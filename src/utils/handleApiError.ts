import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types'; // Zaimportuj interfejs

export const handleApiError = (error: AxiosError): string => {
    if (error.response) {
        const status = error.response.status;

        // Bezpieczniejsze podejście z conditional type assertion:
        const data = typeof error.response.data === 'object' && error.response.data !== null && 'message' in error.response.data
            ? error.response.data as ApiErrorResponse  // Jeśli warunek jest spełniony, traktujemy data jako ApiErrorResponse
            : { message: 'Nieznany błąd' }; // W przeciwnym razie tworzymy domyślny obiekt z message

        if (status === 400) {
            return data.message || "Nieprawidłowe dane wejściowe."; // Możemy bezpiecznie użyć data.message
        } else if (status === 401) {
            return data.message || "Brak autoryzacji. Zaloguj się ponownie.";
        } else if (status === 403) {
            return data.message || "Brak uprawnień do wykonania tej operacji.";
        } else if (status === 404) {
            return data.message || "Nie znaleziono zasobu.";
        } else if (status === 500) {
            return data.message || "Wewnętrzny błąd serwera. Spróbuj ponownie później.";
        } else if (status === 503) {
            return data.message || "Serwer jest chwilowo niedostępny. Spróbuj ponownie później.";
        }

        return data.message || `Błąd serwera: ${status}`;

    } else if (error.request) {
        return "Nie można połączyć się z serwerem. Sprawdź połączenie z internetem.";
    } else {
        return "Wystąpił nieoczekiwany błąd.";
    }
};