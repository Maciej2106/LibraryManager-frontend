import axios, { AxiosResponse } from 'axios';
import { create } from 'zustand';
import { handleApiError } from '../utils/handleApiError';
import { useBooksStore } from './useBooksStor';
import { Book, Rental } from '../types';

export interface RentalWithBook extends Rental {
    book: Book | null;
}

interface RentalsState {
    rentals: RentalWithBook[];
    loading: boolean;
    error: string | null;
    fetchRentals: () => Promise<void>;
    returnBook: (rentalId: string | number) => Promise<void>;
    borrowBook: (bookId: string | number) => Promise<void>;
}

export const useRentalsStore = create<RentalsState>((set, get) => ({
    rentals: [],
    loading: false,
    error: null,

    fetchRentals: async () => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Brak tokenu w localStorage.');
                throw new Error('Nie jesteś zalogowany.');
            }
            const rentalsResponse: AxiosResponse<Rental[]> = await axios.get(
                'http://localhost:3000/rentals',
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const rentalsWithBooks = await Promise.all(
                rentalsResponse.data.map(async (rental) => {
                    if (rental.bookId) {
                        try {
                            const bookResponse: AxiosResponse<Book> =
                                await axios.get(
                                    `http://localhost:3000/books/${rental.bookId}`,
                                );
                            return { ...rental, book: bookResponse.data };
                        } catch {
                            return { ...rental, book: null };
                        }
                    } else {
                        return { ...rental, book: null };
                    }
                }),
            );
            set({ rentals: rentalsWithBooks, loading: false });
        } catch (error) {
            console.error('Błąd podczas pobierania wypożyczeń:', error);
            const errorMessage = axios.isAxiosError(error)
                ? handleApiError(error)
                : 'Wystąpił nieznany błąd.';
            set({ error: errorMessage, loading: false, rentals: [] });
        }
    },
    returnBook: async (rentalId: string | number) => {
        set({ loading: true, error: null });
        try {
            await axios.patch(
                `http://localhost:3000/rentals/${rentalId}`,
                { status: 'Returned', returnDate: new Date().toISOString() },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );
            set((state) => ({
                rentals: state.rentals.map((r) =>
                    r.id === rentalId
                        ? {
                              ...r,
                              status: 'Returned',
                              returnDate: new Date().toISOString(),
                          }
                        : r,
                ),
                loading: false,
            }));
            const { books, setBooks } = useBooksStore.getState();
            const rental = get().rentals.find((r) => r.id === rentalId);
            if (rental && rental.bookId) {
                const updatedBooks = books.map((book) =>
                    book.id === rental.bookId
                        ? {
                              ...book,
                              availableCopies: (book.availableCopies ?? 0) + 1,
                          }
                        : book,
                );
                setBooks(updatedBooks);
            }
        } catch (error) {
            console.error('Błąd podczas zwracania książki:', error);
            const errorMessage = axios.isAxiosError(error)
                ? handleApiError(error)
                : 'Wystąpił nieznany błąd podczas zwracania książki.';
            set({ error: errorMessage, loading: false });
        }
    },
    borrowBook: async (bookId: string | number) => {
        set({ loading: true, error: null });
        try {
            const rentalData = {
                bookId: bookId,
            };
            if (!localStorage.getItem('token')) {
                console.error('Brak tokenu w localStorage.');
                throw new Error('Nie jesteś zalogowany.');
            }
            const response: AxiosResponse<Rental> = await axios.post(
                'http://localhost:3000/rentals',
                rentalData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            const newRental: RentalWithBook = { ...response.data, book: null };
            set((state) => ({
                rentals: [...state.rentals, newRental],
                loading: false,
            }));
            const { books, setBooks } = useBooksStore.getState();
            const updatedBooks = books.map((book) =>
                book.id === bookId
                    ? {
                          ...book,
                          availableCopies: (book.availableCopies ?? 0) - 1,
                      }
                    : book,
            );
            setBooks(updatedBooks);
        } catch (error) {
            console.error('Błąd podczas wypożyczania książki:', error); // Logowanie błędu
            const errorMessage = axios.isAxiosError(error)
                ? handleApiError(error)
                : 'Wystąpił nieznany błąd podczas wypożyczania książki.';
            set({ error: errorMessage, loading: false });
        }
    },
}));
