import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { handleApiError } from '../utils/handleApiError';
import { Log } from '../types';

export interface LogsState {
    logs: Log[];
    loading: boolean;
    error: string | null;
    fetchLogs: () => Promise<void>;
}

export const useLogsStore = create<LogsState>((set) => ({
    logs: [],
    loading: true,
    error: null,
    fetchLogs: async () => {
        set({ loading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Brak tokenu autoryzacyjnego.');
            }
            const response = await axios.get('http://localhost:3000/logs', {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });

            set({ logs: response.data, loading: false });
        } catch (error) {
            const errorMessage = handleApiError(error as AxiosError);
            console.error('Błąd pobierania logów:', errorMessage, error);
            set({ error: errorMessage, loading: false });
        }
    },
}));
