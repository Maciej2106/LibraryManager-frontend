import { useMemo } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useBooksStore } from '../store/useBooksStor';
import { useUserStore } from '../store/useUserStore';
import { useRentalsStore } from '../store/useRentalsStore';
import { Link } from 'react-router-dom';

export const AvailableBooks = () => {
  const { books, loadingBooks, errorBooks } = useBooksStore();
  const { user } = useUserStore();
  const { borrowBook } = useRentalsStore();

  const handleBorrow = (bookId: string) => {
    borrowBook(bookId);
  };

  const availableBooks = useMemo(
    () => books.filter((book) => (book.availableCopies ?? 0) > 0),
    [books]
  );

  const isLoggedIn = !!user;

  return (
    <Box
      sx={{
        padding: 3,
        borderRadius: 2,
        boxShadow: 1,
        maxWidth: 800,
        margin: 'auto',
      }}
    >
      {loadingBooks && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 100,
          }}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Ładowanie książek...
          </Typography>
        </Box>
      )}
      {errorBooks && <Alert severity="error">Błąd: {errorBooks}</Alert>}
      {!loadingBooks && !errorBooks && (
        <>
          <Typography variant="h6" component="h3" sx={{ marginBottom: 2 }}>
            Dostępne książki:
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="available books table">
              <TableHead>
                <TableRow>
                  <TableCell>Tytuł</TableCell>
                  <TableCell>Autor</TableCell>
                  <TableCell>Dostępne Egzemplarze</TableCell>
                  <TableCell>Akcja</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availableBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <Link
                        to={`/books/${book.id}`}
                        style={{ textDecoration: 'none', color: 'blue' }}
                      >
                        {book.title}
                      </Link>
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.availableCopies}</TableCell>
                    <TableCell>
                      {isLoggedIn ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleBorrow(book.id)}
                        >
                          Wypożycz
                        </Button>
                      ) : (
                        <Typography>Zaloguj się, aby wypożyczyć</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};