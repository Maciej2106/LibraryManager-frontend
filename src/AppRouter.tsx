import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Link, Outlet } from 'react-router-dom'; // Dodajemy Outlet
import {AdminPage} from './pages/AdminPage';
import {LoginForm} from './components/LoginForm';
import {UserPage} from './pages/UserPage';
import { User } from './types';
import {HomePage} from './pages/HomePage';
import {BooksPage} from './pages/BooksPage';
import {RegisterForm} from './components/RegisterForm';
import { AppBar, Box, Container, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Tooltip, Typography } from '@mui/material';
import {AdminBooksPanel} from './components/AdminBooksPanel';
import {AdminRentalsPanel} from './components/AdminRentalsPanel';
import {AdminLogsPanel} from './components/AdminLogsPanel';
import {Logout as LogoutIcon } from '@mui/icons-material'; 
import { useBooksStore } from './store/useBooksStor';
import { useRentalsStore } from './store/useRentalsStore';
import { useLogsStore } from './store/useLogsStor';

interface AppRouterProps {
    login: (userData: { libraryCardId: string; password: string }) => Promise<User | null>;
    register: (userData: { email: string; password: string; name: string }) => Promise<User | null>;
    loading: boolean;
    logout: () => void;
    user: User | null;
    setUser: (user: User | null) => void;    
}

export const AppRouter: React.FC<AppRouterProps> = ({ login, loading, logout, setUser, user, register }) => {
    const { fetchBooks, books: allBooks, loading: booksLoading } = useBooksStore();
    const { fetchRentals, rentals, loading: rentalsLoading } = useRentalsStore();
    const { fetchLogs, logs, loading: logsLoading } = useLogsStore();
    const isAdmin = user?.role === 'ADMIN';
    const dataLoading = booksLoading || rentalsLoading || logsLoading;

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            Promise.all([fetchBooks(), fetchRentals(), fetchLogs()])
                .catch(error => console.error("AppRouter - Error fetching data:", error));
        }
    }, [user, fetchBooks, fetchRentals, fetchLogs]);

    return (
        <Box>
            <List sx={{ display: 'flex'}}> 
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/">
                        <ListItemText primary="Strona główna" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/books">
                    <   ListItemText primary="Książki" />
                    </ListItemButton>
                </ListItem>
                {!user && (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/register">
                                <ListItemText primary="Rejestracja" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/login">
                                <ListItemText primary="Zaloguj" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
                {user && (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/user">
                                <ListItemText primary="Profil" />
                            </ListItemButton>
                        </ListItem>
                        {isAdmin && (
                                <ListItem disablePadding>
                                <ListItemButton component={Link} to="/admin">
                                    <ListItemText primary="Panel administracyjny" />
                                </ListItemButton>
                            </ListItem>
                        )}
                        <ListItem disablePadding>
                            <ListItemButton onClick={logout}>
                                <ListItemText primary="Wyloguj" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={!user ? <RegisterForm register={register} /> : <Navigate to="/" replace />} />
                    <Route path="/books" element={<BooksPage />} />
                    <Route path="/login" element={<LoginForm onLogin={login} loading={loading} setUser={setUser} />} />
                    <Route path="/user" element={user && user.role !== 'ADMIN' ? <UserPage user={user} /> : <Navigate to="/login" replace />} />
                    <Route path="/admin" element={dataLoading ? <div>Ładowanie...</div> : (isAdmin ? <AdminLayout logout={logout} /> : <Navigate to="/login" replace />)}>
                        <Route index element={<AdminPage isAdmin={isAdmin} logout={logout} />} />
                        <Route path="books" element={<AdminBooksPanel books={allBooks} loading={booksLoading} />} />
                        <Route path="rentals" element={<AdminRentalsPanel rentals={rentals} books={allBooks} loading={rentalsLoading} />} />
                        <Route path="logs" element={<AdminLogsPanel logs={logs} loading={logsLoading} />} />
                    </Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
        </Box>
    );
};

// Komponent layoutu dla admina (wydzielony, żeby uniknąć duplikacji kodu)
const AdminLayout = ({ logout }: { logout: () => void }) => {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
                        Panel Administracyjny
                    </Typography>
                    <Tooltip title="Wyloguj">
                        <IconButton color="inherit" onClick={logout}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Outlet /> 
            </Container>
        </div>
    );
};