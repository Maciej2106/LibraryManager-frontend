import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RegisterData, User } from '../types';
import { TextField, Button, CircularProgress, Box, Alert } from '@mui/material';

interface RegisterFormProps {
    register: (userData: RegisterData) => Promise<User | null>;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ register }) => {
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [registrationError, setRegistrationError] = useState<string | null>(
        null,
    );
    const [loading, setLoading] = useState(false);
    const {
        register: reactRegister,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RegisterData>();

    const onSubmit = async (data: RegisterData) => {
        setLoading(true);
        setRegistrationError(null);
        try {
            const user = await register(data);
            if (user) {
                setRegistrationSuccess(true);
                reset();
            } else {
                setRegistrationError('Rejestracja nieudana.');
            }
        } catch (error: unknown) {
            let errorMessage = 'Wystąpił nieznany błąd.';

            if (error instanceof AxiosError) {
                if (error.response) {
                    const message =
                        typeof error.response.data === 'object' &&
                        error.response.data !== null &&
                        'message' in error.response.data
                            ? error.response.data.message
                            : 'Błąd rejestracji.';

                    if (
                        error.response.status === 400 &&
                        message === 'User already exists'
                    ) {
                        errorMessage =
                            'Użytkownik z takim adresem email już istnieje.';
                    } else {
                        errorMessage = message as string;
                    }
                } else if (error.request) {
                    errorMessage = 'Brak odpowiedzi od serwera.';
                } else {
                    errorMessage = error.message || 'Błąd rejestracji.';
                }
            } else if (error instanceof Error) {
                errorMessage = error.message || 'Wystąpił nieznany błąd.';
            }

            setRegistrationError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 400,
                margin: 'auto',
                marginTop: 4,
            }}
        >
            <TextField
                label="Imię"
                {...reactRegister('name', { required: 'Imię jest wymagane' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
            />

            <TextField
                label="Email"
                type="email"
                {...reactRegister('email', {
                    required: 'Email jest wymagany',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Niepoprawny format email',
                    },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
            />

            <TextField
                label="Hasło"
                type="password"
                {...reactRegister('password', {
                    required: 'Hasło jest wymagane',
                    minLength: {
                        value: 6,
                        message: 'Hasło musi mieć co najmniej 6 znaków',
                    },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
            >
                {loading ? <CircularProgress size={24} /> : 'Zarejestruj'}
            </Button>

            {registrationSuccess && (
                <Alert severity="success">
                    Rejestracja zakończona sukcesem!
                </Alert>
            )}
            {registrationError && (
                <Alert severity="error">{registrationError}</Alert>
            )}
        </Box>
    );
};
