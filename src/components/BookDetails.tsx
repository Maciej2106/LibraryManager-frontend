// import { Box, Button, Typography } from '@mui/material';
// import { Book } from '../types';
// import { useRentalsStore } from '../store/useRentalsStore';

// interface BookDetailsProps {
//     book: Book | null;
// }

// export const BookDetails: React.FC<BookDetailsProps> = ({ book }) => {
//     const { borrowBook } = useRentalsStore();

//     if (!book) {
//         return <Typography variant="body1">Nie znaleziono książki.</Typography>;
//     }

//     return (
//         <Box
//             sx={{
//                 padding: 3,
//                 borderRadius: 2,
//                 boxShadow: 1,
//                 maxWidth: 400,
//                 margin: 'auto',
//             }}
//         >
//             <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
//                 {book.title}
//             </Typography>
//             <Typography variant="body1">Autor: {book.author}</Typography>
//             <Typography variant="body1">Rok wydania: {book.year}</Typography>
//             <Typography variant="body1">Opis: {book.description}</Typography>
//             <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => book && borrowBook(book.id)}
//                 sx={{ marginTop: 2 }}
//             >
//                 Wypożycz
//             </Button>
//         </Box>
//     );
// };

import React from 'react';
import {  Button, Typography, Paper } from '@mui/material';
import { Book } from '../types';
import { useRentalsStore } from '../store/useRentalsStore';

interface BookDetailsProps {
    book: Book | null;
}

export const BookDetails: React.FC<BookDetailsProps> = ({ book }) => {
    const { borrowBook } = useRentalsStore();

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
                bgcolor: 'background.paper'
            }}
        >
            <Typography variant="h4" component="h2" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
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
            <Button
                variant="contained"
                color="primary"
                onClick={() => book && borrowBook(book.id)}
                sx={{ marginTop: 2, padding: '10px 20px', fontSize: '1rem' }}
            >
                Wypożycz
            </Button>
        </Paper>
    );
};
