import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { withTheme } from 'emotion-theming';
import { css } from '@emotion/core';
import Button from '../default/Button';
import { Card, CardBody } from '../default/Card';
import { Table, Thead } from '../default/Table';
import Modal from '../default/Modal';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';
import { connect } from 'react-redux';
import Icon from '../default/icons';
import Select from 'react-select';

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

const AddButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
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

const PERCENTAGES = (() => {
  let percentages = [];
  for (let i = 1; i <= 100; i++) {
    percentages.push({ value: i, label: i + ' %' });
  }
  return percentages;
})();

const TEMP_NOTIFICATIONS = [
  { id: 1, percentage: 1 },
  { id: 2, percentage: 12 },
  { id: 3, percentage: 15 },
];

const Notifications = ({ theme, addNotification }) => {
  const [clickedNotification, setClickedNotification] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const editModal = useRef(null);
  const deleteModal = useRef(null);
  const addModal = useRef(null);

  const openEditModal = notification => {
    setClickedNotification(notification);
    editModal.current.open();
  };

  const openDeleteModal = notification => {
    setClickedNotification(notification);
    deleteModal.current.open();
  };

  const onModalClose = () => {
    setClickedNotification(null);
    setPercentage(null);
  };

  const addLowCreditNotification = () => {
    addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message: `Notification added with percentage ${percentage.value}`
    });
    addModal.current.close();
  };

  const updateNotification = () => {
    addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Notification updated!' });
    editModal.current.close();
  };

  const deleteNotification = () => {
    addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Notification successfully removed!' });
    deleteModal.current.close();
  };

  const renderRow = (notification, idx) => <tr key={idx}>
    <td>{ notification.id }</td>
    <td>{ notification.percentage }&nbsp;%</td>
    <td>
      <IconButton title={'View Running Bots'} type={'primary'} onClick={() => openEditModal(notification)}>
        <Icon name={'edit'} color={theme.colors.white} />
      </IconButton>
      <IconButton title={'Edit Remaining Credits'} type={'danger'} onClick={() => openDeleteModal(notification)}>
        <Icon name={'garbage'} color={theme.colors.white} />
      </IconButton>
    </td>
  </tr>;

  return(
    <>
      <AddButtonWrap>
        <Button type={'primary'} onClick={() => addModal.current.open()}>Add Notification</Button>
      </AddButtonWrap>
      <Container>
        <CardBody>
          <Table>
            <Thead>
              <tr>
                <th>ID</th>
                <th>Percentage</th>
                <th>Actions</th>
              </tr>
            </Thead>
            <tbody>
              { TEMP_NOTIFICATIONS.map(renderRow) }
            </tbody>
          </Table>
        </CardBody>
      </Container>

      <Modal ref={editModal} title={'Edit Notification'} contentStyles={modalStyles}
        onClose={onModalClose}
      >
        <Select options={PERCENTAGES} value={percentage} onChange={option => setPercentage(option.value)}
          defaultValue={clickedNotification && PERCENTAGES.find(item => item.value === clickedNotification.percentage)}
        />
        <Buttons>
          <Button type={'primary'} onClick={updateNotification}>Update</Button>
          <Button type={'danger'} onClick={() => editModal.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>

      <Modal ref={deleteModal} title={'Are you sure?'} contentStyles={modalStyles}
        onClose={onModalClose}
      >
        <Buttons>
          <Button type={'primary'} onClick={deleteNotification}>Delete</Button>
          <Button type={'danger'} onClick={() => editModal.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>

      <Modal ref={addModal} title={'Add Notification'} contentStyles={modalStyles}
        onClose={onModalClose}
      >
        <Select options={PERCENTAGES} value={percentage} onChange={option => setPercentage(option)} />
        <Buttons>
          <Button type={'primary'} onClick={addLowCreditNotification}>Add</Button>
          <Button type={'danger'} onClick={() => addModal.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>
    </>
  );
};

Notifications.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload))
});

export default connect(null, mapDispatchToProps)(withTheme(Notifications));