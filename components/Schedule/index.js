import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import { Card, CardBody } from '../default/Card';
import { Filters, LimitFilter, Table, Thead } from '../default/Table';
import Button from '../default/Button';
import Badge from '../default/Badge';
import Icon from '../default/icons';
import Modal from '../default/Modal';
import { addNotification } from 'store/notification/actions';
import { connect } from 'react-redux';
import { NOTIFICATION_TYPES } from 'config';
import Paginator from '../default/Paginator';
import { getSchedules, updateSchedule, deleteSchedule } from 'store/schedule/actions';
import { css } from '@emotion/core';
import ScheduleEditor from '../default/ScheduleEditor';

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

const StatusButton = styled(Button)`
  text-transform: uppercase;
`;

const Tag = styled(Badge)`
  margin-right: .5rem;
  font-size: 14px;
  &:last-child {
    margin-right: 0;
  }
`;

const AddButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
`;

const modalStyles = css`
  min-width: 500px;
  overflow-y: visible;
`;

const BotsSchedule = ({ theme, addNotification, getSchedules, updateSchedule, changeStatus, deleteSchedule, schedules,
  total }) => {
  const [clickedSchedule, setClickedSchedule] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const modal = useRef(null);
  const addModal = useRef(null);
  const editModal = useRef(null);

  useEffect(() => {
    getSchedules({ page, limit });
  }, []);

  const changeScheduleStatus = schedule => {
    const statusName = schedule.status === 'active' ? 'deactivated' : 'activated';
    const status = schedule.status === 'active' ? 'inactive' : 'active';
    updateSchedule(schedule.id, {status})
      .then(() => addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `Schedule was successfully ${statusName}!`
      }))
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Status update failed' }));
  };

  const toggleModal = schedule => {
    setClickedSchedule(schedule);
    modal.current.open();
  };

  const toggleEditModal = schedule => {
    setClickedSchedule(schedule);
    editModal.current.open();
  };

  const modalUpdateSchedule = () => {
    editModal.current.close();

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

    updateSchedule(clickedSchedule.id, {timezone, details})
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
      <StatusButton type={schedule.status === 'active' ? 'success' : 'danger'} onClick={() => changeScheduleStatus(schedule)}>
        { schedule.status }
      </StatusButton>
    </td>
    <td>
      <ul>
        {
          schedule.details.map((detail, idx) => <li key={idx}>
            <Tag pill type={'info'}>{ detail['day'] } { detail['selected_time'] } ({ detail['schedule_type'] })</Tag>
          </li>)
        }
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
      <AddButtonWrap>
        <Button type={'primary'} onClick={() => addModal.current.open()}>Add schedule</Button>
      </AddButtonWrap>
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
          <Paginator total={total} pageSize={limit}
            onChangePage={(page) => { setPage(page); getSchedules({ page, limit }); }}
          />
        </CardBody>
      </Container>

      <Modal ref={modal} title={'Delete this schedule?'} onClose={() => setClickedSchedule(null)}>
        <Buttons>
          <Button type={'primary'} onClick={modalDeleteSchedule}>Yes</Button>
          <Button type={'danger'} onClick={() => modal.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>

      <Modal ref={addModal} title={'Schedule Editor'} contentStyles={modalStyles}
        onClose={() => setClickedSchedule(null)}
      >
        <ScheduleEditor schedules={clickedSchedule ? clickedSchedule.details : []}
          close={() => editModal.current.close()}
        />
      </Modal>

      <Modal ref={editModal} title={'Schedule Editor'} contentStyles={modalStyles}
        onClose={() => setClickedSchedule(null)}
      >
        <ScheduleEditor schedules={clickedSchedule ? clickedSchedule.details : []}
          close={() => editModal.current.close()}
        />
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
  getSchedules: query => dispatch(getSchedules(query)),
  updateSchedule: (id, data) => dispatch(updateSchedule(id, data)),
  deleteSchedule: (id) => dispatch(deleteSchedule(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BotsSchedule));