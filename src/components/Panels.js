import React, { useState, useEffect, useRef } from "react";

const MyComponent = ({ left, right }) => {
  const [dimension, setDimension] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768 && window.innerHeight <= 1024
  );
  const text = "Hello World ".repeat(1000);

  const handleMouseMove = (event) => {
    if (isDragging) {
      if (isMobile) {
        setDimension((event.touches[0].clientY / window.innerHeight) * 100);
      } else {
        setDimension((event.clientX / window.innerWidth) * 100);
      }
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
  }, [isMobile, isDragging]);

  function DragMask() {
    return (
      isDragging && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )
    );
  }

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
        <DragMask />
      </div>

      <div
        style={{
          flexBasis: "6px",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          margin: "5px",
          border: "3px dotted grey",
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
