import React from 'react';
import {
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Fade,
    Slide,
    Box,
} from '@mui/material';

export const HomePage: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Sekcja 1: O naszej bibliotece */}
            <Fade in={true} timeout={1000}>
                <Paper
                    elevation={3}
                    sx={{ p: 4, mb: 4, bgcolor: 'background.paper' }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{ fontWeight: 'bold', color: 'primary.main' }}
                    >
                        O naszej bibliotece
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ lineHeight: 1.6, color: 'text.secondary' }}
                    >
                        Jesteśmy biblioteką, która oferuje szeroki wybór książek
                        z różnych gatunków. Naszym celem jest promowanie
                        czytelnictwa i umożliwienie łatwego dostępu do
                        literatury. W naszej ofercie znajdziesz zarówno klasyki,
                        jak i najnowsze bestsellery.
                    </Typography>
                </Paper>
            </Fade>

            {/* Sekcja 2: Co znajdziesz w naszej bibliotece? */}
            <Slide in={true} direction="up" timeout={1000}>
                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', md: 'row' }}
                    gap={2}
                    sx={{ mb: 2 }}
                >
                    <Box flex={1}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                height: '100%',
                                bgcolor: 'background.paper',
                            }}
                        >
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'primary.main',
                                }}
                            >
                                Co znajdziesz w naszej bibliotece?
                            </Typography>
                            <List>
                                {[
                                    'Tysiące książek, w tym beletrystyka, literatura faktu, książki dla dzieci i młodzieży.',
                                    'Wygodną wyszukiwarkę, która pomoże Ci znaleźć interesujące Cię tytuły.',
                                    'Możliwość wypożyczania książek online.',
                                    'Aktualności i informacje o wydarzeniach literackich.',
                                ].map((text, index) => (
                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={text}
                                            sx={{ color: 'text.secondary' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Box>

                    {/* Sekcja 3: Jak korzystać z biblioteki? */}
                    <Box flex={1}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                height: '100%',
                                bgcolor: 'background.paper',
                            }}
                        >
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'primary.main',
                                }}
                            >
                                Jak korzystać z biblioteki?
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    lineHeight: 1.6,
                                    color: 'text.secondary',
                                    mb: 2,
                                }}
                            >
                                Aby wypożyczyć książkę, wystarczy się
                                zarejestrować i zalogować. Następnie możesz
                                przeglądać katalog i wybierać tytuły do
                                wypożyczenia. Po złożeniu zamówienia, książka
                                zostanie przygotowana do odbioru.
                            </Typography>
                        </Paper>
                    </Box>
                </Box>
            </Slide>

            {/* Sekcja 4: Zapraszamy! */}
            <Fade in={true} timeout={1000}>
                <Paper elevation={3} sx={{ p: 4, bgcolor: 'background.paper' }}>
                    <Typography
                        variant="h3"
                        gutterBottom
                        sx={{ fontWeight: 'bold', color: 'primary.main' }}
                    >
                        Zapraszamy!
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ lineHeight: 1.6, color: 'text.secondary' }}
                    >
                        Dołącz do naszej społeczności czytelników i odkryj świat
                        literatury!
                    </Typography>
                </Paper>
            </Fade>
        </Container>
    );
};
