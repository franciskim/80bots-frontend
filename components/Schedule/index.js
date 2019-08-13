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
import { getSchedules, changeStatus } from 'store/schedule/actions';

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

const OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const BotsSchedule = ({ theme, addNotification, getSchedules, changeStatus, schedules, total }) => {

  const [clickedSchedule, setClickedSchedule] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const modal = useRef(null);

  useEffect(() => {
    getSchedules();
  }, []);

  const changeScheduleStatus = (option, id) => {
    const status = option.value === 'active' ? 'activated' : 'deactivated';
    changeStatus(id, option.value)
      .then(() => addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `Schedule was successfully ${status}!`
      }));
  };

  const toggleModal = schedule => {
    setClickedSchedule(schedule);
    modal.current.open();
  };

  const deleteSchedule = () => {
    modal.current.close();
    setClickedSchedule(null);
    addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Schedule was successfully deleted' });
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
      <IconButton type={'primary'}><Icon name={'edit'} color={theme.colors.white} /></IconButton>
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
          <Button type={'primary'} onClick={deleteSchedule}>Yes</Button>
          <Button type={'danger'} onClick={() => modal.current.close()}>Cancel</Button>
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
  changeStatus: PropTypes.func.isRequired,
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
  changeStatus: (id, status) => dispatch(changeStatus(id, status))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BotsSchedule));