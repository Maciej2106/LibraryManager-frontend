import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Button,
    Typography,
    Paper,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Book } from '../types';
import { useRentalsStore } from '../store/useRentalsStore';
import { useBooksStore } from '../store/useBooksStor';
import { useUserStore } from '../store/useUserStore';

export const BookDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { books, loadingBooks, errorBooks, fetchBooks } = useBooksStore();
    const { borrowBook } = useRentalsStore();
    const { user } = useUserStore();

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const book: Book | undefined = books.find((b) => b.id === id);
    const isLoggedIn = !!user;

    if (loadingBooks) {
        return (
            <Paper
                sx={{
                    padding: 3,
                    margin: 'auto',
                    maxWidth: 400,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>
                    Ładowanie książki...
                </Typography>
            </Paper>
        );
    }

    if (errorBooks) {
        return (
            <Paper sx={{ padding: 3, margin: 'auto', maxWidth: 400 }}>
                <Alert severity="error">Błąd: {errorBooks}</Alert>
            </Paper>
        );
    }

    if (!book) {
        return (
            <Paper sx={{ padding: 3, margin: 'auto', maxWidth: 400 }}>
                <Typography variant="body1">Nie znaleziono książki.</Typography>
            </Paper>
        );
    }

    return (
        <Paper
            sx={{
                padding: 4,
                borderRadius: 2,
                boxShadow: 2,
                maxWidth: 500,
                margin: '20px auto',
                bgcolor: 'background.paper',
            }}
        >
            <Typography
                variant="h4"
                component="h2"
                sx={{ marginBottom: 2, fontWeight: 'bold' }}
            >
                {book.title}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Autor:</strong> {book.author}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Rok wydania:</strong> {book.year}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                <strong>Opis:</strong> {book.description}
            </Typography>
            {isLoggedIn ? (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => borrowBook(book.id)}
                    sx={{
                        marginTop: 2,
                        padding: '10px 20px',
                        fontSize: '1rem',
                    }}
                >
                    Wypożycz
                </Button>
            ) : (
                <>
                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                        Zaloguj się, aby wypożyczyć książkę.
                    </Typography>
                    <Button
                        component={Link}
                        to="/login"
                        variant="outlined"
                        sx={{ marginTop: 1 }}
                    >
                        Zaloguj się
                    </Button>
                </>
            )}
        </Paper>
    );
};
