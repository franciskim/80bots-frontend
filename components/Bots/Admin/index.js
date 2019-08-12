import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Button from 'components/default/Button';
import { Card, CardBody } from 'components/default/Card';
import { Table, Thead } from 'components/default/Table';
import { connect } from 'react-redux';
import { getBots } from 'store/bot/actions';
import Modal from 'components/default/Modal';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';

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

const TEMP_BOTS = [
  { name: 'testbot1', ami_id: '12hfa23qd', ami_name: 'name', instance_type: 't2.micro', storage: 8, status: 'active' },
  { name: 'testbot2', ami_id: 'sddas', ami_name: 'name', instance_type: 't2.micro', storage: 8, status: 'inactive' },
  { name: 'testbot3', ami_id: '12hfa23qd', ami_name: 'name', instance_type: 't2.micro', storage: 8, status: 'active' },
];

const Bots = ({ getBots, bots, addNotification }) => {
  const [clickedBot, setClickedBot] = useState(null);
  const modal = useRef(null);

  const launchBot = () => {
    modal.current.close();
    setClickedBot(null);
    addNotification({ type: NOTIFICATION_TYPES.INFO, message: 'Launching selected bot' });
  };

  useEffect(() => {
    //getBots();
  }, []);

  const changeBotStatus = bot => {
    const status = bot.status === 'active' ? 'deactivated' : 'activated';
    addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: `Bot was successfully ${status}` });
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
      <Launch type={'primary'} onClick={() => modal.current.open()}>Launch</Launch>
    </td>
  </tr>;

  return(
    <>
      <Container>
        <CardBody>
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
              { TEMP_BOTS.map(renderRow) }
            </tbody>
          </Table>
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
  getBots: PropTypes.func.isRequired,
  bots: PropTypes.array.isRequired,
  addNotification: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  bots: state.bot.bots
});

const mapDispatchToProps = dispatch => ({
  getBots: (page) => dispatch(getBots(page)),
  addNotification: payload => dispatch(addNotification(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Bots);