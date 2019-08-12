import App, { Container } from 'next/app';
import React from 'react';
import withReduxStore from '../lib/connectRedux';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'emotion-theming';
import { theme, globalStyles } from '../config';
import { Global } from '@emotion/core';
import Notification from '../components/default/Notification';
import 'bootstrap/dist/css/bootstrap.min.css';

class MyApp extends App {
  render () {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Container>
        <Provider store={reduxStore}>
          <ThemeProvider theme={theme}>
            <Global styles={globalStyles}/>
            <Notification/>
            <Component {...pageProps} />
          </ThemeProvider>
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(MyApp);
