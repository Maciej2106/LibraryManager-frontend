import { Box, Typography } from '@mui/material';
import React from 'react';

export const Header: React.FC = () => {
    return (
        <Box sx={{
            backgroundColor: '#1976d2', 
            color: 'white', 
            padding: '20px', 
            textAlign: 'center', 
        }}>

            <Typography variant='h4' component='h1' sx={{marginBottom: '10px'}}>
                Biblioteka Online
            </Typography>
            <Typography variant='body1' component= 'p'>
                program do obsługi wypożyczeń
            </Typography>
        </Box>
    );
};