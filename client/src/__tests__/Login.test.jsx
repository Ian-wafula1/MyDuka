import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import '@testing-library/jest-dom/vitest';

vi.mock('axios');

const navigateMock = vi.fn();
vi.doMock('react-router-dom', async (importOriginal) => {
	const actual = await importOriginal();
	return { ...actual, useNavigate: () => navigateMock };
});

const renderWithRouter = (ui, { route = '/' } = {}) => {
	return render(
		<AppProvider>
			<MemoryRouter initialEntries={[route]}>
				<Routes>
					<Route path="/:token?" element={ui} />
				</Routes>
			</MemoryRouter>
		</AppProvider>
	);
};

describe('LoginForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('renders email and password fields', () => {
		renderWithRouter(<Login />);
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
	});

	test('shows validation errors when fields are empty', async () => {
		renderWithRouter(<Login />);
		fireEvent.click(screen.getByRole('button', { name: /login/i }));
		const errors = await screen.findAllByText(/Required/i);
		expect(errors.length).toBeGreaterThanOrEqual(1);
	});

	test('submits form with valid data', async () => {
		const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

		renderWithRouter(<Login />);

		fireEvent.change(screen.getByLabelText(/email/i), {
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
