import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Book } from '../types';
import { BookDetails } from '../components/BookDetails';
import { AvailableBooks } from '../components/AvailableBooks';
import { useBooksStore } from '../store/useBooksStor';

export const BooksPage: React.FC = () => {
    const { books, loading, error, fetchBooks } = useBooksStore();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const selectedBook = id
        ? books.find((book: Book) => {
              const bookIdAsString = String(book.id);
              return bookIdAsString === id;
          })
        : null;

    if (loading) {
        return <div>Ładowanie książek...</div>;
    }

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div>
            {selectedBook ? (
                <BookDetails />
            ) : (
                <AvailableBooks />
            )}
        </div>
    );
};
