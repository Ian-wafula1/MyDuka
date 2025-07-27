import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminStore from '../components/AdminStore';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import axios from 'axios';
import { adminObj } from '../utils/userObjects';

vi.mock('axios');

const mockSetStore = vi.fn();
const baseStore = {
	users: [{ id: 1, name: 'Clerk One', email: 'clerk1@example.com', account_type: 'clerk', account_status: 'active' }],
	entries: [{ id: 10, product_id: 100, quantity: 2, payment_status: 'pending', total_sum: 500, created_at: '2025-07-18T10:00:00Z' }],
	supply_requests: [{ id: 20, product_id: 100, quantity: 5, status: 'pending', created_at: '2025-07-18T10:00:00Z' }],
	products: [{ id: 100, name: 'Apples' }],
};

const store = adminObj.stores[0];

describe('AdminStore', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders clerks, entries, and supply requests', () => {
		render(<AdminStore store={store} setStore={mockSetStore} />);
		expect(screen.getByText(/Clerks/i)).toBeInTheDocument();
		expect(screen.getByText(/Entries/)).toBeInTheDocument();
		expect(screen.getByText(/Supply Requests/)).toBeInTheDocument();
	});

	it('toggles the add clerk form', () => {
		render(<AdminStore store={store} setStore={mockSetStore} />);
		const toggleButton = screen.getByRole('button', { name: '+' });
		fireEvent.click(toggleButton);
		expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
		fireEvent.click(screen.getByRole('button', { name: '-' }));
		expect(screen.queryByLabelText(/Name/i)).not.toBeInTheDocument();
	});

	it('handles form submission for adding a clerk', async () => {
		axios.post.mockResolvedValueOnce({ data: { id: 2, name: 'New Clerk', account_type: 'clerk', email: 'new@clerk.com', account_status: 'active' } });
		render(<AdminStore store={baseStore} setStore={mockSetStore} />);
		fireEvent.click(screen.getByRole('button', { name: '+' }));
		fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Clerk' } });
		fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: 'new@clerk.com' } });
		fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'longenoughpw' } });
		fireEvent.click(screen.getByRole('button', { name: /submit/i }));
		await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/clerk', expect.objectContaining({ name: 'New Clerk' })));
		await waitFor(() => expect(mockSetStore).toHaveBeenCalled());
	});

	it('handles edge case: no clerks', () => {
		const store = { ...baseStore, users: [] };
		render(<AdminStore store={store} setStore={mockSetStore} />);
		expect(screen.getByText(/Clerks/)).toBeInTheDocument();
	});

	it('handles edge case: no entries or supply requests', () => {
		const store = { ...baseStore, entries: [], supply_requests: [] };
		render(<AdminStore store={store} setStore={mockSetStore} />);
		expect(screen.getByText(/Entries/)).toBeInTheDocument();
		expect(screen.getByText(/Supply Requests/)).toBeInTheDocument();
	});

	it('deactivates a clerk when button is clicked', async () => {
		axios.patch.mockResolvedValueOnce({});
		render(<AdminStore store={baseStore} setStore={mockSetStore} />);
		fireEvent.click(screen.getByText(/Deactivate/));
		await waitFor(() => expect(axios.patch).toHaveBeenCalled());
	});

	it('removes a clerk when remove button is clicked', async () => {
		axios.delete.mockResolvedValueOnce({});
		render(<AdminStore store={baseStore} setStore={mockSetStore} />);
		fireEvent.click(screen.getByText(/Remove/));
		await waitFor(() => expect(axios.delete).toHaveBeenCalled());
	});

	it('changes entry status', async () => {
		axios.patch.mockResolvedValueOnce({});
		render(<AdminStore store={baseStore} setStore={mockSetStore} />);
		fireEvent.click(screen.getByText(/Change status/));
		await waitFor(() => expect(axios.patch).toHaveBeenCalled());
	});

	it('approves supply request', async () => {
		axios.patch.mockResolvedValueOnce({});
		render(<AdminStore store={baseStore} setStore={mockSetStore} />);
		fireEvent.click(screen.getByText(/Approve/));
		await waitFor(() => expect(axios.patch).toHaveBeenCalled());
	});
});
