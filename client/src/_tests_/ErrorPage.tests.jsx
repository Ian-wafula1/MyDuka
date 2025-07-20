import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: () => jest.fn(),
}));

describe('ErrorPage', () => {
  it('displays error message from location state', () => {
    useLocation.mockReturnValueOnce({ state: { message: 'Custom Error' } });
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
  });

  it('displays default error message if none provided', () => {
    useLocation.mockReturnValueOnce({});
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Oops! Something went wrong./i)).toBeInTheDocument();
  });
});