import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const hamburgerBaseStyle = css`
  content: '';
  cursor: pointer;
  border-radius: 1px;
  height: 3px;
  width: 24px;
  background: #7dffff;
  display: block;
  left: 0;
  right: 0;
  transition: all 0.2s ease-in-out;
`;

const Button = styled.span`
  position: relative;
  top: 0;
  ${hamburgerBaseStyle};
  
  &::before, &::after {
    ${hamburgerBaseStyle};
  }
  
  &::before {
    top: -7.5px;
    width: 18px;
    left: 0;
    position: absolute;
  }
  
  &::after {
    bottom: -7.5px;
    width: 14px;
    position: absolute;
  }
`;

const openedStyles = css`
  span::before, span::after {
    left: -1px;
    width: 12px;
  }
  span::before {
    transform: rotateZ(-45deg);
    top: -4px;
  }
  span::after {
    transform: rotateZ(45deg);
    bottom: -4px;
  }
`;

const closedStyles = css`
  span::before, span::after {
    left: 13px;
    width: 12px;
  }
  span::before {
    transform: rotateZ(45deg);
    top: -4px;
  }
  span::after {
    transform: rotateZ(-45deg);
    bottom: -4px;
  }
`;

const Container = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  width: 26px;
  height: 26px;
  &:hover {
    cursor: pointer;
    ${ props => props.opened ? openedStyles : closedStyles };
  }
`;

const HamburgerButton = ({ opened, ...props }) => {
  return <Container opened={opened} {...props}> <Button/> </Container>;
};

HamburgerButton.propTypes = {
  opened: PropTypes.bool
};

export default HamburgerButton;
