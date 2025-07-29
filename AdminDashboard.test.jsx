import { render, screen } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';
import { UserContext } from '../context/UserContext';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
describe('AdminDashboard'), () => {
  const renderWithContext = (role) => {
    return render(
      <UserContext.Provider value={{ role }}>
        <Router>
          <AdminDashboard />
        </Router>
      </UserContext.Provider>
    );
  };

  it('renders AdminDashboard for admin role', () => {
    renderWithContext('admin');
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('does not render AdminDashboard for non-admin roles', () => {
    const { container } = renderWithContext('merchant');
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a message when no role is assigned', () => {
    const { container } = renderWithContext(null);
    expect(container).toHaveTextContent('No role assigned');
  });
}