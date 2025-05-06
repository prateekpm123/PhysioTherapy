import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ExerciseBuilder } from '../../../../pages/DoctorHomePage/MainPages/ExcerciseBuilder';
// import { useToast } from '../../../../stores/ToastContext';
import { useCurrentMainScreenContext } from '../../../../pages/DoctorHomePage/DoctorHomePage';
// import { getAllExcercises } from '../../../../controllers/ExcerciseController';
import { useToast } from '../../../../stores/ToastContext';
import { getAllExcercises } from '../../../../controllers/ExcerciseController';

// Mock the required hooks and controllers
jest.mock('../../../../stores/ToastContext');
jest.mock('../../../../pages/DoctorHomePage/DoctorHomePage');
jest.mock('../../../../controllers/ExcerciseController');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock data
const mockExercises = [
  {
    e_id: '1',
    excercise_name: 'Test Exercise 1',
    excercise_type: 'Type 1',
    excercise_image_url: 'test1.jpg',
  },
  {
    e_id: '2',
    excercise_name: 'Test Exercise 2',
    excercise_type: 'Type 2',
    excercise_image_url: 'test2.jpg',
  },
  {
    e_id: '3',
    excercise_name: 'Test Exercise 3',
    excercise_type: 'Type 3',
    excercise_image_url: 'test3.jpg',
  },
];

const mockToast = {
  showToast: jest.fn(),
};

const mockContext = {
  isExcerciseBuilderLoading: false,
  setIsExcerciseBuilderLoading: jest.fn(),
  excerciseBuilderPlannerList: [],
  setExcerciseBuilderPlannerList: jest.fn(),
};

