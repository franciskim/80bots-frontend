import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import Select from 'react-select'
// import { Input } from 'components/default/inputs'
import Clock from 'react-live-clock'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification } from 'store/notification/actions'
import { NOTIFICATION_TYPES } from 'config'
import { getTimezones, getRegions } from 'store/user/actions'
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardImg,
  FormGroup,
  Form,
  Input,
  ListGroupItem,
  ListGroup,
  Progress,
  Container,
  Row,
  Col,
} from 'reactstrap'
import { updateUserProfile } from 'store/auth/actions'

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
    if (!timezone && timezones.length > 0) {
      const defaultValue = timezones.find(
        (item) => item.timezone === user.timezone
      )
      setTimezone({ value: defaultValue.id, label: defaultValue.value })
    }
  }, [timezones])

  useEffect(() => {
    if (!region && regions.length > 0) {
      const defaultValue = regions.find((item) => item.name === user.region)
      setRegion({ value: defaultValue.id, label: defaultValue.name })
    }
  }, [regions])

  const updateTimezone = () => {
    updateUser({ timezone_id: timezone.value }).then(() => {
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `Timezone was successfully set to ${timezone.label}`,
      })
    })
  }

  const updateRegion = () => {
    updateUser({ region_id: region.value }).then(() => {
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `Region was successfully set to ${region.label}`,
      })
    })
  }

  return (
    <>
      <Row>
        <Col className="order-xl-1">
          <Card>
            <CardHeader>
              <Row className="align-items-center">
                <Col xs="8">
                  <h3 className="mb-0">Edit profile</h3>
                </Col>
                <Col className="text-right" xs="4">
                  <Button
                    color="primary"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Settings
                  </Button>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Form>
                <h6 className="heading-small text-muted mb-4">
                  User information
                </h6>
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
                          placeholder="jesse@example.com"
                          type="email"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <hr className="my-4" />
                <h6 className="heading-small text-muted mb-4">
                  Contact information
                </h6>
                <div className="pl-lg-4">
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Address
                        </label>
                        <Input
                          defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                          id="input-address"
                          placeholder="Home Address"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* <Block>
        <Row>
          <Label>User Profile</Label>
        </Row>
        <Row>
          <Input type={'text'} label={'Email'} value={user.email} readOnly />
        </Row>
      </Block>
      <br />
      <Block>
        <Row>
          <Label>My Timezone</Label>
        </Row>
        <Row>
          <TextLabel>Your current time: </TextLabel>
          <Clock
            format={'dddd Do, MMMM Mo, YYYY, h:mm:ss A'}
            timezone={null}
            style={currClockStyle}
            ticking={true}
          />
        </Row>
        <Row>
          <TextLabel>Current platform time: </TextLabel>
          <Clock
            format={'dddd Do, MMMM Mo, YYYY, h:mm:ss A'}
            timezone={user.timezone}
            style={clockStyle}
            ticking={true}
          />
        </Row>
        <Row>
          <Container>
            <Select
              options={timezones.map((item) => ({
                value: item.id,
                label: item.value,
              }))}
              styles={selectStyles}
              onChange={(option) => setTimezone(option)}
              value={timezone}
            />
            <ButtonContainer>
              <Button type={'primary'} onClick={updateTimezone}>
                Update
              </Button>
            </ButtonContainer>
          </Container>
        </Row>
      </Block>
      <br />
      <Block>
        <Row>
          <Label>Preferred Region</Label>
        </Row>
        <Row>
          <Container>
            <Select
              options={regions.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              styles={selectStyles}
              onChange={(option) => setRegion(option)}
              value={region}
            />
            <ButtonContainer>
              <Button type={'primary'} onClick={updateRegion}>
                Update
              </Button>
            </ButtonContainer>
          </Container>
        </Row>
      </Block> */}
    </>
  )
}

// Profile.propTypes = {
//   user: PropTypes.object.isRequired,
//   getTimezones: PropTypes.func.isRequired,
//   updateUser: PropTypes.func.isRequired,
//   addNotification: PropTypes.func.isRequired,
//   getRegions: PropTypes.func.isRequired,
//   timezones: PropTypes.array.isRequired,
//   regions: PropTypes.array.isRequired,
// }

// const mapStateToProps = (state) => ({
//   user: state.auth.user,
//   timezones: state.user.timezones,
//   regions: state.user.regions,
// })

// const mapDispatchToProps = (dispatch) => ({
//   getTimezones: () => dispatch(getTimezones()),
//   updateUser: (updateData) => dispatch(updateUserProfile(updateData)),
//   addNotification: (payload) => dispatch(addNotification(payload)),
//   getRegions: () => dispatch(getRegions()),
// })

export default Profile
