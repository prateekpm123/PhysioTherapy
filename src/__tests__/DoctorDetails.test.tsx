import React from 'react'; // Add React import for JSX
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import DoctorDetails from '@/pages/DoctorDetails'; // Use alias import path
import { DoctorDetails as iDoctorDetails } from '@/models/iDoctorDetails'; // Assuming model path is correct with alias
import { FailedResponseDto } from '@/dtos/FailedResponseDto'; // Assuming DTO path is correct with alias
import { StatusAndErrorType } from '@/models/StatusAndErrorType.enum'; // Assuming enum path is correct with alias
import { ToastColors } from '@/components/Toast'; // Use alias import path
import { UserType } from '@/models/UserType'; // Use alias import path

// --- Mock Dependencies ---

// Mock react-router-dom's useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Use actual implementations for other parts
  useNavigate: () => mockedNavigate,
}));

// Mock useToast hook from ToastContext
const mockedShowToast = jest.fn();
jest.mock('@/stores/ToastContext', () => ({ // Using @ alias
  useToast: () => ({
    showToast: mockedShowToast,
  }),
  DefaultToastTiming: 3000, // Provide a default value if needed
}));

// Mock createDoctor controller function
const mockedCreateDoctor = jest.fn();
jest.mock('@/controllers/DoctorController', () => ({ // Using @ alias
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  createDoctor: (args: { afterAPISuccess: Function, afterAPIFail: Function }) => mockedCreateDoctor(args),
}));

// --- Mock Redux Store ---
const mockUser = {
  uid: 'test-user-123',
  name: 'Dr. Test User',
  email: 'test.user@example.com',
  pictureUrl: '',
  type: UserType.DOCTOR, // Assuming a UserType enum/value exists
  // Add other necessary fields from the User interface in IUser.ts
  googleIss: '',
  googleAud: '',
  googleAuthTime: 0,
  googleUserId: '',
  googleSub: '',
  googleIat: 0,
  googleExp: 0,
  googleEmailVerified: true,
  googleFireBaseIdentitiesGoogleDotCom: [],
  googleIdentitiesEmail: [],
  googleSignInProvider: '',
};

const mockDoctorDetailsInitial: iDoctorDetails = {
  name: '', age: 0, country_code: '', phone_number: 0n, email: '',
  address: '', pincode: 0, country: '', city: '', state: '', role: '',
  user_id: '', doctor_history: '', doctor_specialization: '',
  doctor_qualification: '', doctor_experience: '', doctor_awards: '',
  doctor_certification: '', d_id: '',
};

// Create a mock slice manually if needed, or reuse the actual one if imports work
const mockUserSessionSlice = createSlice({
  name: 'userSession',
  initialState: {
    user: mockUser,
    doctorDetails: mockDoctorDetailsInitial,
    token: 'mock-token',
    isSignedIn: true,
  },
  reducers: {
    // Mock the setDoctorDetails reducer if needed for assertion, otherwise leave empty
    setDoctorDetails: (state, action) => {
        state.doctorDetails = action.payload;
    },
    // Add other reducers used by the component if any
  },
});

// Helper function to create a store with preloaded state
const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      userSession: mockUserSessionSlice.reducer,
    },
    preloadedState,
    // Required to handle non-serializable types like BigInt in doctorDetails
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
           ignoredActions: ['userSession/setDoctorDetails'], // Ignore for the action that might contain BigInt
           ignoredPaths: ['userSession.doctorDetails.phone_number'], // Ignore the specific path
        },
      }),
  });
};

// --- Mock Data ---
const mockSuccessDoctorData: iDoctorDetails = {
  d_id: 'doc-456',
  name: 'Dr. Test User',
  age: 35,
  country_code: '+91',
  phone_number: 9876543210n, // Use BigInt literal
  email: 'test.user@example.com',
  address: '123 Test St',
  city: 'Testville',
  pincode: 123456,
  state: 'Test State',
  country: 'Testland',
  doctor_history: 'Started practice in 2010.',
  doctor_specialization: 'Orthopedics',
  doctor_qualification: 'MBBS, MS Ortho',
  doctor_experience: '14 years',
  doctor_awards: 'Best Doctor 2020',
  doctor_certification: 'Board Certified',
  user_id: 'test-user-123',
  role: 'doctor', // Assuming role is part of the model
};

