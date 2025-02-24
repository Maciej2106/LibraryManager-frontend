import React, { useState } from 'react';
import { Book } from '../types';
import { useBooksStore } from '../store/useBooksStor';

interface AdminBooksPanelProps {
    books: Book[];
    loading: boolean;
}

export const AdminBooksPanel: React.FC<AdminBooksPanelProps> = ({
    books,
    loading,
}) => {
    const { addBook, editBook, deleteBook, error } = useBooksStore();
    const [newBook, setNewBook] = useState<Omit<Book, 'id'>>({
        title: '',
        author: '',
        description: '',
        availableCopies: 0,
        borrowedCopies: 0,
        year: 0,
    });

    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const handleAddBookChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;

        if (name === 'availableCopies' || name === 'year') {
            const newValue = parseInt(value);
            const safeValue = isNaN(newValue) ? 0 : newValue;
            setNewBook({ ...newBook, [name]: safeValue });
        } else {
            setNewBook({ ...newBook, [name]: value });
        }
    };
    const handleEditBookChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;

        if (name === 'availableCopies' || name === 'year') {
            const newValue = parseInt(value);
            const safeValue = isNaN(newValue) ? 0 : newValue;
            if (editingBook) {
                setEditingBook({ ...editingBook, [name]: safeValue });
            }
        } else {
            if (editingBook) {
                setEditingBook({ ...editingBook, [name]: value });
            }
        }
    };

    const handleAddBookSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addBook({ ...newBook, year: newBook.year });
        setNewBook({
            title: '',
            author: '',
            description: '',
            borrowedCopies: 0,
            availableCopies: 0,
            year: 0,
        });
    };

    const handleEditBookSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBook) {
            editBook(editingBook);
            setEditingBook(null);
        }
    };

    if (loading) {
        return <div>Ładowanie książek...</div>;
    }

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div>
            <h2>Panel Zarządzania Książkami</h2>

            <h3>Dodaj Książkę</h3>
            <form onSubmit={handleAddBookSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Tytuł"
                    value={newBook.title}
                    onChange={handleAddBookChange}
                    required
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Autor"
                    value={newBook.author}
                    onChange={handleAddBookChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Opis"
                    value={newBook.description || ''}
                    onChange={handleAddBookChange}
                />
                <input
                    type="number"
                    name="availableCopies"
                    placeholder="Dostępne kopie"
                    value={newBook.availableCopies || 0}
                    onChange={handleAddBookChange}
                    required
                />
                <input
                    type="number"
                    name="year"
                    placeholder="Rok wydania"
                    value={newBook.year || 0}
                    onChange={handleAddBookChange}
                    required
                />
                <button type="submit">Dodaj</button>
            </form>

            <h3>Lista Książek</h3>
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        {book.title} - {book.author} - {book.year}
                        <button onClick={() => setEditingBook(book)}>
                            Edytuj
                        </button>
                        <button onClick={() => deleteBook(book.id)}>
                            Usuń
                        </button>
                    </li>
                ))}
            </ul>

            {editingBook && (
                <div>
                    <h3>Edytuj Książkę</h3>
                    <form onSubmit={handleEditBookSubmit}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Tytuł"
                            value={editingBook.title}
                            onChange={handleEditBookChange}
                            required
                        />
                        <input
                            type="text"
                            name="author"
                            placeholder="Autor"
                            value={editingBook.author}
                            onChange={handleEditBookChange}
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Opis"
                            value={editingBook.description || ''}
                            onChange={handleEditBookChange}
                        />
                        <input
                            type="number"
                            name="availableCopies"
                            placeholder="Dostępne kopie"
                            value={editingBook.availableCopies || 0}
                            onChange={handleEditBookChange}
                            required
                        />
                        <input
                            type="number"
                            name="year"
                            placeholder="Rok wydania"
                            value={editingBook.year || 0}
                            onChange={handleEditBookChange}
                            required
                        />
                        <button type="submit">Zapisz</button>
                        <button onClick={() => setEditingBook(null)}>
                            Anuluj
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
