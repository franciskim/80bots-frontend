import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Head from '../default/layout/components/Head';
import {connect} from 'react-redux';
import {withTheme} from 'emotion-theming';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Header = styled.h1`
  color: #333;
  font-size: 80px;
`;

const Home = () => {
  return (
    <Fragment>
      <Head title={'Home'}/>
      <Container>
        <Header>80bots is a hyper-modern, cloud-native RPA (Robotic Process Automation) platform for the web that helps you and your organisation automate tasks that cannot be done with IFTTT or Zapier.</Header>
      </Container>
    </Fragment>
  );
};

Home.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthorized: state.auth.isAuthorized
});

export default connect(mapStateToProps, null)(withTheme(Home));
