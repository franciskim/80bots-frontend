import React, { Fragment, useState, useEffect } from 'react';
import Head from '../default/layout/components/Head';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Link from 'next/link';
import { css } from '@emotion/core';
import { connect } from 'react-redux';
import { NOTIFICATION_TYPES } from '/config';
import { resetPassword } from '/store/auth/actions';
import { Input } from '/components/default/inputs';
import { addNotification } from '/store/notification/actions';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-image: radial-gradient(hsl(200, 100%, 65%), hsl(200, 100%, 40%));
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  max-width: 400px;
  width: 100%;
  border-radius: 3px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const ResetWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.a`
  display: block;
  text-decoration: none;
  padding: 1rem 1.5rem;
`;

const inputStyles = {
  container: css`
    margin-bottom: 20px;
  `
};

const Reset = ({ addNotification, resetPassword }) => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setToken(Router.router.query.token || '');
    setEmail(Router.router.query.email || '');
  }, []);

  const submit = (e) => {
    e.preventDefault();

    setEmailError('');
    setPasswordError('');

    addNotification({ type: NOTIFICATION_TYPES.INFO, message: 'Password reset is disabled' });
    /*
    resetPassword(token, email, password, passwordConfirm)
      .then(() => {
        Router.push('/dashboard');
      })
      .catch(({ error : { response } }) => {
        if (response) {
          if (response.data.errors) {
            response.data.errors.credentials && addNotification({
              type: NOTIFICATION_TYPES.ERROR,
              message: response.data.errors.credentials
            });
            response.data.errors.email && setEmailError(response.data.errors.email[0]);
            response.data.errors.password && setPasswordError(response.data.errors.password[0]);
          }

        } else {
          addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Connection error' });
        }
      });
      */
  };

  return(
    <Fragment>
      <Head title={'Reset Password'}/>
      <Container>
        <FormContainer>
          <form method="POST" className="flex-grow-1">
            <Logo href="/">
              <img src="/images/80bots.svg" alt=""/>
            </Logo>
            <h4 className="text-center">Reset Password</h4>

            <Input label={'Email'} type="email" onChange={e => setEmail(e.target.value)}
              value={email} required autoFocus styles={inputStyles} error={emailError}/>

            <Input label={'Password'} type="password" onChange={e => setPassword(e.target.value)}
              value={password} required styles={inputStyles} error={passwordError}/>

            <Input label={'Confirm Password'} type="password" onChange={e => setPasswordConfirm(e.target.value)}
              value={passwordConfirm} required styles={inputStyles}/>

            <button type="submit" onClick={submit} className="btn btn-primary btn-block text-uppercase mb-3">
              Reset Password
            </button>
          </form>
        </FormContainer>
        <ResetWrap>
          <h5 className="text-white mb-0">
            Already a member?&nbsp;
            <Link href={'/login'}>
              <a href="#" className="text-white font-weight-bold">Sign In</a>
            </Link>
          </h5>
        </ResetWrap>
      </Container>
    </Fragment>
  );
};

Reset.propTypes = {
  addNotification: PropTypes.func.isRequired,
  resetPassword: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  resetPassword: (token, email, password, passwordConfirm) => dispatch(resetPassword(token, email, password, passwordConfirm)),
  addNotification: payload => dispatch(addNotification(payload)),
});

export default connect(null, mapDispatchToProps)(Reset);
