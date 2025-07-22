import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

const navigateMock = vi.fn();
const mockError = { status: null };

vi.doMock('react-router-dom', async (importOriginal) => {
        const actual = await importOriginal();
        return { 
                ...actual, 
                useNavigate: () => navigateMock,
                useRouteError: () => mockError
        };
});

const renderWithRouter = (ui, { route = '/' } = {}) => {
        return render(
                <MemoryRouter initialEntries={[route]}>
                        <Routes>
                                <Route path="*" element={ui} />
                        </Routes>
                </MemoryRouter>
        );
};

describe('ErrorPage', () => {
        beforeEach(() => {
                vi.clearAllMocks();
                mockError.status = null;
        });

        it('Renders default error message', () => {
                renderWithRouter(<ErrorPage />);
                expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
                expect(screen.getByText(/We're having trouble loading this page/i)).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
        });

        it('Renders 404 error message when status is 404', () => {
                mockError.status = 404;
                renderWithRouter(<ErrorPage />);
                expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
                expect(screen.getByText(/This page doesn't exist or has been moved/i)).toBeInTheDocument();
        });

        it('Renders server error message when status is 500+', () => {
                mockError.status = 500;
                renderWithRouter(<ErrorPage />);
                expect(screen.getByText(/Server error/i)).toBeInTheDocument();
                expect(screen.getByText(/We're working to fix this issue/i)).toBeInTheDocument();
        });

        it('Handles go home button click', () => {
                renderWithRouter(<ErrorPage />);
                fireEvent.click(screen.getByRole('button', { name: /go home/i }));
                expect(navigateMock).toHaveBeenCalledWith('/');
        });

        it('Handles go back button click', () => {
                renderWithRouter(<ErrorPage />);
                fireEvent.click(screen.getByRole('button', { name: /go back/i }));
                expect(navigateMock).toHaveBeenCalledWith(-1);
        });
});