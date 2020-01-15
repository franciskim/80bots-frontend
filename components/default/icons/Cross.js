import React from "react";
import PropTypes from "prop-types";

const Cross = ({ color, width = 12, height = 13, ...props }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 12 13" {...props}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-1397.000000, -93.000000)" fill={color}>
          <path d="M1406.46186,105.0226 L1403.00375,101.56449 L1399.53814,105.028593 C1398.9583,105.609939 1398.01586,105.609939 1397.43601,105.028593 C1396.85466,104.448745 1396.85466,103.507804 1397.43601,102.926458 L1400.90011,99.4608565 L1397.43601,95.9967537 C1396.85466,95.4154077 1396.85466,94.4744662 1397.43601,93.8946186 C1398.01586,93.3132726 1398.9583,93.3132726 1399.53814,93.8946186 L1403.00375,97.3587214 L1406.46186,93.9006118 C1407.0417,93.3192658 1407.98264,93.3192658 1408.56399,93.9006118 C1409.14384,94.4819578 1409.14384,95.4228992 1408.56399,96.0027469 L1405.10588,99.4623549 L1408.56399,102.920464 C1409.14534,103.500312 1409.14534,104.442752 1408.56399,105.0226 C1407.98414,105.602447 1407.0417,105.602447 1406.46186,105.0226 Z" />
        </g>
      </g>
    </svg>
  );
};

Cross.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

export default Cross;
