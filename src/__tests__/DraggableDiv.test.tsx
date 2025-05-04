import React, { useRef, useEffect } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DraggableDiv from '../components/DraggableDiv';
import { Theme } from '@radix-ui/themes'; // Assuming stitches/radix theme context might be needed

// Mock getBoundingClientRect as JSDOM doesn't have layout
const mockGetBoundingClientRect = (elementRect = {}) => {
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

  beforeEach(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 50,
      top: 0,
      left: 0,
      right: 100,
      bottom: 50,
      x: 0,
      y: 0,
      toJSON: () => ({}),
      ...elementRect, // Allow overriding defaults for the draggable element
    }));
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    jest.restoreAllMocks();
  });
};

// Helper component to provide the parent ref
const TestWrapper = ({ children, parentSize = { width: 500, height: 500 } }: { children: React.ReactNode, parentSize?: {width: number, height: number} }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  // Directly mock parentRef's getBoundingClientRect on mount
  useEffect(() => {
    if (parentRef.current) {
      const mockRect = {
        width: parentSize.width,
        height: parentSize.height,
        top: 0,
        left: 0,
        right: parentSize.width,
        bottom: parentSize.height,
        x: 0,
        y: 0,
        toJSON: () => ({...mockRect}), // Ensure toJSON returns the mock values
      };
      Object.defineProperty(parentRef.current, 'getBoundingClientRect', {
        value: () => mockRect,
        configurable: true,
      });
    }
  }, [parentSize]); // Rerun if parentSize changes

  return (
    <div ref={parentRef} style={{ width: `${parentSize.width}px`, height: `${parentSize.height}px`, position: 'relative' }} data-testid="parent-container">
      {React.cloneElement(children as React.ReactElement, { parentRef })}
    </div>
  );
};

