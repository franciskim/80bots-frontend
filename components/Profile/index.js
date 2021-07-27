import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import Clock from 'react-live-clock'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification } from 'lib/helper'
import { NOTIFICATION_TYPES } from 'config'
import { getTimezones, getRegions } from 'store/user/actions'
import {
  Label,
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from 'reactstrap'
import { updateUserProfile as updateUser } from 'store/auth/actions'

// const selectStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     border: 'solid 1px hsl(0,0%,80%)',
//     borderRadius: '4px',
//     color: '#fff',
//     backgroundColor: 'transparent',
//     '&:hover': {
//       borderColor: '#7dffff',
//     },
//   }),
//   singleValue: (provided, state) => ({
//     ...provided,
//     color: '#fff',
//   }),
//   menu: (provided, state) => ({
//     ...provided,
//     border: 'solid 1px hsl(0,0%,80%)',
//     borderRadius: '4px',
//     zIndex: '7',
//   }),
//   menuList: (provided, state) => ({
//     ...provided,
//     backgroundColor: '#333',
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     color: state.isFocused ? 'black' : '#fff',
//   }),
// }

const Profile = () => {
  const dispatch = useDispatch()
  const [timezone, setTimezone] = useState(null)
  const [region, setRegion] = useState(null)

  useEffect(() => {
    dispatch(getTimezones())
    dispatch(getRegions())
  }, [])

  const user = useSelector((state) => state.auth.user)
  const timezones = useSelector((state) => state.user.timezones)
  const regions = useSelector((state) => state.user.regions)

  useEffect(() => {
    if (user && !timezone && timezones.length > 0) {
      const defaultValue = timezones.find(
        (item) => item.timezone === user.timezone
      )
      setTimezone({ value: defaultValue.id, label: defaultValue.value })
    }
  }, [timezones])

  useEffect(() => {
    if (user && !region && regions.length > 0) {
      const defaultValue = regions.find((item) => item.name === user.region)
      setRegion({ value: defaultValue.id, label: defaultValue.name })
    }
  }, [regions])

  const updateTimezone = () => {
    dispatch(
      updateUser({ timezone_id: timezone.value }).then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Timezone was successfully set to ${timezone.label}`,
        })
      })
    )
  }

  const updateRegion = () => {
    dispatch(
      updateUser({ region_id: region.value }).then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Region was successfully set to ${region.label}`,
        })
      })
    )
  }

  return (
    <>
      <Row>
        <Col className="order-xl-1">
          <Card>
            <CardBody>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  User information
                </h6>
                {user && (
                  <>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              id="input-email"
                              type="email"
                              value={user.email}
                              readOnly
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="3">
                          <label>Your current time: </label>
                        </Col>
                        <Col md="9">
                          <Clock
                            format={'dddd Do, MMMM Mo, YYYY, h:mm:ss A'}
                            timezone={null}
                            // style={currClockStyle}
                            ticking={true}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="3">
                          <label>Current platform time: </label>
                        </Col>
                        <Col md="9">
                          <Clock
                            format={'dddd Do, MMMM Mo, YYYY, h:mm:ss A'}
                            timezone={user.timezone}
                            ticking={true}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={6}>
                          <FormGroup className="row">
                            <Label
                              className="form-control-label"
                              htmlFor="example-text-input"
                              md="3"
                            >
                              My Timezone
                            </Label>
                            <Col md="9">
                              <Select
                                options={timezones.map((item) => ({
                                  value: item.id,
                                  label: item.value,
                                }))}
                                onChange={(option) => setTimezone(option)}
                                value={timezone}
                              />
                              <Button
                                color={'primary'}
                                onClick={updateTimezone}
                              >
                                Update
                              </Button>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col lg={6}>
                          {' '}
                          <FormGroup className="row">
                            <Label
                              className="form-control-label"
                              htmlFor="example-text-input"
                              md="3"
                            >
                              Preferred Region
                            </Label>
                            <Col md={9}>
                              <Select
                                options={regions.map((item) => ({
                                  value: item.id,
                                  label: item.name,
                                }))}
                                // styles={selectStyles}
                                onChange={(option) => setRegion(option)}
                                value={region}
                              />
                              <Button color={'primary'} onClick={updateRegion}>
                                Update
                              </Button>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Profile
