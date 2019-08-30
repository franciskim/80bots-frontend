import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import BotEditor from './components/BotEditor';
import Icon from 'components/default/icons';
import Router from 'next/router';
import LaunchEditor from '../components/LaunchEditor';
import SettingsEditor from './components/SettingsEditor';
import Modal from 'components/default/Modal';
import { Button, Badge, Paginator } from 'components/default';
import { Card, CardBody } from 'components/default/Card';
import { Table, Thead, Filters, LimitFilter, SearchFilter } from 'components/default/Table';
import { connect } from 'react-redux';
import {
  adminGetBots, adminUpdateBot, addBot, adminLaunchInstance, getBotSettings, updateBotSettings, adminDeleteBot,
  syncLocalBots
} from 'store/bot/actions';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES, NOTIFICATION_TIMINGS } from 'config';
import { css } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import {addListener} from '../../../store/socket/actions';

const Container = styled(Card)`
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const Launch = styled(Button)`
  padding: 0 10px;
  font-size: 16px;
  margin-right: 5px;
`;

const IconButton = styled(Button)`
  display: inline-flex;
  justify-content: center; 
  padding: 2px;
  margin-right: 5px;
  width: 27px;
  height: 27px;
  &:last-child {
    margin-right: 0;
  }
`;

const StatusButton = styled(Button)`
  text-transform: uppercase;
`;

const AddButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
  button {
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const BotType = styled(Badge)`
  font-size: 14px;
  text-transform: uppercase;
`;

const Tag = styled(Badge)`
  margin-right: .5rem;
  font-size: 14px;
  &:last-child {
    margin-right: 0;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const modalContainerStyles = css`
  margin-top: 0;
`;

const modalStyles = css`
  min-width: 800px;
  max-width: 800px;
  overflow-y: visible;
  @media (max-height: 900px) {
    max-height: 700px;
    overflow-y: scroll;
  }
`;

const Bots = ({ adminGetBots, adminUpdateBot, adminLaunchInstance, bots, total, addNotification, theme, adminDeleteBot
  , syncLocalBots, syncLoading, addListener, user, ...props}) => {
  const [clickedBot, setClickedBot] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const modal = useRef(null);
  const addModal = useRef(null);
  const editModal = useRef(null);
  const editSettingsModal = useRef(null);
  const deleteModal = useRef(null);

  useEffect(() => {
    adminGetBots({ page, limit });
    addListener(`bots.${user.id}`, 'BotsSyncSucceeded', () => {
      addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Sync completed' });
      adminGetBots({ page, limit });
    });
  }, []);

  const launchBot = (params) => {
    modal.current.close();

    adminLaunchInstance(clickedBot.id, params).then(() => {
      addNotification({ type: NOTIFICATION_TYPES.INFO, message: 'New instance is enqueued for launch' });
      setTimeout(() => {
        Router.push('/admin/bots/running');
      }, (NOTIFICATION_TIMINGS.DURATION * 2) + NOTIFICATION_TIMINGS.INFO_HIDE_DELAY);
    }).catch(() => {
      addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Error occurred during new instance launch' });
    }).finally(() => {
      setClickedBot(null);
    });
  };

  const convertBotData = botData => ({
    name: botData.botName,
    description: botData.description,
    platform: botData.platform,
    aws_custom_script: botData.botScript,
    tags: botData.botTags,
    users: botData.users.map(user => user.id),
    type: botData.isPrivate ? 'private' : 'public'
  });

  const addBot = botData => {
    props.addBot(convertBotData(botData))
      .then(() => {
        addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Bot added!' });
        addModal.current.close();
        adminGetBots({ page, limit });
      })
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Add failed!' }));
  };

  const updateBot = botData => {
    adminUpdateBot(clickedBot.id, convertBotData(botData))
      .then(() => {
        addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Bot updated!' });
        editModal.current.close();
      })
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Update failed!' }));
  };

  const changeBotStatus = bot => {
    const statusName = bot.status === 'active' ? 'deactivated' : 'activated';
    const status = bot.status === 'active' ? 'inactive' : 'active';

    adminUpdateBot(bot.id, { status })
      .then(() => addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `Bot was successfully ${statusName}!`
      }))
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Status update failed' }));
  };

  const deleteBot = () => {
    setClickedBot(null);
    adminDeleteBot(clickedBot.id)
      .then(() => {
        addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Bot removed!' });
        adminGetBots({ page, limit });
        deleteModal.current.close();
      })
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Bot delete failed' }));
  };

  const sync = () => {
    syncLocalBots()
      .then(() => addNotification({ type: NOTIFICATION_TYPES.INFO, message: 'Sync started' }))
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Sync cannot be started' }));
  };

  const renderRow = (bot, idx) => <tr key={idx}>
    <td>{ bot.platform }</td>
    <td>{ bot.name }</td>
    <td>
      <BotType type={bot.type === 'public' ? 'info' : 'danger'} pill>
        { bot.type }
      </BotType>
    </td>
    <td>{ bot.description }</td>
    <td>
      {
        bot.tags && bot.tags.length > 0
          ? bot.tags.map((tag, idx) => <Tag key={idx} pill type={'info'}>{ tag }</Tag>)
          : '-'
      }
    </td>
    <td>
      <StatusButton type={bot.status === 'active' ? 'success' : 'danger'} onClick={() => changeBotStatus(bot)}>
        { bot.status }
      </StatusButton>
    </td>
    <td>
      <Buttons>
        <Launch type={'primary'} onClick={() => { setClickedBot(bot); modal.current.open(); }}>Launch</Launch>
        <IconButton title={'Edit Bot'} type={'primary'} onClick={() => { setClickedBot(bot); editModal.current.open(); }}>
          <Icon name={'edit'} color={theme.colors.white}/>
        </IconButton>
        <IconButton title={'Delete Bot'} type={'danger'}
          onClick={() => { setClickedBot(bot); deleteModal.current.open(); }}
        >
          <Icon name={'garbage'} color={theme.colors.white}/>
        </IconButton>
      </Buttons>
    </td>
  </tr>;

  return(
    <>
      <AddButtonWrap>
        <Button type={'success'} onClick={() => addModal.current.open()}>Add Bot</Button>
        <Button type={'primary'} onClick={() => editSettingsModal.current.open()}>Edit Global Bot Settings</Button>
        <Button type={'primary'} onClick={sync} loading={`${syncLoading}`} loaderWidth={148}>
          Sync Bots From Repo
        </Button>
      </AddButtonWrap>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter onChange={({ value }) => {setLimit(value); adminGetBots({ page, limit: value }); }}/>
            <SearchFilter onChange={console.log}/>
          </Filters>
          <Table responsive>
            <Thead>
              <tr>
                <th>Bot Platform</th>
                <th>Bot Name</th>
                <th>Bot Type</th>
                <th>Bot Description</th>
                <th>Bot Tags</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </Thead>
            <tbody>
              { bots.map(renderRow) }
            </tbody>
          </Table>
          <Paginator total={total} pageSize={limit}
            onChangePage={(page) => { setPage(page); adminGetBots({ page, limit }); }}
          />
        </CardBody>
      </Container>

      <Modal ref={modal} title={'Launch selected bot?'} onClose={() => setClickedBot(null)}
        contentStyles={css`overflow-x: visible; overflow-y: hidden;`}
      >
        <LaunchEditor onSubmit={launchBot} onClose={() => modal.current.close()} bot={clickedBot} />
      </Modal>

      <Modal ref={addModal} title={'Add Bot'} contentStyles={modalStyles} containerStyles={modalContainerStyles}
        disableSideClosing
      >
        <BotEditor type={'add'} onSubmit={addBot} onClose={() => addModal.current.close()}/>
      </Modal>

      <Modal ref={editModal} title={'Edit Bot'} contentStyles={modalStyles} containerStyles={modalContainerStyles}>
        <BotEditor type={'edit'} bot={clickedBot} onSubmit={updateBot} onClose={() => editModal.current.close()}/>
      </Modal>

      <Modal ref={deleteModal} title={'Delete Bot'} contentStyles={css`min-width: 300px;`}>
        <Buttons>
          <Button type={'primary'} onClick={deleteBot}>
            Yes
          </Button>
          <Button type={'danger'} onClick={() => { setClickedBot(null); deleteModal.current.close(); }}>
            Cancel
          </Button>
        </Buttons>
      </Modal>

      <Modal ref={editSettingsModal} title={'Edit Global Settings'}
        containerStyles={modalContainerStyles}
        contentStyles={css`min-width: 600px;`}
      >
        <SettingsEditor onClose={() => editSettingsModal.current.close()} />
      </Modal>
    </>
  );
};

