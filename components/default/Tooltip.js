import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const positionTop = css`
  & > * {
    &:after {
      bottom: calc(100% + 8px);
    }
    &:before {      
      top: -8px;
      border-color: rgba(0,0,0,0.7) transparent transparent transparent;
    }
  }
`;

const positionBottom = css`
  & > * {
    &:after {
      top: calc(100% + 8px);
    }
    &:before {      
      bottom: -8px;
      border-color: transparent transparent rgba(0,0,0,0.7) transparent;
    }
  }
`;

const TooltipContainer = styled.div`
  & > * {
    position: relative;
    display: inline-block;
    overflow: visible;
    width: 120px;
    &:hover:before, &:hover:after {
      opacity: 1;
    }
    &:before {
      content: " ";
      position: absolute;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      opacity: 0;
      left: 10%;
    }
    &:after {
      content: "${props => props.text}";
      width: 120px;
      margin-left: -70px;
      position: absolute;
      background: rgba(0,0,0,0.7);
      text-align: center;
      color: #fff;
      padding: 4px 2px;
      font-size: 12px;
      min-width: 80px;
      border-radius: 5px;
      pointer-events: none;
      opacity: 0;
      z-index: 2;
    }
  }
  ${ props => props.position === 'top' ? positionTop : positionBottom };
`;

export const Tooltip = ({ children, position = 'top', text, ...props }) =>
  <TooltipContainer position={position} text={text} {...props}>
    <div>{children}</div>
  </TooltipContainer>;

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  position: PropTypes.oneOf(['top', 'bottom'])
};

export default Tooltip;
