import React from "react";
import PropTypes from "prop-types";

const Bubbles = ({ color, width = 20, height = 20 }) => {
  return (
    <svg viewBox="0 0 32 32" width={width} height={height}>
      <g fill={color} fillRule={"evenodd"}>
        <circle transform="translate(8 0)" cx="0" cy="16" r="0">
          <animate
            attributeName="r"
            values="0; 4; 0; 0"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0"
            keyTimes="0;0.2;0.7;1"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle transform="translate(16 0)" cx="0" cy="16" r="0.0114679">
          <animate
            attributeName="r"
            values="0; 4; 0; 0"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.3"
            keyTimes="0;0.2;0.7;1"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle transform="translate(24 0)" cx="0" cy="16" r="0.920581">
          <animate
            attributeName="r"
            values="0; 4; 0; 0"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.6"
            keyTimes="0;0.2;0.7;1"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
            calcMode="spline"
          />
        </circle>
      </g>
    </svg>
  );
};

Bubbles.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

export default Bubbles;
