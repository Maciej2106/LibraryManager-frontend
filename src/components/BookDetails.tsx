import { Box, Button, Typography } from '@mui/material';
import { Book } from '../types';
import { useRentalsStore } from '../store/useRentalsStore';

interface BookDetailsProps {
    book: Book | null;
}

export const BookDetails: React.FC<BookDetailsProps> = ({ book }) => {
    const { borrowBook } = useRentalsStore();

    if (!book) {
        return <Typography variant="body1">Nie znaleziono książki.</Typography>;
    }

    return (
        <Box sx={{
            padding: 3,
            borderRadius: 2,
            boxShadow: 1,
            maxWidth: 400,
            margin: 'auto',
        }}>
            <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
                {book.title}
            </Typography>
            <Typography variant="body1">
                Autor: {book.author}
            </Typography>
            <Typography variant="body1">
                Rok wydania: {book.year}
            </Typography>
            <Typography variant="body1">
                Opis: {book.description}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => book && borrowBook(book.id)}
                sx={{ marginTop: 2 }}
            >
                Wypożycz
            </Button>
        </Box>
    );
};