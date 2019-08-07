import React from 'react';
import styled from '@emotion/styled';

const H1 = styled.h1`
  font-size: 32px;
  color: ${ props => props.theme.colors.blue};
`;

const RunningBots = () => {
  return(
    <H1>Running Bots Page here</H1>
  );
};

export default RunningBots;