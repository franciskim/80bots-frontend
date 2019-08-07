import React, { Fragment, useState } from 'react';
import Head from 'components/default/layout/components/Head';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { register } from 'store/auth/actions';
import Router from 'next/router';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

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

const Register = ({ register }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const submit = (e) => {
    e.preventDefault();
    register(email, password).then(Router.push('/dashboard'));
  };

  return(
    <Fragment>
      <Head title={'Sign Up'}/>
      <Container>
        <FormContainer>
          <form method="POST" className="flex-grow-1">
            <Logo href="/">
              <img src="/static/images/80bots.svg" alt=""/>
            </Logo>
            <h4 className="text-center">Sign Up</h4>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" className="form-control" onChange={e => setEmail(e.target.value)}
                value={email} required autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" name="password"
                value={password} required onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Confirm Password</label>
              <input type="password" className="form-control" name="passwordConfirm"
                value={passwordConfirm} required onChange={e => setPasswordConfirm(e.target.value)}
              />
            </div>

            <button type="submit" onClick={submit} className="btn btn-primary btn-block text-uppercase mb-3">
              Sign Up
            </button>
          </form>
        </FormContainer>
        <SignUpWrap>
          <h5 className="text-white mb-0">
            Already a member?&nbsp;
            <Link href={'/login'}>
              <a href="#" className="text-white font-weight-bold">Sign In</a>
            </Link>
          </h5>
        </SignUpWrap>
      </Container>
    </Fragment>
  );
};

Register.propTypes = {
  register: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  register: (email, password) => dispatch(register(email, password))
});

export default connect(null, mapDispatchToProps)(Register);