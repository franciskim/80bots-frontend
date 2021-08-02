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

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from 'reactstrap'

const AdminFooter = () => {
  return (
    <Container fluid>
      <footer className="footer pt-0">
        <Row className="align-items-center justify-content-lg-between">
          <Col lg="6">
            <div className="copyright text-center text-lg-left text-muted">
              © {new Date().getFullYear()}{' '}
              <a
                className="font-weight-bold ml-1"
                href="https://www.80bots.com"
                target="_blank"
                rel="noreferrer"
              >
                80bots.com
              </a>
            </div>
          </Col>
          <Col lg="6">
            <Nav className="nav-footer justify-content-center justify-content-lg-end">
              <NavItem>
                <NavLink href="https://www.80bots.com" target="_blank">
                  80bots.com
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="https://www.creative-tim.com/license?ref=adpr-admin-footer"
                  target="_blank"
                >
                  License
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
        </Row>
      </footer>
    </Container>
  )
}

export default AdminFooter
