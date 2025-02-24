import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminBooksPanel } from '../components/AdminBooksPanel';
import { AdminRentalsPanel } from '../components/AdminRentalsPanel';
import { AdminLogsPanel } from '../components/AdminLogsPanel';
import { useBooksStore } from '../store/useBooksStor';
import { useRentalsStore } from '../store/useRentalsStore';
import { useLogsStore } from '../store/useLogsStor';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';

interface AdminPageProps {
    isAdmin: boolean;
    logout: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ isAdmin }) => {
    const { books, loading: booksLoading } = useBooksStore();
    const { rentals, loading: rentalsLoading } = useRentalsStore();
    const { logs, loading: logsLoading } = useLogsStore();
    const [activePanel, setActivePanel] = useState<
        'books' | 'rentals' | 'logs'
    >('books');

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    if (booksLoading || rentalsLoading || logsLoading) {
        return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    )
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel Administracyjny
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setActivePanel('books')} sx={{ mr: 1 }}>
          Książki
        </Button>
        <Button variant="contained" onClick={() => setActivePanel('rentals')} sx={{ mr: 1 }}>
          Wypożyczenia
        </Button>
        <Button variant="contained" onClick={() => setActivePanel('logs')}>
          Logi
        </Button>
      </Box>
      {activePanel === 'books' && <AdminBooksPanel books={books} loading={booksLoading} />}
      {activePanel === 'rentals' && (
        <AdminRentalsPanel rentals={rentals} books={books} loading={rentalsLoading} />
      )}
      {activePanel === 'logs' && <AdminLogsPanel logs={logs} loading={logsLoading} />}
    </Container>
    );
};
