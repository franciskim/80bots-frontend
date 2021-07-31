import React, { useState } from 'react'
import {
  Button,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  FormFeedback,
} from 'reactstrap'
import classnames from 'classnames'
import { useDispatch } from 'react-redux'
import Router from 'next/router'
import { NOTIFICATION_TYPES } from 'config'
import * as yup from 'yup'

import { login } from 'store/auth/actions'
import { addNotification } from 'lib/helpers'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [focusedEmail, setfocusedEmail] = React.useState(false)
  const [focusedPassword, setfocusedPassword] = React.useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const submitForm = (e) => {
    e.preventDefault()
    try {
      let schema = yup.object().shape({
        email: yup.string().required(),
        password: yup.string().required(),
      })
      schema.validateSync(
        {
          email,
          password,
        },
        {
          abortEarly: false,
        }
      )
    } catch (err) {
      setErrors(
        err.inner.reduce((accr, validationError) => {
          accr[validationError.path] = validationError.message
          return accr
        }, {})
      )
      return
    }

    dispatch(login(email, password))
      .then(() => {
        Router.push('/bots/running')
      })
      .catch(({ response }) => {
        if (response) {
          const { message } = response.data
          addNotification({ type: NOTIFICATION_TYPES.ERROR, message })
        }
      })
  }

  return (
    <Form role="form" noValidate>
      <FormGroup
        className={classnames('mb-3', {
          focused: focusedEmail,
        })}
      >
        <InputGroup className="input-group-merge input-group-alternative">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-email-83" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Email"
            type="email"
            onFocus={() => setfocusedEmail(true)}
            onBlur={() => setfocusedEmail(true)}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>
        <FormFeedback className={classnames({ 'd-block': !!errors['email'] })}>
          Please enter your email.
        </FormFeedback>
      </FormGroup>
      <FormGroup
        className={classnames({
          focused: focusedPassword,
        })}
      >
        <InputGroup className="input-group-merge input-group-alternative">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-lock-circle-open" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Password"
            type="password"
            onFocus={() => setfocusedPassword(true)}
            onBlur={() => setfocusedPassword(true)}
            onChange={(e) => setPassword(e.target.value)}
            invalid={true}
          />
        </InputGroup>
        <FormFeedback
          className={classnames({
            'd-block': !!errors['password'],
          })}
        >
          Please enter the password.
        </FormFeedback>
      </FormGroup>
      <div className="custom-control custom-control-alternative custom-checkbox">
        <input
          className="custom-control-input"
          id=" customCheckLogin"
          type="checkbox"
        />
        <label className="custom-control-label" htmlFor=" customCheckLogin">
          <span className="text-muted">Remember me</span>
        </label>
      </div>
      <div className="text-center">
        <Button
          className="my-4"
          color="info"
          type="button"
          onClick={submitForm}
        >
          Sign in
        </Button>
      </div>
    </Form>
  )
}

export default LoginForm
