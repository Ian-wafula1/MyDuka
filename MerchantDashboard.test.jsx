import { render, screen } from '@testing-library/react';
import MerchantDashboard from './MerchantDashboard';

test('renders MerchantDashboard with relevant content', () => {
  render(<MerchantDashboard />);
  expect(screen.getByText(/Merchant Dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/Welcome, Merchant/i)).toBeInTheDocument();
  expect(screen.getByText(/Sales Overview/i)).toBeInTheDocument(); 
});