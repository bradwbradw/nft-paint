import React, { useState, useEffect, useRef } from "react";

const MyComponent = ({ left, right }) => {
  const [dimension, setDimension] = useState(50);
  const isDragging = useRef(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768 && window.innerHeight <= 1024
  );
  const text = "Hello World ".repeat(1000);

  const handleMouseMove = (event) => {
    if (isDragging.current) {
      if (isMobile) {
        setDimension((event.touches[0].clientY / window.innerHeight) * 100);
      } else {
        setDimension((event.clientX / window.innerWidth) * 100);
      }
    }
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (isMobile) {
      document.addEventListener("touchmove", handleMouseMove);
      document.addEventListener("touchend", handleMouseUp);
    } else {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (isMobile) {
        document.removeEventListener("touchmove", handleMouseMove);
        document.removeEventListener("touchend", handleMouseUp);
      } else {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [isMobile]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: isMobile ? "column" : "row",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flexBasis: `${dimension}%`,
          overflowY: "scroll",
          position: "relative",
        }}
      >
        {left}
        {isDragging.current && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        )}
      </div>
      <div
        style={{
          flexBasis: isMobile ? "5px" : "5px",
          backgroundColor: "purple",
          cursor: isMobile ? "row-resize" : "col-resize",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={(event) => {
          if (isMobile) {
            handleMouseDown(event);
          }
        }}
      />
      <div
        style={{
          flexBasis: `${100 - dimension}%`,
          overflowY: "scroll",
        }}
      >
        {right}
      </div>
    </div>
  );
};

export default MyComponent;
