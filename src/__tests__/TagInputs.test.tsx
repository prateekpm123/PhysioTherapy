/***
 * SUMMARY
 * should render the input field with default placeholder: Checks basic rendering with default props.
should render with initial tags provided: Verifies that initialTags are displayed and the placeholder is hidden. Input structure validation.
should show custom placeholder when provided and no tags exist: Tests custom placeholder prop. Input structure validation.
should add a tag when Enter key is pressed with valid input: Tests core functionality of adding a tag using the 'Enter' delimiter and checks if onChange is called correctly. Output validation (callback).
should add a tag when comma key is pressed with valid input: Tests adding a tag using the ',' delimiter and checks onChange. Output validation.
should not add an empty or whitespace tag: Ensures empty inputs don't create tags. Input validation.
should not add a duplicate tag (case-insensitive): Checks duplicate prevention logic. Input validation.
should remove the last tag on Backspace when input is empty: Tests the Backspace functionality for removing tags and checks onChange. Output validation.
should not remove a tag on Backspace if input is not empty: Ensures Backspace only removes tags when the input field is empty.
should remove the correct tag when its remove button is clicked: Tests clicking the 'x' button on a tag and checks onChange. Output validation.
should use custom delimiters when provided: Tests the delimiters prop for customizing tag creation keys. Input structure validation.
should focus the input when the container is clicked: Verifies the click-to-focus behavior on the component's container.
should render the correct basic DOM structure: Checks the general output structure (container, tag badges, remove buttons, input). Output structure validation.
 */


import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Use userEvent for more realistic interactions
import '@testing-library/jest-dom';
import TagInput from '../components/TagInputs';
import { Theme } from '@radix-ui/themes'; // Wrap in Theme for Radix components

// Mock Radix components/icons if they cause issues in tests, but try without first
// jest.mock('@radix-ui/react-icons', () => ({
//   Cross1Icon: () => <svg data-testid="cross-icon" />,
// }));

// Mock the onChange prop
const mockOnChange = jest.fn();

// Helper function to render with Radix Theme context
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<Theme>{ui}</Theme>);
};

