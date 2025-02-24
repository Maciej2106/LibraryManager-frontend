import React from 'react';
import { User } from '../types';
import { useRentalsStore } from '../store/useRentalsStore';
import { useBooksStore } from '../store/useBooksStor';
import { UserPanel } from '../components/UserPanel';


interface UserPageProps {
    user: User; 
}

export const UserPage: React.FC<UserPageProps> = ({user}) => {
    const {
        rentals,
        loading: rentalsLoading,
        error: errorRentals
    } = useRentalsStore();
    const {
        books,
        loading: booksLoading,
        error: errorBooks 
    } = useBooksStore();
    const loading = rentalsLoading || booksLoading; 

    return (
        <div>
            <UserPanel 
                user={user} 
                rentals={rentals} 
                books={books} 
                loading={loading} 
                loadingRentals={rentalsLoading} 
                errorRentals={errorRentals}     
                loadingBooks={booksLoading}    
                errorBooks={errorBooks}        
            />
        </div>
    );
};