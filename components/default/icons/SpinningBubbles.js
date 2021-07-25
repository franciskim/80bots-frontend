import React from "react";
import PropTypes from "prop-types";

const SpinningBubbles = ({ color, width = 20, height = 20 }) => {
  return (
    <svg viewBox="0 0 32 32" width={width} height={height}>
      <g fill={color} fillRule={"evenodd"}>
        <circle cx="16" cy="3" r="1.93886">
          <animate
            attributeName="r"
            values="0;3;0;0"
            dur="1s"
            repeatCount="indefinite"
            begin="0"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle transform="rotate(45 16 16)" cx="16" cy="3" r="0.36318">
          <animate
            attributeName="r"
            values="0;3;0;0"
            dur="1s"
            repeatCount="indefinite"
            begin="0.125s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle transform="rotate(90 16 16)" cx="16" cy="3" r="0">
          <animate
            attributeName="r"
            values="0;3;0;0"
            dur="1s"
            repeatCount="indefinite"
            begin="0.25s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle transform="rotate(135 16 16)" cx="16" cy="3" r="0">
          <animate
            attributeName="r"
            values="0;3;0;0"
            dur="1s"
            repeatCount="indefinite"
            begin="0.375s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle transform="rotate(180 16 16)" cx="16" cy="3" r="0.0306189">
          <animate
            attributeName="r"
            values="0;3;0;0"
            dur="1s"
            repeatCount="indefinite"
            begin="0.5s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle transform="rotate(225 16 16)" cx="16" cy="3" r="0.695931">
          <animate
            attributeName="r"
            values="0;3;0;0"
            dur="1s"
            repeatCount="indefinite"
            begin="0.625s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle transform="rotate(270 16 16)" cx="16" cy="3" r="2.06261">
          <animate
            attributeName="r"
            values="0;3;0;0"
            dur="1s"
            repeatCount="indefinite"
            begin="0.75s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle transform="rotate(315 16 16)" cx="16" cy="3" r="2.81448">
          <animate
            attributeName="r"
            values="0;3;0;0"
            dur="1s"
            repeatCount="indefinite"
            begin="0.875s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            calcMode="spline"
          />
        </circle>
        <circle transform="rotate(180 16 16)" cx="16" cy="3" r="0.0306189">
          <animate
            attributeName="r"
            values="0;3;0;0"
            dur="1s"
            repeatCount="indefinite"
            begin="0.5s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
            calcMode="spline"
          />
        </circle>
      </g>
    </svg>
  );
};

SpinningBubbles.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

export default SpinningBubbles;
