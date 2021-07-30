import React from 'react'
// nodejs library that concatenates classes
import { useSelector } from 'react-redux'
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  UncontrolledAlert,
} from 'reactstrap'
import Auth from 'layouts/Auth.js'
import AuthHeader from 'components/Headers/AuthHeader.js'
import LoginForm from 'components/LoginForm'

const Login = () => {
  const error = useSelector((state) => state.auth.error)

  return (
    <>
      <AuthHeader />
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className="bg-secondary border-0 mb-0">
              <CardHeader className="bg-transparent pb-3">Sign in</CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                {error && (
                  <UncontrolledAlert color="danger">
                    <i className="fa fa-exclamation" />
                    <span className="alert-text ml-1">{error.message}</span>
                  </UncontrolledAlert>
                )}
                <LoginForm />
              </CardBody>
            </Card>
            <Row className="mt-3">
              <Col xs="6">
                <a
                  className="text-light"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <small>Forgot password?</small>
                </a>
              </Col>
              <Col className="text-right" xs="6">
                <a
                  className="text-light"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <small>Create new account</small>
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

Login.layout = Auth

export default Login
