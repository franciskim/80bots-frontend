import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { withTheme } from 'emotion-theming';
import { css } from '@emotion/core';
import Button from '../default/Button';
import { Card, CardBody } from '../default/Card';
import { Table, Thead, Filters, SearchFilter, LimitFilter } from '../default/Table';
import Modal from '../default/Modal';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';
import { connect } from 'react-redux';
import Icon from '../default/icons';

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

const StatusButton = styled(Button)`
  text-transform: uppercase;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const modalStyles = css`
  min-width: 300px;
  overflow-y: visible;
`;

const TEMP_USERS = [
  { name: 'Loud', email: 'some@email.com', credits_remaining: 80, created_at: new Date().toString(), status: 'active' }
];

const Users = ({ theme, addNotification }) => {
  const [clickedUser, setClickedUser] = useState(null);
  const [credits, setCredits] = useState(null);
  const modal = useRef(null);

  const openEditModal = user => {
    setClickedUser(user);
    setCredits(user.credits_remaining);
    modal.current.open();
  };

  const onModalClose = () => {
    setClickedUser(null);
    setCredits(0);
  };

  const changeUserStatus = user => {
    const status = user.status === 'active' ? 'deactivated' : 'activated';
    addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: `User was successfully ${status}` });
  };

  const updateCredits = () => {
    addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: `User remaining credits was set to ${credits}` });
    modal.current.close();
  };

  const renderRow = (user, idx) => <tr key={idx}>
    <td>{ user.name }</td>
    <td>{ user.email }</td>
    <td>{ user.credits_remaining }</td>
    <td>{ user.created_at }</td>
    <td>
      <StatusButton type={user.status === 'active' ? 'success' : 'danger'} onClick={() => changeUserStatus(user)}>
        { user.status }
      </StatusButton>
    </td>
    <td>
      <IconButton title={'View Running Bots'} type={'primary'}>
        <Icon name={'eye'} color={theme.colors.white} />
      </IconButton>
      <IconButton title={'Edit Remaining Credits'} type={'primary'} onClick={() => openEditModal(user)}>
        <Icon name={'edit'} color={theme.colors.white} />
      </IconButton>
    </td>
  </tr>;

  return(
    <>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter onChange={console.log}/>
            <SearchFilter onChange={console.log}/>
          </Filters>
          <Table>
            <Thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Credits</th>
                <th>Register Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </Thead>
            <tbody>
              { TEMP_USERS.map(renderRow) }
            </tbody>
          </Table>
        </CardBody>
      </Container>
      <Modal ref={modal} title={'Edit Remaining Credits'} contentStyles={modalStyles}
        onClose={onModalClose}
      >
        <InputWrap>
          <label>Credits</label>
          <input type={'text'} className={'form-control'} value={credits} onChange={e => setCredits(e.target.value)}/>
        </InputWrap>
        <Buttons>
          <Button type={'primary'} onClick={updateCredits}>Update</Button>
          <Button type={'danger'} onClick={() => modal.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>
    </>
  );
};

Users.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload))
});

export default connect(null, mapDispatchToProps)(withTheme(Users));