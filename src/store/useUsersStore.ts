import { create } from 'zustand';
import { User } from '../types';

interface UsersState {
  users: User[];
  error: string | null;
  loading: boolean;
  fetchUsers: () => Promise<void>;
}

export const useUsersStore = create<UsersState>()((set) => ({
  users: [],
  error: null,
  loading: false,
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Brak tokenu autoryzacyjnego.');
      }

      const response = await fetch('http://localhost:3000/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błąd pobierania użytkowników.');
      }

      const data = await response.json();
      set({ users: data, loading: false });
    } catch (error) {
      console.error('Błąd pobierania użytkowników:', error);
      if (error instanceof Error) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: 'Nieznany błąd podczas pobierania użytkowników.', loading: false });
      }
    }
  },
}));