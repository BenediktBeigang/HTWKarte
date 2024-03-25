import React from 'react';
import './Building.css';

interface BuildingProperties {
  onClick: () => void;
  path: string;
}

const Building: React.FC<BuildingProperties> = ({ onClick, path }) => (
  <svg onClick={onClick}>
    <g>
      <path
        d = {path}
        fill="#ff3333"/>
    </g>
  </svg>
);

export default Building;
