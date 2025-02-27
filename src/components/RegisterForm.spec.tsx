import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from './RegisterForm';
import { vi } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';

describe('RegisterForm', () => {
    const mockRegister = vi.fn();

    beforeEach(() => {
        mockRegister.mockReset();
    });

    it('should render the form correctly', () => {
        render(<RegisterForm register={mockRegister} />);

        expect(screen.getByLabelText('Imię')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Hasło')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Zarejestruj' }),
        ).toBeInTheDocument();
    });

    it('should display validation errors when form is submitted with empty fields', async () => {
        render(<RegisterForm register={mockRegister} />);

        fireEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }));

        await waitFor(() => {
            expect(screen.getByText('Imię jest wymagane')).toBeInTheDocument();
            expect(screen.getByText('Email jest wymagany')).toBeInTheDocument();
            expect(screen.getByText('Hasło jest wymagane')).toBeInTheDocument();
        });
    });

    it('should display error for password too short', async () => {
        render(<RegisterForm register={mockRegister} />);

        fireEvent.input(screen.getByLabelText('Hasło'), {
            target: { value: '123' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }));

        await waitFor(() => {
            expect(
                screen.getByText('Hasło musi mieć co najmniej 6 znaków'),
            ).toBeInTheDocument();
        });
    });

    it('should call register function and display success message on successful registration', async () => {
        mockRegister.mockResolvedValue({
            id: 1,
            name: 'John',
            email: 'john@example.com',
        });

        render(<RegisterForm register={mockRegister} />);

        fireEvent.input(screen.getByLabelText('Imię'), {
            target: { value: 'John' },
        });

        fireEvent.input(screen.getByLabelText('Email'), {
            target: { value: 'john@example.com' },
        });

        fireEvent.input(screen.getByLabelText('Hasło'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                name: 'John',
                email: 'john@example.com',
                password: 'password123',
            });
            expect(
                screen.getByText('Rejestracja zakończona sukcesem!'),
            ).toBeInTheDocument();
        });
    });

    it('should display error message when registration fails', async () => {
        const error = new AxiosError('User already exists', '400');
        error.response = {
            data: { message: 'User already exists' },
            status: 400,
            statusText: 'Bad Request',
            headers: new AxiosHeaders(),
            config: { headers: new AxiosHeaders() },
        };

        mockRegister.mockRejectedValue(error);

        render(<RegisterForm register={mockRegister} />);

        fireEvent.input(screen.getByLabelText('Imię'), {
            target: { value: 'John' },
        });

        fireEvent.input(screen.getByLabelText('Email'), {
            target: { value: 'john@example.com' },
        });

        fireEvent.input(screen.getByLabelText('Hasło'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }));

        await waitFor(() => {
            expect(
                screen.getByText(
                    'Użytkownik z takim adresem email już istnieje.',
                ),
            ).toBeInTheDocument();
        });
    });

    it('should display generic error message when an unknown error occurs', async () => {
        mockRegister.mockRejectedValue(new Error('Unknown error'));

        render(<RegisterForm register={mockRegister} />);

        fireEvent.input(screen.getByLabelText('Imię'), {
            target: { value: 'John' },
        });

        fireEvent.input(screen.getByLabelText('Email'), {
            target: { value: 'john@example.com' },
        });

        fireEvent.input(screen.getByLabelText('Hasło'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }));

        await waitFor(() => {
            expect(screen.getByText('Unknown error')).toBeInTheDocument();
        });
    });
});
