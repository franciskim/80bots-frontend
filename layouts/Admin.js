/*!

=========================================================
* NextJS Argon Dashboard PRO - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-argon-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from 'react'
import { withRouter } from 'next/router'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import AdminNavbar from 'components/Navbars/AdminNavbar.js'
import AdminFooter from 'components/Footers/AdminFooter.js'
import Sidebar from 'components/Sidebar/Sidebar.js'
import routes from 'routes.js'
import logoImage from 'assets/img/80bots-logo.svg'

function Admin({ router, children }) {
  const [sidenavOpen, setSidenavOpen] = useState(true)
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        // eslint-disable-next-line no-unused-vars
        return getRoutes(prop.views)
      }
      // if (prop.layout === '/admin') {
      return <Route path={prop.path} component={prop.component} key={key} />
      // } else {
      //   return null
      // }
    })
  }
  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (router.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name
      }
    }
    return 'Brand'
  }
  // toggles collapse between mini sidenav and normal
  const toggleSidenav = () => {
    if (document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-pinned')
      document.body.classList.add('g-sidenav-hidden')
    } else {
      document.body.classList.add('g-sidenav-pinned')
      document.body.classList.remove('g-sidenav-hidden')
    }
    setSidenavOpen(!sidenavOpen)
  }
  const getNavbarTheme = () => {
    return router.pathname.indexOf('admin/alternative-dashboard') === -1
      ? 'dark'
      : 'light'
  }

  return (
    <>
      <Sidebar
        routes={routes}
        toggleSidenav={toggleSidenav}
        sidenavOpen={sidenavOpen}
        logo={{
          innerLink: '/',
          imgSrc: logoImage,
          imgAlt: '80bots.com',
        }}
      />
      <div className="main-content">
        <AdminNavbar
          theme={getNavbarTheme()}
          toggleSidenav={toggleSidenav}
          sidenavOpen={sidenavOpen}
          brandText={getBrandText(router.pathname)}
        />
        {children}
        <AdminFooter />
      </div>
      {sidenavOpen ? (
        <div className="backdrop d-xl-none" onClick={toggleSidenav} />
      ) : null}
    </>
  )
}

Admin.propTypes = {
  router: PropTypes.object,
  children: PropTypes.array,
}

export default withRouter(Admin)
