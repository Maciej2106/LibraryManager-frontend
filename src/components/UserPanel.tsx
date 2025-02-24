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
} from '@mui/material';
import { useRentalsStore } from '../store/useRentalsStore';
import { useUserStore } from '../store/useUserStore';

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
    const { user: currentUser } = useUserStore();

    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1,
    );

    useEffect(() => {
        fetchRentals();
    }, [fetchRentals]);

    const rentalsInMonth = useMemo(
        () =>
            rentals.filter((rental) => {
                const rentalDate = rental.rentalDate
                    ? new Date(rental.rentalDate)
                    : null;
                return (
                    rentalDate && rentalDate.getMonth() + 1 === selectedMonth
                );
            }),
        [rentals, selectedMonth],
    );

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
                        {' '}                        
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

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Panel Użytkownika
                </Typography>
            </Box>

            <Box sx={{ display: 'flex' }}>
                {' '}
                <Box sx={{ flex: 1, pr: 2 }}>
                    {' '}
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
                        </Paper>
                    )}
                </Box>
                <Box sx={{ flex: 1 }}>
                    {' '}                    
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
        </Container>
    );
};
