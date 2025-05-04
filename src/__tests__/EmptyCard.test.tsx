/**
 * should render without crashing: This is a basic smoke test to ensure the component renders at all when given minimal required props (in this case, just children). It verifies the component doesn't throw an error during rendering.
should render children correctly: Validates that the content passed between the opening and closing tags of the component (children prop) is actually displayed within the component's output. This ensures the component acts as a proper container.
should apply custom className: Tests if the component correctly merges and applies a custom CSS class provided via the className prop alongside its default classes. This checks the component's extensibility regarding styling.
should render correctly even if className is not provided: Checks the component's behavior when an optional prop (className) is omitted. It ensures the component still renders correctly with its default styles and doesn't add an undefined class. This validates the handling of optional inputs.
should render a div element as the root: Verifies that the outermost element rendered by the component is a div. This checks the basic output structure of the component.
 */


import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import P_EmptyCard from '../components/EmptyCard';

describe('P_EmptyCard Component', () => {
  // Test case 1: Renders correctly
  test('should render without crashing', () => {
    render(
      <P_EmptyCard>
        <div>Test Child</div>
      </P_EmptyCard>
    );
    // Check if the main div container is rendered using data-testid
    expect(screen.getByTestId('p-empty-card')).toBeInTheDocument();
  });

  // Test case 2: Renders children
  test('should render children correctly', () => {
    const childText = 'This is a child element';
    render(
      <P_EmptyCard>
        <p>{childText}</p>
      </P_EmptyCard>
    );
    // Check if the child text is present in the document
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  // Test case 3: Applies custom className
  test('should apply custom className', () => {
    const customClass = 'my-custom-class';
    const { container } = render(
      <P_EmptyCard className={customClass}>
        <div>Test Child</div>
      </P_EmptyCard>
    );
    // The component renders a div wrapper. Check if this div has the custom class.
    // Assuming the root element rendered by P_EmptyCard is the one receiving the className.
    // We might need to inspect the container's first child if the component structure is simple.
    expect(container.firstChild).toHaveClass(customClass);
    // Also check if the base classes are still present
    expect(container.firstChild).toHaveClass('m-10');
    expect(container.firstChild).toHaveClass('bg-gray-600');
  });

  // Test case 4: Input structure validation (Props check - TypeScript handles this largely, but testing ensures runtime behavior)
  test('should render correctly even if className is not provided', () => {
    render(
      <P_EmptyCard>
        <div>Test Child</div>
      </P_EmptyCard>
    );
     // Basic check to ensure rendering happens without className
    expect(screen.getByText('Test Child')).toBeInTheDocument();
    // Check that default classes are applied, and no undefined class is added
    const { container } = render(
      <P_EmptyCard>
        <div>Test Child</div>
      </P_EmptyCard>
    );
    expect(container.firstChild).not.toHaveClass('undefined');
    expect(container.firstChild).toHaveClass('m-10');
  });

   // Test case 5: Output structure validation (basic)
  test('should render a div element as the root', () => {
    const { container } = render(
      <P_EmptyCard>
        <div>Test Child</div>
      </P_EmptyCard>
    );
    // Check if the first child of the container (the rendered component) is a DIV
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

}); 