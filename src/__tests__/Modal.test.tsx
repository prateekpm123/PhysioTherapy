/**
 * should render the modal when pIsOpen is true: Checks if the modal appears with its title and children when the pIsOpen prop is true. Validates basic rendering based on input prop.
should not render the modal when pIsOpen is false: Ensures the modal is not present in the DOM when pIsOpen is false. Validates conditional rendering logic.
should display the correct title: Verifies that the title prop is correctly displayed in the modal's heading. Checks input prop rendering.
should display the children content: Confirms that the content passed as children is rendered within the modal. Validates the container aspect.
should apply the testId to the root element: Checks if the testId prop is correctly applied to the modal's main container, useful for targeting in tests.
should call setIsModelOpen with false when close button is clicked: Tests the functionality of the close button. It simulates a click and checks if the setIsModelOpen callback function (passed as a prop) is called with false, indicating a request to close the modal. This validates interaction and output (callback execution).
should render the correct basic structure: Performs a basic structural validation by checking for the presence of key elements like the dialog container, the heading, the close button, and ensuring the children are rendered within the dialog.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../components/Modal';

// Mock function for setIsModelOpen
const mockSetIsModelOpen = jest.fn();

describe('Modal Component', () => {
  const testProps = {
    testId: 'test-modal',
    pIsOpen: true,
    title: 'Test Modal Title',
    setIsModelOpen: mockSetIsModelOpen,
  };

  beforeEach(() => {
    // Reset the mock function before each test
    mockSetIsModelOpen.mockClear();
  });

  // Test case 1: Renders when pIsOpen is true
  test('should render the modal when pIsOpen is true', () => {
    render(
      <Modal {...testProps}>
        <div>Modal Content</div>
      </Modal>
    );
    // Check if the modal dialog is in the document using the testId
    expect(screen.getByTestId(testProps.testId)).toBeInTheDocument();
    // Check if the title is rendered
    expect(screen.getByRole('heading', { name: testProps.title })).toBeInTheDocument();
    // Check if children are rendered
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  // Test case 2: Does not render when pIsOpen is false
  test('should not render the modal when pIsOpen is false', () => {
    render(
      <Modal {...testProps} pIsOpen={false}>
        <div>Modal Content</div>
      </Modal>
    );
    // Check that the modal dialog is not in the document
    expect(screen.queryByTestId(testProps.testId)).not.toBeInTheDocument();
  });

  // Test case 3: Renders title correctly
  test('should display the correct title', () => {
    const specificTitle = 'Another Modal Title';
    render(
      <Modal {...testProps} title={specificTitle}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByRole('heading', { name: specificTitle })).toBeInTheDocument();
  });

  // Test case 4: Renders children correctly
  test('should display the children content', () => {
    const childContent = <p>This is the child content.</p>;
    render(
      <Modal {...testProps}>
        {childContent}
      </Modal>
    );
    expect(screen.getByText('This is the child content.')).toBeInTheDocument();
  });

  // Test case 5: Applies testId correctly
  test('should apply the testId to the root element', () => {
    render(
      <Modal {...testProps}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByTestId(testProps.testId)).toBeInTheDocument();
  });

  // Test case 6: Calls setIsModelOpen with false when close button is clicked
  test('should call setIsModelOpen with false when close button is clicked', () => {
    render(
      <Modal {...testProps}>
        <div>Modal Content</div>
      </Modal>
    );
    const closeButton = screen.getByTestId('modalCloseBtn');
    fireEvent.click(closeButton);
    // Check if setIsModelOpen was called once with false
    expect(mockSetIsModelOpen).toHaveBeenCalledTimes(1);
    expect(mockSetIsModelOpen).toHaveBeenCalledWith(false);
  });

  // Test case 7: Output structure validation
  test('should render the correct basic structure', () => {
    render(
      <Modal {...testProps}>
        <div>Modal Content</div>
      </Modal>
    );
    // Check for key elements: dialog role, heading, close button
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: testProps.title })).toBeInTheDocument();
    expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
    // Check if children are contained within the dialog
    expect(screen.getByRole('dialog')).toContainElement(screen.getByText('Modal Content'));
  });

  // Input validation (Props) is mostly handled by TypeScript, but we ensure required props work.
  // We've already tested behavior with pIsOpen true/false.
  // We assume testId, title, setIsModelOpen, and children are required as per interface.
}); 