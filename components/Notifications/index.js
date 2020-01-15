import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Button from "../default/Button";
import Modal from "../default/Modal";
import Icon from "../default/icons";
import Select from "react-select";
import Paginator from "../default/Paginator";
import { connect } from "react-redux";
import { withTheme } from "emotion-theming";
import { css } from "@emotion/core";
import { addNotification } from "/store/notification/actions";
import {
  getLowCreditNotifications,
  addLowCreditNotifications,
  deleteLowCreditNotification
} from "/store/eventNotification/actions";
import { NOTIFICATION_TYPES } from "/config";
import { Card, CardBody } from "../default/Card";
import { Table, Thead, Filters, LimitFilter } from "../default/Table";

const Container = styled(Card)`
  background: #333;
  border: none;
  color: #fff;
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
    percentages.push({ value: i, label: i + " %" });
  }
  return percentages;
})();

const Notifications = ({
  theme,
  addNotification,
  lowCreditNotifications,
  total,
  ...props
}) => {
  const [clickedNotification, setClickedNotification] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);

  const editModal = useRef(null);
  const deleteModal = useRef(null);
  const addModal = useRef(null);

  useEffect(() => {
    props.getLowCreditNotifications();
  }, []);

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
    props.addLowCreditNotification(percentage.value).then(() => {
      props.getLowCreditNotifications();
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `Notification added with percentage ${percentage.value}`
      });
      addModal.current.close();
    });
  };

  const updateNotification = () => {
    addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message: "Notification updated!"
    });
    editModal.current.close();
  };

  const deleteNotification = () => {
    props.deleteLowCreditNotification(clickedNotification.id).then(() => {
      props.getLowCreditNotifications();
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: "Notification successfully deleted!"
      });
      deleteModal.current.close();
    });
  };

  const onPageChange = page => {
    setPage(page);
    getLowCreditNotifications({ page, limit });
  };

  const renderRow = (notification, idx) => (
    <tr key={idx}>
      <td>{notification.id}</td>
      <td>{notification.percentage}&nbsp;%</td>
      <td>
        <IconButton
          title={"View Running Bots"}
          type={"primary"}
          onClick={() => openEditModal(notification)}
        >
          <Icon name={"edit"} color={theme.colors.white} />
        </IconButton>
        <IconButton
          title={"Edit Remaining Credits"}
          type={"danger"}
          onClick={() => openDeleteModal(notification)}
        >
          <Icon name={"garbage"} color={theme.colors.white} />
        </IconButton>
      </td>
    </tr>
  );

  return (
    <>
      <AddButtonWrap>
        <Button type={"primary"} onClick={() => addModal.current.open()}>
          Add Notification
        </Button>
      </AddButtonWrap>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter
              onChange={({ limit }) => {
                setLimit(limit);
                props.getLowCreditNotifications({ page, limit });
              }}
            />
          </Filters>
          <Table>
            <Thead>
              <tr>
                <th>ID</th>
                <th>Percentage</th>
                <th>Actions</th>
              </tr>
            </Thead>
            <tbody>{lowCreditNotifications.map(renderRow)}</tbody>
          </Table>
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={onPageChange}
          />
        </CardBody>
      </Container>

      <Modal
        ref={editModal}
        title={"Edit Notification"}
        contentStyles={modalStyles}
        onClose={onModalClose}
      >
        <Select
          options={PERCENTAGES}
          value={percentage}
          onChange={option => setPercentage(option.value)}
          defaultValue={
            clickedNotification &&
            PERCENTAGES.find(
              item => item.value === clickedNotification.percentage
            )
          }
        />
        <Buttons>
          <Button type={"danger"} onClick={() => editModal.current.close()}>
            Cancel
          </Button>
          <Button type={"primary"} onClick={updateNotification}>
            Update
          </Button>
        </Buttons>
      </Modal>

      <Modal
        ref={deleteModal}
        title={"Are you sure?"}
        contentStyles={modalStyles}
        onClose={onModalClose}
      >
        <Buttons>
          <Button type={"danger"} onClick={() => editModal.current.close()}>
            Cancel
          </Button>
          <Button type={"primary"} onClick={deleteNotification}>
            Delete
          </Button>
        </Buttons>
      </Modal>

      <Modal
        ref={addModal}
        title={"Add Notification"}
        contentStyles={modalStyles}
        onClose={onModalClose}
      >
        <Select
          options={PERCENTAGES}
          value={percentage}
          onChange={option => setPercentage(option)}
        />
        <Buttons>
          <Button type={"danger"} onClick={() => addModal.current.close()}>
            Cancel
          </Button>
          <Button type={"primary"} onClick={addLowCreditNotification}>
            Add
          </Button>
        </Buttons>
      </Modal>
    </>
  );
};

Notifications.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  getLowCreditNotifications: PropTypes.func.isRequired,
  addLowCreditNotification: PropTypes.func.isRequired,
  deleteLowCreditNotification: PropTypes.func.isRequired,
  lowCreditNotifications: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  lowCreditNotifications: state.eventNotification.lowCreditNotifications,
  total: state.eventNotification.total
});

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload)),
  getLowCreditNotifications: query =>
    dispatch(getLowCreditNotifications(query)),
  addLowCreditNotification: percentage =>
    dispatch(addLowCreditNotifications(percentage)),
  deleteLowCreditNotification: id => dispatch(deleteLowCreditNotification(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Notifications));
