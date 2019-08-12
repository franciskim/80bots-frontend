import React, { useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withTheme } from 'emotion-theming';
import { Card, CardBody } from '../default/Card';
import { Table, Thead } from '../default/Table';
import Button from '../default/Button';
import Icon from '../default/icons';
import Select from 'react-select';
import Modal from '../default/Modal';
import { connect } from 'react-redux';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';
import { getRunningBots } from 'store/bot/actions';
import Paginator from '../default/Paginator';

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

const modalStyles = css`
  min-width: 500px;
  overflow-y: visible;
`;

const selectStyles = {
  container: (provided) => ({
    ...provided,
    width: '100%'
  })
};

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

const Label = styled.label`
  font-size: 13px;
  margin-bottom: 5px;
`;

const OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' } ,
  { value: 'terminated', label: 'Terminated' }
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

const RunningBots = ({ theme, addNotification, getRunningBots, botInstances, paginate }) => {
  const modal = useRef(null);

  useEffect(() => {
    getRunningBots();
  }, []);

  const changeBotInstanceStatus = option => {
    addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: `Instance was successfully ${option.value}` });
  };

  const renderRow = (botInstance, idx) => <tr key={idx}>
    <td>{ botInstance.name }</td>
    <td>{ botInstance.credits_used }</td>
    <td>{ botInstance.ip }</td>
    <td>
      <Select options={OPTIONS} defaultValue={OPTIONS.find(item => item.value === botInstance.status)}
        onChange={changeBotInstanceStatus}
      />
    </td>
    <td>{ botInstance.launched_at }</td>
    <td>
      <IconButton type={'primary'}><Icon name={'eye'} color={theme.colors.white} /></IconButton>
      <IconButton type={'primary'} onClick={() => modal.current.open()}>
        <Icon name={'edit'} color={theme.colors.white} />
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
                <th>Name</th>
                <th>Credits Used</th>
                <th>IP</th>
                <th>Status</th>
                <th>Launched At</th>
                <th>Actions</th>
              </tr>
            </Thead>
            <tbody>
              { botInstances.map(renderRow) }
            </tbody>
          </Table>
          <Paginator total={paginate.total} pageSize={1} onChangePage={getRunningBots}/>
        </CardBody>
      </Container>
      <Modal ref={modal} title={'Schedule Editor'} contentStyles={modalStyles} onClose={() => {}}>
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
      </Modal>
    </>
  );
};

RunningBots.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  getRunningBots: PropTypes.func.isRequired,
  botInstances: PropTypes.array.isRequired,
  paginate: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  botInstances: state.bot.botInstances,
  paginate: state.bot.paginate,
});

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload)),
  getRunningBots: (page) => dispatch(getRunningBots(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(RunningBots));