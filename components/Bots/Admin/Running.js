import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import { Card, CardBody } from 'components/default/Card';
import { Table, Thead } from 'components/default/Table';
import Button from 'components/default/Button';
import Icon from 'components/default/icons';
import Select from 'react-select';
import { connect } from 'react-redux';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';
import { getRunningBots } from 'store/bot/actions';

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

const TEMP_BOT_INSTANCES = [
  {
    launched_by: 'user@asdas.asd',
    name: 'name 1',
    instance_id: '1sda',
    uptime: 1231,
    ip: '123.32.12.32',
    status: 'running',
    launch_time: new Date().toISOString(),
    pem: 'pem key path here'
  },
  {
    launched_by: 'user@asdas.asd',
    name: 'name 1',
    instance_id: '1sda',
    uptime: 1231,
    ip: '123.32.12.32',
    status: 'running',
    launch_time: new Date().toISOString(),
    pem: 'pem key path here'
  },
  {
    launched_by: 'user@asdas.asd',
    name: 'name 1',
    instance_id: '1sda',
    uptime: 1231,
    ip: '123.32.12.32',
    status: 'running',
    launch_time: new Date().toISOString(),
    pem: 'pem key path here'
  }
];

const RunningBots = ({ theme, addNotification, getRunningBots, botInstances }) => {
  useEffect(() => {
    //getRunningBots();
  }, []);

  const changeBotInstanceStatus = option => {
    addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: `Instance was successfully ${option.value}` });
  };

  const renderRow = (botInstance, idx) => <tr key={idx}>
    <td>{ botInstance.launched_by }</td>
    <td>{ botInstance.name }</td>
    <td>{ botInstance.instance_id }</td>
    <td>{ botInstance.uptime }</td>
    <td>{ botInstance.ip }</td>
    <td>
      <Select options={OPTIONS} defaultValue={OPTIONS.find(item => item.value === botInstance.status)}
        onChange={changeBotInstanceStatus}
      />
    </td>
    <td>{ botInstance.launch_time }</td>
    <td>{ botInstance.pem }</td>
  </tr>;

  return(
    <>
      <Container>
        <CardBody>
          <Table>
            <Thead>
              <tr>
                <th>Launched By</th>
                <th>Name</th>
                <th>Instance Id</th>
                <th>Uptime</th>
                <th>IP</th>
                <th>Status</th>
                <th>Launch Time</th>
                <th>Download PEM</th>
              </tr>
            </Thead>
            <tbody>
              { TEMP_BOT_INSTANCES.map(renderRow) }
            </tbody>
          </Table>
        </CardBody>
      </Container>
    </>
  );
};

RunningBots.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  getRunningBots: PropTypes.func.isRequired,
  botInstances: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  botInstances: state.bot.botInstances
});

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload)),
  getRunningBots: (page) => dispatch(getRunningBots(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(RunningBots));