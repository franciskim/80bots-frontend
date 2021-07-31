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
/*eslint-disable*/
import React from 'react'
import Link from 'next/link'
// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardBody,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from 'reactstrap'
// core components
import IndexNavbar from 'components/Navbars/IndexNavbar.js'
import IndexHeader from 'components/Headers/IndexHeader.js'
import AuthFooter from 'components/Footers/AuthFooter.js'

function Index() {
  return (
    <>
      <IndexNavbar />
      <div className="main-content">
        <IndexHeader />
        <section className="py-6 pb-9 bg-default">
          <Container fluid>
            <Row className="justify-content-center text-center">
              <Col md="6">
                <h2 className="display-3 text-white">
                  A complete React and NextJS solution
                </h2>
                <p className="lead text-white">
                  Argon is a completly new product built on our newest re-built
                  from scratch framework structure that is meant to make our
                  products more intuitive, more adaptive and, needless to say,
                  so much easier to customize. Let Argon amaze you with its cool
                  features and build tools and get your project to a whole new
                  level.
                </p>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="section section-lg pt-lg-0 mt--7">
          <Container>
            <Row className="justify-content-center">
              <Col lg="12">
                <Row>
                  <Col lg="4">
                    <Card className="card-lift--hover shadow border-0">
                      <CardBody className="py-5">
                        <div className="icon icon-shape bg-gradient-info text-white rounded-circle mb-4">
                          <i className="ni ni-check-bold" />
                        </div>
                        <h4 className="h3 text-info text-uppercase">
                          Based on React, NextJS and Reactstrap
                        </h4>
                        <p className="description mt-3">
                          Argon is built on top of the most popular open source
                          toolkit for developing with HTML, CSS, and JS.
                        </p>
                        <div>
                          <Badge color="info" pill>
                            react
                          </Badge>
                          <Badge color="info" pill>
                            reactstrap
                          </Badge>
                          <Badge color="info" pill>
                            dashboard
                          </Badge>
                          <Badge color="info" pill>
                            template
                          </Badge>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg="4">
                    <Card className="card-lift--hover shadow border-0">
                      <CardBody className="py-5">
                        <div className="icon icon-shape bg-gradient-success text-white rounded-circle mb-4">
                          <i className="ni ni-istanbul" />
                        </div>
                        <h4 className="h3 text-success text-uppercase">
                          Integrated build tools
                        </h4>
                        <p className="description mt-3">
                          Use Argons's included npm scripts to compile source
                          code, scss and more with just a few simple commands.
                        </p>
                        <div>
                          <Badge color="success" pill>
                            npm
                          </Badge>
                          <Badge color="success" pill>
                            build tools
                          </Badge>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg="4">
                    <Card className="card-lift--hover shadow border-0">
                      <CardBody className="py-5">
                        <div className="icon icon-shape bg-gradient-warning text-white rounded-circle mb-4">
                          <i className="ni ni-planet" />
                        </div>
                        <h4 className="h3 text-warning text-uppercase">
                          Full Sass support
                        </h4>
                        <p className="description mt-3">
                          Argon makes customization easier than ever before. You
                          get all the tools to make your website building
                          process a breeze.
                        </p>
                        <div>
                          <Badge color="warning" pill>
                            sass
                          </Badge>
                          <Badge color="warning" pill>
                            design
                          </Badge>
                          <Badge color="warning" pill>
                            customize
                          </Badge>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="py-6">
          <Container>
            <Row className="row-grid align-items-center">
              <Col className="order-md-2" md="6">
                <img
                  alt="..."
                  className="img-fluid"
                  src={require('assets/img/theme/landing-1.png')}
                />
              </Col>
              <Col className="order-md-1" md="6">
                <div className="pr-md-5">
                  <h1>Awesome features</h1>
                  <p>
                    The kit comes with three pre-built pages to help you get
                    started faster. You can change the text and images and
                    you're good to go.
                  </p>
                  <ul className="list-unstyled mt-5">
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <Badge className="badge-circle mr-3" color="success">
                            <i className="ni ni-settings-gear-65" />
                          </Badge>
                        </div>
                        <div>
                          <h4 className="mb-0">Carefully crafted components</h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <Badge className="badge-circle mr-3" color="success">
                            <i className="ni ni-html5" />
                          </Badge>
                        </div>
                        <div>
                          <h4 className="mb-0">Amazing page examples</h4>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <Badge className="badge-circle mr-3" color="success">
                            <i className="ni ni-satisfied" />
                          </Badge>
                        </div>
                        <div>
                          <h4 className="mb-0">Super friendly support team</h4>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="py-7 section-nucleo-icons bg-white overflow-hidden">
          <Container>
            <Row className="justify-content-center">
              <Col className="text-center" lg="8">
                <h2 className="display-3">Nucleo Icons</h2>
                <p className="lead">
                  The official package contains over 21.000 icons which are
                  looking great in combination with Argon Design System. Make
                  sure you check all of them and use those that you like the
                  most.
                </p>
                <div className="btn-wrapper">
                  <Button
                    color="info"
                    href="https://www.creative-tim.com/learning-lab/nextjs/icons/argon-dashboard?ref=njsadp-index-page"
                    target="_blank"
                  >
                    View demo icons
                  </Button>
                  <Button
                    className="mt-3 mt-md-0"
                    color="default"
                    href="https://nucleoapp.com/?ref=1712"
                    target="_blank"
                  >
                    View all icons
                  </Button>
                </div>
              </Col>
            </Row>
            <div className="blur--hover">
              <a
                href="https://www.creative-tim.com/learning-lab/nextjs/icons/argon-dashboard?ref=njsadp-index-page"
                target="_blank"
              >
                <div className="icons-container blur-item mt-5">
                  <i className="icon ni ni-diamond" />

                  <i className="icon icon-sm ni ni-album-2" />
                  <i className="icon icon-sm ni ni-app" />
                  <i className="icon icon-sm ni ni-atom" />

                  <i className="icon ni ni-bag-17" />
                  <i className="icon ni ni-bell-55" />
                  <i className="icon ni ni-credit-card" />

                  <i className="icon icon-sm ni ni-briefcase-24" />
                  <i className="icon icon-sm ni ni-building" />
                  <i className="icon icon-sm ni ni-button-play" />

                  <i className="icon ni ni-calendar-grid-58" />
                  <i className="icon ni ni-camera-compact" />
                  <i className="icon ni ni-chart-bar-32" />
                </div>
                <span className="blur-hidden h5 text-success">
                  Eplore all the 21.000+ Nucleo Icons
                </span>
              </a>
            </div>
          </Container>
        </section>
      </div>
      <AuthFooter />
    </>
  )
}

export default Index
