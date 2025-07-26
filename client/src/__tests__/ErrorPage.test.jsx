import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

const navigateMock = vi.fn();
let mockErrorStatus = null;

vi.mock('react-router-dom', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		useNavigate: () => navigateMock,
		useRouteError: () => ({ status: mockErrorStatus }),
	};
});

const renderWithDataRouter = (ui, { route = '/' } = {}) => {
	const router = createMemoryRouter(
		[
			{
				path: '*',
				element: ui,
				errorElement: ui,
			},
		],
		{
			initialEntries: [route],
		}
	);
	return render(<RouterProvider router={router} />);
};

describe('ErrorPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockErrorStatus = null;
	});

	it('Renders default error message', () => {
		renderWithDataRouter(<ErrorPage />);
		expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
		expect(screen.getByText(/We're having trouble loading this page/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
	});

	it('Renders 404 error message when status is 404', () => {
		mockErrorStatus = 404;
		renderWithDataRouter(<ErrorPage />);
		expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
		expect(screen.getByText(/This page doesn't exist or has been moved/i)).toBeInTheDocument();
	});

	it('Renders server error message when status is 500+', () => {
		mockErrorStatus = 500;
		renderWithDataRouter(<ErrorPage />);
		expect(screen.getByText(/Server error/i)).toBeInTheDocument();
		expect(screen.getByText(/We're working to fix this issue/i)).toBeInTheDocument();
	});

	it('Handles go home button click', () => {
		renderWithDataRouter(<ErrorPage />);
		fireEvent.click(screen.getByRole('button', { name: /go home/i }));
		expect(navigateMock).toHaveBeenCalledWith('/');
	});

	it('Handles go back button click', () => {
		renderWithDataRouter(<ErrorPage />);
		fireEvent.click(screen.getByRole('button', { name: /go back/i }));
		expect(navigateMock).toHaveBeenCalledWith(-1);
	});
});
