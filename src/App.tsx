import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {Header} from './components/Header';
import {AppRouter} from './AppRouter';
import { User } from './types';
import { useUserStore } from './store/useUserStore';


export const App: React.FC = () => {
    const { user, login, logout, register, loading, setUser: setUserFromStore } = useUserStore();

    const setUser = (user: User | null) => setUserFromStore(user); // Tworzymy nową funkcję setUser

    return (
        <Router>
            <Header />
            <AppRouter
                user={user} // Przekazujemy user
                setUser={setUser} // Przekazujemy setUser
                login={login}
                register={register}
                loading={loading}
                logout={logout}
            />
        </Router>
    );
};