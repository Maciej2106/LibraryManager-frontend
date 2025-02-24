import { create } from 'zustand';
import { User } from '../types';

interface UserState {
    user: User | null;
    token: string | null;
    error: string | null;
    loading: boolean;
    login: (userData: {
        libraryCardId: string;
        password: string;
    }) => Promise<User | null>;
    register: (userData: {
        email: string;
        password: string;
        name: string;
    }) => Promise<User | null>;
    logout: () => void;
    setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()((set) => ({
    user: null,
    token: null,
    error: null,
    loading: false,
    setUser: (user) => set({ user }),
    login: async (userData) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Błąd logowania');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            set({ user: data.user, token: data.token, loading: false });
            return data.user;
        } catch (error) {
            console.error('Błąd logowania:', error);
            if (error instanceof Error) {
                set({ error: error.message, loading: false });
            } else {
                set({ error: 'An unknown error occurred', loading: false });
            }
            return null;
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });
        console.log('Dane rejestracyjne wysyłane do backendu:', userData);
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            console.log('Odpowiedź z backendu (cała):', response);
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Błąd rejestracji z backendu:', errorData);
                throw new Error(errorData.message || 'Błąd rejestracji');
            }
            const data = await response.json();
            console.log('Dane użytkownika po rejestracji:', data);
            set({ loading: false });
            return data;
        } catch (error: unknown) {
            console.error('Błąd logowania:', error);
            if (error instanceof Error) {
                set({ error: error.message, loading: false });
            } else {
                set({ error: 'An unknown error occurred', loading: false });
            }
            return null;
        }
    },
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null, token: null, error: null, loading: false });
    },
}));
