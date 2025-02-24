import React from 'react';
import { Book } from '../types';

interface BooksListProps {
    books: Book[];
    onBorrow: (bookId: string) => void;
    isLoggedIn: boolean;
}

export const BooksList: React.FC<BooksListProps> = ({ books, onBorrow, isLoggedIn }) => {
    return (
        <ul>
            {books.map(book => (
                <li key={book.id}>
                    {book.title} - {book.author} - {book.availableCopies}
                    {isLoggedIn && ( // Przycisk "Wypożycz" jest widoczny tylko dla zalogowanych użytkowników
                        <button onClick={() => onBorrow(book.id.toString())}>Wypożycz</button> 
                    )}
                </li>
            ))}
        </ul>
    );
};