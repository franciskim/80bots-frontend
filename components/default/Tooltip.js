import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const TooltipContainer = styled.div`
  ${props => props.css};
  & > * {
    position: relative;
    display: inline-block;
    &:hover:before, &:hover:after {
      opacity: 1;
    }
    &:before {
      content: "";
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      border-width: 4px 6px 0 6px;
      border-style: solid;
      border-color: rgba(0,0,0,0.7) transparent transparent transparent;
      z-index: 3;
      opacity: 0;
    }
    &:after {
      content: "${props => props.text}";
      position: absolute;
      left: 50%;
      top: -8px;
      transform: translateX(-50%) translateY(-100%);
      background: rgba(0,0,0,0.7);
      text-align: center;
      color: #fff;
      padding: 4px 2px;
      font-size: 12px;
      min-width: 80px;
      border-radius: 5px;
      pointer-events: none;
      opacity: 0;
    }
  }
`;

export const Tooltip = ({ children, text, ...props }) => {
  return(
    <TooltipContainer text={text} {...props}>
      <div>{children}</div>
    </TooltipContainer>
  );
};

Tooltip.propTypes = {
  children: PropTypes.any.isRequired,
  text: PropTypes.string.isRequired
};

export default Tooltip;
