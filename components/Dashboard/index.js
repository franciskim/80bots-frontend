import React, { Fragment, useState } from 'react';
import styled from '@emotion/styled';
import Head from '../default/layout/Head';
import Sidebar from '../default/layout/Sidebar';
import Header from '../default/layout/Header';
import Banner from '../default/layout/Banner';

const Container = styled.div`
  display: flex;
  flex: 1;
  background-color: #F5F9FC;
`;

const Main = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Content = styled(Main)`
  padding: 2rem;
`;

const Dashboard = () => {
  const [opened, toggle] = useState(true);
  return(
    <Fragment>
      <Head title={'Dashboard'}/>
      <Container>
        <Sidebar opened={opened}/>
        <Main>
          <Header sidebarOpened={opened} onHamburgerClick={() => toggle(!opened)}/>
          <Content>
            <Banner/>
          </Content>
        </Main>
      </Container>
    </Fragment>
  );
};

export default Dashboard;