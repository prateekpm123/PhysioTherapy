import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { useToast } from '../../stores/ToastContext';
import { LoginPage } from '../../pages/LoginPage/LoginPage';
// import { LoginPage } from '../../../pages/LoginPage/LoginPage';
// import { useToast } from '../../../stores/ToastContext';

// Mock dependencies
jest.mock('../../stores/ToastContext');
jest.mock('../../databaseConnections/FireBaseConnection');
jest.mock('../../controllers/authController');

// Mock useToast
const mockUseToast = useToast as jest.Mock;
mockUseToast.mockReturnValue({
  showToast: jest.fn(),
});

// Create a mock store
const mockStore = configureStore({
  reducer: {
    userSession: (state = {}) => state
  }
});

// Helper function to render the component with all necessary providers
const renderLoginPage = () => {
  return render(
    <Provider store={mockStore}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login page', () => {
    renderLoginPage();
    // Check for main elements
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Facebook')).toBeInTheDocument();
  });
});