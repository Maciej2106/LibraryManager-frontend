import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { useBooksStore, BooksState } from './useBooksStor';
import { Book } from '../types';

describe('useBooksStore', () => {
    let mockAxios: MockAdapter;
    let store: BooksState;

    beforeEach(() => {
        mockAxios = new MockAdapter(axios);
        store = useBooksStore.getState();
        useBooksStore.setState({ books: [], loading: true, error: null });
    });

    afterEach(() => {
        mockAxios.restore();
    });

    it('should fetch books correctly', async () => {
        const mockBooks: Book[] = [
            {
                id: '1',
                title: 'Book 1',
                author: 'Author 1',
                year: 2020,
                availableCopies: 5,
                borrowedCopies: 0,
                description: 'Description 1'
            },
            { 
                id: '2',
                title: 'Book 2',
                author: 'Author 2',
                year: 2021,
                availableCopies: 3,
                borrowedCopies: 2,
                description: 'Description 2'
            },
        ];
        mockAxios.onGet('http://localhost:3000/books').reply(200, mockBooks);

        await store.fetchBooks();

        expect(useBooksStore.getState().books).toEqual(mockBooks);
        expect(useBooksStore.getState().loading).toBe(false);
        expect(useBooksStore.getState().error).toBeNull();
    });

    it('should handle error during fetch books', async () => {
        mockAxios.onGet('http://localhost:3000/books').reply(500, { message: 'Internal Server Error' });

        await store.fetchBooks();

        expect(useBooksStore.getState().loading).toBe(false);
        expect(useBooksStore.getState().error).toBe('Wystąpił błąd serwera.');
    });

    it('should add book correctly', async () => {
        const newBook: Omit<Book, 'id'> = {
            title: 'New Book',
            author: 'New Author',
            year: 2022,
            availableCopies: 2,
            borrowedCopies: 0,
            description: 'New description'
        };
        const addedBook: Book = { id: '3', ...newBook };
        mockAxios.onPost('http://localhost:3000/books', newBook).reply(201, addedBook);
        mockAxios.onGet('http://localhost:3000/books').reply(200, [addedBook]);

        await store.addBook(newBook);

        expect(useBooksStore.getState().books).toContainEqual(addedBook);
    });

    it('should edit book correctly', async () => {
        const initialBook: Book = {
            id: '1',
            title: 'Initial Book',
            author: 'Initial Author',
            year: 2020,
            availableCopies: 5,
            borrowedCopies: 0,
            description: 'Description 1'
        };
        const updatedBook: Book = {
            id: '1',
            title: 'Updated Book',
            author: 'Updated Author',
            year: 2023,
            availableCopies: 10,
            borrowedCopies: 0,
            description: 'Description 2'
        };
        mockAxios.onPut(`http://localhost:3000/books/${initialBook.id}`, updatedBook).reply(200);
        mockAxios.onGet('http://localhost:3000/books').reply(200, [updatedBook]);

        useBooksStore.setState({ books: [initialBook] });
        await store.editBook(updatedBook);

        expect(useBooksStore.getState().books).toEqual([updatedBook]);
    });

    it('should delete book correctly', async () => {
        const initialBook: Book = {
            id: '1',
            title: 'Book to Delete',
            author: 'Author to Delete',
            year: 2020, availableCopies: 5,
            borrowedCopies: 0,
            description: 'description to delete'
        };
        mockAxios.onDelete(`http://localhost:3000/books/${initialBook.id}`).reply(200);
        mockAxios.onGet('http://localhost:3000/books').reply(200, []);

        useBooksStore.setState({ books: [initialBook] });
        await store.deleteBook(initialBook.id);

        expect(useBooksStore.getState().books).toEqual([]);
    });

    it('should set books correctly', () => {
        const newBooks: Book[] = [
            {
                id: '3',
                title: 'Book 3',
                author: 'Author 3',
                year: 2022,
                availableCopies: 4,
                borrowedCopies: 1,
                description: 'Description 1'
            },
            { 
                id: '4',
                title: 'Book 4',
                author: 'Author 4',
                year: 2023,
                availableCopies: 6,
                borrowedCopies: 0,
                description: 'Description 2'
            },
        ];

        store.setBooks(newBooks);

        expect(useBooksStore.getState().books).toEqual(newBooks);
    });
});