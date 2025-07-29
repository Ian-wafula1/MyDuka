import { render, screen } from '@testing-library/react';
import ClerkDashboard from './ClerkDashboard';

test('renders ClerkDashboard with correct role content', () => {
  render(<ClerkDashboard />);
  expect(screen.getByText(/Clerk Dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/Inventory Management/i)).toBeInTheDocument(); 
});