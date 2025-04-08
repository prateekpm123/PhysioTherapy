import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlannerList, PlannerListProps } from '../../../../pages/DoctorHomePage/MainPages/ExcerciseBuilder/PlannerList';
import { useCurrentMainScreenContext } from '../../../../pages/DoctorHomePage/DoctorHomePage';
import { iExcerciseDataDto } from '../../../../models/ExcerciseInterface';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('../../../../pages/DoctorHomePage/DoctorHomePage', () => ({
  ...jest.requireActual('../../../../pages/DoctorHomePage/DoctorHomePage'),
  useCurrentMainScreenContext: jest.fn(),
}));

// Mock PlannerItem to simplify PlannerList tests
jest.mock('../../../../pages/DoctorHomePage/MainPages/ExcerciseBuilder/PlannerItem', () => ({
  PlannerItem: ({ excercise, onDelete }: { excercise: iExcerciseDataDto, onDelete: (ex: iExcerciseDataDto) => void }) => (
    <div data-testid={`planner-item-${excercise.e_id}`}>
      <span>{excercise.excercise_name}</span>
      <button data-testid={`delete-${excercise.e_id}`} onClick={() => onDelete(excercise)}>Delete</button>
    </div>
  ),
}));

const mockNavigate = jest.fn();
const mockSetCurrentMainScreen = jest.fn();
const mockSetBreadCrumbItems = jest.fn();
const mockSetExcerciseBuilderPlannerList = jest.fn();

const mockCurrentPatientDetails = {
  p_id: 'patient123',
  name: 'Test Patient',
  // Add other required fields from iPatientDto if necessary
};

const mockExercise1: iExcerciseDataDto = {
  e_id: 'ex1',
  excercise_name: 'Squats',
  excercise_description: 'Leg exercise',
  excercise_sets: 3,
  excercise_reps: 10,
  excercise_video_url: 'http://example.com/squats.mp4',
  excercise_duration: '',
  excercise_reps_description: '',
  excercise_sets_description: '',
  excercise_category: '',
  excercise_type: '',
  excercise_tags: '',
  excercise_level: '',
  excercise_equipment: '',
  excercise_target: '',
  excercise_benefits: '',
  excercise_precautions: '',
  excercise_variations: '',
  excercise_mistakes: '',
  excercise_tips: '',
  excercise_created_by: '',
  excercise_created_on: new Date(),
  modified_created_on: new Date(),
  excercise_image_url: ''
};
const mockExercise2: iExcerciseDataDto = {
  e_id: 'ex2',
  excercise_name: 'Push Ups',
  excercise_description: 'Chest exercise',
  excercise_sets: 3,
  excercise_reps: 15,
  excercise_video_url: 'http://example.com/pushups.mp4',
  excercise_duration: '',
  excercise_reps_description: '',
  excercise_sets_description: '',
  excercise_category: '',
  excercise_type: '',
  excercise_tags: '',
  excercise_level: '',
  excercise_equipment: '',
  excercise_target: '',
  excercise_benefits: '',
  excercise_precautions: '',
  excercise_variations: '',
  excercise_mistakes: '',
  excercise_tips: '',
  excercise_created_by: '',
  excercise_created_on: new Date(),
  modified_created_on: new Date(),
  excercise_image_url: ''
};

const mockPlannerList: iExcerciseDataDto[] = [mockExercise1, mockExercise2];

const mockContextValue = {
  breadCrumbItems: [],
  setBreadCrumbItems: mockSetBreadCrumbItems,
  currentPatientDetails: mockCurrentPatientDetails,
  excerciseBuilderPlannerList: [] as iExcerciseDataDto[],
  setExcerciseBuilderPlannerList: mockSetExcerciseBuilderPlannerList,
  setCurrentMainScreen: mockSetCurrentMainScreen,
};

const defaultProps: PlannerListProps = {
  isPDFPreviewModelRequired: false,
  setIsPDFPreviewModelRequired: jest.fn(),
  testId: 'planner-list-test',
};

const renderPlannerList = (props: Partial<PlannerListProps> = {}, contextValue = mockContextValue) => {
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  (useCurrentMainScreenContext as jest.Mock).mockReturnValue(contextValue);

  return render(
    <MemoryRouter>
      <PlannerList {...defaultProps} {...props} />
    </MemoryRouter>
  );
};

describe('PlannerList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly when planner list is empty', () => {
    renderPlannerList();

    expect(screen.getByTestId('planner-list-test')).toBeInTheDocument();
    expect(screen.getByText('Patient Plan (0)')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('create-plan-button')).toBeInTheDocument();
  });

  test('renders correctly with exercises in the planner list', () => {
    renderPlannerList({}, { ...mockContextValue, excerciseBuilderPlannerList: mockPlannerList });

    expect(screen.getByText('Patient Plan (2)')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();

    // Check if PlannerItems are rendered
    expect(screen.getByTestId('planner-item-ex1')).toBeInTheDocument();
    expect(screen.getByText('Squats')).toBeInTheDocument();
    expect(screen.getByTestId('planner-item-ex2')).toBeInTheDocument();
    expect(screen.getByText('Push Ups')).toBeInTheDocument();

    expect(screen.getByTestId('create-plan-button')).toBeInTheDocument();
  });

  test('handles delete button click from PlannerItem', () => {
    renderPlannerList({}, { ...mockContextValue, excerciseBuilderPlannerList: [...mockPlannerList] });

    const deleteButton = screen.getByTestId('delete-ex1');
    fireEvent.click(deleteButton);

    expect(mockSetExcerciseBuilderPlannerList).toHaveBeenCalledTimes(1);
    expect(mockSetExcerciseBuilderPlannerList).toHaveBeenCalledWith([mockExercise2]);
    
    // Verify the deleted item is no longer in the document
    waitFor(() => {
      expect(screen.queryByTestId('planner-item-ex1')).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('planner-item-ex2')).toBeInTheDocument();
  });

  test('handles "Create Plan" button click', () => {
    renderPlannerList({}, { ...mockContextValue, excerciseBuilderPlannerList: mockPlannerList });

    const createPlanButton = screen.getByTestId('create-plan-button');
    fireEvent.click(createPlanButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/doctorhome/main/patientDetails/patient123/buildPlan/createPlan');

    expect(mockSetCurrentMainScreen).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentMainScreen).toHaveBeenCalledWith(expect.any(Number));

    expect(mockSetBreadCrumbItems).toHaveBeenCalledTimes(1);
    expect(mockSetBreadCrumbItems).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ label: 'Patient Details' }),
      expect.objectContaining({ label: 'Exercise Builder' }),
      expect.objectContaining({ label: 'Create Exercise Plan' }),
    ]));
  });
}); 