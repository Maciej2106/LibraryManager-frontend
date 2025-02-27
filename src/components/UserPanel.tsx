import React, { useState, useEffect, useMemo } from 'react';
import { Book, RentalWithBook, User } from '../types';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    List,
    ListItem,
    MenuItem,
    Paper,
    Select,
    Typography,
    Modal,
} from '@mui/material';
import { useRentalsStore } from '../store/useRentalsStore';
import { useUserStore } from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';

interface UserPanelProps {
    user: User | null;
    books: Book[];
    loadingRentals: boolean;
    errorRentals: string | null;
    loading: boolean;
    loadingBooks: boolean;
    errorBooks: string | null;
    rentals: RentalWithBook[];
}

export const UserPanel: React.FC<UserPanelProps> = ({
    loadingRentals,
    errorRentals,
    loadingBooks,
    errorBooks,
    loading,
}) => {
    const { rentals, fetchRentals, returnBook } = useRentalsStore();
    const { user: currentUser, deleteUser, logout } = useUserStore();
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1,
    );
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRentals();
    }, [fetchRentals]);

    const rentalsInMonth = useMemo(() => {
        return rentals.filter((rental) => {
            const rentalDate = rental.rentalDate
                ? new Date(rental.rentalDate)
                : null;
            return rentalDate && rentalDate.getMonth() + 1 === selectedMonth;
        });
    }, [rentals, selectedMonth]);

    const rentalStats = useMemo(() => {
        return {
            onTimeReturns: rentals.filter(
                (rental) => rental.status === 'Returned',
            ).length,
            overdueReturns: rentals.filter(
                (rental) => rental.status === 'Overdue',
            ).length,
            currentRentals: rentals.filter(
                (rental) => rental.status === 'Borrowed',
            ).length,
        };
    }, [rentals]);

    const handleReturnBook = (rental: RentalWithBook) => {
        returnBook(rental.id);
        console.log(`Zwracanie książki: ${rental.book?.title}`);
    };

    const renderRentals = (rentalsToRender: RentalWithBook[]) => {
        if (loadingRentals) return <CircularProgress />;
        if (errorRentals)
            return <Typography color="error">{errorRentals}</Typography>;
        if (!rentalsToRender.length)
            return <Typography>Brak wypożyczeń w tym miesiącu.</Typography>;

        return (
            <List>
                {rentalsToRender.map((rental) => (
                    <ListItem
                        key={rental.id}
                        sx={{
                            marginBottom: 1,
                            border: '1px solid #eee',
                            borderRadius: '4px',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <Typography>
                                {rental.book?.title || 'Nieznany tytuł'}
                            </Typography>
                            {rental.status === 'Borrowed' && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleReturnBook(rental)}
                                >
                                    Zwróć
                                </Button>
                            )}
                        </Box>
                    </ListItem>
                ))}
            </List>
        );
    };

    const borrowedBooks = useMemo(() => {
        return rentals.filter(
            (rental) =>
                rental.status === 'Borrowed' &&
                rental.userId === currentUser?.id,
        );
    }, [rentals, currentUser]);

    const handleDelete = () => {
        setOpenModal(true);
    };

    const confirmDelete = async () => {
        try {
            console.log('confirmDelete wywołane');
            await deleteUser(currentUser?.id);
            logout();
            navigate('/');
        } catch (error) {
            console.error('Błąd usuwania konta:', error);
        } finally {
            setOpenModal(false);
            console.log('openModal ustawione na false');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Panel Użytkownika
                </Typography>
            </Box>

            <Box sx={{ display: 'flex' }}>
                <Box sx={{ flex: 1, pr: 2 }}>
                    {currentUser && (
                        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                            <Typography variant="h6">
                                Imię i Nazwisko: {currentUser.name}
                            </Typography>
                            <Typography>Email: {currentUser.email}</Typography>
                            <Typography>
                                Numer karty bibliotecznej:{' '}
                                {currentUser.libraryCardId}
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDelete}
                                sx={{ marginTop: 2 }}
                            >
                                Zrezygnuj z członkostwa
                            </Button>
                        </Paper>
                    )}
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FormControl>
                            <InputLabel id="month-label">Miesiąc</InputLabel>
                            <Select
                                labelId="month-label"
                                id="month"
                                value={selectedMonth}
                                label="Miesiąc"
                                onChange={(e) =>
                                    setSelectedMonth(Number(e.target.value))
                                }
                                sx={{ minWidth: 120 }}
                            >
                                {[...Array(12)].map((_, i) => (
                                    <MenuItem key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString(
                                            'default',
                                            { month: 'long' },
                                        )}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Typography variant="h5" gutterBottom>
                        Wypożyczone książki w tym miesiącu (
                        {rentalsInMonth.length}):
                    </Typography>
                    {renderRentals(rentalsInMonth)}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            mt: 2,
                        }}
                    >
                        <Typography>
                            Oddane w terminie: {rentalStats.onTimeReturns}
                        </Typography>
                        <Typography>
                            Oddane po terminie: {rentalStats.overdueReturns}
                        </Typography>
                        <Typography>
                            Aktualnie wypożyczone: {rentalStats.currentRentals}
                        </Typography>
                    </Box>
                    {loading && <CircularProgress />}
                    {loadingBooks && <CircularProgress />}
                    {errorBooks && (
                        <Typography color="error">
                            Błąd pobierania książek: {errorBooks}
                        </Typography>
                    )}
                </Box>
            </Box>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        {borrowedBooks.length > 0
                            ? 'Nie możesz zrezygnować z członkostwa, dopóki nie zwrócisz wszystkich książek.'
                            : 'Czy na pewno chcesz zrezygnować z członkostwa?'}
                    </Typography>
                    {borrowedBooks.length > 0 && (
                        <List>
                            {borrowedBooks.map((rental) => (
                                <ListItem key={rental.id}>
                                    {rental.book?.title}
                                </ListItem>
                            ))}
                        </List>
                    )}
                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        {borrowedBooks.length === 0 && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={confirmDelete}
                            >
                                Potwierdź rezygnację
                            </Button>
                        )}
                        <Button
                            variant="outlined"
                            onClick={() => setOpenModal(false)}
                        >
                            Anuluj
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};
