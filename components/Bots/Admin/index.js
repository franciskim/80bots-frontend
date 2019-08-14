import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Button from 'components/default/Button';
import { Card, CardBody } from 'components/default/Card';
import { Table, Thead, Filters, LimitFilter } from 'components/default/Table';
import { connect } from 'react-redux';
import { getAdminBots, updateAdminBot, adminLaunchInstance } from 'store/bot/actions';
import Modal from 'components/default/Modal';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';
import Paginator from '../../default/Paginator';

const Container = styled(Card)`
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const Launch = styled(Button)`
  padding: 0 10px;
  font-size: 16px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StatusButton = styled(Button)`
  text-transform: uppercase;
`;

const Bots = ({ getAdminBots, updateAdminBot, adminLaunchInstance, bots, total, addNotification }) => {
  const [clickedBot, setClickedBot] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const modal = useRef(null);

  const launchBot = () => {
    modal.current.close();

    adminLaunchInstance(clickedBot.id).then(() => {
      addNotification({ type: NOTIFICATION_TYPES.INFO, message: 'New instance is enqueued for launch' });
    }).catch(() => {
      addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Error occurred during new instance launch' });
    }).finally(() => {
      setClickedBot(null);
    });
  };

  useEffect(() => {
    getAdminBots({ page, limit });
  }, []);

  const changeBotStatus = bot => {
    const statusName = bot.status === 'active' ? 'deactivated' : 'activated';
    const status = bot.status === 'active' ? 'inactive' : 'active';

    updateAdminBot(bot.id, { status })
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
    </td>
  </tr>;

  return(
    <>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter onChange={({ value }) => {setLimit(value); getAdminBots({ page, limit: value }); }}/>
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
          <Paginator total={total} pageSize={limit} onChangePage={(page) => { setPage(page); getAdminBots({ page, limit }); }}/>
        </CardBody>
      </Container>
      <Modal ref={modal} title={'Launch selected bot?'} onClose={() => setClickedBot(null)}>
        <Buttons>
          <Button type={'primary'} onClick={launchBot}>Yes</Button>
          <Button type={'danger'} onClick={() => modal.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>
    </>
  );
};

Bots.propTypes = {
  getAdminBots: PropTypes.func.isRequired,
  updateAdminBot: PropTypes.func.isRequired,
  adminLaunchInstance: PropTypes.func.isRequired,
  bots: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  addNotification: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  bots: state.bot.bots,
  total: state.bot.total,
});

const mapDispatchToProps = dispatch => ({
  getAdminBots: query => dispatch(getAdminBots(query)),
  addNotification: payload => dispatch(addNotification(payload)),
  adminLaunchInstance: id => dispatch(adminLaunchInstance(id)),
  updateAdminBot: (id, data) => dispatch(updateAdminBot(id, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Bots);