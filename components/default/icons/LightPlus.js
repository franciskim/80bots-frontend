import React from 'react';
import PropTypes from 'prop-types';

const LightPlus = ({ color, width = 16, height = 16 }) => {
  return (
    <svg viewBox="0 0 512 512" width={width} height={height}>
      <g fill={color}>
        <path d="M492,236H276V20c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v216H20c-11.046,0-20,8.954-20,20s8.954,20,20,20h216
        v216c0,11.046,8.954,20,20,20s20-8.954,20-20V276h216c11.046,0,20-8.954,20-20C512,244.954,503.046,236,492,236z"
        />
      </g>
    </svg>
  );
};

LightPlus.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

export default LightPlus;
