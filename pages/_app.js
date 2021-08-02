import React from 'react'
import ReactDOM from 'react-dom'
import App from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import { Provider } from 'react-redux'
import ReduxToastr from 'react-redux-toastr'
import { PersistGate } from 'redux-persist/integration/react'

import PageChange from 'components/PageChange/PageChange.js'
import withReduxStore from '../lib/connectRedux'

// plugins styles from node_modules
import 'react-perfect-scrollbar/dist/css/styles.css'
import '@fullcalendar/common/main.min.css'
import '@fullcalendar/daygrid/main.min.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'select2/dist/css/select2.min.css'
import 'quill/dist/quill.core.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
// plugins styles downloaded
import 'assets/vendor/nucleo/css/nucleo.css'
// core styles
import 'assets/scss/nextjs-argon-dashboard-pro.scss?v1.1.0'
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'

Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`)
  document.body.classList.add('body-page-transition')
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById('page-transition')
  )
})
Router.events.on('routeChangeComplete', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'))
  document.body.classList.remove('body-page-transition')
})
Router.events.on('routeChangeError', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'))
  document.body.classList.remove('body-page-transition')
})

class MyApp extends App {
  componentDidMount() {
    let comment = document.createComment(`

=========================================================
* * NextJS Argon Dashboard PRO v1.1.0 based on Argon Dashboard PRO React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-argon-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

`)
    document.insertBefore(comment, document.documentElement)
  }
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }
  render() {
    const { Component, pageProps, reduxStore } = this.props
    const Layout = Component.layout || (({ children }) => <>{children}</>)

    return (
      <Provider store={reduxStore}>
        <PersistGate persistor={reduxStore.__PERSISTOR} loading={null}>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <title>80bots Web RPA</title>
          </Head>
          <Layout>
            <Component {...pageProps} />
            <ReduxToastr
              // icon={<NotificationIcon />}
              timeOut={3000}
              newestOnTop={false}
              preventDuplicates
              position="top-center"
              getState={(state) => state.toastr} // This is the default
              transitionIn="fadeIn"
              transitionOut="fadeOut"
              progressBar
              closeOnToastrClick
              component={
                <div className="alert-text">
                  <span className="alert-title" data-notify="title">
                    Bootstrap Notify
                  </span>
                  <span data-notify="message">
                    Turning standard Bootstrap alerts into awesome notifications
                  </span>
                </div>
              }
            />
          </Layout>
        </PersistGate>
      </Provider>
    )
  }
}

export default withReduxStore(MyApp)
