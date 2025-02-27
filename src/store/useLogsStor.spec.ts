import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { useLogsStore, LogsState } from './useLogsStor';
import { Log } from '../types';

describe('useLogsStore', () => {
    let mockAxios: MockAdapter;
    let store: LogsState;

    beforeEach(() => {
        mockAxios = new MockAdapter(axios);
        store = useLogsStore.getState();
        localStorage.clear();
    });

    afterEach(() => {
        mockAxios.restore();
        useLogsStore.setState({ logs: [], loading: true, error: null });
    });

    it('should fetch logs correctly', async () => {
        const mockLogs: Log[] = [
            {
                user: 'user1',
                action: 'Login',
                timestamp: new Date().toISOString(),
            },
            {
                user: 'user2',
                action: 'Logout',
                timestamp: new Date().toISOString(),
            },
        ];
        localStorage.setItem('token', 'test-token');
        mockAxios.onGet('http://localhost:3000/logs').reply(200, mockLogs);

        await store.fetchLogs();

        expect(useLogsStore.getState().logs).toEqual(mockLogs);
        expect(useLogsStore.getState().loading).toBe(false);
        expect(useLogsStore.getState().error).toBeNull();
    });

    it('should handle error during fetch logs', async () => {
        localStorage.setItem('token', 'test-token');
        mockAxios
            .onGet('http://localhost:3000/logs')
            .reply(500, { message: 'Internal Server Error' });

        await store.fetchLogs();

        expect(useLogsStore.getState().loading).toBe(false);
        expect(useLogsStore.getState().error).toBe('Internal Server Error');
    });

    it('should handle missing token error', async () => {
        await store.fetchLogs();

        expect(useLogsStore.getState().loading).toBe(false);
        expect(useLogsStore.getState().error).toBe(
            'Wystąpił nieoczekiwany błąd.',
        );
    });
});
