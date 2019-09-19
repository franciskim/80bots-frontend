import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { keyframes } from '@emotion/core';

const fadeAnimation = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  z-index: 2;
  font-size: calc(${props => props.size}px / 5);
  position: relative;
  padding: 0;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.theme.colors.white}; 
  border-radius: 50%;
  line-height: ${props => props.height};
  animation: ${fadeAnimation} 100ms ease-in;
  &:after {
    border: none;
    position: absolute;
    top: calc(${props => props.size}px * 0.07);
    left: calc(${props => props.size}px * 0.07);
    text-align: center;
    display: block;
    border-radius: 50%;
    width: calc(${props => props.size}px * 0.86);
    height: calc(${props => props.size}px * 0.86);
    background-color: ${props => props.theme.colors.white};
    content: ' ';
  }
  ${props => props.css};
`;

const ProgressBarContainer = styled.div`
  border-radius: 50%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  position: absolute;
  clip: ${props => props.progress > 50
    ? 'rect(auto,auto,auto,auto)'
    : `rect(0, ${props.size}px, ${props.size}px, calc(${props.size}px * 0.5))`};
`;

const ValueBar = styled.div`
  position: absolute;
  clip: rect(0, calc(${props => props.size}px * 0.5), ${props => props.size}px, 0);
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  border: calc(${props => props.size}px * 0.07) solid ${props => props.theme.colors.primary};
  box-sizing: border-box;
  display: ${props => props.progress === 0 && 'none'};
  transition: all 100ms ease-in;
  transform: rotate(calc(${props => props.progress}*3.6deg));
`;

const ProgressNumber = styled.span`
  position: absolute;
  font-size: ${props => props.size * 0.33}px;
  line-height: ${props => props.size}px;
  width: ${props => props.size}px;
  text-align: center;
  display: block;
  color: ${props => props.theme.colors.primary};
  z-index: 2;
`;

const ProgressBar = styled.div`
  position: absolute;
  clip: rect(0, ${props => props.size}px, ${props => props.size}px, calc(${props => props.size}px * 0.5));
  background-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  display: ${props => props.progress < 50 && 'none'};
`;

export const CircleProgressBar = ({ progress, size, ...props }) => {
  return(
    progress
      ? <Container {...props} size={size}>
        <ProgressNumber size={size}>{progress}</ProgressNumber>
        <ProgressBarContainer progress={progress} size={size}>
          <ProgressBar progress={progress} size={size}/>
          <ValueBar progress={progress} size={size}/>
        </ProgressBarContainer>
      </Container>
      : null
  );
};

CircleProgressBar.propTypes = {
  progress: PropTypes.number,
  size: PropTypes.number.isRequired
};

export default CircleProgressBar;
