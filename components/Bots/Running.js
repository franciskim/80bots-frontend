import React, { useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Icon from '../default/icons';
import Select from 'react-select';
import Modal from '../default/Modal';
import Link from 'next/link';
import { connect } from 'react-redux';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';
import { botInstanceUpdated, getRunningBots, updateRunningBot, setBotLimit } from 'store/bot/actions';
import { addListener, removeAllListeners } from 'store/socket/actions';
import { Paginator, Loader, Button } from '../default';
import { withTheme } from 'emotion-theming';
import { Card, CardBody } from '../default/Card';
import { Table, Thead, Th, Filters, LimitFilter, SearchFilter } from '../default/Table';
import { css } from '@emotion/core';

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
  color: ${ props => props.theme.colors.clearBlue };
  cursor: pointer;
  &:hover {
    border-bottom: 1px solid ${ props => props.theme.colors.clearBlue };
  }
`;

const A = styled.a`
  color: inherit;
  text-decoration: none;
`;

const modalStyles = css`
  min-width: 500px;
  overflow-y: visible;
`;

const selectStyles = {
  container: provided => ({
    ...provided,
    minWidth: '90px'
  }),
  menuPortal: base => ({ ...base, zIndex: 5 }),
};

const OPTIONS = [
  { value: 'pending', label: 'Pending', readOnly: true },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' } ,
  { value: 'terminated', label: 'Terminated' }
];

const RunningBots = ({ theme, notify, getRunningBots, updateRunningBot, botInstances,
  total, user, addListener, removeAllListeners, botInstanceUpdated, setLimit, limit }) => {
  const [clickedBotInstance, setClickedBotInstance] = useState(null);
  const [order, setOrder] = useState({ value: '', field: '' });
  const [page, setPage] = useState(1);

  const modal = useRef(null);

  useEffect(() => {
    getRunningBots({ page, limit });
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
    return () => {
      removeAllListeners();
    };
  }, []);

  const changeBotInstanceStatus = (option, id) => {
    updateRunningBot(id, { status: option.value })
      .then(() => notify({
        type: NOTIFICATION_TYPES.INFO,
        message: `Enqueued status change: ${option.value}`
      }))
      .catch(() => notify({ type: NOTIFICATION_TYPES.ERROR, message: 'Status update failed' }));
  };

  const copyToClipboard = (bot) => {
    const text = process.env.NODE_ENV === 'development'
      ? `chmod 400 ${bot.instance_id}.pem && ssh -i ${bot.instance_id}.pem ubuntu@${bot.ip}`
      : bot.ip;
    navigator.clipboard.writeText(text)
      .then(() => notify({ type: NOTIFICATION_TYPES.INFO, message: 'Copied to clipboard' }));
  };

  const Loading = <Loader type={'bubbles'} width={45} height={45} color={theme.colors.primary} />;

  const renderRow = (botInstance, idx) => <Tr key={idx} disabled={botInstance.status === 'pending'}>
    <td>{ botInstance.region }</td>
    <td>{ botInstance.name }</td>
    <td>{ botInstance.credits_used }</td>
    <td>
      <Ip onClick={() => copyToClipboard(botInstance)}>{ botInstance.ip }</Ip>
    </td>
    <td>
      <Select options={OPTIONS} value={OPTIONS.find(item => item.value === botInstance.status)}
        onChange={option => changeBotInstanceStatus(option, botInstance.id)}
        isOptionDisabled={ (option) => option.readOnly }
        isDisabled={botInstance.status === 'pending' || botInstance.status === 'terminated'}
        styles={selectStyles}
        menuPortalTarget={document.body} menuPosition={'absolute'} menuPlacement={'bottom'}
      />
    </td>
    <td>{ botInstance.launched_at }</td>
    <td>
      <IconButton title={'View Bot'} type={'primary'}>
        <Link href={'/bots/running/[id]'} as={`/bots/running/${botInstance.id}`}>
          <A><Icon name={'eye'} color={'white'}/></A>
        </Link>
      </IconButton>
      <IconButton type={'primary'} onClick={() => { setClickedBotInstance(botInstance); modal.current.open(); }}>
        <Icon name={'edit'} color={theme.colors.white} />
      </IconButton>
    </td>
    { botInstance.status === 'pending' && <Td colSpan={'9'}>{ Loading }</Td> }
  </Tr>;

  // eslint-disable-next-line react/prop-types
  const OrderTh = props => <Th {...props} order={props.children === order.field ? order.value : ''}
    onClick={(field, value) => setOrder({ field, value })}
  />;

  return(
    <>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter onChange={({ value }) => {setLimit(value); getRunningBots({ page, limit: value }); }}/>
            <SearchFilter onChange={console.log}/>
          </Filters>
          <Table>
            <Thead>
              <tr>
                <OrderTh>Region</OrderTh>
                <OrderTh>Name</OrderTh>
                <OrderTh>Credits Used</OrderTh>
                <OrderTh>IP</OrderTh>
                <OrderTh>Status</OrderTh>
                <OrderTh>Launched At</OrderTh>
                <th>Actions</th>
              </tr>
            </Thead>
            <tbody>
              { botInstances.map(renderRow) }
            </tbody>
          </Table>
          <Paginator total={total} pageSize={limit}
            onChangePage={(page) => { setPage(page); getRunningBots({ page, limit }); }}
          />
        </CardBody>
      </Container>
      <Modal ref={modal} title={'Edit Bot'} contentStyles={modalStyles} onClose={() => {}}>
        <span>Edit Bot here</span>
      </Modal>
    </>
  );
};

RunningBots.propTypes = {
  removeAllListeners: PropTypes.func.isRequired,
  botInstanceUpdated: PropTypes.func.isRequired,
  updateRunningBot:   PropTypes.func.isRequired,
  getRunningBots:     PropTypes.func.isRequired,
  botInstances:       PropTypes.array.isRequired,
  addListener:        PropTypes.func.isRequired,
  setLimit:           PropTypes.func.isRequired,
  notify:             PropTypes.func.isRequired,
  total:              PropTypes.number.isRequired,
  limit:              PropTypes.number.isRequired,
  user:               PropTypes.object,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
};

const mapStateToProps = state => ({
  botInstances: state.bot.botInstances,
  total: state.bot.total,
  user:  state.auth.user,
  limit: state.bot.limit
});

const mapDispatchToProps = dispatch => ({
  notify: payload => dispatch(addNotification(payload)),
  getRunningBots: query => dispatch(getRunningBots(query)),
  updateRunningBot: (id, data) => dispatch(updateRunningBot(id, data)),
  addListener: (room, eventName, handler) => dispatch(addListener(room, eventName, handler)),
  removeAllListeners: () => dispatch(removeAllListeners()),
  botInstanceUpdated: (botInstance) => dispatch(botInstanceUpdated(botInstance)),
  setLimit: limit => dispatch(setBotLimit(limit))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(RunningBots));
