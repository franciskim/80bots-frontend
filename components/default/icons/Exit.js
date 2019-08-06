import React from 'react';
import PropTypes from 'prop-types';

const Exit = ({ color, width = 18, height = 18 }) => {
  return (
    <svg height={height} width={width} viewBox="0 0 24 24" fill={color || 'none'} stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
};

Exit.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

export default Exit;