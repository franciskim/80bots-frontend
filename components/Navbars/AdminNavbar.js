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
import React from 'react'
// nodejs library that concatenates classes
import classnames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import Router from 'next/router'
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  ListGroupItem,
  ListGroup,
  Media,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from 'reactstrap'
import { logout } from 'store/auth/actions'

const AdminNavbar = ({ theme, sidenavOpen, toggleSidenav }) => {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth.user)

  // function that on mobile devices makes the search open
  const openSearch = () => {
    document.body.classList.add('g-navbar-search-showing')
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-showing')
      document.body.classList.add('g-navbar-search-show')
    }, 150)
    setTimeout(function () {
      document.body.classList.add('g-navbar-search-shown')
    }, 300)
  }

  // function that on mobile devices makes the search close
  const closeSearch = () => {
    document.body.classList.remove('g-navbar-search-shown')
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-show')
      document.body.classList.add('g-navbar-search-hiding')
    }, 150)
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hiding')
      document.body.classList.add('g-navbar-search-hidden')
    }, 300)
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hidden')
    }, 500)
  }

  const onLogoutClick = (e) => {
    // e.preventDefault()
    dispatch(logout())
    Router.push('/')
  }

  return (
    <>
      <Navbar
        className={classnames(
          'navbar-top navbar-expand border-bottom',
          { 'navbar-dark bg-dark': theme === 'dark' },
          { 'navbar-light bg-secondary': theme === 'light' }
        )}
      >
        <Container fluid>
          <Collapse navbar isOpen={true}>
            <Form
              className={classnames(
                'navbar-search form-inline mr-sm-3',
                { 'navbar-search-light': theme === 'dark' },
                { 'navbar-search-dark': theme === 'light' }
              )}
            >
              <FormGroup className="mb-0">
                <InputGroup className="input-group-alternative input-group-merge">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-search" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Search" type="text" />
                </InputGroup>
              </FormGroup>
              <button
                aria-label="Close"
                className="close"
                type="button"
                onClick={closeSearch}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </Form>

            <Nav className="align-items-center ml-md-auto" navbar>
              <NavItem className="d-xl-none">
                <div
                  className={classnames(
                    'pr-3 sidenav-toggler',
                    { active: sidenavOpen },
                    { 'sidenav-toggler-dark': theme === 'dark' }
                  )}
                  onClick={toggleSidenav}
                >
                  <div className="sidenav-toggler-inner">
                    <i className="sidenav-toggler-line" />
                    <i className="sidenav-toggler-line" />
                    <i className="sidenav-toggler-line" />
                  </div>
                </div>
              </NavItem>
              <NavItem className="d-sm-none">
                <NavLink onClick={openSearch}>
                  <i className="ni ni-zoom-split-in" />
                </NavLink>
              </NavItem>
            </Nav>
            <Nav className="align-items-center ml-auto ml-md-0" navbar>
              <UncontrolledDropdown nav>
                {user && (
                  <DropdownToggle className="nav-link pr-0" color="" tag="a">
                    <Media className="align-items-center">
                      <i className="fas fa-user-circle"></i>
                      <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold">
                          {user.name}
                        </span>
                      </Media>
                    </Media>
                  </DropdownToggle>
                )}
                {!user && <span>...</span>}
                <DropdownMenu right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem
                    href="#pablo"
                    onClick={() => Router.push('profile')}
                  >
                    <i className="ni ni-single-02" />
                    <span>My profile</span>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem href="#pablo" onClick={onLogoutClick}>
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  )
}

AdminNavbar.defaultProps = {
  toggleSidenav: () => {},
  sidenavOpen: false,
  theme: 'dark',
}

AdminNavbar.propTypes = {
  toggleSidenav: PropTypes.func,
  sidenavOpen: PropTypes.bool,
  theme: PropTypes.oneOf(['dark', 'light']),
}

export default AdminNavbar
