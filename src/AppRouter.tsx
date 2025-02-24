import {
    Routes,
    Route,
    Navigate,
    Link,
    Outlet,
    useLocation,
} from 'react-router-dom';
import { AdminPage } from './pages/AdminPage';
import { LoginForm } from './components/LoginForm';
import { UserPage } from './pages/UserPage';
import { User } from './types';
import { HomePage } from './pages/HomePage';
import { BooksPage } from './pages/BooksPage';
import { RegisterForm } from './components/RegisterForm';
import {
    Box,
    Container,
    AppBar,
    Toolbar,
    Button,
    Typography,
} from '@mui/material';
import { AdminBooksPanel } from './components/AdminBooksPanel';
import { AdminRentalsPanel } from './components/AdminRentalsPanel';
import { AdminLogsPanel } from './components/AdminLogsPanel';
import { useBooksStore } from './store/useBooksStor';
import { useRentalsStore } from './store/useRentalsStore';
import { useLogsStore } from './store/useLogsStor';
import { BookDetails } from './components/BookDetails';
import { useEffect } from 'react';

interface AppRouterProps {
    login: (userData: {
        libraryCardId: string;
        password: string;
    }) => Promise<User | null>;
    register: (userData: {
        email: string;
        password: string;
        name: string;
    }) => Promise<User | null>;
    loading: boolean;
    logout: () => void;
    user: User | null;
    setUser: (user: User | null) => void;
}

export const AppRouter: React.FC<AppRouterProps> = ({
    login,
    loading,
    logout,
    setUser,
    user,
    register,
}) => {
    const {
        fetchBooks,
        books: allBooks,
        loading: booksLoading,
    } = useBooksStore();
    const {
        fetchRentals,
        rentals,
        loading: rentalsLoading,
    } = useRentalsStore();
    const { fetchLogs, logs, loading: logsLoading } = useLogsStore();
    const isAdmin = user?.role === 'ADMIN';
    const dataLoading = booksLoading || rentalsLoading || logsLoading;
    const location = useLocation();

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            Promise.all([fetchBooks(), fetchRentals(), fetchLogs()]).catch(
                (error) =>
                    console.error('AppRouter - Error fetching data:', error),
            );
        }
    }, [user, fetchBooks, fetchRentals, fetchLogs]);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Moja Biblioteka
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            component={Link}
                            to="/"
                            color="inherit"
                            sx={
                                isActive('/')
                                    ? {
                                          backgroundColor:
                                              'rgba(255, 255, 255, 0.1)',
                                      }
                                    : {}
                            }
                        >
                            Strona główna
                        </Button>
                        <Button
                            component={Link}
                            to="/books"
                            color="inherit"
                            sx={
                                isActive('/books')
                                    ? {
                                          backgroundColor:
                                              'rgba(255, 255, 255, 0.1)',
                                      }
                                    : {}
                            }
                        >
                            Książki
                        </Button>
                        {!user && (
                            <>
                                <Button
                                    component={Link}
                                    to="/register"
                                    color="inherit"
                                    sx={
                                        isActive('/register')
                                            ? {
                                                  backgroundColor:
                                                      'rgba(255, 255, 255, 0.1)',
                                              }
                                            : {}
                                    }
                                >
                                    Rejestracja
                                </Button>
                                <Button
                                    component={Link}
                                    to="/login"
                                    color="inherit"
                                    sx={
                                        isActive('/login')
                                            ? {
                                                  backgroundColor:
                                                      'rgba(255, 255, 255, 0.1)',
                                              }
                                            : {}
                                    }
                                >
                                    Zaloguj
                                </Button>
                            </>
                        )}
                        {user && (
                            <>
                                {user && !isAdmin && (
                                    <Button
                                        component={Link}
                                        to="/user"
                                        color="inherit"
                                        sx={
                                            isActive('/user')
                                                ? {
                                                      backgroundColor:
                                                          'rgba(255, 255, 255, 0.1)',
                                                  }
                                                : {}
                                        }
                                    >
                                        Profil
                                    </Button>
                                )}
                                {isAdmin && (
                                    <Button
                                        component={Link}
                                        to="/admin"
                                        color="inherit"
                                        sx={
                                            isActive('/admin')
                                                ? {
                                                      backgroundColor:
                                                          'rgba(255, 255, 255, 0.1)',
                                                  }
                                                : {}
                                        }
                                    >
                                        Panel administracyjny
                                    </Button>
                                )}
                                <Button color="inherit" onClick={logout}>
                                    Wyloguj
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/register"
                    element={
                        !user ? (
                            <RegisterForm register={register} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:id" element={<BookDetails />} />{' '}
                {/* Dodana trasa BookDetails */}
                <Route
                    path="/login"
                    element={
                        <LoginForm
                            onLogin={login}
                            loading={loading}
                            setUser={setUser}
                        />
                    }
                />
                <Route
                    path="/user"
                    element={
                        user && user.role !== 'ADMIN' ? (
                            <UserPage user={user} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/admin"
                    element={
                        dataLoading ? (
                            <div>Ładowanie...</div>
                        ) : isAdmin ? (
                            <Container maxWidth="lg" sx={{ py: 4 }}>
                                <Outlet />
                            </Container>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                >
                    <Route
                        index
                        element={
                            <AdminPage isAdmin={isAdmin} logout={logout} />
                        }
                    />
                    <Route
                        path="books"
                        element={
                            <AdminBooksPanel
                                books={allBooks}
                                loading={booksLoading}
                            />
                        }
                    />
                    <Route
                        path="rentals"
                        element={
                            <AdminRentalsPanel
                                rentals={rentals}
                                books={allBooks}
                                loading={rentalsLoading}
                            />
                        }
                    />
                    <Route
                        path="logs"
                        element={
                            <AdminLogsPanel logs={logs} loading={logsLoading} />
                        }
                    />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Box>
    );
};
