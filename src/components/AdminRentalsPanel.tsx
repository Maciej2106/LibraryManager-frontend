import React from 'react';
import { Rental, Book } from '../types';
import { useRentalsStore } from '../store/useRentalsStore';

interface AdminRentalsPanelProps {
    rentals: Rental[];
    books: Book[];
    loading: boolean;
}

export const AdminRentalsPanel: React.FC<AdminRentalsPanelProps> = ({ rentals, books, loading }) => {
    const { returnBook } = useRentalsStore();

    const getBookTitle = (bookId: string) => {
        const book = books.find((b) => b.id === bookId);
        return book ? book.title : 'Nieznany tytuł';
    };

    if (loading) {
        return <div>Ładowanie wypożyczeń...</div>;
    }

    return (
        <div>
            <h2>Panel Zarządzania Wypożyczeniami</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Użytkownik</th>
                        <th>Książka</th>
                        <th>Data Wypożyczenia</th>
                        <th>Data Zwrotu</th>
                        <th>Status</th>
                        <th>Akcja</th>
                    </tr>
                </thead>
                <tbody>
                    {rentals.map((rental) => (
                        <tr key={rental.id}>
                            <td>{rental.id}</td>
                            <td>{rental.userId}</td>
                            <td>{getBookTitle(rental.bookId)}</td>
                            <td>{rental.rentalDate}</td>
                            <td>{rental.returnDate}</td>
                            <td>{rental.status}</td>
                            <td>
                                {rental.status !== 'Returned' ? (
                                    <button onClick={() => returnBook(rental.id)}>Wymuś Zwrot</button>
                                ) : null}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};