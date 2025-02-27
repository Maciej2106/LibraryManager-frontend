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
    setUser: (user: User | null) => void;
    deleteUser: (userId: string | undefined) => Promise<void>;
    logout: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
    user: null,
    token: null,
    error: null,
    loading: false,
    setUser: (user) => set({ user }),

    deleteUser: async (userId) => {
        if (userId) {
            try {
                const response = await fetch(
                    `http://localhost:3000/users/${userId}`,
                    {
                        method: 'DELETE',
                    },
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                set({ user: null });
            } catch (error) {
                console.error('Błąd usuwania użytkownika:', error);
                throw error;
            }
        }
    },

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
                throw error;
            } else {
                set({ error: 'An unknown error occurred', loading: false });
                throw new Error('An unknown error occurred');
            }
            return null;
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Błąd rejestracji z backendu:', errorData);
                throw new Error(errorData.message || 'Błąd rejestracji');
            }
            const data = await response.json();

            set({ loading: false });
            return data;
        } catch (error: unknown) {
            console.error('Błąd logowania:', error);
            if (error instanceof Error) {
                set({ error: error.message, loading: false });
                throw error;
            } else {
                set({ error: 'An unknown error occurred', loading: false });
                throw new Error('An unknown error occurred');
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
