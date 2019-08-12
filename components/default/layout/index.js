import React, { Fragment, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Head from './components/Head';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Banner from './components/Banner';
import Loader from '../Loader';
import { checkAuth } from 'store/auth/actions';
import { connect } from 'react-redux';
import { withTheme } from 'emotion-theming';
import Router from 'next/router';
import { ROUTES } from 'config';

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

const AppLayout = ({ title, children, checkAuth, isAuthorized, loading, theme, user, hideBanner = false }) => {
  const [opened, toggle] = useState(true);
  useEffect(() => {
    if(!isAuthorized) checkAuth();
  }, []);

  return(
    <Fragment>
      <Head title={title}/>
      {
        !loading
          ? <Container>
            <Sidebar opened={opened} userRole={user && user.role}/>
            <Main>
              <Header sidebarOpened={opened} onHamburgerClick={() => toggle(!opened)}/>
              <Content>
                { !hideBanner && <Banner/> }
                { children }
              </Content>
            </Main>
          </Container>
          : <Loader type={'bubbles'} color={theme.colors.blue} width={100} height={100}/>
      }
    </Fragment>
  );
};

AppLayout.propTypes = {
  title: PropTypes.string.isRequired,
  checkAuth: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  children: PropTypes.any,
  hideBanner: PropTypes.bool
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthorized: state.auth.isAuthorized,
  loading: state.auth.loading
});

const mapDispatchToProps = dispatch => ({
  checkAuth: () => dispatch(checkAuth())
});

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(AppLayout));