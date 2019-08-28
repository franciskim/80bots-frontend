import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Button from '../default/Button';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';
import { connect } from 'react-redux';
import { getTimezones, updateUserProfile, getRegions } from 'store/user/actions';

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

const Profile = ({ user, getTimezones, getRegions, updateUser, addNotification, timezones, regions }) => {
  const [timezone, setTimezone] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    getTimezones();
    getRegions();
  }, []);

  useEffect(() => {
    if(!timezone && timezones.length > 0) {
      const defaultValue = timezones.find(item => item.timezone === user.timezone);
      setTimezone({ value: defaultValue.id, label: defaultValue.value });
    }
  }, [timezones]);

  useEffect(() => {
    if(!region && regions.length > 0) {
      const defaultValue = regions.find(item => item.name === user.region);
      setRegion({ value: defaultValue.id, label: defaultValue.name });
    }
  }, [regions]);

  const updateTimezone = () => {
    updateUser({ timezone_id: timezone.value })
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Timezone was successfully set to ${timezone.label}`
        });
      });
  };

  const updateRegion = () => {
    updateUser({ region_id: region.value })
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Region was successfully set to ${region.label}`
        });
      });
  };

  return(
    <>
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="mb-0">User Profile</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="form-group">
                <label htmlFor="">Email</label>
                <input type="text" name="email" className="form-control"
                  value={user.email} readOnly
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <label htmlFor="">Used Credits</label>
                <input type="text" name="credit_used" value={user.used_credits} readOnly className="form-control" />
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <label htmlFor="">Remaining Credits</label>
                <input type="text" name="remaining_credits" value={user.remaining_credits} readOnly
                  className="form-control"
                />
              </div>
            </div>
            { user.plan && <div className="col-md-12 col-sm-12">
              <div className="form-group">
                <label htmlFor="">Active Plan</label>
                <input type="text" name="plan" className="form-control" value={user.plan} readOnly />
              </div>
            </div>}
          </div>
        </div>
      </div>
      <br/>
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="mb-0">My Timezone</h5>
        </div>
        <div className="card-body">
          <Container>
            <Select options={timezones.map(item => ({ value: item.id, label: item.value }))}
              onChange={option => setTimezone(option)} value={timezone}
            />
            <ButtonContainer>
              <Button type={'primary'} onClick={updateTimezone}>Update</Button>
            </ButtonContainer>
          </Container>
        </div>
      </div>
      <br/>
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="mb-0">Preferred Region</h5>
        </div>
        <div className="card-body">
          <Container>
            <Select options={regions.map(item => ({ value: item.id, label: item.name }))}
              onChange={option => setRegion(option)} value={region}
            />
            <ButtonContainer>
              <Button type={'primary'} onClick={updateRegion}>Update</Button>
            </ButtonContainer>
          </Container>
        </div>
      </div>
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
