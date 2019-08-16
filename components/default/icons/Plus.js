import React from 'react';
import PropTypes from 'prop-types';

const Plus = ({ color, width = 16, height = 16 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 42 42" >
      <path fill={color} d="M37.059,16H26V4.941C26,2.224,23.718,0,21,0s-5,2.224-5,4.941V16H4.941C2.224,16,0,18.282,0,21
        s2.224,5,4.941,5H16v11.059C16,39.776,18.282,42,21,42s5-2.224,5-4.941V26h11.059C39.776,26,42,23.718,42,21S39.776,16,37.059,16z"
      />
    </svg>
  );
};

Plus.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

export default Plus;