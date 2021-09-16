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
import PropTypes from 'prop-types'
import { Breadcrumb, BreadcrumbItem, Container, Row, Col } from 'reactstrap'

const SimpleHeader = ({ name }) => {
  return (
    <div className="header header-dark bg-dark pb-6 content__title content__title--calendar">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-center py-4">
            <Col>
              <h6 className="h2 text-white d-inline-block mb-0">{name}</h6>{' '}
              <Breadcrumb
                className="d-none d-md-inline-block ml-lg-4"
                listClassName="breadcrumb-links breadcrumb-dark"
              >
                <BreadcrumbItem>
                  <a href="/bots/running#pablo">
                    <i className="fas fa-home" />
                  </a>
                </BreadcrumbItem>
                {/* <BreadcrumbItem>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    {parentName}
                  </a>
                </BreadcrumbItem>
                <BreadcrumbItem aria-current="page" className="active">
                  {name}
                </BreadcrumbItem> */}
              </Breadcrumb>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  )
}

SimpleHeader.propTypes = {
  name: PropTypes.string,
  parentName: PropTypes.string,
}

export default SimpleHeader