describe('ExerciseBuilder Component', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks(); 
    (useToast as jest.Mock).mockReturnValue(mockToast);
    (useCurrentMainScreenContext as jest.Mock).mockReturnValue(mockContext);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (getAllExcercises as jest.Mock).mockImplementation(({ afterAPISuccess }) => {
      afterAPISuccess({
        data: {
          excercises: [mockExercises[0], mockExercises[1]],
          pagination: {
            total: 2,
          },
        },
      });
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/doctorhome/main/patientDetails/123/buildPlan']}>
        <Routes>
          <Route
            path="/doctorhome/main/patientDetails/:pid/buildPlan"
            element={
              <ExerciseBuilder
                isExcerciseBuilderRefreshInValid={false}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  // Test Case 1: Verify main components
  it('renders all main components correctly', async () => {
    renderComponent();

    // Check if ExerciseTile components are rendered
    await waitFor(() => {
      expect(screen.getAllByTestId('exercise-tile')).toHaveLength(2);
    });

    // Check if search bar is rendered
    expect(screen.getByTestId('search-input')).toBeInTheDocument();

    // Check if add exercise button is rendered
    expect(screen.getByTestId('add-exercise-button')).toBeInTheDocument();

    // Check if planner list is rendered
    expect(screen.getByTestId('planner-list')).toBeInTheDocument();
  });

  // Test Case 2: Verify ExerciseTile components
  it('renders all ExerciseTile components correctly', async () => {
    renderComponent();

    await waitFor(() => {
      // Check if images are rendered
      const images = screen.getAllByTestId('exercise-image');
      expect(images).toHaveLength(2);

      // Check if expand buttons are rendered
      const expandButtons = screen.getAllByTestId('expand-button');
      expect(expandButtons).toHaveLength(2);

      // Check if exercise names are rendered
      expect(screen.getByText('Test Exercise 1')).toBeInTheDocument();
      expect(screen.getByText('Test Exercise 2')).toBeInTheDocument();
    });
  });

  // Test Case 3: Verify Delete functionality
  it('shows delete confirmation modal when delete button is clicked', async () => {
    renderComponent();

    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
    });

    // Check if navigation was called with correct path and state
    expect(mockNavigate).toHaveBeenCalledWith('/doctorhome/main/patientDetails/123/buildPlan/deleteExcercise', {
      state: {
        actionButtonClickParams: mockExercises[0],
        title: 'Are you sure you want to delete ?',
        message: 'This excercise will be deleted permanently. Are you sure you want to go ahead?',
        actionButtonText: 'Delete',
        closeButtonText: 'Cancel'
      }
    });
  });

  // Test Case 4: Verify Add functionality
  it('adds exercise to PlannerList when Add button is clicked', async () => {
    const setPlannerList = jest.fn();
    (useCurrentMainScreenContext as jest.Mock).mockReturnValue({
      ...mockContext,
      setExcerciseBuilderPlannerList: setPlannerList,
    });

    renderComponent();

    await waitFor(() => {
      const addButtons = screen.getAllByText('Add');
      fireEvent.click(addButtons[0]);
    });

    // The function is called with a function that takes the current list and returns a new list
    expect(setPlannerList).toHaveBeenCalledWith(expect.any(Function));
    
    // Verify the function adds the correct exercise
    const updateFunction = setPlannerList.mock.calls[0][0];
    expect(updateFunction([])).toEqual([mockExercises[0]]);
  });

  // Test Case 5: Verify Edit functionality
  it('navigates to edit route when Edit button is clicked', async () => {
    renderComponent();

    await waitFor(() => {
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
    });

    // Check if navigation was called with correct path and state
    expect(mockNavigate).toHaveBeenCalledWith(
      '/doctorhome/main/patientDetails/123/buildPlan/editExcercise/1',
      { state: { excercise: mockExercises[0] } }
    );
  });

  // Test Case 6: Verify Add Exercise button functionality
  it('navigates to add exercise route when Add button is clicked', async () => {
    renderComponent();

    const addButton = screen.getByTestId('add-exercise-button');
    fireEvent.click(addButton);

    // Check if navigation was called with correct path
    expect(mockNavigate).toHaveBeenCalledWith('/doctorhome/main/patientDetails/123/buildPlan/addExcercise');
  });

  // Test Case 7: Verify Search functionality
  it('filters exercises based on search term', async () => {
    // Mock the search implementation
    (getAllExcercises as jest.Mock).mockImplementation(({ afterAPISuccess }) => {
      afterAPISuccess({
        data: {
          excercises: [mockExercises[0]], // Only return the first exercise
          pagination: {
            total: 1,
          },
        },
      });
    });

    renderComponent();

    const searchInput = screen.getByPlaceholderText('Search exercises...');
    fireEvent.change(searchInput, { target: { value: 'Test Exercise 1' } });

    await waitFor(() => {
      expect(screen.getAllByTestId('exercise-tile')).toHaveLength(1);
      expect(screen.getByText('Test Exercise 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Exercise 2')).not.toBeInTheDocument();
    });
  });

  // Test Case 8: Verify Lazy Loading
//   it('triggers lazy loading when scrolling to bottom', async () => {
//     let callCount = 0;
//     (getAllExcercises as jest.Mock).mockImplementation(({ afterAPISuccess }) => {
//       callCount++;
//       if (callCount === 1) {
//         afterAPISuccess({
//           data: {
//             excercises: [mockExercises[0], mockExercises[1]],
//             pagination: {
//               total: 3,
//               page: 1,
//               limit: 20
//             },
//           },
//         });
//       } else if (callCount === 2) {
//         afterAPISuccess({
//           data: {
//             excercises: [mockExercises[2]],
//             pagination: {
//               total: 3,
//               page: 2,
//               limit: 20
//             },
//           },
//         });
//       }
//     });

//     renderComponent();

//     // Wait for initial load to complete and verify initial exercises
//     await waitFor(() => {
//       const exerciseTiles = screen.getAllByTestId('exercise-tile');
//       expect(exerciseTiles).toHaveLength(2);
//       expect(exerciseTiles[0]).toHaveTextContent('Test Exercise 1');
//       expect(exerciseTiles[1]).toHaveTextContent('Test Exercise 2');
//     });

//     // Trigger scroll to bottom
//     fireEvent.scroll(window, { target: { scrollY: 1000 } });

//     // Wait for the third exercise to be loaded
//     await waitFor(() => {
//       const exerciseTiles = screen.getAllByTestId('exercise-tile');
//       expect(exerciseTiles).toHaveLength(3);
//       expect(exerciseTiles[2]).toHaveTextContent('Test Exercise 3');
//     });
//   });
}); 