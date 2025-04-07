// import React from 'react';
// import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import { Provider } from 'react-redux';
// import { configureStore } from '@reduxjs/toolkit';
// import { MemoryRouter, Routes, Route } from 'react-router-dom';
// import NewPatientEntry from '../NewPatientEntry';
// import { useToast } from '../../../../stores/ToastContext';
// import { createPatient } from '../../../../controllers/PatientsController';

// // Mock dependencies
// jest.mock('../../../../stores/ToastContext');
// jest.mock('../../../../controllers/PatientsController');

// // Mock createPatient
// // const mockCreatePatient = createPatient as jest.MockedFunction<typeof createPatient>;

// // Mock useToast
// const mockUseToast = useToast as jest.Mock;
// mockUseToast.mockReturnValue({
//   showToast: jest.fn(),
// });

// // Create a slice for testing
// const initialState = {};
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const mockReducer = (state = initialState, action: any) => {
//   switch (action.type) {
//     default:
//       return state;
//   }
// };

// // Helper function to render the component with all necessary providers
// const renderComponent = () => {
//   const mockStore = configureStore({
//     reducer: {
//       test: mockReducer
//     }
//   });

//   const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
//     return (
//       <Provider store={mockStore}>
//         <MemoryRouter initialEntries={['/doctor/new-patient']}>
//           <Routes>
//             <Route path="/doctor/new-patient" element={children} />
//           </Routes>
//         </MemoryRouter>
//       </Provider>
//     );
//   };

//   return render(<NewPatientEntry />, { wrapper: AllTheProviders });
// };

// // Mock the useCurrentMainScreenContext
// jest.mock('../../DoctorHomePage', () => ({
//   useCurrentMainScreenContext: () => ({
//     setIsPatientListScreenRefresh: jest.fn(),
//     isPatientListScreenRefresh: false,
//     setCurrentPatientDetails: jest.fn(),
//   }),
// }));

// describe('NewPatientEntry Component', () => {
//   const mockShowToast = jest.fn();
//   const mockUseSelector = jest.requireMock('react-redux').useSelector;

//   beforeEach(() => {
//     // Reset all mocks before each test
//     jest.clearAllMocks();
//     (useToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     mockUseSelector.mockImplementation((selector: (state: any) => any) => selector({
//       userSession: {
//         doctorDetails: {
//           d_id: 'test-doctor-id',
//         },
//       },
//     }));
//   });

//   // Component Rendering Tests
//   describe('Component Rendering', () => {
//     it('renders all form fields correctly', () => {
//       renderComponent();

//       expect(screen.getByText('New Patient Entry')).toBeInTheDocument();
//       expect(screen.getByLabelText(/Patient Name/i)).toBeInTheDocument();
//       expect(screen.getByLabelText(/Patient Age/i)).toBeInTheDocument();
//       expect(screen.getByLabelText(/Chief Complaint/i)).toBeInTheDocument();
//       expect(screen.getByLabelText(/Additional Description/i)).toBeInTheDocument();
//       expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
//       expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
//       expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
//       expect(screen.getByLabelText(/Upload Documents/i)).toBeInTheDocument();
//       expect(screen.getByText('Submit Patient Data')).toBeInTheDocument();
//     });

//     it('renders country code selector with correct options', () => {
//       renderComponent();

//       const countryCodeSelect = screen.getByRole('combobox', { name: /country code/i });
//       expect(countryCodeSelect).toBeInTheDocument();
//       expect(screen.getByText('+91 (India)')).toBeInTheDocument();
//       expect(screen.getByText('+1 (USA)')).toBeInTheDocument();
//       expect(screen.getByText('+44 (UK)')).toBeInTheDocument();
//     });
//   });

//   // Form Validation Tests
//   describe('Form Validation', () => {
//     it('shows validation error for required fields when submitting empty form', async () => {
//       renderComponent();

//       const submitButton = screen.getByText('Submit Patient Data');
//       await act(async () => {
//         fireEvent.click(submitButton);
//       });

//       await waitFor(() => {
//         expect(screen.getByText(/Patient Name is required/i)).toBeInTheDocument();
//         expect(screen.getByText(/Patient Age is required/i)).toBeInTheDocument();
//         expect(screen.getByText(/Chief Complaint is required/i)).toBeInTheDocument();
//         expect(screen.getByText(/Phone Number is required/i)).toBeInTheDocument();
//         expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
//         expect(screen.getByText(/Address is required/i)).toBeInTheDocument();
//       });
//     });

//     it('validates phone number format', async () => {
//       renderComponent();

//       const phoneInput = screen.getByLabelText(/Phone Number/i);
//       await act(async () => {
//         fireEvent.change(phoneInput, { target: { value: '12345' } });
//       });

//       const submitButton = screen.getByText('Submit Patient Data');
//       await act(async () => {
//         fireEvent.click(submitButton);
//       });

//       await waitFor(() => {
//         expect(screen.getByText(/Please enter a 10-digit phone number/i)).toBeInTheDocument();
//       });
//     });

//     it('validates email format', async () => {
//       renderComponent();

//       const emailInput = screen.getByLabelText(/Email/i);
//       await act(async () => {
//         fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
//       });

//       const submitButton = screen.getByText('Submit Patient Data');
//       await act(async () => {
//         fireEvent.click(submitButton);
//       });

//       await waitFor(() => {
//         expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
//       });
//     });
//   });

//   // Form Submission Tests
//   describe('Form Submission', () => {
//     it('submits form successfully with valid data', async () => {
//       const mockPatientData = {
//         p_id: 'test-patient-id',
//         name: 'Test Patient',
//         age: 30,
//         chiefComplaint: 'Back pain',
//         phone_number: '+911234567890',
//         email: 'test@example.com',
//         address: 'Test Address',
//       };

//       (createPatient as jest.Mock).mockImplementation(({ afterAPISuccess }) => {
//         afterAPISuccess(mockPatientData);
//       });

//       renderComponent();

//       // Fill in the form
//       await act(async () => {
//         fireEvent.change(screen.getByLabelText(/Patient Name/i), { target: { value: 'Test Patient' } });
//         fireEvent.change(screen.getByLabelText(/Patient Age/i), { target: { value: '30' } });
//         fireEvent.change(screen.getByLabelText(/Chief Complaint/i), { target: { value: 'Back pain' } });
//         fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
//         fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
//         fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: 'Test Address' } });
//       });

//       const submitButton = screen.getByText('Submit Patient Data');
//       await act(async () => {
//         fireEvent.click(submitButton);
//       });

//       await waitFor(() => {
//         expect(createPatient).toHaveBeenCalled();
//         expect(mockShowToast).toHaveBeenCalledWith(
//           'Form submitted successfully',
//           expect.any(Number),
//           expect.any(String)
//         );
//       });
//     });

//     it('handles API error during submission', async () => {
//       const mockError = {
//         message: 'Failed to create patient',
//         statusCode: 500,
//         errorCode: 'INTERNAL_ERROR',
//       };

//       (createPatient as jest.Mock).mockImplementation(({ afterAPIFail }) => {
//         afterAPIFail(mockError);
//       });

//       renderComponent();

//       // Fill in the form
//       await act(async () => {
//         fireEvent.change(screen.getByLabelText(/Patient Name/i), { target: { value: 'Test Patient' } });
//         fireEvent.change(screen.getByLabelText(/Patient Age/i), { target: { value: '30' } });
//         fireEvent.change(screen.getByLabelText(/Chief Complaint/i), { target: { value: 'Back pain' } });
//         fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
//         fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
//         fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: 'Test Address' } });
//       });

//       const submitButton = screen.getByText('Submit Patient Data');
//       await act(async () => {
//         fireEvent.click(submitButton);
//       });

//       await waitFor(() => {
//         expect(mockShowToast).toHaveBeenCalledWith(
//           'Failed to create patient',
//           expect.any(Number),
//           expect.any(String)
//         );
//       });
//     });
//   });

//   // State Management Tests
//   describe('State Management', () => {
//     it('updates form data state correctly', async () => {
//       renderComponent();

//       const nameInput = screen.getByLabelText(/Patient Name/i);
//       await act(async () => {
//         fireEvent.change(nameInput, { target: { value: 'Test Patient' } });
//       });
//       expect(nameInput).toHaveValue('Test Patient');

//       const ageInput = screen.getByLabelText(/Patient Age/i);
//       await act(async () => {
//         fireEvent.change(ageInput, { target: { value: '30' } });
//       });
//       expect(ageInput).toHaveValue('30');
//     });

//     it('updates country code state correctly', async () => {
//       renderComponent();

//       const countryCodeSelect = screen.getByRole('combobox', { name: /country code/i });
//       await act(async () => {
//         fireEvent.change(countryCodeSelect, { target: { value: '+1' } });
//       });
//       expect(countryCodeSelect).toHaveValue('+1');
//     });
//   });

//   // File Upload Tests
//   describe('File Upload', () => {
//     it('handles file upload correctly', async () => {
//       renderComponent();

//       const fileInput = screen.getByLabelText(/Upload Documents/i);
//       const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
//       await act(async () => {
//         fireEvent.change(fileInput, { target: { files: [file] } });
//       });

//       expect(fileInput).toHaveAttribute('accept', '.pdf, image/*');
//     });

//     it('handles multiple file uploads', async () => {
//       renderComponent();

//       const fileInput = screen.getByLabelText(/Upload Documents/i);
//       const files = [
//         new File(['test1'], 'test1.pdf', { type: 'application/pdf' }),
//         new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
//       ];
//       await act(async () => {
//         fireEvent.change(fileInput, { target: { files } });
//       });

//       expect(fileInput).toHaveAttribute('multiple');
//     });
//   });
// }); 