import React, { Fragment, useState } from "react";
import Head from "/components/default/layout/components/Head";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import Link from "next/link";
import { css } from "@emotion/core";
import { connect } from "react-redux";
import { Input } from "../default/inputs";
import { addNotification } from "/store/notification/actions";
import { NOTIFICATION_TYPES } from "/config";
import { register } from "/store/auth/actions";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  background: #333;
  color: #fff;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: transparent;
  max-width: 400px;
  width: 100%;
  border: none;
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

const inputStyles = {
  container: css`
    margin-bottom: 20px;
  `
};

const Register = ({ addNotification, register }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const submit = e => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    addNotification({
      type: NOTIFICATION_TYPES.INFO,
      message: "Registration is temporary disabled"
    });
    /*    register(email, password, passwordConfirm)
      .then(() => {
        Router.push('/dashboard');
      })
      .catch(({ error : { response } }) => {
        if (response) {
          response.data.email && setEmailError(response.data.email[0]);
          response.data.password && setPasswordError(response.data.password[0]);
        } else {
          addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Connection error' });
        }
      });*/
  };

  return (
    <Fragment>
      <Head title={"Sign Up"} />
      <Container>
        <FormContainer>
          <form method="POST" className="flex-grow-1">
            <Link href={"/"}>
              <Logo
                href="/"
                className="sidebar-brand text-decoration-none"
                style={{
                  display: "inline-block",
                  position: "relative",
                  "z-index": "1",
                  width: "100%",
                  height: "51px",
                  "text-align": "center",
                  "margin-bottom": "100px"
                }}
              >
                <span
                  className={"pewpew"}
                  style={{
                    display: "inline-block",
                    width: "202px",
                    height: "51px"
                  }}
                >
                  <object
                    type="image/svg+xml"
                    data="/images/80bots-logo.svg"
                    className={"logo"}
                    style={{
                      position: "relative",
                      "z-index": "-1",
                      width: "202px",
                      height: "51px"
                    }}
                  />
                </span>
              </Logo>
            </Link>

            <h4 className="text-center">Sign Up</h4>

            <Input
              label={"Email"}
              type="email"
              onChange={e => setEmail(e.target.value)}
              value={email}
              required
              autoFocus
              styles={inputStyles}
              error={emailError}
            />

            <Input
              label={"Password"}
              type="password"
              onChange={e => setPassword(e.target.value)}
              value={password}
              required
              styles={inputStyles}
              error={passwordError}
            />

            <Input
              label={"Confirm Password"}
              type="password"
              onChange={e => setPasswordConfirm(e.target.value)}
              value={passwordConfirm}
              required
              styles={inputStyles}
            />

            <button
              type="submit"
              onClick={submit}
              className="btn btn-primary btn-block text-uppercase mb-3"
            >
              Sign Up
            </button>
          </form>
        </FormContainer>
        <SignUpWrap>
          <h5 className="text-white mb-0">
            Already a member?&nbsp;
            <Link href={"/login"}>
              <a href="#" className="text-white font-weight-bold">
                Sign In
              </a>
            </Link>
          </h5>
        </SignUpWrap>
      </Container>
    </Fragment>
  );
};

Register.propTypes = {
  addNotification: PropTypes.func.isRequired,
  register: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  register: (email, password, passwordConfirm) =>
    dispatch(register(email, password, passwordConfirm)),
  addNotification: payload => dispatch(addNotification(payload))
});

export default connect(null, mapDispatchToProps)(Register);
