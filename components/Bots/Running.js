import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import { Card, CardBody } from '../default/Card';
import { Table, Thead } from '../default/Table';
import Button from '../default/Button';
import Icon from '../default/icons';
import Select from 'react-select';
import { connect } from 'react-redux';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';

const TEMP_BOT_INSTANCES = [
  { name: 'Bot 1', credits_used: 2, ip: '129.123.32.23', status: 'running', launched_at: new Date().toDateString() },
  { name: 'Bot 2', credits_used: 21, ip: '129.123.32.23', status: 'stopped', launched_at: new Date().toDateString() },
  { name: 'Bot 3', credits_used: 0, ip: '129.123.32.23', status: 'terminated', launched_at: new Date().toDateString() },
  { name: 'Bot 4', credits_used: 223, ip: '129.123.32.23', status: 'stopped', launched_at: new Date().toDateString() },
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

const OPTIONS = [
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' } ,
  { value: 'terminated', label: 'Terminated' }
];

const RunningBots = ({ theme, addNotification }) => {
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
      <IconButton type={'primary'}><Icon name={'edit'} color={theme.colors.white} /></IconButton>
    </td>
  </tr>;

  return(
    <Fragment>
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
              { TEMP_BOT_INSTANCES.map(renderRow) }
            </tbody>
          </Table>
        </CardBody>
      </Container>
    </Fragment>
  );
};

RunningBots.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload))
});

export default connect(null, mapDispatchToProps)(withTheme(RunningBots));