import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { useToast } from '../../stores/ToastContext';
import { LoginPage } from '../../pages/LoginPage/LoginPage';
import { Auth } from 'firebase/auth';
// import { firebaseAuth } from '../../databaseConnections/FireBaseConnection';
// import { LoginPage } from '../../../pages/LoginPage/LoginPage';
// import { useToast } from '../../../stores/ToastContext';

// Mock dependencies
jest.mock('../../stores/ToastContext');
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({
    addScope: jest.fn()
  })),
  signInWithPopup: jest.fn().mockResolvedValue({
    user: {
      getIdToken: jest.fn().mockResolvedValue('mock-token')
    }
  })
}));

// Create a complete mock of firebaseAuth
const mockFirebaseAuth = {
  app: {},
  currentUser: null,
  signInWithPopup: jest.fn().mockResolvedValue({
    user: {
      getIdToken: jest.fn().mockResolvedValue('mock-token')
    }
  })
} as unknown as Auth & { signInWithPopup: jest.Mock };

jest.mock('../../databaseConnections/FireBaseConnection', () => ({
  firebaseAuth: mockFirebaseAuth
}));
jest.mock('../../controllers/authController', () => ({
  sendIdTokenToBackendLogin: jest.fn(),
}));

// Mock React Router hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' }),
}));

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

  test('renders login page with all required elements', () => {
    renderLoginPage();
    const password = screen.getByTestId('passwordInput');
    // Check for main title
    expect(screen.getByTestId('loginText')).toHaveTextContent('Login');
    expect(screen.getByTestId('emailLabel')).toHaveTextContent('Email');
    expect(screen.getByTestId('passwordLabel')).toHaveTextContent('Password');
    
    // Check for form fields
    expect(screen.getByTestId('emailInput')).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(password).toHaveAttribute('type', 'password');
    
    // Check for buttons
    expect(screen.getByTestId('loginButton')).toBeInTheDocument();
    expect(screen.getByTestId('googleLoginButton')).toBeInTheDocument();
    expect(screen.getByTestId('facebookLoginButton')).toBeInTheDocument();

    // Check for correct styles
    
    // Check for sign up link
    expect(screen.getByTestId('signupLink')).toBeInTheDocument();
  });

  test('handles form input changes correctly', () => {
    renderLoginPage();
    
    const emailInput = screen.getByTestId('emailInput');
    const passwordInput = screen.getByTestId('passwordInput');
    
    // Test email input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
    
    // Test password input
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput).toHaveValue('password123');

    // @Todo: On Submit button expected data format.
  });


  test('handles sign up link navigation', () => {
    renderLoginPage();
    
    const signupLink = screen.getByTestId('signupLink');
    fireEvent.click(signupLink);
    
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

});