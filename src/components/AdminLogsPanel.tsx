import React from 'react';
import { Log } from '../types';
import { useLogsStore } from '../store/useLogsStor';
import {
    CircularProgress,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

interface AdminLogsPanelProps {
    logs: Log[];
    loading: boolean;
}

export const AdminLogsPanel: React.FC<AdminLogsPanelProps> = ({
    logs,
    loading,
}) => {
    const { error } = useLogsStore();

    if (loading) {
        return (
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return <Typography color="error">Błąd: {error}</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Panel Logów
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Użytkownik</TableCell>
                            <TableCell>Akcja</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {log?.timestamp}
                                </TableCell>
                                <TableCell>{log?.user}</TableCell>
                                <TableCell>{log?.action}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};
