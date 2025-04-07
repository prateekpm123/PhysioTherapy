import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { useToast } from '../../stores/ToastContext';
import { SignIn } from '../../pages/SignInPage/SignIn';
import { Auth } from 'firebase/auth';

// Mock dependencies
jest.mock('../../stores/ToastContext');
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({
    addScope: jest.fn()
  })),
  FacebookAuthProvider: jest.fn().mockImplementation(() => ({
    addScope: jest.fn()
  })),
  signInWithPopup: jest.fn().mockResolvedValue({
    user: {
      getIdToken: jest.fn().mockResolvedValue('mock-token')
    }
  }),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
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
  }),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: {
      getIdToken: jest.fn().mockResolvedValue('mock-token')
    }
  })
} as unknown as Auth & { 
  signInWithPopup: jest.Mock;
  signInWithEmailAndPassword: jest.Mock;
};

jest.mock('../../databaseConnections/FireBaseConnection', () => ({
  firebaseAuth: mockFirebaseAuth
}));

jest.mock('../../controllers/authController', () => ({
  sendIdTokenToBackendSignUp: jest.fn(),
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
const renderSignInPage = () => {
  return render(
    <Provider store={mockStore}>
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    </Provider>
  );
};

describe('SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders sign in page with all required elements', () => {
    renderSignInPage();
    
    // Check for main title
    expect(screen.getByTestId('signinText')).toHaveTextContent('Sign In');
    expect(screen.getByTestId('emailLabel')).toHaveTextContent('Email');
    expect(screen.getByTestId('passwordLabel')).toHaveTextContent('Password');
    
    // Check for form fields
    expect(screen.getByTestId('emailInput')).toBeInTheDocument();
    expect(screen.getByTestId('passwordInput')).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByTestId('emailSigninButton')).toBeInTheDocument();
    expect(screen.getByTestId('googleSigninButton')).toBeInTheDocument();
    expect(screen.getByTestId('facebookSigninButton')).toBeInTheDocument();

    // Check for login link
    expect(screen.getByTestId('loginLink')).toBeInTheDocument();
  });


  test('handles form input changes correctly', () => {
    renderSignInPage();
    
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

  // @Todo Need to implement the actual working of this test
  test('handles email sign in button click', async () => {
    renderSignInPage();
    
    const emailButton = screen.getByTestId('emailSigninButton');
    fireEvent.click(emailButton);
    
    await waitFor(() => {
      expect(mockFirebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
    });
  });

  test('handles login link navigation', () => {
    renderSignInPage();
    
    const loginLink = screen.getByTestId('loginLink');
    fireEvent.click(loginLink);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
}); 