describe('TagInput Component', () => {
  const defaultProps = {
    onChange: mockOnChange,
    id: 'tag-input-test',
  };

  beforeEach(() => {
    // Clear mock calls and reset any state if necessary
    mockOnChange.mockClear();
  });

  // Test case 1: Renders correctly with default props
  test('should render the input field with default placeholder', () => {
    renderWithTheme(<TagInput {...defaultProps} />);
    expect(screen.getByPlaceholderText('Add tags...')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument(); // No tags initially, so no remove buttons
  });

  // Test case 2: Renders with initial tags
  test('should render with initial tags provided', () => {
    const initialTags = ['react', 'test'];
    renderWithTheme(<TagInput {...defaultProps} initialTags={initialTags} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Remove/i })).toHaveLength(2);
    // Placeholder should be explicitly set to empty string, not absent
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', '');
  });

  // Test case 3: Input structure - Placeholder updates correctly
  test('should show custom placeholder when provided and no tags exist', () => {
    const customPlaceholder = 'Enter skills...';
    renderWithTheme(<TagInput {...defaultProps} placeholder={customPlaceholder} />);
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  // Test case 4: Adds a tag when Enter key is pressed
  test('should add a tag when Enter key is pressed with valid input', async () => {
    const user = userEvent.setup();
    renderWithTheme(<TagInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('Add tags...');

    await act(async () => {
      await user.type(input, 'typescript{enter}');
    });

    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(input).toHaveValue(''); // Input should clear
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(['typescript']);
  });

  // Test case 5: Adds a tag when comma key is pressed
  test('should add a tag when comma key is pressed with valid input', async () => {
    const user = userEvent.setup();
    renderWithTheme(<TagInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('Add tags...');

    await act(async () => {
      await user.type(input, 'jest,');
    });

    expect(screen.getByText('jest')).toBeInTheDocument();
    expect(input).toHaveValue(''); // Input should clear
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(['jest']);
  });

  // Test case 6: Does not add empty or whitespace tags
  test('should not add an empty or whitespace tag', async () => {
    const user = userEvent.setup();
    renderWithTheme(<TagInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('Add tags...');

    await act(async () => {
      await user.type(input, '   {enter}'); // Whitespace then Enter
    });

    expect(screen.queryByRole('button', { name: /Remove/i })).not.toBeInTheDocument(); // No tags added
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('   '); // Input doesn't clear if tag wasn't added

    await act(async () => {
      await user.clear(input);
    });
    await act(async () => {
      await user.type(input, '{enter}'); // Just Enter
    });
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  // Test case 7: Prevents adding duplicate tags (case-insensitive)
  test('should not add a duplicate tag (case-insensitive)', async () => {
    const user = userEvent.setup();
    const initialTags = ['React'];
    renderWithTheme(<TagInput {...defaultProps} initialTags={initialTags} />);
    const input = screen.getByRole('textbox');

    await act(async () => {
      await user.type(input, 'react{enter}'); // Try adding lowercase version
    });

    expect(screen.getByText('React')).toBeInTheDocument(); // Original tag still there
    expect(screen.getAllByRole('button', { name: /Remove/i })).toHaveLength(1); // Only one tag
    expect(mockOnChange).not.toHaveBeenCalled(); // onChange shouldn't be called for duplicates
    expect(input).toHaveValue(''); // Input clears even if duplicate
  });

  // Test case 8: Removes the last tag when Backspace is pressed in an empty input
  test('should remove the last tag on Backspace when input is empty', async () => {
    const user = userEvent.setup();
    const initialTags = ['one', 'two'];
    renderWithTheme(<TagInput {...defaultProps} initialTags={initialTags} />);
    const input = screen.getByRole('textbox');

    await act(async () => {
      await user.type(input, '{backspace}');
    });

    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.queryByText('two')).not.toBeInTheDocument();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(['one']);
  });

  // Test case 9: Does not remove a tag on Backspace if input is not empty
  test('should not remove a tag on Backspace if input is not empty', async () => {
    const user = userEvent.setup();
    const initialTags = ['one'];
    renderWithTheme(<TagInput {...defaultProps} initialTags={initialTags} />);
    const input = screen.getByRole('textbox');

    await act(async () => {
      await user.type(input, 'a{backspace}');
    });

    expect(screen.getByText('one')).toBeInTheDocument(); // Tag still there
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(input).toHaveValue(''); // Input value changed
  });

  // Test case 10: Removes a specific tag when its remove button is clicked
  test('should remove the correct tag when its remove button is clicked', async () => {
    const user = userEvent.setup();
    const initialTags = ['apple', 'banana', 'cherry'];
    renderWithTheme(<TagInput {...defaultProps} initialTags={initialTags} />);

    // Find the button specifically by its aria-label
    const tagToRemove = 'banana';
    const removeButton = screen.getByRole('button', { name: `Remove ${tagToRemove}` });
    expect(removeButton).toBeInTheDocument(); // Verify button exists

    await act(async () => {
      await user.click(removeButton);
    });

    expect(screen.queryByText(tagToRemove)).not.toBeInTheDocument();
    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText('cherry')).toBeInTheDocument();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(['apple', 'cherry']);
  });

  // Test case 11: Input structure - Uses custom delimiters
  test('should use custom delimiters when provided', async () => {
    const user = userEvent.setup();
    renderWithTheme(<TagInput {...defaultProps} delimiters={[';']} />);
    const input = screen.getByPlaceholderText('Add tags...');

    await act(async () => {
      await user.type(input, 'tag1{enter}');
    });
    expect(screen.queryByText('tag1')).not.toBeInTheDocument();
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('tag1');

    await act(async () => {
      await user.type(input, ';');
    });
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(['tag1']);
    expect(input).toHaveValue('');
  });

  // Test case 12: Focuses input when container is clicked
  test('should focus the input when the container is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<TagInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('Add tags...');
    const container = input.closest('div');

    expect(input).not.toHaveFocus();
    if (container) {
      await act(async () => {
        await user.click(container);
      });
    }
    expect(input).toHaveFocus();
  });

  // Test case 13: Output structure validation
  test('should render the correct basic DOM structure', () => {
    const initialTags = ['tagA'];
    renderWithTheme(<TagInput {...defaultProps} initialTags={initialTags} />);

    // Check for the main container (implementation-dependent, check class/structure)
    // For styled-components, checking the input's parent might be sufficient
    const input = screen.getByRole('textbox');
    // The following class check is brittle and depends on styled-components generated names.
    // Consider a more robust selector if possible, e.g., a data-testid on the container.
    // expect(input.parentElement).toHaveClass('c-PJLV c-PJLV-igafrHz-css'); // Example class, might change

    // Check for tag badge presence
    expect(screen.getByText('tagA')).toBeInTheDocument();
    // Check for remove button within the tag structure
    expect(screen.getByRole('button', { name: 'Remove tagA' })).toBeInTheDocument();
    // Check for the input element
    expect(input).toBeInTheDocument();
  });

}); 