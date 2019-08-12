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

const StatusButton = styled(Button)`
  text-transform: uppercase;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  &:first-of-type {
    margin-top: 20px;
  }
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

const TEMP_PLANS = [
  { name: 'Basic', price: 10, credits: 80, status: 'active' },
  { name: 'Plus', price: 100, credits: 820, status: 'inactive' },
  { name: 'Pro', price: 120, credits: 810, status: 'active' },
];

const Subscriptions = ({ theme, addNotification }) => {
  const [clickedPlan, setClickedPlan] = useState(null);
  const [planName, setPlanName] = useState('');
  const [planCredits, setPlanCredits] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const addModal = useRef(null);
  const editModal = useRef(null);
  const deleteModal = useRef(null);

  const openAddModal = plan => {
    setClickedPlan(plan);
    addModal.current.open();
  };

  const openEditModal = plan => {
    setClickedPlan(plan);
    setPlanPrice(plan.price);
    setPlanCredits(plan.credits);
    setPlanName(plan.name);
    editModal.current.open();
  };

  const openDeleteModal = plan => {
    setClickedPlan(plan);
    deleteModal.current.open();
  };

  const onModalClose = () => {
    setClickedPlan(null);
    setPlanName('');
    setPlanCredits('');
    setPlanPrice('');
  };

  const changePlanStatus = plan => {
    const status = plan.status === 'active' ? 'deactivated' : 'activated';
    addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: `Subscription plan was successfully ${status}` });
  };

  const addPlan = () => {
    addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Subscription plan was successfully added' });
    addModal.current.close();
  };

  const updatePlan = () => {
    addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Subscription plan was successfully updated' });
    editModal.current.close();
  };

  const deletePlan = () => {
    addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message: `Subscription plan "${clickedPlan.name}" was successfully deleted`
    });
    deleteModal.current.close();
  };

  const renderRow = (plan, idx) => <tr key={idx}>
    <td>{ plan.name }</td>
    <td>{ plan.price }$</td>
    <td>{ plan.credits }</td>
    <td>
      <StatusButton type={plan.status === 'active' ? 'success' : 'danger'} onClick={() => changePlanStatus(plan)}>
        { plan.status }
      </StatusButton>
    </td>
    <td>
      <IconButton title={'Edit Subscription Plan'} type={'primary'} onClick={() => openEditModal(plan)}>
        <Icon name={'edit'} color={theme.colors.white} />
      </IconButton>
      <IconButton title={'Delete Subscription Plan'} type={'danger'} onClick={() => openDeleteModal(plan)}>
        <Icon name={'garbage'} color={theme.colors.white} />
      </IconButton>
    </td>
  </tr>;

  return(
    <>
      <AddButtonWrap>
        <Button type={'primary'} onClick={openAddModal}>Add subscription plan</Button>
      </AddButtonWrap>
      <Container>
        <CardBody>
          <Table>
            <Thead>
              <tr>
                <th>Plan Name</th>
                <th>Price</th>
                <th>Credits</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </Thead>
            <tbody>
              { TEMP_PLANS.map(renderRow) }
            </tbody>
          </Table>
        </CardBody>
      </Container>

      <Modal ref={editModal} title={'Edit Subscription Plan'} contentStyles={modalStyles}
        onClose={onModalClose}
      >
        <InputWrap>
          <label>Name</label>
          <input type={'text'} className={'form-control'} value={planName}
            onChange={e => setPlanName(e.target.value)}
          />
        </InputWrap>
        <InputWrap>
          <label>Credits</label>
          <input type={'text'} className={'form-control'} value={planCredits}
            onChange={e => setPlanCredits(e.target.value)}
          />
        </InputWrap>
        <InputWrap>
          <label>Price</label>
          <input type={'text'} className={'form-control'} value={planPrice}
            onChange={e => setPlanPrice(e.target.value)}
          />
        </InputWrap>
        <Buttons>
          <Button type={'primary'} onClick={updatePlan}>Update</Button>
          <Button type={'danger'} onClick={() => editModal.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>

      <Modal ref={addModal} title={'Add Subscription Plan'} contentStyles={modalStyles}
        onClose={onModalClose}
      >
        <InputWrap>
          <label>Name</label>
          <input type={'text'} className={'form-control'} value={planName}
            onChange={e => setPlanName(e.target.value)}
          />
        </InputWrap>
        <InputWrap>
          <label>Credits</label>
          <input type={'text'} className={'form-control'} value={planCredits}
            onChange={e => setPlanCredits(e.target.value)}
          />
        </InputWrap>
        <InputWrap>
          <label>Price</label>
          <input type={'text'} className={'form-control'} value={planPrice}
            onChange={e => setPlanPrice(e.target.value)}
          />
        </InputWrap>
        <Buttons>
          <Button type={'primary'} onClick={addPlan}>Add</Button>
          <Button type={'danger'} onClick={() => addModal.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>

      <Modal ref={deleteModal} title={'Are you sure?'} contentStyles={modalStyles} onClose={onModalClose}>
        <Buttons>
          <Button type={'primary'} onClick={deletePlan}>Delete</Button>
          <Button type={'danger'} onClick={() => deleteModal.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>

    </>
  );
};

Subscriptions.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload))
});

export default connect(null, mapDispatchToProps)(withTheme(Subscriptions));