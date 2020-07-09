import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import Select from "react-select";
import Button from "../default/Button";
import { Input } from "/components/default/inputs";
import ClockBlock from "/components/default/ClockBlock";
import { connect } from "react-redux";
import { addNotification } from "/store/notification/actions";
import { NOTIFICATION_TYPES } from "/config";
import {
  getTimezones,
  getRegions
} from "/store/user/actions";

import {
  updateUserProfile,
} from "/store/auth/actions";
import {css} from "@emotion/core";

const Block = styled.div`
  border: 1px solid #fff; 
  display: flex;
  flex-direction: column;
  margin: 20px 0 10px 0;
`;

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  padding: 15px;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 5px;
  color: #7dffff;
`;

const TextLabel = styled.label`
  font-size: 16px;
  margin-bottom: 5px;
  color: #fff;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 15px;
`;

const inputStyles = {
  container: css`
    color: #fff;
    font-size: 16px;
    &:first-of-type {
      margin-right: 10px;
    }
    &:last-of-type {
      margin-left: 10px;
    }
  `
};

const clockStyle = {
  color: '#7dffff',
  fontSize: '16px',
};

const currClockStyle = {
  color: '#7CFC00',
  fontSize: '16px',
};

const Profile = ({
  user,
  getTimezones,
  getRegions,
  updateUser,
  addNotification,
  timezones,
  regions
}) => {
  const [timezone, setTimezone] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    getTimezones();
    getRegions();
  }, []);

  useEffect(() => {
    if (!timezone && timezones.length > 0) {
      const defaultValue = timezones.find(
        item => item.timezone === user.timezone
      );
      setTimezone({ value: defaultValue.id, label: defaultValue.value });
    }
  }, [timezones]);

  useEffect(() => {
    if (!region && regions.length > 0) {
      const defaultValue = regions.find(item => item.name === user.region);
      setRegion({ value: defaultValue.id, label: defaultValue.name });
    }
  }, [regions]);

  const updateTimezone = () => {
    updateUser({ timezone_id: timezone.value }).then(() => {
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `Timezone was successfully set to ${timezone.label}`
      });
    });
  };

  const updateRegion = () => {
    updateUser({ region_id: region.value }).then(() => {
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `Region was successfully set to ${region.label}`
      });
    });
  };

  return (
    <>
      <Block>
        <Row>
          <Label>User Profile</Label>
        </Row>
        <Row>
          <Input
            type={"text"}
            label={"Email"}
            value={user.email}
            styles={inputStyles}
            readOnly
          />
        </Row>
      </Block>
      <br />
      <Block>
        <Row>
          <Label>My Timezone</Label>
        </Row>
        <Row>
          <TextLabel>Current Time: </TextLabel>
          <ClockBlock
            style={currClockStyle}
            useTimezone={null}
            format={' dddd Do, MMMM Mo, YYYY, h:mm:ss A'}
          />
        </Row>
        <Row>
          <TextLabel>Platform Time: </TextLabel>
          <ClockBlock
            style={clockStyle}
            useTimezone={user.timezone}
            format={' dddd Do, MMMM Mo, YYYY, h:mm:ss A'}
          />
        </Row>
        <Row>
          <Container>
            <Select
              options={timezones.map(item => ({
                value: item.id,
                label: item.value
              }))}
              onChange={option => setTimezone(option)}
              value={timezone}
            />
            <ButtonContainer>
              <Button type={"primary"} onClick={updateTimezone}>
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
              options={regions.map(item => ({
                value: item.id,
                label: item.name
              }))}
              onChange={option => setRegion(option)}
              value={region}
            />
            <ButtonContainer>
              <Button type={"primary"} onClick={updateRegion}>
                Update
              </Button>
            </ButtonContainer>
          </Container>
        </Row>
      </Block>
    </>
  );
};

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  getTimezones: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  getRegions: PropTypes.func.isRequired,
  timezones: PropTypes.array.isRequired,
  regions: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user,
  timezones: state.user.timezones,
  regions: state.user.regions
});

const mapDispatchToProps = dispatch => ({
  getTimezones: () => dispatch(getTimezones()),
  updateUser: updateData => dispatch(updateUserProfile(updateData)),
  addNotification: payload => dispatch(addNotification(payload)),
  getRegions: () => dispatch(getRegions())
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