describe('DraggableDiv Component', () => {
  const onDragEndMock = jest.fn();

  // Apply mock for getBoundingClientRect for all tests in this suite
  mockGetBoundingClientRect({ width: 100, height: 50 });

  beforeEach(() => {
    onDragEndMock.mockClear();
  });

  // Test case 1: Renders children
  test('should render its children', () => {
    render(
      <TestWrapper>
        <DraggableDiv parentRef={null as any} onDragEnd={onDragEndMock}>
          <span>Draggable Content</span>
        </DraggableDiv>
      </TestWrapper>
    );
    expect(screen.getByText('Draggable Content')).toBeInTheDocument();
  });

  // Test case 2: Initial position
  test('should render at initial position (0, 0)', () => {
    render(
      <TestWrapper>
        <DraggableDiv parentRef={null as any} onDragEnd={onDragEndMock}>
          <span>Draggable Content</span>
        </DraggableDiv>
      </TestWrapper>
    );
    const draggableElement = screen.getByText('Draggable Content').parentElement;
    expect(draggableElement).toHaveStyle('position: absolute');
    expect(draggableElement).toHaveStyle('left: 0px');
    expect(draggableElement).toHaveStyle('top: 0px');
  });

  // Test case 3: Starts dragging on mouse down
  test('should start dragging on mouse down and apply grabbing cursor and scale', () => {
     render(
      <TestWrapper>
        <DraggableDiv parentRef={null as any} onDragEnd={onDragEndMock}>
          <span>Draggable Content</span>
        </DraggableDiv>
      </TestWrapper>
    );
    const draggableElement = screen.getByText('Draggable Content').parentElement;
    expect(draggableElement).toHaveStyle('cursor: grab');
    expect(draggableElement).toHaveStyle('transform: scale(1)');

    fireEvent.mouseDown(draggableElement!, { clientX: 10, clientY: 10 });

    // Check for style changes indicating drag start
    // Note: Checking for active pseudo-class style ('cursor: grabbing') is difficult in JSDOM.
    // We rely on the transform change as an indicator.
    expect(draggableElement).toHaveStyle('transform: scale(1.02)');
  });

  // Test case 4: Moves element on mouse move while dragging
  test('should update position on mouse move while dragging', () => {
    render(
        <TestWrapper>
          <DraggableDiv parentRef={null as any} onDragEnd={onDragEndMock}>
            <span>Draggable Content</span>
          </DraggableDiv>
        </TestWrapper>
      );
    const draggableElement = screen.getByText('Draggable Content').parentElement;

    // Start dragging (offset calculation depends on initial clientX/Y)
    fireEvent.mouseDown(draggableElement!, { clientX: 5, clientY: 5 }); // Click near top-left

    // Simulate moving the mouse
    fireEvent.mouseMove(window, { clientX: 100, clientY: 80 });

    // Position should be clientX/Y - offset (which is clientX/Y - elementRect.left/top)
    // If elementRect starts at 0,0 and click is at 5,5, offset is {x: 5, y: 5}
    // New pos = (100 - 5, 80 - 5) = (95, 75)
    expect(draggableElement).toHaveStyle('left: 95px');
    expect(draggableElement).toHaveStyle('top: 75px');
  });

  // Test case 5: Stops dragging on mouse up
  test('should stop dragging on mouse up and reset scale', () => {
     render(
        <TestWrapper>
          <DraggableDiv parentRef={null as any} onDragEnd={onDragEndMock}>
            <span>Draggable Content</span>
          </DraggableDiv>
        </TestWrapper>
      );
    const draggableElement = screen.getByText('Draggable Content').parentElement;

    fireEvent.mouseDown(draggableElement!, { clientX: 10, clientY: 10 });
    expect(draggableElement).toHaveStyle('transform: scale(1.02)'); // Dragging

    fireEvent.mouseUp(window);

    expect(draggableElement).toHaveStyle('transform: scale(1)'); // Not dragging
  });

  // Test case 6: Calls onDragEnd on mouse up after dragging
  test('should call onDragEnd when dragging stops', () => {
     render(
        <TestWrapper>
          <DraggableDiv parentRef={null as any} onDragEnd={onDragEndMock}>
            <span>Draggable Content</span>
          </DraggableDiv>
        </TestWrapper>
      );
    const draggableElement = screen.getByText('Draggable Content').parentElement;

    fireEvent.mouseDown(draggableElement!, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(window, { clientX: 50, clientY: 50 }); // Ensure some movement happened
    fireEvent.mouseUp(window);

    expect(onDragEndMock).toHaveBeenCalledTimes(1);
  });

  // Test case 7: Does not call onDragEnd if not dragging (e.g., just a click)
  test('should not call onDragEnd on mouse up if not dragging', () => {
     render(
        <TestWrapper>
          <DraggableDiv parentRef={null as any} onDragEnd={onDragEndMock}>
            <span>Draggable Content</span>
          </DraggableDiv>
        </TestWrapper>
      );

    fireEvent.mouseUp(window); // Mouse up without preceding mousedown
    expect(onDragEndMock).not.toHaveBeenCalled();
  });

  // Test case 8: Respects parent boundaries (Top-Left)
  test('should not move outside parent boundaries (top-left)', () => {
     render(
        <TestWrapper parentSize={{ width: 500, height: 500 }}>
          <DraggableDiv parentRef={null as any} onDragEnd={onDragEndMock}>
            <span>Draggable Content</span>
          </DraggableDiv>
        </TestWrapper>
      );
    const draggableElement = screen.getByText('Draggable Content').parentElement;

    fireEvent.mouseDown(draggableElement!, { clientX: 50, clientY: 50 });
    // Try to move way off top-left
    fireEvent.mouseMove(window, { clientX: -100, clientY: -100 });

    // Should clamp to 0, 0
    expect(draggableElement).toHaveStyle('left: 0px');
    expect(draggableElement).toHaveStyle('top: 0px');
  });

  // Test case 9: Respects parent boundaries (Bottom-Right)
  test('should not move outside parent boundaries (bottom-right)', () => {
     render(
        <TestWrapper parentSize={{ width: 500, height: 500 }}>
          <DraggableDiv parentRef={null as any} onDragEnd={onDragEndMock}>
            <span>Draggable Content</span>
          </DraggableDiv>
        </TestWrapper>
      );
    const draggableElement = screen.getByText('Draggable Content').parentElement;
    // Element size is mocked as 100x50, Parent is 500x500
    const maxLeft = 500 - 100; // parentWidth - elementWidth
    const maxTop = 500 - 50;  // parentHeight - elementHeight

    fireEvent.mouseDown(draggableElement!, { clientX: 10, clientY: 10 });
    // Try to move way off bottom-right
    fireEvent.mouseMove(window, { clientX: 600, clientY: 600 });

    expect(draggableElement).toHaveStyle(`left: ${maxLeft}px`);
    expect(draggableElement).toHaveStyle(`top: ${maxTop}px`);
  });

  // Test case 10: Cleans up event listeners
  test('should clean up window event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(
      <TestWrapper>
        <DraggableDiv parentRef={null as any} onDragEnd={onDragEndMock}>
          <span>Draggable Content</span>
        </DraggableDiv>
      </TestWrapper>
    );
    const draggableElement = screen.getByText('Draggable Content').parentElement;

    // Start dragging to add listeners
    fireEvent.mouseDown(draggableElement!, { clientX: 10, clientY: 10 });

    // Unmount the component
    unmount();

    // Check if removeEventListener was called for mousemove and mouseup
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  test('should maintain position within boundaries when parent resizes', () => {
    const { rerender } = render(
        <TestWrapper parentSize={{ width: 500, height: 500 }}>
          <DraggableDiv parentRef={null as any} onDragEnd={onDragEndMock}>
            <span>Draggable Content</span>
          </DraggableDiv>
        </TestWrapper>
    );
    // ... existing code ...
  });
}); 