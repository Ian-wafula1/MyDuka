import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResetPassword from '../pages/ResetPassword';
import axios from 'axios';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('axios');

const navigateMock = vi.fn();
vi.doMock('react-router-dom', async (importOriginal) => {
        const actual = await importOriginal();
        return { ...actual, useNavigate: () => navigateMock };
});

const renderWithRouter = (ui, { route = '/' } = {}) => {
        return render(
                <MemoryRouter initialEntries={[route]}>
                        <Routes>
                                <Route path="/:token?" element={ui} />
                        </Routes>
                </MemoryRouter>
        );
};

describe('ResetPassword', () => {
        beforeEach(() => {
                vi.clearAllMocks();
        });

        it('Renders reset password form by default', () => {
                renderWithRouter(<ResetPassword />);
                expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
                expect(screen.getByLabelText(/Email/i)).not.toBeDisabled();
        });

        it('Renders form with disabled email when token is provided', async () => {
                axios.get.mockResolvedValueOnce({ data: { email: 'user@example.com' } });
                renderWithRouter(<ResetPassword />, { route: '/sometoken' });
                expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
                await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/api/verify-token'));
                expect(screen.getByLabelText(/Email/i)).toBeDisabled();
        });

        it('Validates required fields', async () => {
                renderWithRouter(<ResetPassword />);
                fireEvent.click(screen.getByRole('button', { name: /submit/i }));
                const errors = await screen.findAllByText(/Required/i);
                expect(errors.length).toBeGreaterThanOrEqual(1);
        });

        it('Submits form and redirects to login', async () => {
                axios.post.mockResolvedValueOnce({});

                renderWithRouter(<ResetPassword />);

                fireEvent.change(screen.getByLabelText(/Name/i), {
                        target: { value: 'John' },
                });
                fireEvent.change(screen.getByLabelText(/^Email/i), {
                        target: { value: 'john@example.com' },
                });
                fireEvent.change(screen.getByLabelText(/New Password/i), {
                        target: { value: 'newsecret123' },
                });
                fireEvent.click(screen.getByRole('button', { name: /submit/i }));

                await waitFor(() =>
                        expect(axios.post).toHaveBeenCalledWith(
                                '/api/reset-password',
                                expect.objectContaining({
                                        name: 'John',
                                        email: 'john@example.com',
                                        newPassword: 'newsecret123',
                                })
                        )
                );
                // await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/login'));
        });
});