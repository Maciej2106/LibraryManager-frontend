// import React from 'react';
// import { Rental, Book } from '../types';
// import { useRentalsStore } from '../store/useRentalsStore';
// import { Button, CircularProgress, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// interface AdminRentalsPanelProps {
//     rentals: Rental[];
//     books: Book[];
//     loading: boolean;
// }

// export const AdminRentalsPanel: React.FC<AdminRentalsPanelProps> = ({
//     rentals,
//     books,
//     loading,
// }) => {
//     const { returnBook } = useRentalsStore();

//     const getBookTitle = (bookId: string) => {
//         const book = books.find((b) => b.id === bookId);
//         return book ? book.title : 'Nieznany tytuł';
//     };

//     if (loading) {
//         return (
//             <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//                 <CircularProgress />
//             </Container>
//     );
//     }

//     return (
//     <Container maxWidth="md" sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Panel Zarządzania Wypożyczeniami
//       </Typography>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="rentals table">
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Użytkownik</TableCell>
//               <TableCell>Książka</TableCell>
//               <TableCell>Data Wypożyczenia</TableCell>
//               <TableCell>Data Zwrotu</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Akcja</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rentals.map((rental) => (
//               <TableRow key={rental.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
//                 <TableCell component="th" scope="row">
//                   {rental.id}
//                 </TableCell>
//                 <TableCell>{rental.userId}</TableCell>
//                 <TableCell>{getBookTitle(rental.bookId)}</TableCell>
//                 <TableCell>{rental.rentalDate}</TableCell>
//                 <TableCell>{rental.returnDate}</TableCell>
//                 <TableCell>{rental.status}</TableCell>
//                 <TableCell>
//                   {rental.status !== 'Returned' ? (
//                     <Button variant="contained" color="primary" onClick={() => returnBook(rental.id)}>
//                       Wymuś Zwrot
//                     </Button>
//                   ) : null}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// };



// import React, { useEffect } from 'react';
// import { Rental, Book, User } from '../types';
// import { useRentalsStore } from '../store/useRentalsStore';
// import { useUserStore } from '../store/useUserStore';
// import {
//   Button,
//   CircularProgress,
//   Container,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from '@mui/material';

// interface AdminRentalsPanelProps {
//   rentals: Rental[];
//   books: Book[];
//   loading: boolean;
// }

// export const AdminRentalsPanel: React.FC<AdminRentalsPanelProps> = ({
//   rentals,
//   books,
//   loading,
// }) => {
//   const { returnBook } = useRentalsStore();
//   const { users, fetchUsers } = useUserStore();

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   const getBookTitle = (bookId: string) => {
//     const book = books.find((b) => b.id === bookId);
//     return book ? book.title : 'Nieznany tytuł';
//   };

//   const getUserName = (userId: string) => { // userId jest stringiem
//     const user = users.find((u: User) => u.id === userId);
//     return user ? user.name : 'Nieznany użytkownik';
//   };

//   if (loading) {
//     return (
//       <Container
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '100vh',
//         }}
//       >
//         <CircularProgress />
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="md" sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Panel Zarządzania Wypożyczeniami
//       </Typography>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="rentals table">
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Użytkownik</TableCell>
//               <TableCell>Książka</TableCell>
//               <TableCell>Data Wypożyczenia</TableCell>
//               <TableCell>Data Zwrotu</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Akcja</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rentals.map((rental) => (
//               <TableRow
//                 key={rental.id}
//                 sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//               >
//                 <TableCell component="th" scope="row">
//                   {rental.id}
//                 </TableCell>
//                 <TableCell>{getUserName(rental.userId)}</TableCell>
//                 <TableCell>{getBookTitle(rental.bookId)}</TableCell>
//                 <TableCell>{rental.rentalDate}</TableCell>
//                 <TableCell>{rental.returnDate}</TableCell>
//                 <TableCell>{rental.status}</TableCell>
//                 <TableCell>
//                   {rental.status !== 'Returned' ? (
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => returnBook(rental.id)}
//                     >
//                       Wymuś Zwrot
//                     </Button>
//                   ) : null}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// };

import React, { useEffect } from 'react';
import { Rental, Book, User } from '../types';
import { useRentalsStore } from '../store/useRentalsStore';
import { useUsersStore } from '../store/useUsersStore';
import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

interface AdminRentalsPanelProps {
  rentals: Rental[];
  books: Book[];
  loading: boolean;
}

export const AdminRentalsPanel: React.FC<AdminRentalsPanelProps> = ({
  rentals,
  books,
  loading,
}) => {
  const { returnBook } = useRentalsStore();
  const { users, fetchUsers } = useUsersStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getBookTitle = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    return book ? book.title : 'Nieznany tytuł';
  };

  const getUserName = (userId: string) => {
    const user = users.find((u: User) => u.id === userId);
    return user ? user.name : 'Nieznany użytkownik';
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel Zarządzania Wypożyczeniami
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="rentals table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Użytkownik</TableCell>
              <TableCell>Książka</TableCell>
              <TableCell>Data Wypożyczenia</TableCell>
              <TableCell>Data Zwrotu</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Akcja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rentals.map((rental) => (
              <TableRow
                key={rental.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {rental.id}
                </TableCell>
                <TableCell>{getUserName(rental.userId)}</TableCell>
                <TableCell>{getBookTitle(rental.bookId)}</TableCell>
                <TableCell>{rental.rentalDate}</TableCell>
                <TableCell>{rental.returnDate}</TableCell>
                <TableCell>{rental.status}</TableCell>
                <TableCell>
                  {rental.status !== 'Returned' ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => returnBook(rental.id)}
                    >
                      Wymuś Zwrot
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};