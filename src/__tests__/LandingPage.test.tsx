import React from 'react'; // Add React import for JSX
import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from '@/pages/LandingPage/LandingPage'; // Use alias import path
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

// Mock the useNavigate hook
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Use actual implementations for other parts
  useNavigate: () => mockedNavigate,
}));

// Mock NavBar and Footer components to isolate the LandingPage logic
jest.mock('@/pages/LandingPage/NavBar', () => () => <div data-testid="navbar-mock">NavBar</div>);
jest.mock('@/pages/LandingPage/Footer', () => () => <div data-testid="footer-mock">Footer</div>);


// Test suite for the LandingPage component
describe('LandingPage Component', () => {
  beforeEach(() => {
    // Clear any previous mock calls and render the component within MemoryRouter before each test
    mockedNavigate.mockClear();
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
  });

  // Test case 1: Ensure the LandingPage renders essential elements correctly
  test('renders LandingPage with key elements', () => {
    // Verify the main heading is rendered
    expect(screen.getByRole('heading', { name: /Your One-Stop Solution for Physiotherapy Management and Assistance/i })).toBeInTheDocument();

    // Verify the mocked NavBar is rendered
    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
    expect(screen.getByText('NavBar')).toBeInTheDocument(); // Check text content of mock

    // Verify the mocked Footer is rendered
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument(); // Check text content of mock

    // Verify the "For Physiotherapists" card heading is rendered
    expect(screen.getByRole('heading', { name: /For Physiotherapists/i })).toBeInTheDocument();

    // Verify the "For Individuals" card heading is rendered
    expect(screen.getByRole('heading', { name: /For Individuals$/i })).toBeInTheDocument();

    // Verify feature section headings are rendered
    expect(screen.getByRole('heading', { name: /Advanced Patient Management/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /AI-Powered Insights and Recommendations/i })).toBeInTheDocument();

    // Verify the quote text is present (partial match)
    expect(screen.getByText(/This platform has transformed how I manage my practice/i)).toBeInTheDocument();

    // Verify both "Check Out" buttons are rendered
    expect(screen.getAllByRole('button', { name: /Check Out/i })).toHaveLength(2);
  });

  // Test case 2: Verify navigation for the "For Physiotherapists" Check Out button
  test('navigates to /signup when "For Physiotherapists" Check Out button is clicked', () => {
    // Get all "Check Out" buttons
    const checkOutButtons = screen.getAllByRole('button', { name: /Check Out/i });
    // Click the first button (assuming it's for physiotherapists based on DOM order)
    fireEvent.click(checkOutButtons[0]);
    // Assert that navigate was called once with the correct path
    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith('/signup');
  });

  // Test case 3: Verify navigation for the "For Individuals" Check Out button
  test('navigates to /signup when "For Individuals" Check Out button is clicked', () => {
    // Get all "Check Out" buttons
    const checkOutButtons = screen.getAllByRole('button', { name: /Check Out/i });
    // Click the second button (assuming it's for individuals based on DOM order)
    fireEvent.click(checkOutButtons[1]);
    // Assert that navigate was called once with the correct path
    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith('/signup');
  });

  // Test case 4: Ensure static text content is rendered correctly
  test('renders static text content correctly', () => {
    // Verify text within the "For Physiotherapists" card
    expect(screen.getByText(/Empowering physiotherapists to manage patient data, track progress, and provide personalized treatments with AI-powered tools./i)).toBeInTheDocument();

    // Verify text within the "For Individuals" card
    expect(screen.getByText(/Get insights into your condition and determine if you need a physiotherapy visit by describing your symptoms./i)).toBeInTheDocument();

    // Verify text within the "Advanced Patient Management" feature card
    expect(screen.getByText(/Manage all your patients' data with in-depth tracking, follow-ups, and personalized treatment plans to ensure optimal care./i)).toBeInTheDocument();

    // Verify text within the "AI-Powered Insights" feature card
    expect(screen.getByText(/Utilize AI to analyze patient data, suggest exercises, and provide diagnostic insights to enhance treatment outcomes./i)).toBeInTheDocument();

     // Verify text within the quote card (author and title)
    expect(screen.getByText(/Dr\. Sarah Johnson/i)).toBeInTheDocument();
    expect(screen.getByText(/Physiotherapist, Wellness Clinic/i)).toBeInTheDocument();

    // Verify text in the "For Individuals: Understand Your Needs" section
    expect(screen.getByText(/Unsure if you need physiotherapy\? Describe your symptoms, and our platform will provide insights and recommend whether a visit to a physiotherapist is necessary./i)).toBeInTheDocument();
  });

}); 