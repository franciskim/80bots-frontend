import React from 'react';
import styled from '@emotion/styled';

const Content = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 32px;
    color: ${props => props.theme.colors.blue};
  }
`;

const Dashboard = () => {
  return(
    <Content>
      <h1>Metrics and graphs will be here soon.</h1>
    </Content>
  );
};

export default Dashboard;