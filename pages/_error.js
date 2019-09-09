import React from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';
import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: process.env.SENTRY_DSN });

const notifySentry = (err, req, statusCode) => {
  Sentry.configureScope((scope) => {
    if (!req) {
      scope.setTag('ssr', false);
    } else {
      scope.setTag('ssr', true);
      scope.setExtra('url', req.url);
      scope.setExtra('params', req.params);
      scope.setExtra('query', req.query);
      scope.setExtra('statusCode', statusCode);
      scope.setExtra('headers', req.headers);

      if (req.user) {
        scope.setUser({ id: req.user.id, email: req.user.email });
      }
    }
  });

  Sentry.captureException(err);
};

const ErrorPage = ({ statusCode }) => <Error statusCode={statusCode} />;

ErrorPage.getInitialProps = async ({ req, res, err }) => {
  let statusCode;
  if (res) {
    ({ statusCode } = res);
  } else if (err) {
    ({ statusCode } = err);
  } else {
    statusCode = null;
  }

  notifySentry(err, req, statusCode);

  return { statusCode };
};

ErrorPage.propTypes = {
  statusCode: PropTypes.number
};

export default ErrorPage;
