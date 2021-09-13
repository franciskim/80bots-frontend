import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import Clock from 'react-live-clock'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification } from 'lib/helpers'
import { NOTIFICATION_TYPES } from 'config'
import { getTimezones } from 'store/user/actions'
import {
  Label,
  Button,
  Card,
  CardBody,
  FormGroup,
  Input,
  Col,
  CardHeader,
  CardFooter,
} from 'reactstrap'
import { updateUserProfile as updateUser } from 'store/auth/actions'
import Skeleton from 'react-loading-skeleton'

const clockStyle = {
  color: '#7dffff',
  fontSize: '16px',
}

const currClockStyle = {
  color: '#7CFC00',
  fontSize: '16px',
}

const Profile = () => {
  const dispatch = useDispatch()
  const [timezone, setTimezone] = useState(null)

  useEffect(() => {
    dispatch(getTimezones())
  }, [])

  const user = useSelector((state) => state.auth.user)
  const timezones = useSelector((state) => state.user.timezones)

  useEffect(() => {
    if (user && user.timezone && timezones.length > 0) {
      const defaultValue = timezones.find(
        (item) => item.timezone === user.timezone
      )
      setTimezone({ value: defaultValue.id, label: defaultValue.value })
    }
  }, [timezones])

  const handleUpdate = () => {
    dispatch(updateUser({ timezone_id: timezone.value }))
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Settings were successfully saved`,
        })
      })
      .catch((err) => {
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: err.error.message,
        })
      })
  }

  return (
    <Card>
      <CardHeader>User information</CardHeader>
      <CardBody>
        <FormGroup className="row">
          <Label md={4} className="form-control-label" htmlFor="input-email">
            Email address
          </Label>
          <Col md={4}>
            {user && (
              <Input
                id="input-email"
                type="email"
                value={user.email}
                readOnly
              />
            )}
            {!user && <Skeleton count={1} />}
          </Col>
        </FormGroup>
        <FormGroup className="row">
          <Label md="4" className="form-control-label">
            Your current time:
          </Label>
          <Col md="4">
            <Clock
              format={'dddd Do, MMMM Mo, YYYY, h:mm:ss A'}
              timezone={null}
              style={currClockStyle}
              ticking={true}
            />
          </Col>
        </FormGroup>
        <FormGroup className="row">
          <Label md={4} className="form-control-label">
            Current platform time:
          </Label>
          <Col md="4">
            {user && (
              <Clock
                format={'dddd Do, MMMM Mo, YYYY, h:mm:ss A'}
                timezone={user.timezone}
                style={clockStyle}
                ticking={true}
              />
            )}
            {!user && <Skeleton count={1} />}
          </Col>
        </FormGroup>
        <FormGroup className="row">
          <Label
            className="form-control-label"
            htmlFor="example-text-input"
            md="4"
          >
            My Timezone
          </Label>
          <Col md="8">
            {user && (
              <Select
                options={timezones.map((item) => ({
                  value: item.id,
                  label: item.value,
                }))}
                onChange={(option) => setTimezone(option)}
                value={timezone}
              />
            )}
            {!user && <Skeleton count={1} />}
          </Col>
        </FormGroup>
      </CardBody>
      <CardFooter>
        <Button color={'primary'} onClick={handleUpdate}>
          Update
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Profile
