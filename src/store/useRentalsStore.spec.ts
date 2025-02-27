import { useRentalsStore } from './useRentalsStore';
import { useBooksStore } from './useBooksStor';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { act } from 'react';
import { Book, Rental } from '../types';

const mockAxios = new MockAdapter(axios);

describe('useRentalsStore', () => {
    const mockBook: Book = {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        availableCopies: 5,
        borrowedCopies: 0,
        description: 'Test Description',
        year: 2023,
    };

    const mockRental: Rental = {
        id: '1',
        bookId: '1',
        status: 'Borrowed',
        rentalDate: '2023-01-01T00:00:00.000Z',
        returnDate: null,
        userId: 'someUserId',
        userName: 'Test User',
        libraryCardId: '123',
        book: null,
    };

    beforeEach(() => {
        useRentalsStore.getState().rentals = [mockRental];
        useRentalsStore.getState().error = null;
        useRentalsStore.getState().loading = false;
        useBooksStore.getState().books = [mockBook];
        localStorage.setItem('token', 'test-token');
    });

    afterEach(() => {
        mockAxios.reset();
        localStorage.clear();
    });

    it('should fetch rentals correctly', async () => {
        const mockRentals: Rental[] = [mockRental];
        mockAxios
            .onGet('http://localhost:3000/rentals')
            .reply(200, mockRentals);
        mockAxios
            .onGet(`http://localhost:3000/books/${mockRental.bookId}`)
            .reply(200, mockBook);

        await act(async () => {
            await useRentalsStore.getState().fetchRentals();
        });

        const rentals = useRentalsStore.getState().rentals;
        expect(rentals).toHaveLength(1);
        expect(rentals[0].id).toEqual(mockRental.id);
        expect(rentals[0].book?.id).toEqual(mockBook.id);
    });

    it('should handle error during fetch rentals', async () => {
        mockAxios
            .onGet('http://localhost:3000/rentals')
            .reply(500, { message: 'Wystąpił błąd serwera.' });

        await act(async () => {
            await useRentalsStore.getState().fetchRentals();
        });

        expect(useRentalsStore.getState().error).toEqual(
            'Wystąpił błąd serwera.',
        );
        expect(useRentalsStore.getState().loading).toBe(false);
    });

    it('should return book correctly', async () => {
        mockAxios
            .onPatch(`http://localhost:3000/rentals/${mockRental.id}`)
            .reply(200);

        await act(async () => {
            await useRentalsStore.getState().returnBook(mockRental.id);
        });

        const updatedRental = useRentalsStore
            .getState()
            .rentals.find((r) => r.id === mockRental.id);
        expect(updatedRental?.status).toEqual('Returned');
        expect(useBooksStore.getState().books[0].availableCopies).toEqual(6);
    });

    it('should handle error during return book', async () => {
        mockAxios
            .onPatch(`http://localhost:3000/rentals/${mockRental.id}`)
            .reply(500, { message: 'Wystąpił błąd serwera.' });

        await act(async () => {
            await useRentalsStore.getState().returnBook(mockRental.id);
        });

        expect(useRentalsStore.getState().error).toEqual(
            'Wystąpił błąd serwera.',
        );
        expect(useRentalsStore.getState().loading).toBe(false);
    });

    it('should borrow book correctly', async () => {
        mockAxios
            .onPost('http://localhost:3000/rentals')
            .reply(201, { ...mockRental, id: '2' });

        await act(async () => {
            await useRentalsStore.getState().borrowBook(mockBook.id);
        });

        const newRental = useRentalsStore
            .getState()
            .rentals.find((r) => r.id === '2');
        expect(newRental?.bookId).toEqual(mockBook.id);
        expect(useBooksStore.getState().books[0].availableCopies).toEqual(4);
    });

    it('should handle error during borrow book', async () => {
        mockAxios
            .onPost('http://localhost:3000/rentals')
            .reply(500, { message: 'Wystąpił błąd serwera.' });

        await act(async () => {
            await useRentalsStore.getState().borrowBook(mockBook.id);
        });

        expect(useRentalsStore.getState().error).toEqual(
            'Wystąpił błąd serwera.',
        );
        expect(useRentalsStore.getState().loading).toBe(false);
    });
});
