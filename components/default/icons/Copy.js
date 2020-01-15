import React from "react";
import PropTypes from "prop-types";

const Copy = ({ color, width = 24, height = 24 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24">
      <path
        fill={color}
        d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
      />
    </svg>
  );
};

Copy.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

export default Copy;
