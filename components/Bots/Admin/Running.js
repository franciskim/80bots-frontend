import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Icon from 'components/default/icons';
import Select from 'react-select';
import Link from 'next/link';
import { withTheme } from 'emotion-theming';
import { Card, CardBody } from 'components/default/Card';
import { Table, Thead, Filters, LimitFilter, ListFilter, SearchFilter } from 'components/default/Table';
import { connect } from 'react-redux';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';
import {
  adminGetRunningBots, updateAdminRunningBot, downloadInstancePemFile, botInstanceUpdated, syncBotInstances
} from 'store/bot/actions';
import { addListener, removeAllListeners } from 'store/socket/actions';
import { Paginator, Loader, Button } from 'components/default';

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

const Td = styled.td`
  position: absolute;
  left: 20px;
  width: calc(100% - 40px);
`;

const Tr = styled.tr`
  position: relative;
  background-color: ${ props => props.disabled ? 'rgba(221, 221, 221, .5)' : 'none' };
`;

const Ip = styled.span`
  color: ${props => props.theme.colors.clearBlue};
  cursor: pointer;
  &:hover {
    border-bottom: 1px solid ${props => props.theme.colors.clearBlue};
  }
`;

const AddButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
  button {
    &:last-child {
      margin-left: 20px;
    }
  }
`;

const A = styled.a`
  color: inherit;
  text-decoration: none; 
