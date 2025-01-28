import React, { useState, useRef, useEffect } from 'react';

const CircularSlider = ({ radius = 100, min = 0, max = 100, initialValue = 50, onChange }) => {
  const [value, setValue] = useState(initialValue);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let newValue = ((angle + Math.PI) / (2 * Math.PI)) * (max - min) + min;

    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;

    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
    let newValue = ((angle + Math.PI) / (2 * Math.PI)) * (max - min) + min;

    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;

    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const angle = ((value - min) / (max - min)) * 2 * Math.PI - Math.PI;
  const lineEndX = radius + radius * 0.8 * Math.cos(angle); // 0.8 to make the line shorter than the radius
  const lineEndY = radius + radius * 0.8 * Math.sin(angle);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: radius * 2,
        height: radius * 2,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <svg width={radius * 2} height={radius * 2}>
        {/* Outer circle */}
        <circle
          cx={radius}
          cy={radius}
          r={radius}
          fill="none"
          stroke="#ddd"
          strokeWidth="2"
        />
        {/* Rotating line (like a clock hand) */}
        <line
          x1={radius}
          y1={radius}
          x2={lineEndX}
          y2={lineEndY}
          stroke="#007bff"
          strokeWidth="4"
          style={{ cursor: 'pointer' }}
        />
      </svg>
    </div>
  );
};

export default CircularSlider;
