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
import { adminGetBots, adminUpdateBot, addBot, adminLaunchInstance, getBotSettings,
  updateBotSettings } from 'store/bot/actions';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES, NOTIFICATION_TIMINGS } from 'config';
import { css } from '@emotion/core';
import { withTheme } from 'emotion-theming';

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
    &:last-child {
      margin-left: 20px;
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

const Bots = ({ adminGetBots, adminUpdateBot, adminLaunchInstance, bots, total, addNotification, theme
  , ...props}) => {
  const [clickedBot, setClickedBot] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const modal = useRef(null);
  const addModal = useRef(null);
  const editModal = useRef(null);
  const editSettingsModal = useRef(null);

  useEffect(() => {
    adminGetBots({ page, limit });
  }, []);

  const launchBot = () => {
    modal.current.close();

    adminLaunchInstance(clickedBot.id).then(() => {
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
    aws_ami_image_id: botData.imageId,
    aws_ami_name: botData.imageName,
    aws_instance_type: botData.instanceType,
    aws_startup_script: botData.startupScript,
    aws_custom_script: botData.botScript,
    aws_storage_gb: botData.storage,
    tags: botData.botTags,
    users: botData.users.map(user => user.id),
    type: botData.isPrivate ? 'private' : 'public'
  });

  const addBot = botData => {
    props.addBot(convertBotData(botData))
      .then(() => {
        addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Bot added!' });
        addModal.current.close();
      })
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Add failed!' }));
  };

  const updateBot = botData => {
    props.adminUpdateBot(clickedBot.id, convertBotData(botData))
      .then(() => addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Bot updated!' }))
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

  const renderRow = (bot, idx) => <tr key={idx}>
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
          ? bot.tags.map((tag, idx) => <Tag key={idx} pill type={'info'}>{ tag['name'] }</Tag>)
          : '-'
      }
    </td>
    <td>
      <StatusButton type={bot.status === 'active' ? 'success' : 'danger'} onClick={() => changeBotStatus(bot)}>
        { bot.status }
      </StatusButton>
    </td>
    <td>
      <Launch type={'primary'} onClick={() => { setClickedBot(bot); modal.current.open(); }}>Launch</Launch>
      <IconButton title={'Edit Bot'} type={'primary'} onClick={() => { setClickedBot(bot); editModal.current.open(); }}>
        <Icon name={'edit'} color={theme.colors.white}/>
      </IconButton>
    </td>
  </tr>;

  return(
    <>
      <AddButtonWrap>
        <Button type={'success'} onClick={() => addModal.current.open()}>Add Bot</Button>
        <Button type={'primary'} onClick={() => editSettingsModal.current.open()}>Edit Global Bot Settings</Button>
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
          <Paginator total={total} pageSize={limit} onChangePage={(page) => { setPage(page); adminGetBots({ page, limit }); }}/>
        </CardBody>
      </Container>

      <Modal ref={modal} title={'Launch selected bot?'} onClose={() => setClickedBot(null)}>
        <LaunchEditor onSubmit={launchBot} onClose={() => modal.current.close()} bot={clickedBot} />
      </Modal>

      <Modal ref={addModal} title={'Add Bot'} contentStyles={modalStyles} containerStyles={modalContainerStyles}
        disableSideClosing
      >
        <BotEditor type={'add'} onSubmit={addBot} onClose={() => addModal.current.close()}/>
      </Modal>

      <Modal ref={editModal} title={'Edit Bot'} contentStyles={modalStyles} containerStyles={modalContainerStyles}>
        <BotEditor type={'add'} bot={clickedBot} onSubmit={updateBot} onClose={() => editModal.current.close()}/>
      </Modal>

      <Modal ref={editSettingsModal} title={'Edit Global Settings'} containerStyles={modalContainerStyles}>
        <SettingsEditor onClose={() => editSettingsModal.current.close()} />
      </Modal>
    </>
  );
};

Bots.propTypes = {
  adminGetBots: PropTypes.func.isRequired,
  adminUpdateBot: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  adminLaunchInstance: PropTypes.func.isRequired,
  bots: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  addNotification: PropTypes.func.isRequired,
  addBot: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  bots: state.bot.bots,
  total: state.bot.total,
});

const mapDispatchToProps = dispatch => ({
  adminGetBots: query => dispatch(adminGetBots(query)),
  addNotification: payload => dispatch(addNotification(payload)),
  adminLaunchInstance: (id, params) => dispatch(adminLaunchInstance(id, params)),
  adminUpdateBot: (id, data) => dispatch(adminUpdateBot(id, data)),
  addBot: (data) => dispatch(addBot(data)),
  getBotSettings: () => dispatch(getBotSettings()),
  updateBotSettings: (id, data) => dispatch(updateBotSettings(id, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Bots));
