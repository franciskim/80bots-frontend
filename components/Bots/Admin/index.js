import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Button from 'components/default/Button';
import { Card, CardBody } from 'components/default/Card';
import { Table, Thead, Filters, LimitFilter, SearchFilter } from 'components/default/Table';
import { connect } from 'react-redux';
import { adminGetBots, adminUpdateBot, addBot, adminLaunchInstance } from 'store/bot/actions';
import Modal from 'components/default/Modal';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES, notificationTimings } from 'config';
import Paginator from '../../default/Paginator';
import { css } from '@emotion/core';
import BotEditor from './components/BotEditor';
import Icon from '../../default/icons';
import { withTheme } from 'emotion-theming';
import Router from 'next/router';

const Container = styled(Card)`
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const Launch = styled(Button)`
  padding: 0 10px;
  font-size: 16px;
  margin-right: 5px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

const Bots = ({ adminGetBots, adminUpdateBot, adminLaunchInstance, bots, total, addNotification, theme, ...props}) => {
  const [clickedBot, setClickedBot] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const modal = useRef(null);
  const addModal = useRef(null);
  const editModal = useRef(null);

  useEffect(() => {
    adminGetBots({ page, limit });
  }, []);

  const launchBot = () => {
    modal.current.close();

    adminLaunchInstance(clickedBot.id).then(() => {
      addNotification({ type: NOTIFICATION_TYPES.INFO, message: 'New instance is enqueued for launch' });
      setTimeout(() => {
        Router.push('/admin/bots/running');
      }, (notificationTimings.DURATION * 2) + notificationTimings.INFO_HIDE_DELAY);
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
    <td>{ bot.ami_id }</td>
    <td>{ bot.ami_name }</td>
    <td>{ bot.instance_type }</td>
    <td>{ bot.storage }&nbsp;GB</td>
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
        <Button type={'primary'} onClick={() => addModal.current.open()}>Add Bot</Button>
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
                <th>AMI Image ID</th>
                <th>AMI name</th>
                <th>Instance Type</th>
                <th>Storage GB</th>
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
        <Buttons>
          <Button type={'primary'} onClick={launchBot}>Yes</Button>
          <Button type={'danger'} onClick={() => modal.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>

      <Modal ref={addModal} title={'Add Bot'} contentStyles={modalStyles} containerStyles={modalContainerStyles}
        disableSideClosing
      >
        <BotEditor type={'add'} onSubmit={addBot} onClose={() => addModal.current.close()}/>
      </Modal>

      <Modal ref={editModal} title={'Edit Bot'} contentStyles={modalStyles} containerStyles={modalContainerStyles}>
        <BotEditor type={'add'} bot={clickedBot} onSubmit={updateBot} onClose={() => editModal.current.close()}/>
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
  adminLaunchInstance: id => dispatch(adminLaunchInstance(id)),
  adminUpdateBot: (id, data) => dispatch(adminUpdateBot(id, data)),
  addBot: (data) => dispatch(addBot(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Bots));