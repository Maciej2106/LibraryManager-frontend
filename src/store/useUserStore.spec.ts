import { act } from 'react';
import { useUserStore } from './useUserStore';
import { vi, expect, beforeEach, afterEach, Mock } from 'vitest';
import { User } from '../types';

describe('useUserStore', () => {
    const mockUser: User = {
        id: '1',
        libraryCardId: '123',
        role: 'USER',
        name: 'Test User',
        email: 'test.user@example.com',
    };

    const mockToken = 'test-token';
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        global.fetch = vi.fn();
        localStorage.clear();
        consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
    });

    afterEach(() => {
        useUserStore.getState().logout();
        consoleErrorSpy.mockRestore();
    });

    it('should set user correctly', () => {
        act(() => {
            useUserStore.getState().setUser(mockUser);
        });
        expect(useUserStore.getState().user).toEqual(mockUser);
    });

    it('should delete user correctly', async () => {
        (global.fetch as Mock).mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });
        await act(async () => {
            await useUserStore.getState().deleteUser(mockUser.id);
        });
        expect(useUserStore.getState().user).toBeNull();
    });

    it('should handle error during delete user', async () => {
        (global.fetch as Mock).mockResolvedValue({
            ok: false,
            status: 404,
            json: async () => ({}),
        });

        await expect(
            useUserStore.getState().deleteUser(mockUser.id),
        ).rejects.toThrowError('HTTP error! status: 404');
    });

    it('should login user correctly', async () => {
        (global.fetch as Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ user: mockUser, token: mockToken }),
        });

        await act(async () => {
            await useUserStore
                .getState()
                .login({ libraryCardId: '123', password: 'password' });
        });

        expect(useUserStore.getState().user).toEqual(mockUser);
        expect(useUserStore.getState().token).toEqual(mockToken);
        expect(localStorage.getItem('token')).toEqual(mockToken);
        expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(
            mockUser,
        );
    });

    it('should handle error during login', async () => {
        (global.fetch as Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ message: 'Login failed' }),
        });

        await expect(
            useUserStore
                .getState()
                .login({ libraryCardId: '123', password: 'password' }),
        ).rejects.toThrowError('Login failed');
    });

    it('should register user correctly', async () => {
        (global.fetch as Mock).mockResolvedValue({
            ok: true,
            json: async () => mockUser,
        });

        await act(async () => {
            await useUserStore.getState().register({
                email: 'test@example.com',
                password: 'password',
                name: 'Test User',
            });
        });

        expect(useUserStore.getState().loading).toBe(false);
    });

    it('should handle error during register', async () => {
        (global.fetch as Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ message: 'Registration failed' }),
        });

        await expect(
            useUserStore.getState().register({
                email: 'test@example.com',
                password: 'password',
                name: 'Test User',
            }),
        ).rejects.toThrowError('Registration failed');
    });

    it('should logout user correctly', () => {
        act(() => {
            useUserStore.getState().setUser(mockUser);
            useUserStore.getState().token = mockToken;
            useUserStore.getState().logout();
        });

        expect(useUserStore.getState().user).toBeNull();
        expect(useUserStore.getState().token).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });
});
