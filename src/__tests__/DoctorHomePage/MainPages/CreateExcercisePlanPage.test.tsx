import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import CreateExcercisePlanPage from '../../../pages/DoctorHomePage/MainPages/CreateExcercisePlanPage';
import { useCurrentMainScreenContext, DoctorHomeMainScreen } from '../../../pages/DoctorHomePage/DoctorHomePage';
import { useToast } from '../../../stores/ToastContext';
import { saveExcercisePlan } from '../../../controllers/ExcerciseController';
import { iExcerciseDataDto } from '../../../models/ExcerciseInterface';
import { iPatientDto } from '../../../dtos/PatientDto';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock('../../../pages/DoctorHomePage/DoctorHomePage', () => ({
  ...jest.requireActual('../../../pages/DoctorHomePage/DoctorHomePage'),
  useCurrentMainScreenContext: jest.fn(),
}));
jest.mock('../../../stores/ToastContext');
jest.mock('../../../controllers/ExcerciseController');

// Mock NumberComponent as it has its own state logic we don't need to test here
jest.mock('../../../components/NumberComonent', () => ({
    __esModule: true, // This property makes it work correctly with ES modules
    default: jest.fn(({ initialValue, handleInputChange, index, property_name }) => (
      <input
        type="number"
        data-testid={`number-input-${property_name}-${index}`}
        value={initialValue}
        onChange={(e) => handleInputChange(e, index, property_name)}
      />
    )),
}));


// --- Mock Data ---
const mockNavigate = jest.fn();
const mockShowToast = jest.fn();
const mockSetCurrentMainScreen = jest.fn();
const mockSetExcerciseBuilderPlannerList = jest.fn();
const mockSetBreadCrumbItems = jest.fn();

const mockPatient: iPatientDto = {
  p_id: 'patient123',
  name: 'Test Patient',
  age: 45,
  country_code: '+1',
  phone_number: 1234567890,
  email: 'test@patient.com',
  address: '123 Test St',
  chiefComplaint: 'Back Pain',
  description: 'Chronic back pain for 5 years.',
  patient_history: [],
};


const mockExercise1: iExcerciseDataDto = {
  e_id: 'ex1',
  excercise_name: 'Squats',
  excercise_description: 'Leg exercise',
  excercise_sets: 3,
  excercise_reps: 10,
  excercise_video_url: 'http://example.com/squats.mp4',
  excercise_duration: '',
  excercise_reps_description: '10 times',
  excercise_sets_description: '3 rounds',
  excercise_muscles_involved: "Quads, Glutes",
  excercise_related_conditions: "Knee rehab",
  excercise_type: 'Strength',
  excercise_tags: 'legs, strength',
  excercise_level: 'Beginner',
  excercise_equipment: 'None',
  excercise_target: 'Legs',
  excercise_benefits: 'Strength',
  excercise_precautions: 'Knee pain',
  excercise_variations: 'Goblet Squat',
  excercise_mistakes: 'Rounding back',
  excercise_tips: 'Keep chest up',
  excercise_created_by: 'doc1',
  excercise_created_on: new Date(),
  modified_created_on: new Date(),
  excercise_image_url: 'http://example.com/squat.jpg',
  excercise_category: 'Strength'
};

const mockExercise2: iExcerciseDataDto = {
  e_id: 'ex2',
  excercise_name: 'Push Ups',
  excercise_description: 'Chest exercise',
  excercise_sets: 4,
  excercise_reps: 15,
  excercise_video_url: 'http://example.com/pushups.mp4',
  excercise_duration: '',
  excercise_reps_description: '15 times',
  excercise_sets_description: '4 rounds',
  excercise_muscles_involved: "Chest, Triceps, Shoulders",
  excercise_related_conditions: "Shoulder rehab",
  excercise_type: 'Strength',
  excercise_tags: 'upper body, strength',
  excercise_level: 'Intermediate',
  excercise_equipment: 'None',
  excercise_target: 'Chest',
  excercise_benefits: 'Strength',
  excercise_precautions: 'Wrist pain',
  excercise_variations: 'Incline Pushup',
  excercise_mistakes: 'Flaring elbows',
  excercise_tips: 'Keep core tight',
  excercise_created_by: 'doc1',
  excercise_created_on: new Date(),
  modified_created_on: new Date(),
  excercise_image_url: 'http://example.com/pushup.jpg',
  excercise_category: 'Strength'
};

