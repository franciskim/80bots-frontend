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
  color: #7DFFFF;
  font-size: 45px;
`;

const Home = () => {
  return (
    <Fragment>
      <img src="/images/80bots-logo.svg" className={'logo'}/>
      <style jsx global>{`
          body { background: #333; padding: 23px; }
          .logo { width: 230px; float: left; }
          input {
          background: transparent;
          border: none;
          font-size: 45px;
          color: #FF7D7D;
          width: 100%;
          }
          input:focus { outline: 0; }
          form { width: 100%; }
      `}</style>
      <Head title={'Home'}/>
      <Container>
        <Header>80bots is a hyper-modern, cloud-native RPA (Robotic Process Automation) platform for the web that helps
          you and your organisation automate tasks that cannot be done with IFTTT or Zapier.</Header>
        <form action={'https://80bots.us4.list-manage.com/subscribe/post?u=105560c1c79f5eb1cf278f471&amp;id=21583f32e6'}
          method={'post'} target={'_blank'} noValidate>
          <input type={'email'} name={'EMAIL'} placeholder={'Enter your email to be in the know.'} autoFocus/>
        </form>
      </Container>
    </Fragment>
  );
};

Home.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthorized: state.auth.isAuthorized,
});

export default connect(mapStateToProps, null)(withTheme(Home));
