import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PDFPreview, iPDFPreview } from '../components/PDFPreview'; // Corrected import path
import { iExcerciseData } from '../models/ExcerciseInterface'; // Corrected import path

// Mock the child components/utilities relative to __tests__ location
jest.mock('../components/PDFExcerciseView1', () => ({ // Corrected mock path
  PDFExcerciseView1: jest.fn(({ excercise_name }) => ( 
    <div data-testid={`pdf-exercise-${excercise_name?.replace(/\s+/g, '-') || 'unknown'}`}>Mock: {excercise_name}</div> 
  )),
}));
jest.mock('../components/PDFGeneration', () => ({ // Corrected mock path
  PDFGeneration: jest.fn(),
}));

// Import mocks after jest.mock calls
import { PDFExcerciseView1 } from '../components/PDFExcerciseView1'; // Corrected import path
import { PDFGeneration } from '../components/PDFGeneration'; // Corrected import path

// Mock data conforming to iExcerciseData (adjust based on actual interface)
const mockExercise1: iExcerciseData = {
  excercise_name: 'Push Ups',
  excercise_description: 'Standard push-ups',
  excercise_sets: 3,
  excercise_reps: 10,
  excercise_tags: 'chest, triceps',
  excercise_image_url: 'pushup.gif',
  excercise_video_url: '',
  excercise_duration: '',
  excercise_reps_description: '',
  excercise_sets_description: '',
  excercise_category: '',
  excercise_type: '',
  excercise_muscles_involved: '',
  excercise_related_conditions: '',
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
const mockExercise2: iExcerciseData = {
  excercise_name: 'Squats',
  excercise_description: 'Bodyweight squats',
  excercise_sets: 3,
  excercise_reps: 15,
  excercise_tags: 'legs, glutes',
  excercise_image_url: 'squat.gif',
  excercise_video_url: '',
  excercise_duration: '',
  excercise_reps_description: '',
  excercise_sets_description: '',
  excercise_category: '',
  excercise_type: '',
  excercise_muscles_involved: '',
  excercise_related_conditions: '',
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

describe('PDFPreview Component', () => {
  beforeEach(() => {
    (PDFExcerciseView1 as jest.Mock).mockClear();
    (PDFGeneration as jest.Mock).mockClear();
  });

  test('should render PDFExcerciseView1 for each exercise', () => {
    const props: iPDFPreview = {
      plannerList: [mockExercise1, mockExercise2],
    };
    render(<PDFPreview {...props} />);
    expect(screen.getByRole('button', { name: 'Generate PDF' })).toBeInTheDocument();
    expect(PDFExcerciseView1).toHaveBeenCalledTimes(2);
    expect(PDFExcerciseView1).toHaveBeenCalledWith(expect.objectContaining({ excercise_name: 'Push Ups' }), {});
    expect(PDFExcerciseView1).toHaveBeenCalledWith(expect.objectContaining({ excercise_name: 'Squats' }), {});
    expect(screen.getByTestId('pdf-exercise-Push-Ups')).toBeInTheDocument();
    expect(screen.getByTestId('pdf-exercise-Squats')).toBeInTheDocument();
  });

  test('should render PDFExcerciseView1 once for a single exercise', () => {
    const props: iPDFPreview = {
      plannerList: [mockExercise1],
    };
    render(<PDFPreview {...props} />);
    expect(PDFExcerciseView1).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('pdf-exercise-Push-Ups')).toBeInTheDocument();
  });

  test('should render correctly when plannerList is empty', () => {
    const props: iPDFPreview = {
      plannerList: [],
    };
    render(<PDFPreview {...props} />);
    expect(screen.queryByTestId(/^pdf-exercise-/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate PDF' })).toBeInTheDocument();
    expect(() => render(<PDFPreview {...props} />)).not.toThrow();
  });

  test('should call PDFGeneration with the preview ref on button click', () => {
    const props: iPDFPreview = {
      plannerList: [mockExercise1],
    };
    render(<PDFPreview {...props} />);
    const generateButton = screen.getByRole('button', { name: 'Generate PDF' });
    fireEvent.click(generateButton);
    expect(PDFGeneration).toHaveBeenCalledTimes(1);
    expect(PDFGeneration).toHaveBeenCalledWith(expect.objectContaining({ current: expect.any(HTMLDivElement) }));
  });

  test('should accept the plannerList prop structure', () => {
    const props: iPDFPreview = { plannerList: [mockExercise1] };
    expect(() => render(<PDFPreview {...props} />)).not.toThrow();
    expect(PDFExcerciseView1).toHaveBeenCalled();
  });

  test('should render a main container, a scrollable area, and a button', () => {
    const props: iPDFPreview = { plannerList: [mockExercise1, mockExercise2] };
    const { container } = render(<PDFPreview {...props} />);
    expect(container.firstChild).toHaveClass('w-full h-full p-10');
    expect(screen.getByRole('button', { name: 'Generate PDF' })).toBeInTheDocument();
    const previewItems = screen.getAllByTestId(/^pdf-exercise-/);
    expect(previewItems).toHaveLength(2);
    const previewArea = previewItems[0].parentElement;
    expect(previewArea).toHaveStyle('height: 95%');
    expect(previewArea).toHaveClass('w-full overflow-scroll overflow-y-scroll');
  });
});