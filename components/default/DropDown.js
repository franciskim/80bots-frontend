import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

const Container = styled.div`
  position: relative;
`;

const DropDownMenu = styled.div`
  position: absolute;
  top: 100%;
  ${props =>
    props.side === 'right'
      ? css`
            right: 0;
        `
      : css`
            left: 0;
        `};
  z-index: 1000;
  float: left;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  display: ${props => (props.open ? 'block' : 'none')};
`;

const DropDownToggle = styled.span`
  display: flex;
  cursor: pointer;
  align-items: center;
  white-space: nowrap;
`;

const DropDown = ({ toggleItem, children, side }) => {
  const [opened, toggle] = useState(false);

  return (
    <Container>
      <DropDownToggle onClick={() => toggle(!opened)}>{toggleItem}</DropDownToggle>
      <DropDownMenu side={side} open={opened}>{children}</DropDownMenu>
    </Container>
  );
};

DropDown.propTypes = {
  side: PropTypes.string,
  toggleItem: PropTypes.object,
  children: PropTypes.any,
};

export default DropDown;
