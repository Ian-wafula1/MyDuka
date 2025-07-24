import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { vi } from 'vitest';

describe('LoginForm', () => {
  test('renders email and password fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('shows validation errors when fields are empty', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    setTimeout(() => {
      expect(alertMock).toHaveBeenCalled();
      alertMock.mockRestore();
    }, 500);
  });
});