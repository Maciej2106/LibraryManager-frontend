import React, { useState } from 'react';
import { Book } from '../types';
import { useBooksStore } from '../store/useBooksStor';
import { Box, Button, CircularProgress, Container, List, ListItem, ListItemText, Paper, TextField, Typography } from '@mui/material';

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
        return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
    }

    if (error) {
        return <Typography color="error">Błąd: {error}</Typography>;
    }

    return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Panel Zarządzania Książkami
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Dodaj Książkę
        </Typography>
        <form onSubmit={handleAddBookSubmit}>
          <TextField
            label="Tytuł"
            name="title"
            value={newBook.title}
            onChange={handleAddBookChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Autor"
            name="author"
            value={newBook.author}
            onChange={handleAddBookChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Opis"
            name="description"
            value={newBook.description || ''}
            onChange={handleAddBookChange}
            fullWidth
            margin="normal"
            multiline
          />
          <TextField
            label="Dostępne kopie"
            type="number"
            name="availableCopies"
            value={newBook.availableCopies || 0}
            onChange={handleAddBookChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Rok wydania"
            type="number"
            name="year"
            value={newBook.year || ''}
            onChange={handleAddBookChange}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Dodaj
          </Button>
        </form>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Lista Książek
      </Typography>
      <List>
        {books.map((book) => (
          <ListItem key={book.id} sx={{ borderBottom: '1px solid #eee' }}>
            <ListItemText primary={`${book.title} - ${book.author} - ${book.year}`} />
            <Button onClick={() => setEditingBook(book)} sx={{ ml: 2 }}>
              Edytuj
            </Button>
            <Button onClick={() => deleteBook(book.id)} color="error" sx={{ ml: 1 }}>
              Usuń
            </Button>
          </ListItem>
        ))}
      </List>

      {editingBook && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Edytuj Książkę
          </Typography>
          <form onSubmit={handleEditBookSubmit}>
            <TextField
              label="Tytuł"
              name="title"
              value={editingBook.title}
              onChange={handleEditBookChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Autor"
              name="author"
              value={editingBook.author}
              onChange={handleEditBookChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Opis"
              name="description"
              value={editingBook.description || ''}
              onChange={handleEditBookChange}
              fullWidth
              margin="normal"
              multiline
            />
            <TextField
              label="Dostępne kopie"
              type="number"
              name="availableCopies"
              value={editingBook.availableCopies || 0}
              onChange={handleEditBookChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Rok wydania"
              type="number"
              name="year"
              value={editingBook.year || 0}
              onChange={handleEditBookChange}
              fullWidth
              margin="normal"
              required
            />
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
                Zapisz
              </Button>
              <Button onClick={() => setEditingBook(null)} variant="outlined">
                Anuluj
              </Button>
            </Box>
          </form>
        </Paper>
      )}
    </Container>
  );
};
