import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Head from '../default/layout/components/Head';
import { connect } from 'react-redux';
import { withTheme } from 'emotion-theming';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-image: radial-gradient(hsl(200, 100%, 65%), hsl(200, 100%, 40%));
`;

const Header = styled.h1`
  color: white;
  font-size: 80px;
`;

const Home = () => {

  useEffect(() => {
    throw new Error('testing source maps');
  });

  return(
    <>
      <Head title={'Home'}/>
      <Container>
        <Header>Home page here</Header>
      </Container>
    </>
  );
};

Home.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthorized: state.auth.isAuthorized
});

export default connect(mapStateToProps, null)(withTheme(Home));
