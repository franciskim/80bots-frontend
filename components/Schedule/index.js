import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import { Card, CardBody } from '../default/Card';
import {Filters, LimitFilter, Table, Thead} from '../default/Table';
import Button from '../default/Button';
import Badge from '../default/Badge';
import Icon from '../default/icons';
import Select from 'react-select';
import Modal from '../default/Modal';
import { addNotification } from 'store/notification/actions';
import { connect } from 'react-redux';
import { NOTIFICATION_TYPES } from 'config';
import Paginator from '../default/Paginator';
import { getSchedules, updateSchedule, changeStatus, deleteSchedule } from 'store/schedule/actions';
import moment from 'moment';
import {css} from '@emotion/core';

const Container = styled(Card)`
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const IconButton = styled(Button)`
  display: inline-flex;
  justify-content: center;
  padding: 2px;
  margin-right: 5px;
  width: 30px;
  height: 30px;
  &:last-child {
    margin-right: 0;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Tag = styled(Badge)`
  margin-right: .5rem;
  font-size: 14px;
  &:last-child {
    margin-right: 0;
  }
`;

const modalStyles = css`
  min-width: 500px;
  overflow-y: visible;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const SelectWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-right: 10px;
`;

const selectStyles = {
  container: (provided) => ({
    ...provided,
    width: '100%'
  })
};

const Label = styled.label`
  font-size: 13px;
  margin-bottom: 5px;
`;

const OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const TYPE_OPTIONS = [
  { value: 'stop', label: 'Stop' },
  { value: 'start', label: 'Start' }
];

const DAY_OPTIONS = moment.weekdays().map(day => ({ value: day, label: day }));

const TIME_OPTIONS = (() => {
  const startTime = moment('00:00', 'HH:mm');
  const endTime = moment('11:30', 'HH:mm');
  let timeStops = [];
  while(startTime <= endTime){
    let stop = new moment(startTime).format('HH:mm');
    timeStops.push({ value: stop, label: stop });
    startTime.add(30, 'minutes');
  }
  return timeStops;
})();

const BotsSchedule = ({ theme, addNotification, getSchedules, updateSchedule, changeStatus, deleteSchedule, schedules, total }) => {

  const [clickedSchedule, setClickedSchedule] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const modal = useRef(null);
  const modalScheduleDetails = useRef(null);

  useEffect(() => {
    getSchedules();
  }, []);

  const changeScheduleStatus = (option, id) => {
    const status = option.value === 'active' ? 'activated' : 'deactivated';
    changeStatus(id, option.value)
      .then(() => addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `Schedule was successfully ${status}!`
      }))
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Status update failed' }));
  };

  const toggleModal = schedule => {
    setClickedSchedule(schedule);
    modal.current.open();
  };

  const toggleEditModal = schedule => {
    setClickedSchedule(schedule);
    modalScheduleDetails.current.open();
  };

  const modalUpdateSchedule = () => {
    modalScheduleDetails.current.close();

    const timezone = '+03:00';
    const details = [
      {
        type: 'start',
        time: '6:00 PM',
        day: 'Friday'
      },
      {
        type: 'end',
        time: '8:00 PM',
        day: 'Friday'
      }
    ];

    updateSchedule(clickedSchedule.id, timezone, details)
      .then(() => addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Schedule was successfully updated' }))
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Update of schedule failed' }))
      .finally(() => setClickedSchedule(null));
  };

  const modalDeleteSchedule = () => {
    modal.current.close();
    deleteSchedule(clickedSchedule.id)
      .then(() => addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Schedule was successfully deleted' }))
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Removal of Schedule failed' }))
      .finally(() => setClickedSchedule(null));
  };

  const renderRow = (schedule, idx) => <tr key={idx}>
    <td>{ schedule.instance_id }</td>
    <td>{ schedule.bot_name }</td>
    <td>
      <Select options={OPTIONS} defaultValue={OPTIONS.find(item => item.value === schedule.status)}
        onChange={option => changeScheduleStatus(option, schedule.id)}
      />
    </td>
    <td>
      <ul>
        { schedule.details.map((detail, idx) => <li key={idx}><Tag pill type={'info'}>{ detail['day'] } { detail['selected_time'] } ({ detail['schedule_type'] })</Tag></li>) }
      </ul>
    </td>
    <td>
      <IconButton type={'primary'} onClick={() => toggleEditModal(schedule)}>
        <Icon name={'edit'} color={theme.colors.white} />
      </IconButton>
      <IconButton type={'danger'} onClick={() => toggleModal(schedule)}>
        <Icon name={'garbage'} color={theme.colors.white} />
      </IconButton>
    </td>
  </tr>;

  return(
    <>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter onChange={({ value }) => {setLimit(value); getSchedules({ page, limit: value }); }}/>
          </Filters>
          <Table>
            <Thead>
              <tr>
                <th>Instance Id</th>
                <th>Bot Name</th>
                <th>Status</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </Thead>
            <tbody>
              { schedules.map(renderRow) }
            </tbody>
          </Table>
          <Paginator total={total} pageSize={1} onChangePage={(page) => { setPage(page); getSchedules({ page, limit }); }}/>
        </CardBody>
      </Container>
      <Modal ref={modal} title={'Delete this schedule?'} onClose={() => setClickedSchedule(null)}>
        <Buttons>
          <Button type={'primary'} onClick={modalDeleteSchedule}>Yes</Button>
          <Button type={'danger'} onClick={() => modal.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>
      <Modal ref={modalScheduleDetails} title={'Schedule Editor'} contentStyles={modalStyles} onClose={() => setClickedSchedule(null)}>
        <SelectContainer>
          <SelectWrap>
            <Label>Type</Label>
            <Select options={TYPE_OPTIONS} styles={selectStyles}/>
          </SelectWrap>
          <SelectWrap>
            <Label>Day</Label>
            <Select options={DAY_OPTIONS} styles={selectStyles}/>
          </SelectWrap>
          <SelectWrap>
            <Label>Time</Label>
            <Select options={TIME_OPTIONS} styles={selectStyles}/>
          </SelectWrap>
        </SelectContainer>
        <Buttons>
          <Button type={'primary'} onClick={modalUpdateSchedule}>Yes</Button>
          <Button type={'danger'} onClick={() => modalScheduleDetails.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>
    </>
  );
};

BotsSchedule.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  getSchedules: PropTypes.func.isRequired,
  updateSchedule: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired,
  deleteSchedule: PropTypes.func.isRequired,
  schedules: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  schedules: state.schedule.schedules,
  total: state.schedule.total,
});

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload)),
  getSchedules: (page) => dispatch(getSchedules(page)),
  updateSchedule: (id, timezone, details) => dispatch(updateSchedule(id, timezone, details)),
  changeStatus: (id, status) => dispatch(changeStatus(id, status)),
  deleteSchedule: (id) => dispatch(deleteSchedule(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BotsSchedule));