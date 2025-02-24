import React from 'react';
import { Log } from '../types';
import { useLogsStore } from '../store/useLogsStor';

interface AdminLogsPanelProps {
    logs: Log[];
    loading: boolean;
}

export const AdminLogsPanel: React.FC<AdminLogsPanelProps> = ({
    logs,
    loading,
}) => {
    const { error } = useLogsStore();

    if (loading) {
        return <div>Ładowanie logów...</div>;
    }

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div>
            <h2>Panel Logów</h2>
            <table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Użytkownik</th>
                        <th>Akcja</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, index) => {
                        return (
                            <tr key={index}>
                                <td>{log?.timestamp}</td>
                                <td>{log?.user}</td>
                                <td>{log?.action}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
