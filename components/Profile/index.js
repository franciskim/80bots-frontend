import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTimeZones } from 'store/user/actions';

const Profile = ({ user, getTimeZones }) => {
  useEffect(() => { getTimeZones(); }, []);

  return(
    <Fragment>
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
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <form method="post">
                <div className="form-group">
                  <label htmlFor="">Timezone</label>
                  <select name="timezone" className="form-control">
                    <option value="">Timezone</option>
                  </select>
                </div>
                <div className="form-group">
                  <button className="btn btn-primary">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  getTimeZones: PropTypes.func.isRequired,
  timeZones: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user,
  timeZones: state.user.timeZones
});

const mapDispatchToProps = dispatch => ({
  getTimeZones: () => dispatch(getTimeZones())
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);