const mockFailResponseDoctorNotCreated: FailedResponseDto = {
  message: 'Failed to create doctor record.',
  statusCode: 500,
  errorCode: StatusAndErrorType.DoctorNotCreated,
  errors: {},
};

const mockFailResponseUnauthorized: FailedResponseDto = {
  message: 'User session expired.',
  statusCode: 401,
  errorCode: StatusAndErrorType.Unauthorized,
  errors: {},
};

// --- Test Suite ---
describe('DoctorDetails Component', () => {
  let store: ReturnType<typeof createMockStore>;
  const mockOnSave = jest.fn();


  // Helper function to render the component with providers
  const renderComponent = (props = {}) => {
      store = createMockStore({ userSession: { user: mockUser, doctorDetails: mockDoctorDetailsInitial, token: 'mock-token', isSignedIn: true } });
      // Mock dispatch spy
      jest.spyOn(store, 'dispatch');
      return render(
          <Provider store={store}>
              <MemoryRouter initialEntries={['/doctor-details']}>
                 <Routes>
                    <Route path="/doctor-details" element={<DoctorDetails {...props} />} />
                 </Routes>
              </MemoryRouter>
          </Provider>
      );
  };


  beforeEach(() => {
    // Clear mocks before each test
    mockedNavigate.mockClear();
    mockedShowToast.mockClear();
    mockedCreateDoctor.mockClear();
    mockOnSave.mockClear();
    // Reset mock implementation if needed
    mockedCreateDoctor.mockImplementation(({ afterAPISuccess }) => {
      // Default mock behavior (e.g., success)
      afterAPISuccess({ Doctor: mockSuccessDoctorData });
    });
  });

  // Test 1: Initial Rendering and Prefilled Data
  test('renders the form and pre-fills name and email from Redux store', () => {
    renderComponent();

    // Check heading
    expect(screen.getByRole('heading', { name: /Doctor Details/i })).toBeInTheDocument();

    // Check pre-filled fields (using getByDisplayValue for inputs)
    expect(screen.getByLabelText(/Name/i)).toHaveValue(mockUser.name);
    expect(screen.getByLabelText(/^Email$/i)).toHaveValue(mockUser.email); // Use precise regex for Email label

    // Check other required fields exist (using getByLabelText)
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    // Combine country code and phone number label check if necessary
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Doctor Specialization/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Doctor Qualification/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument(); // Corrected label


    // Check optional fields exist
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Doctor History/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Doctor Experience/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Doctor Awards/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Doctor Certification/i)).toBeInTheDocument();

    // Check submit button
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  // Test 2: Form Input Changes
  test('updates form state when user types in fields', () => {
    renderComponent();

    // Change Age
    const ageInput = screen.getByLabelText(/Age/i);
    fireEvent.change(ageInput, { target: { value: '42' } });
    expect(ageInput).toHaveValue(42);

    // Change Specialization
    const specializationInput = screen.getByLabelText(/Doctor Specialization/i);
    fireEvent.change(specializationInput, { target: { value: 'Cardiology' } });
    expect(specializationInput).toHaveValue('Cardiology');

     // Change Country Code
    const countryCodeSelect = screen.getByDisplayValue('+91 (India)'); // Default value
    fireEvent.change(countryCodeSelect, { target: { value: '+1' } });
    expect(countryCodeSelect).toHaveValue('+1');

    // Change Phone Number
    const phoneInput = screen.getByPlaceholderText(/Enter phone number/i);
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    expect(phoneInput).toHaveValue('1234567890'); // Note: input type="tel" value is string

    // Change Address (textarea)
    const addressTextarea = screen.getByLabelText(/Address/i);
    fireEvent.change(addressTextarea, { target: { value: '456 Clinic Ave' } });
    expect(addressTextarea).toHaveValue('456 Clinic Ave');
  });

  // Function to fill all required fields
  const fillRequiredFields = () => {
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: mockSuccessDoctorData.age.toString() } });
      fireEvent.change(screen.getByDisplayValue('+91 (India)'), { target: { value: mockSuccessDoctorData.country_code } }); // Select country code
      fireEvent.change(screen.getByPlaceholderText(/Enter phone number/i), { target: { value: mockSuccessDoctorData.phone_number.toString() } });
      fireEvent.change(screen.getByLabelText(/Doctor Specialization/i), { target: { value: mockSuccessDoctorData.doctor_specialization } });
      fireEvent.change(screen.getByLabelText(/Doctor Qualification/i), { target: { value: mockSuccessDoctorData.doctor_qualification } });
      fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: mockSuccessDoctorData.country } });
      fireEvent.change(screen.getByLabelText(/Pincode/i), { target: { value: mockSuccessDoctorData.pincode.toString() } });
      fireEvent.change(screen.getByLabelText(/City/i), { target: { value: mockSuccessDoctorData.city } });
      fireEvent.change(screen.getByLabelText(/State/i), { target: { value: mockSuccessDoctorData.state } }); // Corrected label
      // Fill optional fields just in case they become required later or for robustness
      fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: mockSuccessDoctorData.address }});
      fireEvent.change(screen.getByLabelText(/Doctor History/i), { target: { value: mockSuccessDoctorData.doctor_history }});
      fireEvent.change(screen.getByLabelText(/Doctor Experience/i), { target: { value: mockSuccessDoctorData.doctor_experience }});
      fireEvent.change(screen.getByLabelText(/Doctor Awards/i), { target: { value: mockSuccessDoctorData.doctor_awards }});
      fireEvent.change(screen.getByLabelText(/Doctor Certification/i), { target: { value: mockSuccessDoctorData.doctor_certification }});

  };

  // Test 3: Form Submission - Success Scenario
  test('submits form successfully, calls API, shows toast, dispatches action, and navigates', async () => {
    mockedCreateDoctor.mockImplementation(({ afterAPISuccess }) => {
      afterAPISuccess({ Doctor: mockSuccessDoctorData });
    });
    renderComponent();
    fillRequiredFields();

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton); // Use click for button, submit for form element if needed

    // Wait for async operations (API call simulation, state updates)
    await waitFor(() => {
      // Check if createDoctor was called correctly
      expect(mockedCreateDoctor).toHaveBeenCalledTimes(1);
      // Prepare expected form data by explicitly selecting fields and converting types
      const expectedFormData = {
        name: mockSuccessDoctorData.name,
        age: mockSuccessDoctorData.age.toString(), // Convert to string
        country_code: mockSuccessDoctorData.country_code,
        phone_number: mockSuccessDoctorData.phone_number.toString(), // Convert to string
        email: mockSuccessDoctorData.email,
        address: mockSuccessDoctorData.address,
        pincode: mockSuccessDoctorData.pincode.toString(), // Convert to string
        country: mockSuccessDoctorData.country,
        city: mockSuccessDoctorData.city,
        state: mockSuccessDoctorData.state,
        // role: is excluded
        user_id: mockSuccessDoctorData.user_id,
        doctor_history: mockSuccessDoctorData.doctor_history,
        doctor_specialization: mockSuccessDoctorData.doctor_specialization,
        doctor_qualification: mockSuccessDoctorData.doctor_qualification,
        doctor_experience: mockSuccessDoctorData.doctor_experience,
        doctor_awards: mockSuccessDoctorData.doctor_awards,
        doctor_certification: mockSuccessDoctorData.doctor_certification,
        // d_id: is excluded
      };

      expect(mockedCreateDoctor).toHaveBeenCalledWith(expect.objectContaining({
          data: expect.objectContaining(expectedFormData)
      }));


      // Check if success toast was shown
      expect(mockedShowToast).toHaveBeenCalledTimes(1);
      expect(mockedShowToast).toHaveBeenCalledWith(
        'Doctor details submitted successfully',
        expect.any(Number), // Allow any duration (DefaultToastTiming)
        ToastColors.GREEN
      );

       // Check if Redux action was dispatched
      expect(store.dispatch).toHaveBeenCalledWith(
          mockUserSessionSlice.actions.setDoctorDetails(mockSuccessDoctorData)
      );

      // Check if navigation occurred
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toHaveBeenCalledWith('/doctorhome/main/newPatient');
    });
  });

 // Test 4: Form Submission - Success Scenario with onSave Prop
  test('calls onSave prop instead of navigating when provided on successful submission', async () => {
    mockedCreateDoctor.mockImplementation(({ afterAPISuccess }) => {
        afterAPISuccess({ Doctor: mockSuccessDoctorData });
    });
    renderComponent({ onSave: mockOnSave });
    fillRequiredFields();

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
        // Check API call
        expect(mockedCreateDoctor).toHaveBeenCalledTimes(1);
        // Check toast
        expect(mockedShowToast).toHaveBeenCalledWith(
            'Doctor details submitted successfully', expect.any(Number), ToastColors.GREEN
        );
         // Check Redux dispatch
        expect(store.dispatch).toHaveBeenCalledWith(
            mockUserSessionSlice.actions.setDoctorDetails(mockSuccessDoctorData)
        );
        // Check onSave was called
        expect(mockOnSave).toHaveBeenCalledTimes(1);
        // Check navigation was NOT called
        expect(mockedNavigate).not.toHaveBeenCalled();
    });
  });


  // Test 5: Form Submission - Failure Scenario (DoctorNotCreated)
  test('shows specific error toast when API fails with DoctorNotCreated', async () => {
    // Mock API to fail
    mockedCreateDoctor.mockImplementation(({ afterAPIFail }) => {
      afterAPIFail(mockFailResponseDoctorNotCreated);
    });
    renderComponent();
    fillRequiredFields();

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      // Check API call happened
      expect(mockedCreateDoctor).toHaveBeenCalledTimes(1);

      // Check if specific error toast was shown
      expect(mockedShowToast).toHaveBeenCalledTimes(1);
      expect(mockedShowToast).toHaveBeenCalledWith(
        'Doctor details were not saved',
        expect.any(Number),
        ToastColors.RED
      );

      // Check navigation did NOT occur
      expect(mockedNavigate).not.toHaveBeenCalled();
        // Check Redux action was NOT dispatched
      expect(store.dispatch).not.toHaveBeenCalledWith(
          mockUserSessionSlice.actions.setDoctorDetails(expect.anything())
      );
    });
  });

  // Test 6: Form Submission - Failure Scenario (Unauthorized)
  test('shows specific error toast when API fails with Unauthorized', async () => {
    // Mock API to fail
    mockedCreateDoctor.mockImplementation(({ afterAPIFail }) => {
      afterAPIFail(mockFailResponseUnauthorized);
    });
    renderComponent();
    fillRequiredFields();

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      // Check API call happened
      expect(mockedCreateDoctor).toHaveBeenCalledTimes(1);

      // Check if specific error toast was shown
      expect(mockedShowToast).toHaveBeenCalledTimes(1);
      expect(mockedShowToast).toHaveBeenCalledWith(
        'Your session has expired, log in again',
        10000, // Specific duration used in component
        ToastColors.RED
      );

      // Check navigation did NOT occur
      expect(mockedNavigate).not.toHaveBeenCalled();
        // Check Redux action was NOT dispatched
       expect(store.dispatch).not.toHaveBeenCalledWith(
           mockUserSessionSlice.actions.setDoctorDetails(expect.anything())
       );
    });
  });

  // Test 7: Form Submission - Required Field Validation (HTML5)
  test('does not call API if a required field is empty', async () => {
    renderComponent();
    // Fill some fields but leave a required one (e.g., Age) empty
    fireEvent.change(screen.getByLabelText(/Doctor Specialization/i), { target: { value: 'Test Spec' } });
    fireEvent.change(screen.getByLabelText(/Doctor Qualification/i), { target: { value: 'Test Qual' } });
    // Leave Age empty

    // Attempt to submit
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Use waitFor to ensure no async state changes trigger the mock unexpectedly
    await waitFor(() => {
        // Short delay to allow potential (incorrect) async calls to initiate
        return new Promise(resolve => setTimeout(resolve, 50));
    });

    // Assert that the API mock was NOT called because HTML validation should prevent it
    expect(mockedCreateDoctor).not.toHaveBeenCalled();
    expect(mockedShowToast).not.toHaveBeenCalled(); // No toast should appear either
  });

}); 