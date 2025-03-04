import { IDraggableDiv } from '../models/IDraggableDiv';

import React, { useState, useRef, MouseEvent, useEffect } from 'react';

const DraggableDiv: React.FC<IDraggableDiv> = (props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const divRef = useRef<HTMLDivElement>(null);
  const parentRef = props.parentRef;
  const [parentDimensions, setParentDimensions] = useState({ width: 0, height: 0 });
  const [divDimensions, setDivDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (parentRef.current) {
      setParentDimensions({
        width: parentRef.current.clientWidth,
        height: parentRef.current.clientHeight,
      });
    }

    if (divRef.current){
      setDivDimensions({
        width: divRef.current.clientWidth,
        height: divRef.current.clientHeight,
      });
    }

    const handleResize = () => {
      if (parentRef.current) {
        setParentDimensions({
          width: parentRef.current.clientWidth,
          height: parentRef.current.clientHeight,
        });
      }
      if (divRef.current) {
        setDivDimensions({
          width: divRef.current.clientWidth,
          height: divRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [parentRef]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (divRef.current) {
      setIsDragging(true);
      setOffset({
        x: e.clientX - divRef.current.offsetLeft,
        y: e.clientY - divRef.current.offsetTop,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      let newX = e.clientX - offset.x;
      let newY = e.clientY - offset.y;

      // Boundary checks
      if (newX < 0) {
        newX = 0;
      } else if (newX > parentDimensions.width - divDimensions.width) {
        newX = parentDimensions.width - divDimensions.width;
      }

      if (newY < 0) {
        newY = 0;
      } else if (newY > parentDimensions.height - divDimensions.height) {
        newY = parentDimensions.height - divDimensions.height;
      }

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={parentRef}
      style={{
        position: 'relative', // Parent needs a positioning context
        width: '500px',
        height: '300px',
        border: '1px solid black',
      }}
    >
      <div
        ref={divRef}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: '100px',
          height: '50px',
          backgroundColor: 'lightblue',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        Drag Me!
      </div>
    </div>
  );
};

export default DraggableDiv;