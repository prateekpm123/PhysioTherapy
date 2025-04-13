import { render, screen } from '@testing-library/react';
import NotFound from '../pages/NotFound'; // Adjust the import path as necessary
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Test suite for the NotFound component
describe('NotFound Component', () => {
  // Test case to ensure the NotFound component renders correctly
  test('renders NotFound component', () => {
    render(
        <BrowserRouter>
            <NotFound />
        </BrowserRouter>
    );
    // Check if the "Not Found" text is present in the document
    expect(screen.getByText(/Not Found/i)).toBeInTheDocument();
    // Check if the "The page you are looking for does not exist." text is present
    expect(screen.getByText(/The page you are looking for does not exist./i)).toBeInTheDocument();
  });
}); 