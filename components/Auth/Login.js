import React, { Fragment, useState } from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import Router from "next/router";
import Link from "next/link";
import Head from "../default/layout/components/Head";
import { connect } from "react-redux";
import { login, reset } from "/store/auth/actions";
import { addNotification } from "/store/notification/actions";
import { NOTIFICATION_TYPES } from "/config";

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

const Login = ({ addNotification, login, reset }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formVisible, toggle] = useState(false);

  const submit = e => {
    e.preventDefault();
    login(email, password)
      .then(() => Router.push("/dashboard"))
      .catch(({ error: { response } }) => {
        if (response) {
          const { message } = response.data;
          addNotification({ type: NOTIFICATION_TYPES.ERROR, message });
        }
      });
  };

  const resetSubmit = e => {
    e.preventDefault();
    addNotification({
      type: NOTIFICATION_TYPES.INFO,
      message: "Password reset is disabled"
    });
    /*
    reset(email).then(() => {
      addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'A fresh verification link has been sent to your email address.' });
    } ).catch(({ error : { response } }) => {
      if (response) {
        const { errors: { email } } = response.data;
        addNotification({ type: NOTIFICATION_TYPES.ERROR, message: email[0] });
      }
    });
    */
  };

  const changeForms = () => {
    toggle(!formVisible);
  };

  return (
    <Fragment>
      <Head title={"Login"} />
      <Container>
        <FormContainer>
          <form
            method="POST"
            className="flex-grow-1"
            style={{ display: !formVisible ? "block" : "none" }}
          >
            <Link href={"/"}>
              <Logo href="/" className="sidebar-brand text-decoration-none">
                <object
                  type="image/svg+xml"
                  data="/images/80bots-logo.svg"
                  className={"logo"}
                />{" "}
              </Logo>
            </Link>
            <h4 className="text-center">Sign In</h4>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                autoComplete="username"
                type="email"
                className="form-control"
                onChange={e => setEmail(e.target.value)}
                value={email}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                name="password"
                autoComplete="current-password"
                value={password}
                required
                autoFocus
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              onClick={submit}
              className="btn btn-primary btn-block text-uppercase mb-3"
            >
              Sign in
            </button>
            <div className="text-right">
              <a
                onClick={changeForms}
                href="#"
                className="text-dark text-decoration-none"
              >
                Forgot Password?
              </a>
            </div>
          </form>
          <form
            className="flex-grow-1"
            method="post"
            style={{ display: formVisible ? "block" : "none" }}
          >
            <Link href={"/"}>
              <Logo href="/" className="sidebar-brand text-decoration-none">
                <object
                  type="image/svg+xml"
                  data="/images/80bots-logo.svg"
                  className={"logo"}
                />
              </Logo>
            </Link>
            <h4 className="text-primary text-center">Forgot password?</h4>
            <p className="text-center">
              Reset password link will be sent on email id
            </p>
            <div className="form-group">
              <label htmlFor="">Email</label>
              <input
                type="email"
                name="email"
                onChange={e => setEmail(e.target.value)}
                className="form-control"
                value={email}
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              onClick={resetSubmit}
              className="btn btn-primary btn-block text-uppercase mb-3"
            >
              Send reset link
            </button>
            <div>
              <a
                onClick={changeForms}
                href="#"
                className="text-dark text-decoration-none"
              >
                Back to Sign In
              </a>
            </div>
          </form>
        </FormContainer>
        <SignUpWrap>
          <h5 className="text-white mb-0">
            Not registered?&nbsp;
            <Link href={"/register"}>
              <a href="#" className="text-white font-weight-bold">
                Sign up
              </a>
            </Link>
          </h5>
        </SignUpWrap>
      </Container>
    </Fragment>
  );
};

Login.propTypes = {
  addNotification: PropTypes.func.isRequired,
  login: PropTypes.func,
  reset: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  login: (email, password) => dispatch(login(email, password)),
  reset: email => dispatch(reset(email)),
  addNotification: payload => dispatch(addNotification(payload))
});

export default connect(null, mapDispatchToProps)(Login);
