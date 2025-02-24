import { FieldError } from 'react-hook-form';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    libraryCardId: string;
    role: string;
}
export enum Role {
    CLIENT = 'CLIENT',
    ADMIN = 'ADMIN',
}
export interface Book {
    id: string;
    title: string;
    author: string;
    availableCopies: number | null;
    borrowedCopies: number | null;
    description: string | null;
    year: number | null;
}
export interface Rental {
    id: string;
    userId: string;
    bookId: string;
    book: Book | null;
    userName: string;
    libraryCardId: string;
    rentalDate: string;
    returnDate: string | null;
    status: 'Borrowed' | 'Overdue' | 'Returned';
}
export interface Log {
    timestamp: string;
    user: string;
    action: string;
}
export interface ApiErrorResponse {
    message: string;
}
export interface RegisterData {
    name: string;
    email: string;
    password: string;
}
export interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    error: string | null | FieldError | null;
    token: string | null;
    login: (credentials: {
        libraryCardId: string;
        password: string;
    }) => Promise<User | null>;
    logout: () => void;
    register: (userData: RegisterData) => Promise<User | null>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
    rehydrate: () => Promise<void>;
    setToken: (token: string | null) => void;
}
export interface RentalWithBook extends Rental {
    book: Book | null;
}
