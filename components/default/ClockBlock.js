import React from "react";
import Clock from 'react-live-clock';
import PropTypes from "prop-types";

const ClockBlock = ({useTimezone, style, format}) => {

  return (
    <Clock
      format={format}
      timezone={useTimezone}
      style={style}
    />
  );
};

ClockBlock.propTypes = {
  useTimezone: PropTypes.string,
  style: PropTypes.object,
  format: PropTypes.string
};

export default ClockBlock;

