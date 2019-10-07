import React from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';
import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: process.env.SENTRY_DSN, attachStacktrace: true, release: new Date().toDateString() });

const notifySentry = (err, req, statusCode, user) => {
  Sentry.configureScope((scope) => {
    if (err?.message) {
      scope.setFingerprint([err.message]);
    }
    if (!req) {
      scope.setTag('ssr', false);
    } else {
      scope.setTag('ssr', true);
      scope.setExtra('url', req.url);
      scope.setExtra('params', req.params);
      scope.setExtra('query', req.query);
      scope.setExtra('statusCode', statusCode);
      scope.setExtra('headers', req.headers);
    }
    if (user) {
      scope.setUser({ id: user.id, email: user.email });
    }
  });

  Sentry.captureException(err);
};

const ErrorPage = ({ statusCode }) => <Error statusCode={statusCode} />;

ErrorPage.getInitialProps = async ({ req, res, err, reduxStore }) => {
  let statusCode;
  if (res) {
    ({ statusCode } = res);
  } else if (err) {
    ({ statusCode } = err);
  } else {
    statusCode = null;
  }

  const user = reduxStore.getState().auth.user;

  notifySentry(err, req, statusCode, user);

  return { statusCode };
};

ErrorPage.propTypes = {
  statusCode: PropTypes.number
};

export default ErrorPage;