`;

const selectStyles = {
  container: provided => ({
    ...provided,
    minWidth: '150px'
  }),
  menuPortal: base => ({ ...base, zIndex: 5 }),
};

const OPTIONS = [
  {value: 'pending', label: 'Pending', readOnly: true},
  {value: 'running', label: 'Running'},
  {value: 'stopped', label: 'Stopped'},
  {value: 'terminated', label: 'Terminated'}
];

const FILTERS_LIST_OPTIONS = [
  {value: 'all', label: 'All Instances'},
  {value: 'my', label: 'My Instances'},
];

const RunningBots = ({
  theme, notify, adminGetRunningBots, downloadInstancePemFile, updateAdminRunningBot,
  botInstances, total, user, addListener, removeAllListeners, botInstanceUpdated, syncBotInstances, syncLoading
}) => {
  const [list, setFilterList] = useState('all');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    adminGetRunningBots({page, limit, list});
    addListener(`running.${user.id}`, 'InstanceLaunched', event => {
      if(event.instance) {
        const status = event.instance.status === 'running' ? 'launched' : event.instance.status;
        notify({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `Bot ${event.instance.bot_name} successfully ${status}`
        });
        botInstanceUpdated(event.instance);
      }
    });
    addListener(`bots.${user.id}`, 'BotsSyncSucceeded', () => {
      notify({type: NOTIFICATION_TYPES.SUCCESS, message: 'Sync completed'});
      adminGetRunningBots({page, limit, list});
    });
    return () => {
      removeAllListeners();
    };
  }, []);

  const downloadEventHandler = instance => {
    downloadInstancePemFile(instance.id).then(({data}) => {
      const blob = new Blob([data], {type: 'application/x-pem-file'});
      const file = new File([blob], `${instance.instance_id}.pem`, {
        type: 'application/x-pem-file'
      });
      let a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = `${instance.instance_id}.pem`;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
      }, 0);
    }).catch(() => notify({
      type: NOTIFICATION_TYPES.ERROR,
      message: 'Error occurred while downloading file'
    }));
  };

  const changeBotInstanceStatus = (option, id) => {
    updateAdminRunningBot(id, {status: option.value})
      .then(() => notify({
        type: NOTIFICATION_TYPES.INFO,
        message: `Enqueued status change: ${option.value}`
      }))
      .catch(() => notify({type: NOTIFICATION_TYPES.ERROR, message: 'Status update failed'}));
  };

  const syncWithAWS = () => {
    syncBotInstances()
      .then(() => notify({type: NOTIFICATION_TYPES.INFO, message: 'Sync sequence started'}))
      .catch(() => notify({type: NOTIFICATION_TYPES.ERROR, message: 'Can\'t start sync sequence'}));
  };

  const copyToClipboard = (bot) => {
    const text = process.env.NODE_ENV === 'development'
      ? `chmod 400 ${bot.instance_id}.pem && ssh -i ${bot.instance_id}.pem ubuntu@${bot.ip}`
      : bot.ip;
    navigator.clipboard.writeText(text)
      .then(() => notify({type: NOTIFICATION_TYPES.INFO, message: 'Copied to clipboard'}));
  };

  const Loading = <Loader type={'bubbles'} width={40} height={40} color={theme.colors.primary}/>;

  const renderRow = (botInstance, idx) => <Tr key={idx} disabled={botInstance.status === 'pending'}>
    <td>{botInstance.region}</td>
    <td>{botInstance.launched_by}</td>
    <td>{botInstance.name}</td>
    <td>{botInstance.bot_name}</td>
    <td>{botInstance.instance_id}</td>
    <td>{botInstance.uptime}&nbsp;min</td>
    <td>
      <Ip onClick={() => copyToClipboard(botInstance)}>
        { botInstance.ip }
      </Ip>
    </td>
    <td>
      <Select options={OPTIONS} value={OPTIONS.find(item => item.value === botInstance.status)}
        onChange={option => changeBotInstanceStatus(option, botInstance.id)} styles={selectStyles}
        isOptionDisabled={(option) => option.readOnly}
        isDisabled={botInstance.status === 'pending' || botInstance.status === 'terminated'}
        menuPortalTarget={document.body} menuPosition={'absolute'} menuPlacement={'bottom'}
      />
    </td>
    <td>{botInstance.launched_at}</td>
    <td>
      <IconButton title={'View Bot'} type={'primary'}>
        <Link href={'/admin/bots/running/[id]'} as={`/admin/bots/running/${botInstance.id}`}>
          <A><Icon name={'eye'} color={'white'}/></A>
        </Link>
      </IconButton>
      <IconButton title={'Download PEM'} type={'success'} onClick={() => downloadEventHandler(botInstance)}>
        <Icon name={'download'} color={'white'}/>
      </IconButton>
    </td>
    {botInstance.status === 'pending' && <Td colSpan={'9'}>{Loading}</Td>}
  </Tr>
    ;

  return (
    <>
      <AddButtonWrap>
        <Button type={'primary'} onClick={syncWithAWS} loading={`${syncLoading}`} loaderWidth={140}>
              Sync Bot Instances
        </Button>
      </AddButtonWrap>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter
              onChange={({value}) => {
                setLimit(value);
                adminGetRunningBots({page, limit: value, list});
              }}
            />
            <ListFilter options={FILTERS_LIST_OPTIONS}
              onChange={({value}) => {
                setFilterList(value);
                adminGetRunningBots({page, limit, list: value});
              }}
            />
            <SearchFilter onChange={console.log}/>
          </Filters>
          <Table>
            <Thead>
              <tr>
                <th>Region</th>
                <th>Launched By</th>
                <th>Name</th>
                <th>Script</th>
                <th>Instance Id</th>
                <th>Uptime</th>
                <th>IP</th>
                <th>Status</th>
                <th>Launch Time</th>
                <th>Actions</th>
              </tr>
            </Thead>
            <tbody>
              {botInstances.map(renderRow)}
            </tbody>
          </Table>
          <Paginator total={total} pageSize={limit}
            onChangePage={(page) => {
              setPage(page);
              adminGetRunningBots({page, limit, list});
            }}
          />
        </CardBody>
      </Container>
  </>
  );
};

RunningBots.propTypes = {
  notify:                  PropTypes.func.isRequired,
  adminGetRunningBots:     PropTypes.func.isRequired,
  downloadInstancePemFile: PropTypes.func.isRequired,
  updateAdminRunningBot:   PropTypes.func.isRequired,
  addListener:             PropTypes.func.isRequired,
  removeAllListeners:      PropTypes.func.isRequired,
  botInstanceUpdated:      PropTypes.func.isRequired,
  syncBotInstances:        PropTypes.func.isRequired,
  botInstances:            PropTypes.array.isRequired,
  total:                   PropTypes.number.isRequired,
  syncLoading:             PropTypes.bool.isRequired,
  user:                    PropTypes.object,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
};

const mapStateToProps = state => ({
  botInstances: state.bot.botInstances,
  total: state.bot.total,
  user: state.auth.user,
  syncLoading: state.bot.syncLoading
});

const mapDispatchToProps = dispatch => ({
  notify: payload => dispatch(addNotification(payload)),
  adminGetRunningBots: query => dispatch(adminGetRunningBots(query)),
  downloadInstancePemFile: id => dispatch(downloadInstancePemFile(id)),
  updateAdminRunningBot: (id, data) => dispatch(updateAdminRunningBot(id, data)),
  addListener: (room, eventName, handler) => dispatch(addListener(room, eventName, handler)),
  removeAllListeners: () => dispatch(removeAllListeners()),
  botInstanceUpdated: (botInstance) => dispatch(botInstanceUpdated(botInstance)),
  syncBotInstances: () => dispatch(syncBotInstances()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(RunningBots));
