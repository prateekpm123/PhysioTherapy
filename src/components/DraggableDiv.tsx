import { styled } from "@stitches/react";
import { themeColors } from "../theme/theme";
import React, { useState, useRef, MouseEvent, useEffect } from 'react';

interface DraggableDivProps {
  children: React.ReactNode;
  parentRef: React.RefObject<HTMLDivElement>;
  onDragEnd?: () => void;
}

const DraggableContainer = styled('div', {
  userSelect: 'none',
  backgroundColor: themeColors.background.elevation1,
  borderRadius: '8px',
  transition: 'transform 0.2s ease',
  position: 'absolute',
});

const DraggableDiv: React.FC<DraggableDivProps> = ({ children, parentRef, onDragEnd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent) => {
    if (elementRef.current) {
      e.preventDefault();
      setIsDragging(true);
      const rect = elementRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (isDragging && elementRef.current && parentRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const elementRect = elementRef.current.getBoundingClientRect();

      // Calculate new position relative to parent
      let newX = e.clientX - dragOffset.x - parentRect.left;
      let newY = e.clientY - dragOffset.y - parentRect.top;

      // Calculate maximum allowed positions
      const maxX = parentRect.width - elementRect.width;
      const maxY = parentRect.height - elementRect.height;

      // Apply boundary constraints
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (onDragEnd) {
        onDragEnd();
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onDragEnd]);

  return (
    <DraggableContainer
      ref={elementRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {children}
    </DraggableContainer>
  );
};

export default DraggableDiv;