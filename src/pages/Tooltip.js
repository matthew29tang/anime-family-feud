import React, { useState } from 'react';
import './Tooltip.css'; // Don't forget to create this CSS file

function Tooltip({ text, children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="tooltip-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <span className="tooltip-text" style={{fontWeight: "normal", fontSize: "13px"}}>
          {text}
        </span>
      )}
    </div>
  );
}

export default Tooltip;