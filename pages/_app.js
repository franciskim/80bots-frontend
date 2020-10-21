import App from 'next/app';
import React from 'react';
import withReduxStore from '../lib/connectRedux';
import Notification from '../components/default/Notification';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'emotion-theming';
import { theme, globalStyles } from '../config';
import { Global } from '@emotion/core';
import '../public/styles.css';

class MyApp extends App {
  render () {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Provider store={reduxStore}>
        <ThemeProvider theme={theme}>
          <Global styles={globalStyles}/>
          <Notification/>
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    );
  }
}

export default withReduxStore(MyApp);
