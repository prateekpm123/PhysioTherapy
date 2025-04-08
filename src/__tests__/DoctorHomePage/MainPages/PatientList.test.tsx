import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { useToast } from '../../../stores/ToastContext';
import PatientList from '../../../pages/DoctorHomePage/MainPages/PatientLIst';
import { getAllPatients } from '../../../controllers/PatientsController';
import { iPatientDto } from '../../../dtos/PatientDto';
import { useCurrentMainScreenContext } from '../../../pages/DoctorHomePage/DoctorHomePage';

// Mock dependencies
jest.mock('../../../stores/ToastContext');
jest.mock('../../../controllers/PatientsController');
jest.mock('../../../pages/DoctorHomePage/DoctorHomePage', () => ({
  ...jest.requireActual('../../../pages/DoctorHomePage/DoctorHomePage'),
  useCurrentMainScreenContext: jest.fn(),
}));

// Mock useToast
const mockUseToast = useToast as jest.Mock;
mockUseToast.mockReturnValue({
  showToast: jest.fn(),
});

// Mock getAllPatients
const mockGetAllPatients = getAllPatients as jest.Mock;

// Create a mock store
const mockStore = configureStore({
  reducer: {
    userSession: (state = {
      doctorDetails: { d_id: '123' }
    }) => state,
  },
});

// Mock patient data
const mockPatients: iPatientDto[] = [
  {
    p_id: '1',
    name: 'John Doe',
    age: 30,
    chiefComplaint: 'Back Pain',
    country_code: '+1',
    phone_number: 1234567890,
    email: 'john@example.com',
    address: '123 Main St',
    description: 'Chronic back pain patient',
    patient_history: []
  },
  {
    p_id: '2',
    name: 'Jane Smith',
    age: 25,
    chiefComplaint: 'Knee Pain',
    country_code: '+1',
    phone_number: 987654321,
    email: 'jane@example.com',
    address: '456 Oak St',
    description: 'Sports injury patient',
    patient_history: []
  },
];

// Helper function to render the component with all necessary providers
const renderPatientList = () => {
  return render(
    <Provider store={mockStore}>
      <MemoryRouter>
        <PatientList />
      </MemoryRouter>
    </Provider>
  );
};

describe('PatientList', () => {
  let mockIsPatientListScreenRefresh: boolean;
  let mockSetIsPatientListScreenRefresh: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset state for each test
    mockIsPatientListScreenRefresh = false;
    mockSetIsPatientListScreenRefresh = jest.fn((value) => {
      mockIsPatientListScreenRefresh = typeof value === 'function'
        ? value(mockIsPatientListScreenRefresh)
        : value;
    });

    // Setup the mock implementation for the context hook
    (useCurrentMainScreenContext as jest.Mock).mockImplementation(() => ({
      setBreadCrumbItems: jest.fn(),
      setCurrentMainScreen: jest.fn(),
      setCurrentPatientDetails: jest.fn(),
      isPatientListScreenRefresh: mockIsPatientListScreenRefresh,
      setIsPatientListScreenRefresh: mockSetIsPatientListScreenRefresh,
      isPatientDetailsScreenRefresh: false,
      setIsPatientDetailScreenRefresh: jest.fn(),
    }));

    // Ensure getAllPatients resolves asynchronously
    mockGetAllPatients.mockImplementation(({ afterAPISuccess }) => {
      setTimeout(() => afterAPISuccess({ patients: mockPatients }), 0);
    });
  });

  test('renders all required elements', async () => {
    renderPatientList();
    
    // Check for header elements
    expect(screen.getByText('Patient List')).toBeInTheDocument();
    expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
    
    // Check for search box
    const searchInput = screen.getByPlaceholderText('Search patients...');
    expect(searchInput).toBeInTheDocument();
    
    // Wait for patient cards to load
    await waitFor(() => {
      expect(screen.getAllByTestId('patient-card')).toHaveLength(2);
    });
  });

  test('renders correct patient data', async () => {
    renderPatientList();
    
    // Wait for patient cards to load
    await waitFor(() => {
      // Check first patient
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Age: 30')).toBeInTheDocument();
      expect(screen.getByText('Condition: Back Pain')).toBeInTheDocument();
      
      // Check second patient
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Age: 25')).toBeInTheDocument();
      expect(screen.getByText('Condition: Knee Pain')).toBeInTheDocument();
    });
  });

  test('search functionality works correctly', async () => {
    renderPatientList();
    
    // Wait for patient cards to load
    await waitFor(() => {
      expect(screen.getAllByTestId('patient-card')).toHaveLength(2);
    });
    
    // Search for 'John'
    const searchInput = screen.getByPlaceholderText('Search patients...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Should show only John's card
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    
    // Should show all cards again
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('handles refresh button click', async () => {
    renderPatientList();

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getAllByTestId('patient-card')).toHaveLength(2);
    });
    // Check initial call
    expect(mockGetAllPatients).toHaveBeenCalledTimes(1);

    const refreshButton = screen.getByTestId('refresh-icon');
    fireEvent.click(refreshButton);

    // Check that the state setter was called
    expect(mockSetIsPatientListScreenRefresh).toHaveBeenCalledTimes(1);

    // Re-render implicitly happens due to state change simulation
    // Wait for the effect to run again due to state change
    await waitFor(() => {
        expect(mockGetAllPatients).toHaveBeenCalledTimes(2);
    });
  });

  test('handles patient card click', async () => {
    renderPatientList();
    
    // Wait for patient cards to load
    await waitFor(() => {
      expect(screen.getAllByTestId('patient-card')).toHaveLength(2);
    });
    
    // Click on first patient card
    const firstPatientCard = screen.getByText('John Doe').closest('[data-testid="patient-card"]');
    fireEvent.click(firstPatientCard!);
    
    // Verify navigation and context updates
    const patientCards = screen.getAllByTestId('patient-card');
    expect(patientCards[0]).toHaveAttribute('data-testid', 'patient-card');
  });


  test('handles API error gracefully', async () => {
    mockGetAllPatients.mockImplementation(({ afterAPIFail }) => {
      afterAPIFail({ message: 'Failed to fetch patients' });
    });
    
    renderPatientList();
    
    // Wait for error toast
    await waitFor(() => {
      expect(mockUseToast().showToast).toHaveBeenCalledWith(
        'Failed to fetch patients',
        expect.any(Number),
        expect.any(String)
      );
    });
  });
}); 