import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import { Card, CardBody } from 'components/default/Card';
import { Table, Thead, Filters, LimitFilter, ListFilter, SearchFilter } from 'components/default/Table';
import Button from 'components/default/Button';
import Icon from 'components/default/icons';
import Select from 'react-select';
import { connect } from 'react-redux';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';
import {
  adminGetRunningBots, updateAdminRunningBot, downloadInstancePemFile, botInstanceUpdated
} from 'store/bot/actions';
import { addListener, removeAllListeners } from 'store/socket/actions';
import Paginator from 'components/default/Paginator';
import Loader from '../../default/Loader';

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

const selectStyles = {
  container: provided => ({
    ...provided,
    minWidth: '150px'
  })
};

const OPTIONS = [
  { value: 'pending', label: 'Pending', readOnly: true },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' } ,
  { value: 'terminated', label: 'Terminated' }
];

const FILTERS_LIST_OPTIONS = [
  { value: 'all', label: 'All Instances' },
  { value: 'my', label: 'My Instances' },
];

const RunningBots = ({
  theme,
  addNotification,
  adminGetRunningBots,
  downloadInstancePemFile,
  updateAdminRunningBot,
  botInstances,
  total,
  user,
  addListener,
  removeAllListeners,
  botInstanceUpdated
}) => {

  const [list, setFilterList] = useState('all');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    adminGetRunningBots({ page, limit, list });
    addListener(`running.${user.id}`, 'InstanceLaunched', event => {
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `Bot ${event.instance.bot_name} successfully launched`
      });
      botInstanceUpdated(event.instance);
    });
    return () => {
      removeAllListeners();
    };
  }, []);

  const downloadEventHandler = instance => {
    downloadInstancePemFile(instance.id).then(({ data }) => {
      const blob = new Blob([data], { type: 'application/x-pem-file' });
      const file = new File([blob], `${instance.instance_id}.pem`, {
        type: 'application/x-pem-file'
      });
      let a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = `${instance.instance_id}.pem`;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
      }, 0);
    }).catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Error occurred while downloading file' }));
  };

  const changeBotInstanceStatus = (option, id) => {
    updateAdminRunningBot(id, { status: option.value })
      .then(() => addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `Instance was successfully ${option.value}`
      }))
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Status update failed' }));
  };

  const Loading = <Loader type={'bubbles'} width={45} height={45} color={theme.colors.primary} />;

  const renderRow = (botInstance, idx) => <tr key={idx}>
    <td>{ botInstance.status !== 'pending' ? botInstance.launched_by : Loading }</td>
    <td>{ botInstance.status !== 'pending' ? botInstance.name : Loading }</td>
    <td>{ botInstance.status !== 'pending' ? botInstance.instance_id : Loading }</td>
    <td>{ botInstance.status !== 'pending' ? botInstance.uptime : Loading }</td>
    <td>{ botInstance.status !== 'pending' ? botInstance.ip : Loading }</td>
    <td>
      <Select options={OPTIONS} value={OPTIONS.find(item => item.value === botInstance.status)}
        onChange={option => changeBotInstanceStatus(option, botInstance.id)} styles={selectStyles}
        isOptionDisabled={ (option) => option.readOnly }
        isDisabled={botInstance.status === 'pending' || botInstance.status === 'terminated'}
      />
    </td>
    <td>{ botInstance.status !== 'pending' ? botInstance.launched_at : Loading }</td>
    <td>
      <IconButton type={'success'}
        onClick={() => downloadEventHandler(botInstance)}>
        <Icon name={'download'} color={'white'}/>
      </IconButton>
    </td>
  </tr>;

  return(
    <>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter
              onChange={({ value }) => {setLimit(value); adminGetRunningBots({ page, limit: value, list }); }}
            />
            <ListFilter options={FILTERS_LIST_OPTIONS}
              onChange={({ value }) => {setFilterList(value); adminGetRunningBots({ page, limit, list: value }); }}
            />
            <SearchFilter onChange={console.log}/>
          </Filters>
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
              { botInstances.map(renderRow) }
            </tbody>
          </Table>
          <Paginator total={total} pageSize={limit} onChangePage={(page) => { setPage(page); adminGetRunningBots({ page, limit, list }); }}/>
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
  adminGetRunningBots: PropTypes.func.isRequired,
  downloadInstancePemFile: PropTypes.func.isRequired,
  updateAdminRunningBot: PropTypes.func.isRequired,
  addListener: PropTypes.func.isRequired,
  removeAllListeners: PropTypes.func.isRequired,
  botInstanceUpdated: PropTypes.func.isRequired,
  botInstances: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  botInstances: state.bot.botInstances,
  total: state.bot.total,
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload)),
  adminGetRunningBots: query => dispatch(adminGetRunningBots(query)),
  downloadInstancePemFile: id => dispatch(downloadInstancePemFile(id)),
  updateAdminRunningBot: (id, data) => dispatch(updateAdminRunningBot(id, data)),
  addListener: (room, eventName, handler) => dispatch(addListener(room, eventName, handler)),
  removeAllListeners: () => dispatch(removeAllListeners()),
  botInstanceUpdated: (botInstance) => dispatch(botInstanceUpdated(botInstance)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(RunningBots));