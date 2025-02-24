import {BooksList} from './BooksList';
import { useMemo } from 'react';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useBooksStore } from '../store/useBooksStor';
import { useUserStore } from '../store/useUserStore';
import { useRentalsStore } from '../store/useRentalsStore';

export const AvailableBooks = () => {
    const { books, loadingBooks, errorBooks } = useBooksStore();
    const { user } = useUserStore();
    const { borrowBook } = useRentalsStore();

    const handleBorrow = (bookId: string | number) => {
        
        borrowBook(bookId);
    };

    const availableBooks = useMemo(() => books.filter(book => (book.availableCopies ?? 0) > 0), [books]); // Poprawiona logika filtrowania

    const isLoggedIn = !!user;

    return (
        <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 1, maxWidth: 800, margin: 'auto' }}>
            {loadingBooks && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>Ładowanie książek...</Typography>
            </Box>}
            {errorBooks && <Alert severity="error">Błąd: {errorBooks}</Alert>}
            {!loadingBooks && !errorBooks && (
                <>
                    <Typography variant="h6" component="h3" sx={{ marginBottom: 2 }}>Dostępne książki:</Typography>
                    <BooksList
                        books={availableBooks}
                        onBorrow={handleBorrow}
                        isLoggedIn={isLoggedIn}
                    />
                </>
            )}
        </Box>
    );
};