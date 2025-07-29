import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Store from '../pages/Store';
import { AppContext } from '../context/AppContext';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock the store components
vi.mock('../components/MerchantStore', () => ({
  default: ({ store }) => (
    <div data-testid="merchant-store">Merchant Store Component - Store: {store?.name}</div>
  ),
}));

vi.mock('../components/AdminStore', () => ({
  default: ({ store }) => (
    <div data-testid="admin-store">Admin Store Component - Store: {store?.name}</div>
  ),
}));

vi.mock('../components/ClerkStore', () => ({
  default: ({ store }) => (
    <div data-testid="clerk-store">Clerk Store Component - Store: {store?.name}</div>
  ),
}));

vi.mock('../components/Sidebar', () => ({
  default: ({ handleUrlChange }) => (
    <div data-testid="sidebar">
      <button onClick={() => handleUrlChange(1)}>Store 1</button>
      <button onClick={() => handleUrlChange(2)}>Store 2</button>
    </div>
  ),
}));

const mockStores = [
  {
    id: 1,
    name: 'Tech Store',
    location: 'Nairobi',
    total_products: 50,
    total_revenue: 100000,
    monthly_sales: 25000,
    pending_requests: 5,
    users: [],
    entries: [],
    supply_requests: [],
    products: [],
  },
  {
    id: 2,
    name: 'Fashion Store',
    location: 'Mombasa',
    total_products: 75,
    total_revenue: 150000,
    monthly_sales: 35000,
    pending_requests: 3,
    users: [],
    entries: [],
    supply_requests: [],
    products: [],
  },
];

const createMockUser = (accountType, stores = mockStores) => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  account_type: accountType,
  stores,
});

const renderWithRouterAndContext = (
  ui,
  { route = '/store/1', appContextValue } = {}
) => {
  const mockSetCurrentUser = vi.fn();

  const defaultAppContextValue = {
    currentUser: createMockUser('merchant'),
    setCurrentUser: mockSetCurrentUser,
    ...appContextValue,
  };

  return {
    ...render(
      <AppContext.Provider value={defaultAppContextValue}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/store/:id" element={ui} />
          </Routes>
        </MemoryRouter>
      </AppContext.Provider>
    ),
    mockSetCurrentUser,
  };
};

describe('Store Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders with correct CSS classes', () => {
      renderWithRouterAndContext(<Store />);
      expect(screen.getByTestId('sidebar').parentElement).toHaveClass('store-page');
      expect(screen.getByText('Tech Store').parentElement.parentElement).toHaveClass('store-content');
      expect(screen.getByText('Tech Store').parentElement).toHaveClass('store-header');
      expect(screen.getByText('Tech Store')).toHaveClass('store-title');
    });

    it('renders the sidebar component', () => {
      renderWithRouterAndContext(<Store />);
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('displays store name when store exists', () => {
      renderWithRouterAndContext(<Store />);
      expect(screen.getByText('Tech Store')).toBeInTheDocument();
    });

    it('displays fallback "Store" text when store is not found', () => {
      renderWithRouterAndContext(<Store />, {
        route: '/store/999',
        appContextValue: { currentUser: createMockUser('merchant', []) },
      });
      expect(screen.getByText('Store')).toBeInTheDocument();
    });
  });

  describe('User Type Routing', () => {
    it('renders MerchantStore component for merchant users', () => {
      renderWithRouterAndContext(<Store />, {
        appContextValue: { currentUser: createMockUser('merchant') },
      });
      expect(screen.getByTestId('merchant-store')).toBeInTheDocument();
    });

    it('renders AdminStore component for admin users', () => {
      renderWithRouterAndContext(<Store />, {
        appContextValue: { currentUser: createMockUser('admin') },
      });
      expect(screen.getByTestId('admin-store')).toBeInTheDocument();
    });

    it('renders ClerkStore component for clerk users', () => {
      renderWithRouterAndContext(<Store />, {
        appContextValue: { currentUser: createMockUser('clerk') },
      });
      expect(screen.getByTestId('clerk-store')).toBeInTheDocument();
    });

    it('defaults to ClerkStore for unknown account types', () => {
      renderWithRouterAndContext(<Store />, {
        appContextValue: { currentUser: createMockUser('unknown') },
      });
      expect(screen.getByTestId('clerk-store')).toBeInTheDocument();
    });
  });

  describe('Store Selection', () => {
    it('displays correct store based on URL parameter', () => {
      renderWithRouterAndContext(<Store />, { route: '/store/2' });
      expect(screen.getByText('Fashion Store')).toBeInTheDocument();
    });
  });

  describe('handleUrlChange Function', () => {
    it('updates currentUser and store state when handleUrlChange is called', () => {
      const mockSetCurrentUser = vi.fn();

      renderWithRouterAndContext(<Store />, {
        appContextValue: {
          currentUser: createMockUser('merchant'),
          setCurrentUser: mockSetCurrentUser,
        },
      });

      fireEvent.click(screen.getByText('Store 2'));

      expect(mockSetCurrentUser).toHaveBeenCalled();
      const updateFn = mockSetCurrentUser.mock.calls[0][0];
      const updated = updateFn(createMockUser('merchant'));
      expect(updated.stores[1].name).toBe('Fashion Store');
    });
  });

  describe('Edge Cases', () => {
    it('handles null currentUser gracefully', () => {
      renderWithRouterAndContext(<Store />, {
        appContextValue: { currentUser: null, setCurrentUser: vi.fn() },
      });
      expect(screen.getByText('Store')).toBeInTheDocument();
    });

    it('handles currentUser without stores array', () => {
      renderWithRouterAndContext(<Store />, {
        appContextValue: {
          currentUser: { id: 1, name: 'Test', account_type: 'merchant' },
          setCurrentUser: vi.fn(),
        },
      });
      expect(screen.getByText('Store')).toBeInTheDocument();
    });

    it('handles empty stores array', () => {
      renderWithRouterAndContext(<Store />, {
        appContextValue: { currentUser: createMockUser('merchant', []) },
      });
      expect(screen.getByText('Store')).toBeInTheDocument();
    });

    it('handles invalid store ID in URL', () => {
      renderWithRouterAndContext(<Store />, {
        route: '/store/invalid',
        appContextValue: { currentUser: createMockUser('merchant') },
      });
      expect(screen.getByText('Store')).toBeInTheDocument();
    });
  });

  describe('Store State Management', () => {
    it('initializes store state correctly from currentUser stores', () => {
      renderWithRouterAndContext(<Store />, {
        appContextValue: { currentUser: createMockUser('merchant') },
      });
      expect(screen.getByText('Tech Store')).toBeInTheDocument();
    });

    it('updates store state when URL parameter changes', () => {
      const mockCurrentUser = {
        account_type: 'merchant',
        stores: [
          { id: 1, name: 'Tech Store' },
          { id: 2, name: 'Fashion Store' },
        ],
      };

      const { rerender } = renderWithRouterAndContext(<Store />, {
        route: '/store/1',
        appContextValue: { currentUser: mockCurrentUser },
      });

      expect(screen.getByText((text) => text.includes('Tech Store'))).toBeInTheDocument();

      rerender(
        <MemoryRouter initialEntries={['/store/2']}>
          <AppContext.Provider value={{ currentUser: mockCurrentUser, setCurrentUser: vi.fn() }}>
            <Routes>
              <Route path="/store/:id" element={<Store />} />
            </Routes>
          </AppContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByText((text) => text.includes('Fashion Store'))).toBeInTheDocument();
    });
  });
});
