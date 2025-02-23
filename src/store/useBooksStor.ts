import {create} from 'zustand';
import axios, { AxiosError } from 'axios';
import { handleApiError } from '../utils/handleApiError';
import { Book } from '../types';

interface BooksState {
    books: Book[];
    loading: boolean;
    error: string | null;
    fetchBooks: () => Promise<void>;
    loadingBooks: boolean; 
    errorBooks: string | null; 
    addBook: (newBook: Omit<Book, 'id'>) => Promise<void>;
    editBook: (updatedBook: Book) => Promise<void>;
    deleteBook: (bookId: string) => Promise<void>;
    setBooks: (books: Book[]) => void; 
}
export const useBooksStore = create<BooksState>((set) => ({
    books: [],
    loading: true,
    error: null,
    loadingBooks: false, 
    errorBooks: null,   
    fetchBooks: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('http://localhost:3000/books');
            const data = response.data;
            const books = data as Book[]; // Type assertion - kluczowe!
            const booksWithYearAndCopies = books.map((book: Book) => ({
                ...book, // Rozprzestrzeniamy istniejące właściwości
                year: book.year || null,
                availableCopies: book.availableCopies || null,
                borrowedCopies: book.borrowedCopies || null, // Dodajemy borrowedCopies lub null
            }));

        set({ books: booksWithYearAndCopies, loading: false });        
        } catch (error) {
            const errorMessage = handleApiError(error as AxiosError);
            set({ error: errorMessage, loading: false });            
        }
    },    
    addBook: async (newBook) => {
    try {
        const response = await axios.post('http://localhost:3000/books', newBook);
        const addedBook = response.data;

        set((state) => ({ 
            books: [...state.books, addedBook],
        }));

    } catch (error) {
        const errorMessage = handleApiError(error as AxiosError);
        console.error(errorMessage);
    }
},
    editBook: async (updatedBook) => {
        try {
            await axios.put(`http://localhost:3000/books/${updatedBook.id}`, updatedBook);
            const response = await axios.get('http://localhost:3000/books'); 
            set({ books: response.data });
        } catch (error) {
            const errorMessage = handleApiError(error as AxiosError);
            console.error(errorMessage);
        }
    },
    deleteBook: async (bookId) => {
        try {
            await axios.delete(`http://localhost:3000/books/${bookId}`);
            const response = await axios.get('http://localhost:3000/books'); 
            set({ books: response.data });
        } catch (error) {
            const errorMessage = handleApiError(error as AxiosError);
            console.error(errorMessage);
        }
    },
    setBooks: (books: Book[]) => set({ books }), 
}));