const mockPlannerList: iExcerciseDataDto[] = [mockExercise1, mockExercise2];

const mockContextValue = {
  currentPatientDetails: mockPatient,
  excerciseBuilderPlannerList: [...mockPlannerList], // Use a copy to avoid modification issues
  setCurrentMainScreen: mockSetCurrentMainScreen,
  setExcerciseBuilderPlannerList: mockSetExcerciseBuilderPlannerList,
  breadCrumbItems: [ { label: 'Patient Details', onClick: jest.fn() }, { label: 'Exercise Builder', onClick: jest.fn() } ],
  setBreadCrumbItems: mockSetBreadCrumbItems,
};

// Helper function to render the component within necessary providers
const renderComponent = (context = mockContextValue) => {
  (useCurrentMainScreenContext as jest.Mock).mockReturnValue(context);
  (useToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  (useParams as jest.Mock).mockReturnValue({ pid: mockPatient.p_id });

  return render(
    <MemoryRouter initialEntries={[`/doctorhome/main/patientDetails/${mockPatient.p_id}/buildPlan/createPlan`]}>
      <Routes>
        <Route path="/doctorhome/main/patientDetails/:pid/buildPlan/createPlan" element={<CreateExcercisePlanPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CreateExcercisePlanPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Reset context planner list for tests that modify it
     mockContextValue.excerciseBuilderPlannerList = [...mockPlannerList];
  });

  // Test 1: Basic Rendering
  it('should render all main components correctly', () => {
    renderComponent();

    // Check for date pickers
    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('End Date')).toBeInTheDocument();
    const dateInputs = screen.getAllByRole('textbox', { hidden: true }); // Date inputs might be rendered differently
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);

    // Check for weekday selector
    expect(screen.getByText('Select Days')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox', { hidden: true })).toHaveLength(7); // 7 weekdays

    // Check if exercise cards are rendered
    expect(screen.getByText(mockExercise1.excercise_name)).toBeInTheDocument();
    expect(screen.getByText(mockExercise2.excercise_name)).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(mockPlannerList.length);

    // Check for input fields within the first exercise card
    expect(screen.getByDisplayValue(mockExercise1.excercise_name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockExercise1.excercise_description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockExercise1.excercise_sets_description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockExercise1.excercise_reps_description)).toBeInTheDocument();
    // Check mocked number inputs
    expect(screen.getByTestId('number-input-excercise_sets-0')).toHaveValue(mockExercise1.excercise_sets);
    expect(screen.getByTestId('number-input-excercise_reps-0')).toHaveValue(mockExercise1.excercise_reps);


    // Check for the Create Plan button
    expect(screen.getByRole('button', { name: 'Create Plan' })).toBeInTheDocument();
  });

  // Test 2: Date Input Functionality
  it('should allow changing start and end dates', () => {
    renderComponent();
    // Find date inputs using data-testid
    const startDateInput = screen.getByTestId('start-date-input');
    const endDateInput = screen.getByTestId('end-date-input');


    fireEvent.change(startDateInput, { target: { value: '2024-08-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-08-31' } });

    // We can't easily assert the *internal* state of the date refs, 
    // but we know the change event was fired. We'll verify the value during submission.
    expect(startDateInput).toHaveValue('2024-08-01');
    expect(endDateInput).toHaveValue('2024-08-31');

  });

  // Test 3: Weekday Selector Functionality
  it('should allow selecting and deselecting weekdays', () => {
    renderComponent();

    const mondayCheckbox = screen.getByLabelText('Mon') as HTMLInputElement;
    const wednesdayCheckbox = screen.getByLabelText('Wed') as HTMLInputElement;
    const fridayCheckbox = screen.getByLabelText('Fri') as HTMLInputElement;

    // Initial state: unchecked
    expect(mondayCheckbox.checked).toBe(false);
    expect(wednesdayCheckbox.checked).toBe(false);
    expect(fridayCheckbox.checked).toBe(false);

    // Select Monday and Friday
    fireEvent.click(mondayCheckbox);
    fireEvent.click(fridayCheckbox);

    expect(mondayCheckbox.checked).toBe(true);
    expect(wednesdayCheckbox.checked).toBe(false); // Should remain unchecked
    expect(fridayCheckbox.checked).toBe(true);

    // Deselect Monday
    fireEvent.click(mondayCheckbox);
    expect(mondayCheckbox.checked).toBe(false);
    expect(fridayCheckbox.checked).toBe(true); // Should remain checked
  });

  // Test 4: Exercise Input Functionality
  it('should update exercise details when inputs change', () => {
    renderComponent();

    const exercise1NameInput = screen.getByDisplayValue(mockExercise1.excercise_name);
    const exercise1DescInput = screen.getByDisplayValue(mockExercise1.excercise_description);
    const exercise1SetsInput = screen.getByTestId('number-input-excercise_sets-0'); // Mocked input
    const exercise1RepsInput = screen.getByTestId('number-input-excercise_reps-0'); // Mocked input
    const exercise1SetsDescInput = screen.getByDisplayValue(mockExercise1.excercise_sets_description);
    const exercise1RepsDescInput = screen.getByDisplayValue(mockExercise1.excercise_reps_description);

    // Change values
    fireEvent.change(exercise1NameInput, { target: { value: 'Modified Squats' } });
    fireEvent.change(exercise1DescInput, { target: { value: 'Modified leg exercise' } });
    fireEvent.change(exercise1SetsInput, { target: { value: '5' } });
    fireEvent.change(exercise1RepsInput, { target: { value: '12' } });
    fireEvent.change(exercise1SetsDescInput, { target: { value: '5 rounds of joy' } });
    fireEvent.change(exercise1RepsDescInput, { target: { value: '12 times the fun' } });

    // Assert that the mock context update function was called with the new values
    // We check the mock function called by the mocked NumberComponent and the direct inputs
    expect(mockSetExcerciseBuilderPlannerList).toHaveBeenCalled();

    // To verify the exact state update, we check the *last* call to the setter function.
    // The callback function passed to the state setter receives the previous state.
    const lastCallArgs = mockSetExcerciseBuilderPlannerList.mock.lastCall[0];

    // If it was called with a function (standard practice for state updates based on previous state)
    if (typeof lastCallArgs === 'function') {
        // We can execute this function with the initial state to see the result
        const newState = lastCallArgs(mockPlannerList); // Provide the initial list
        expect(newState[0].excercise_name).toBe('Modified Squats');
        expect(newState[0].excercise_description).toBe('Modified leg exercise');
        expect(newState[0].excercise_sets).toBe(5);
        expect(newState[0].excercise_reps).toBe(12);
        expect(newState[0].excercise_sets_description).toBe('5 rounds of joy');
        expect(newState[0].excercise_reps_description).toBe('12 times the fun');
        // Ensure the second exercise remains unchanged in this update
        expect(newState[1]).toEqual(mockExercise2);
    } else {
        // If called directly with the new state array (less common for updates)
        expect(lastCallArgs[0].excercise_name).toBe('Modified Squats');
        expect(lastCallArgs[0].excercise_description).toBe('Modified leg exercise');
        expect(lastCallArgs[0].excercise_sets).toBe(5);
        expect(lastCallArgs[0].excercise_reps).toBe(12);
        expect(lastCallArgs[0].excercise_sets_description).toBe('5 rounds of joy');
        expect(lastCallArgs[0].excercise_reps_description).toBe('12 times the fun');
        expect(lastCallArgs[1]).toEqual(mockExercise2);
    }

  });

  // Test 5: Form Submission - Success Case
  it('should call saveExcercisePlan with correct data on successful submission', async () => {
    // --- Setup Mocks ---
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (saveExcercisePlan as jest.Mock).mockImplementation(({ data, afterAPISuccess }) => {
      // Simulate successful API call
      afterAPISuccess({ message: 'Success!' });
    });

    renderComponent();

    // --- Simulate User Input ---
    // 1. Set dates
    const startDateInput = screen.getByTestId('start-date-input');
    const endDateInput = screen.getByTestId('end-date-input');
    fireEvent.change(startDateInput, { target: { value: '2024-09-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-09-30' } });

    // 2. Select weekdays (Mon, Wed, Fri)
    const mondayCheckbox = screen.getByLabelText('Mon') as HTMLInputElement;
    const wednesdayCheckbox = screen.getByLabelText('Wed') as HTMLInputElement;
    const fridayCheckbox = screen.getByLabelText('Fri') as HTMLInputElement;
    fireEvent.click(mondayCheckbox);
    fireEvent.click(wednesdayCheckbox);
    fireEvent.click(fridayCheckbox);

    // 3. Modify exercise details (e.g., reps for the first exercise)
    const exercise1RepsInput = screen.getByTestId('number-input-excercise_reps-0');
    fireEvent.change(exercise1RepsInput, { target: { value: '15' } });
    // Assume the state update from the previous test works and the context holds the latest exercise data
    // Update our local mock to reflect the change for assertion later
    const expectedExerciseList = JSON.parse(JSON.stringify(mockPlannerList)); // Deep copy
    expectedExerciseList[0].excercise_reps = 15;
    // Adjust date format expectation in the list - use expect.any(Date)
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     const expectedExerciseListForAssertion = expectedExerciseList.map((ex: any) => ({
         ...ex,
         excercise_created_on: expect.any(Date),
         modified_created_on: expect.any(Date),
     }));

    // --- Trigger Submission ---
    const createPlanButton = screen.getByRole('button', { name: 'Create Plan' });
    fireEvent.click(createPlanButton);

    // --- Assertions ---
    await waitFor(() => {
      // Check if saveExcercisePlan was called
      expect(saveExcercisePlan).toHaveBeenCalledTimes(1);
    });

    // Verify the data passed to saveExcercisePlan
    const expectedApiData = {
      excercises: expectedExerciseListForAssertion, // Use the adjusted list for assertion
      startDate: '2024-09-01', // Ensure these match the values set above
      endDate: '2024-09-30',   // Ensure these match the values set above
      selectedDays: '1,3,5', // Mon, Wed, Fri
      patientId: mockPatient.p_id,
    };
    expect((saveExcercisePlan as jest.Mock).mock.calls[0][0].data).toEqual(expectedApiData);

    // Check success side effects
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        'Excercise Plan created successfully', 
        expect.any(Number), // DefaultToastTiming
        expect.any(String) // ToastColors.GREEN
      );
      expect(mockSetExcerciseBuilderPlannerList).toHaveBeenCalledWith([]);
      expect(mockNavigate).toHaveBeenCalledWith(`/doctorhome/main/patientDetails/${mockPatient.p_id}`);
      expect(mockSetCurrentMainScreen).toHaveBeenCalledWith(DoctorHomeMainScreen.PATIENT_DETAILS);
      expect(mockSetBreadCrumbItems).toHaveBeenCalled(); // Check it was called to update breadcrumbs
   });

  });

    // Test 6: Form Submission - Failure Case
    it('should show error toast on failed submission', async () => {
        // --- Setup Mocks ---
        const errorMessage = 'API Error: Failed to save plan';
        (saveExcercisePlan as jest.Mock).mockImplementation(({ afterAPIFail }) => {
        // Simulate failed API call
        afterAPIFail({ message: errorMessage });
        });

        renderComponent();

        // --- Simulate User Input (Optional, just need to enable button) ---
        const startDateInput = screen.getByTestId('start-date-input');
        const endDateInput = screen.getByTestId('end-date-input');
        fireEvent.change(startDateInput, { target: { value: '2024-10-01' } });
        fireEvent.change(endDateInput, { target: { value: '2024-10-31' } });
        const mondayCheckbox = screen.getByLabelText('Mon') as HTMLInputElement;
        fireEvent.click(mondayCheckbox);

        // --- Trigger Submission ---
        const createPlanButton = screen.getByRole('button', { name: 'Create Plan' });
        fireEvent.click(createPlanButton);

        // --- Assertions ---
        await waitFor(() => {
            // Check if saveExcercisePlan was called
            expect(saveExcercisePlan).toHaveBeenCalledTimes(1);
        });

        // Check error side effects
        await waitFor(() => {
            expect(mockShowToast).toHaveBeenCalledWith(
                errorMessage,
                expect.any(Number), // DefaultToastTiming
                expect.any(String) // ToastColors.RED
            );
        });

        // Ensure success actions did NOT happen
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockSetCurrentMainScreen).not.toHaveBeenCalled();
        // Ensure the planner list was not cleared
        expect(mockSetExcerciseBuilderPlannerList).not.toHaveBeenCalledWith([]);
    });

}); 