import React, { Fragment, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from 'store/auth/actions';
import { addNotification } from 'store/notification/actions';
import { notificationTypes } from 'config';
import Router from 'next/router';
import Link from 'next/link';
import Head from 'components/default/layout/Head';

const slideAnimation = keyframes`
  from {
    
  }
  to {
  
  }
`;

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

const SignUpWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.a`
  display: block;
  text-decoration: none;
  padding: 1rem 1.5rem;
`;

const Login = ({ login, addNotification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formVisible, toggle] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    login(email, password).then(() => {
      Router.push('/dashboard');
      addNotification({ type: notificationTypes.INFO, message: 'Success!' });
    });
  };

  const changeForms = () => {
    toggle(!formVisible);
  };

  return(
    <Fragment>
      <Head title={'Login'} />
      <Container>
        <FormContainer>
          <form method="POST" className="flex-grow-1" style={{ display: !formVisible ? 'block' : 'none' }}>
            <Link href={'/'}>
              <Logo href="/" className="sidebar-brand text-decoration-none">
                <img src="/static/images/80bots.svg" alt=""/>
              </Logo>
            </Link>
            <h4 className="text-center">Sign In</h4>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" className="form-control" onChange={e => setEmail(e.target.value)}
                value={email} required autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" className="form-control" name="password"
                value={password} required autoFocus onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" onClick={submit} className="btn btn-primary btn-block text-uppercase mb-3">
              Sign in
            </button>
            <div className="text-right">
              <a onClick={changeForms} href="#" className="text-dark text-decoration-none">Forgot Password?</a>
            </div>
          </form>
          <form className="flex-grow-1" method="post" style={{ display: formVisible ? 'block' : 'none' }}>
            <Link href={'/'}>
              <Logo href="/" className="sidebar-brand text-decoration-none">
                <img src="/static/images/80bots.svg" alt=""/>
              </Logo>
            </Link>
            <h4 className="text-primary text-center">Forgot password?</h4>
            <p className="text-center">Reset password link will be sent on email id</p>
            <div className="form-group">
              <label htmlFor="">Email</label>
              <input type="email" name="email" className="form-control"/>
            </div>
            <button type="submit" className="btn btn-primary btn-block text-uppercase mb-3">Send reset link</button>
            <div>
              <a onClick={changeForms} href="#" className="text-dark text-decoration-none">Back to Sign In</a>
            </div>
          </form>
        </FormContainer>
        <SignUpWrap>
          <h5 className="text-white mb-0">
            Not registered?&nbsp;
            <Link href={'/register'}>
              <a href="#" className="text-white font-weight-bold">Sign up</a>
            </Link>
          </h5>
        </SignUpWrap>
      </Container>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  login: (email, password) => dispatch(login(email, password)),
  addNotification: payload => dispatch(addNotification(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);