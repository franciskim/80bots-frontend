import React from 'react';
import styled from '@emotion/styled';
import Icon from './icons';
import PropTypes from 'prop-types';

const LoaderContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Loader = ({ type, ...props }) => {
  return(
    <LoaderContainer>
      <Icon name={type || 'bubbles'} {...props}/>
    </LoaderContainer>
  );
};

Loader.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  type: PropTypes.oneOf(['spinning-bubbles', 'bubbles'])
};

export default Loader;
