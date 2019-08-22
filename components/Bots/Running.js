import React, { useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import { Card, CardBody } from '../default/Card';
import {Table, Thead, Filters, LimitFilter, SearchFilter} from '../default/Table';
import Button from '../default/Button';
import Icon from '../default/icons';
import Select from 'react-select';
import Modal from '../default/Modal';
import { connect } from 'react-redux';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';
import { botInstanceUpdated, getRunningBots, updateRunningBot } from 'store/bot/actions';
import { addListener, removeAllListeners } from 'store/socket/actions';
import Paginator from '../default/Paginator';
import Loader from '../default/Loader';

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
  container: provided => ({
    ...provided,
    minWidth: '90px'
  })
};

const OPTIONS = [
  { value: 'pending', label: 'Pending', readOnly: true },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' } ,
  { value: 'terminated', label: 'Terminated' }
];

const RunningBots = ({ theme, addNotification, getRunningBots, updateRunningBot, botInstances,
  total, user, addListener, removeAllListeners, botInstanceUpdated }) => {
  const [clickedBotInstance, setClickedBotInstance] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const modal = useRef(null);

  useEffect(() => {
    getRunningBots({ page, limit });
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

  const changeBotInstanceStatus = (option, id) => {
    updateRunningBot(id, { status: option.value })
      .then(() => addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `Instance was successfully ${option.value}`
      }))
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Status update failed' }));
  };

  const Loading = <Loader type={'bubbles'} width={45} height={45} color={theme.colors.primary} />;

  const renderRow = (botInstance, idx) => <tr key={idx}>
    <td>{ botInstance.status !== 'pending' ? botInstance.region : Loading }</td>
    <td>{ botInstance.status !== 'pending' ? botInstance.name : Loading }</td>
    <td>{ botInstance.status !== 'pending' ? botInstance.credits_used : Loading }</td>
    <td>{ botInstance.status !== 'pending' ? botInstance.ip : Loading }</td>
    <td>
      <Select options={OPTIONS} value={OPTIONS.find(item => item.value === botInstance.status)}
        onChange={option => changeBotInstanceStatus(option, botInstance.id)}
        isOptionDisabled={ (option) => option.readOnly }
        isDisabled={botInstance.status === 'pending' || botInstance.status === 'terminated'}
        styles={selectStyles}
      />
    </td>
    <td>{ botInstance.status !== 'pending' ? botInstance.launched_at : Loading }</td>
    <td>
      <IconButton type={'primary'}><Icon name={'eye'} color={theme.colors.white} /></IconButton>
      <IconButton type={'primary'} onClick={() => { setClickedBotInstance(botInstance); modal.current.open(); }}>
        <Icon name={'edit'} color={theme.colors.white} />
      </IconButton>
    </td>
  </tr>;

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
                <th>Region</th>
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
          <Paginator total={total} pageSize={limit} onChangePage={(page) => { setPage(page); getRunningBots({ page, limit }); }}/>
        </CardBody>
      </Container>
      <Modal ref={modal} title={'Edit Bot'} contentStyles={modalStyles} onClose={() => {}}>
        <span>Edit Bot here</span>
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
  updateRunningBot: PropTypes.func.isRequired,
  botInstances: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  addListener: PropTypes.func.isRequired,
  removeAllListeners: PropTypes.func.isRequired,
  botInstanceUpdated: PropTypes.func.isRequired,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  botInstances: state.bot.botInstances,
  total: state.bot.total,
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload)),
  getRunningBots: query => dispatch(getRunningBots(query)),
  updateRunningBot: (id, data) => dispatch(updateRunningBot(id, data)),
  addListener: (room, eventName, handler) => dispatch(addListener(room, eventName, handler)),
  removeAllListeners: () => dispatch(removeAllListeners()),
  botInstanceUpdated: (botInstance) => dispatch(botInstanceUpdated(botInstance)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(RunningBots));