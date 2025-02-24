import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; 
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material';

interface LoginFormProps {
    onLogin: (credentials: { libraryCardId: string; password: string }) => Promise<User | null>;
    loading: boolean;
    setUser: (user: User | null) => void; 
}

interface FormData { 
    libraryCardId: string;
    password: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, setUser }) => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>(); 

    const onSubmit = async (data: FormData) => { // Zmieniamy typ na FormData
        setLoginError(null); // Resetujemy błąd logowania
        try {
            const loggedInUser = await onLogin(data);
            if (loggedInUser) {
                setUser(loggedInUser);

                // Dodajemy sprawdzenie roli i odpowiednie przekierowanie
                if (loggedInUser.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/user');
                }
            } else {
                setLoginError('Nieprawidłowe dane logowania.');
            }
        } catch (error) {
            setLoginError('Wystąpił błąd podczas logowania.');
            console.error("Błąd logowania:", error);
        }
    };

    const [loginError, setLoginError] = useState<string | null>(null);

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto', padding: 3, borderRadius: 2, boxShadow: 1 }}>
            <TextField
                label="Numer Karty Bibliotecznej"
                {...register("libraryCardId", { required: "Numer karty jest wymagany" })}
                error={!!errors.libraryCardId}
                helperText={errors.libraryCardId?.message}
                fullWidth
            />
            <TextField
                label="Hasło"
                type="password"
                {...register("password", { required: "Hasło jest wymagane" })}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                {loading ? <CircularProgress size={24} /> : "Zaloguj"}
            </Button>
            {loginError && <Alert severity="error">{loginError}</Alert>}
        </Box>
    );
};