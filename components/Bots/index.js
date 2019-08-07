import React from 'react';
import styled from '@emotion/styled';

const H1 = styled.h1`
  font-size: 32px;
  color: ${ props => props.theme.colors.blue};
`;

const Bots = () => {
  return(
    <H1>Bots Page here</H1>
  );
};

export default Bots;