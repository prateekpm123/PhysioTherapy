import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlannerItem } from '../../../../pages/DoctorHomePage/MainPages/ExcerciseBuilder/PlannerItem';
import { iExcerciseData } from '../../../../models/ExcerciseInterface';
import { IPlannerItem } from '../../../../models/IPlannerItems';

const mockExercise: iExcerciseData = {
  excercise_name: 'Squats',
  excercise_description: 'Leg exercise',
  excercise_video_url: 'http://example.com/squats.mp4',
  excercise_image_url: '',
  excercise_duration: '',
  excercise_reps: 10,
  excercise_reps_description: '',
  excercise_sets: 3,
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
  excercise_created_by: ''
};

const mockOnDelete = jest.fn();

const defaultProps: IPlannerItem = {
  excercise: mockExercise,
  plannerListRef: React.createRef<HTMLDivElement>(),
  onDelete: mockOnDelete
};

const renderPlannerItem = (props: Partial<IPlannerItem> = {}) => {
  return render(<PlannerItem {...defaultProps} {...props} />);
};

describe('PlannerItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with exercise data', () => {
    renderPlannerItem();

    expect(screen.getByTestId("excercise-name")).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  test('handles delete button click', () => {
    renderPlannerItem();

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockExercise);
  });

  test('renders delete button', () => {
    renderPlannerItem();
    // Use a more robust selector if possible, like data-testid on the icon container
    const deleteButton = screen.getByTestId("delete-button"); 
    expect(deleteButton).toBeInTheDocument();
  });

  test('calls onDelete when delete button is clicked', () => {
    renderPlannerItem();
    // Use a more robust selector
    const deleteButton = screen.getByTestId("delete-button"); 
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockExercise);
  });

}); 