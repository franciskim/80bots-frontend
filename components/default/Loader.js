import React from 'react';
import styled from '@emotion/styled';
import Icon from './icons';
import PropTypes from 'prop-types';

const LoaderContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Caption = styled.span`
  margin-top: 20px;
  font-size: 16px;
  color: ${ props => props.theme.colors.blueGrey };
`;

export const Loader = ({ type, caption, ...props }) => {
  return(
    <LoaderContainer>
      <Icon name={type || 'bubbles'} {...props}/>
      { caption && <Caption>{caption}</Caption> }
    </LoaderContainer>
  );
};

Loader.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  caption: PropTypes.string,
  type: PropTypes.oneOf(['spinning-bubbles', 'bubbles'])
};

export default Loader;
