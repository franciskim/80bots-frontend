import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Card } from 'components/default/Card';

const Container = styled(Card)`
  display: flex;
  background-image: ${ props => props.image ? `url("${props.image}")` : 'none' };
  background-size: cover;
  width: 320px;
  height: 200px;
  transition: 100ms all;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, .25);
  border: none;
  &:hover {
    transform: scale(1.05);
  }
`;

const Blur = styled.div`
  display: flex;
  flex: 1 1;
  justify-content: center;
  align-items: center;
  color: ${ props => props.theme.colors.white };
  font-size: 18px;
  min-width: 100%;
  min-height: 100%;
  background-color: rgba(0, 0, 0, .45);
`;

const ScreenShot = ({ src, caption, ...props }) => {
  return(
    <Container image={src} {...props}>
      <Blur>{ caption }</Blur>
    </Container>
  );
};

ScreenShot.propTypes = {
  src:     PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired
};

export default ScreenShot;
