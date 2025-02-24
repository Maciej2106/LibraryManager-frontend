import React from 'react';
import { Log } from '../types';
import { TableCell, TableRow, Typography } from '@mui/material';

interface LogItemProps {
    log: Log;
}

export const LogItem: React.FC<LogItemProps> = ({ log }) => {
    console.log("LogItem - log:", log); 

    return (
        <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.05)' } }}>
            <TableCell>
                <Typography variant="body2">{log.timestamp}</Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2">{log.user}</Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2">{log.action}</Typography>
            </TableCell>
        </TableRow>
    );
};