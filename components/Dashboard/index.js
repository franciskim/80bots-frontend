import React from 'react';
import styled from '@emotion/styled';

const Content = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 32px;
    color: ${props => props.theme.colors.cyan};
  }
`;

const Dashboard = () => {
  return(
    <Content>
    </Content>
  );
};

export default Dashboard;