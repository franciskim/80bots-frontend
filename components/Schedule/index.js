import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import { Card, CardBody } from '../default/Card';
import { Table, Thead } from '../default/Table';
import Button from '../default/Button';
import Icon from '../default/icons';
import Select from 'react-select';
import Modal from '../default/Modal';
import { addNotification } from 'store/notification/actions';
import { connect } from 'react-redux';
import { NOTIFICATION_TYPES } from 'config';
import Paginator from '../default/Paginator';

const TEMP_SCHEDULES = [
  { instance_id: 'asd123123', bot_name: 'Name 1', status: 'active' },
  { instance_id: 'asd123112e3123', bot_name: 'Name 2', status: 'inactive' },
  { instance_id: 'asd1adsa23123', bot_name: 'Name 3', status: 'active' },
  { instance_id: 'asdadsd123123', bot_name: 'Name 4', status: 'inactive' },
];

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

const OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const BotsSchedule = ({ theme, addNotification }) => {
  const [clickedSchedule, setClickedSchedule] = useState(null);
  const modal = useRef(null);

  const changeScheduleStatus = option => {
    const status = option.value === 'active' ? 'activated' : 'deactivated';
    addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: `Schedule was successfully ${status}!` });
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
        onChange={changeScheduleStatus}
      />
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
          <Table>
            <Thead>
              <tr>
                <th>Instance Id</th>
                <th>Bot Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </Thead>
            <tbody>
              { TEMP_SCHEDULES.map(renderRow) }
            </tbody>
          </Table>
          <Paginator total={22} onChangePage={console.log}/>
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
  addNotification: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload))
});

export default connect(null, mapDispatchToProps)(withTheme(BotsSchedule));