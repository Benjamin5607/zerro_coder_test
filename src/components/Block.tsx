import React, { useState, useEffect } from 'react';
import './Block.css';

interface BlockProps {
  x: number;
  y: number;
  color: string;
}

const Block: React.FC<BlockProps> = ({ x, y, color }) => {
  return (
    <div
      className="block"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        backgroundColor: color,
      }}
    ></div>
  );
};

export default Block;