Bots.propTypes = {
  bots:                PropTypes.array.isRequired,
  total:               PropTypes.number.isRequired,
  syncLoading:         PropTypes.bool.isRequired,
  user:                PropTypes.object,
  adminGetBots:        PropTypes.func.isRequired,
  adminUpdateBot:      PropTypes.func.isRequired,
  adminLaunchInstance: PropTypes.func.isRequired,
  adminDeleteBot:      PropTypes.func.isRequired,
  addNotification:     PropTypes.func.isRequired,
  addBot:              PropTypes.func.isRequired,
  syncLocalBots:       PropTypes.func.isRequired,
  addListener:         PropTypes.func.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
};

const mapStateToProps = state => ({
  bots:        state.bot.bots,
  total:       state.bot.total,
  syncLoading: state.bot.syncLoading,
  user:        state.auth.user
});

const mapDispatchToProps = dispatch => ({
  adminGetBots: query => dispatch(adminGetBots(query)),
  addNotification: payload => dispatch(addNotification(payload)),
  adminLaunchInstance: (id, params) => dispatch(adminLaunchInstance(id, params)),
  adminUpdateBot: (id, data) => dispatch(adminUpdateBot(id, data)),
  adminDeleteBot: (id) => dispatch(adminDeleteBot(id)),
  addBot: (data) => dispatch(addBot(data)),
  getBotSettings: () => dispatch(getBotSettings()),
  updateBotSettings: (id, data) => dispatch(updateBotSettings(id, data)),
  syncLocalBots: () => dispatch(syncLocalBots()),
  addListener: (room, eventName, handler) => dispatch(addListener(room, eventName, handler)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Bots));
