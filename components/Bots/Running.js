import React, { Fragment, useEffect } from 'react';
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

const OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' } ,
  { value: 'terminated', label: 'Terminated' }
];

const RunningBots = ({ theme, addNotification, getRunningBots, botInstances, paginate }) => {

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
              { botInstances.map(renderRow) }
            </tbody>
          </Table>
          <Paginator total={paginate.total} pageSize={1} onChangePage={getRunningBots}/>
        </CardBody>
      </Container>
    </Fragment>
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