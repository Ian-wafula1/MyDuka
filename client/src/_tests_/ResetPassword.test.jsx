import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPassword from '../pages/ResetPassword';
import { resetPassword } from '../api/auth';

jest.mock('../api/auth');

describe('ResetPassword', () => {
  beforeEach(() => {
    resetPassword.mockClear();
  });

  it('renders form inputs correctly', () => {
    render(<ResetPassword />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
  });

  it('submits form and shows success message', async () => {
    resetPassword.mockResolvedValueOnce({ data: { message: 'Password reset successful' } });
    render(<ResetPassword />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Victor' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'vic@example.com' } });
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newpass123' } });
    fireEvent.click(screen.getByText(/Reset/i));
    await waitFor(() => {
      expect(screen.getByText(/Password reset successful/)).toBeInTheDocument();
    });
  });

  it('shows error message on failure', async () => {
    resetPassword.mockRejectedValueOnce({ response: { data: { message: 'User not found' } } });
    render(<ResetPassword />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Victor' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'vic@example.com' } });
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByText(/Reset/i));
    await waitFor(() => {
      expect(screen.getByText(/User not found/)).toBeInTheDocument();
    });
  });
});