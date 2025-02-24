import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminBooksPanel } from '../components/AdminBooksPanel';
import { AdminRentalsPanel } from '../components/AdminRentalsPanel';
import { AdminLogsPanel } from '../components/AdminLogsPanel';
import { useBooksStore } from '../store/useBooksStor';
import { useRentalsStore } from '../store/useRentalsStore';
import { useLogsStore } from '../store/useLogsStor';


interface AdminPageProps {
  isAdmin: boolean;
  logout: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ isAdmin }) => {
  const { books, loading: booksLoading } = useBooksStore();
  const { rentals, loading: rentalsLoading } = useRentalsStore();
  const { logs, loading: logsLoading } = useLogsStore();
  const [activePanel, setActivePanel] = useState<'books' | 'rentals' | 'logs'>('books'); 

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  if (booksLoading || rentalsLoading || logsLoading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div>
      <h1>Panel Administracyjny</h1>
      <div>
        <button onClick={() => setActivePanel('books')}>Książki</button>
        <button onClick={() => setActivePanel('rentals')}>Wypożyczenia</button>
        <button onClick={() => setActivePanel('logs')}>Logi</button>
      </div>
      {activePanel === 'books' && <AdminBooksPanel books={books} loading={booksLoading} />}
      {activePanel === 'rentals' && <AdminRentalsPanel rentals={rentals} books={books} loading={rentalsLoading} />}
      {activePanel === 'logs' && <AdminLogsPanel logs={logs} loading={logsLoading} />}
    </div>
  );
};