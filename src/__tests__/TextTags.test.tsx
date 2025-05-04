import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { H1, H2, H3, H4, H5, H6, H7, H8, H9 } from '../components/TextTags'; // Import all heading components

// Helper function to test common properties
const testTextComponent = (
  Component: React.FC<any>,
  expectedClass: string,
  expectedNodeName: string = 'SPAN',
  expectBr: boolean = false
) => {
  const testId = `test-${expectedNodeName.toLowerCase()}`;
  const customClass = 'my-custom-style';
  const childText = `Hello ${expectedNodeName}`;

  test(`renders children correctly`, () => {
    render(<Component>{childText}</Component>);
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  test(`applies the correct base class (${expectedClass})`, () => {
    render(<Component>{childText}</Component>);
    expect(screen.getByText(childText)).toHaveClass(expectedClass);
  });

  test(`applies custom className`, () => {
    render(<Component className={customClass}>{childText}</Component>);
    const element = screen.getByText(childText);
    expect(element).toHaveClass(expectedClass);
    expect(element).toHaveClass(customClass);
  });

  test(`passes through other HTML attributes (e.g., id, data-testid)`, () => {
    render(<Component data-testid={testId} id="unique-id">{childText}</Component>);
    const element = screen.getByText(childText);
    expect(element).toHaveAttribute('data-testid', testId);
    expect(element).toHaveAttribute('id', 'unique-id');
  });

  test(`renders as a ${expectedNodeName} element`, () => {
    render(<Component>{childText}</Component>);
    expect(screen.getByText(childText).nodeName).toBe(expectedNodeName);
  });

  if (expectBr) {
    test(`includes a <br> tag after the span`, () => {
      const { container } = render(<Component>{childText}</Component>);
      const spanElement = screen.getByText(childText);
      // Check if the next sibling element exists and is a BR tag
      expect(spanElement.nextSibling).not.toBeNull();
      expect(spanElement.nextSibling?.nodeName).toBe('BR');
    });
  } else {
    test(`does not include a <br> tag after the span`, () => {
      const { container } = render(<Component>{childText}</Component>);
      const spanElement = screen.getByText(childText);
      // Check that there is no next sibling or it's not a BR tag
      expect(spanElement.nextSibling).toBeNull();
    });
  }

};

describe('TextTags Components', () => {
  describe('H1', () => {
    testTextComponent(H1, 'text-9xl', 'SPAN', true);
  });

  describe('H2', () => {
    testTextComponent(H2, 'text-8xl', 'SPAN', false);
  });

  describe('H3', () => {
    testTextComponent(H3, 'text-7xl', 'SPAN', true);
  });

  describe('H4', () => {
    testTextComponent(H4, 'text-6xl', 'SPAN', true);
  });

  describe('H5', () => {
    testTextComponent(H5, 'text-5xl', 'SPAN', false);
  });

  describe('H6', () => {
    // Note: Original component has unreachable code. Testing based on the first return statement.
    testTextComponent(H6, 'text-4xl', 'SPAN', true);
  });

  describe('H7', () => {
    testTextComponent(H7, 'text-3xl', 'SPAN', false);
  });

  describe('H8', () => {
    testTextComponent(H8, 'text-2xl', 'SPAN', false);
  });

  describe('H9', () => {
    // Note: Original component has unreachable code. Testing based on the first return statement.
    testTextComponent(H9, 'text-xl', 'SPAN', true);
  });
}); 