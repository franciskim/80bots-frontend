import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import Icon from "../default/icons";
import Modal from "../default/Modal";
import Link from "next/link";
import { withTheme } from "emotion-theming";
import { css } from "@emotion/core";
import { connect } from "react-redux";
import { Paginator, Button, Badge } from "../default";
import { Card, CardBody } from "../default/Card";
import {
  Table,
  Thead,
  Filters,
  SearchFilter,
  LimitFilter,
  Th
} from "../default/Table";
import { NOTIFICATION_TYPES } from "/config";
import { addNotification } from "/store/notification/actions";
import { updateUser } from "/store/user/actions";
import { getUsers } from "/store/user/actions";

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
  background: transparent;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    background: transparent;
    border: 1px solid #7dffff;
  }
`;

const StatusButton = styled(Button)`
  padding: 2px 10px;
  font-size: 13px;
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

const Role = styled(Badge)`
  font-size: 13px;
  text-transform: uppercase;
`;

const modalStyles = css`
  min-width: 300px;
  overflow-y: visible;
`;

const A = styled.a`
  color: inherit;
  text-decoration: none;
`;

const Users = ({
  theme,
  addNotification,
  getUsers,
  updateUser,
  users,
  total
}) => {
  const [clickedUser, setClickedUser] = useState(null);
  const [credits, setCredits] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState({ value: "", field: "" });
  const [search, setSearch] = useState(null);

  const modal = useRef(null);

  useEffect(() => {
    getUsers({ page, limit });
  }, []);

  const openEditModal = user => {
    setClickedUser(user);
    setCredits(user.credits);
    modal.current.open();
  };

  const onModalClose = () => {
    setClickedUser(null);
    setCredits(0);
  };

  const changeUserStatus = user => {
    updateUser(user.id, {
      status: user.status === "active" ? "inactive" : "active"
    }).then(() => {
      const status = user.status === "active" ? "deactivated" : "activated";
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `User was successfully ${status}`
      });
    });
  };

  const updateCredits = () => {
    updateUser(clickedUser.id, { credits: credits }).then(() => {
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `User remaining credits was set to ${credits}`
      });
      modal.current.close();
    });
  };

  const searchUsers = value => {
    setSearch(value);
    getUsers({
      page,
      limit,
      sort: order.field,
      order: order.value,
      search: value
    });
  };

  const onOrderChange = (field, value) => {
    setOrder({ field, value });
    getUsers({ page, limit, sort: field, order: value, search });
  };

  const OrderTh = props => (
    <Th
      {...props}
      // eslint-disable-next-line react/prop-types
      order={
        props.field === order.field || props.children === order.field
          ? order.value
          : ""
      }
      onClick={onOrderChange}
    />
  );

  const renderRow = (user, idx) => (
    <tr key={idx}>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <Role type={user.role === "Admin" ? "success" : "info"} pill>
          {user.role}
        </Role>
      </td>
      <td>{user.credits}</td>
      <td>{dayjs(user.created_at).format("YYYY-MM-DD HH:mm:ss")}</td>
      <td>
        <StatusButton
          type={user.status === "active" ? "success" : "danger"}
          onClick={() => changeUserStatus(user)}
        >
          {user.status}
        </StatusButton>
      </td>
      <td>
        <IconButton title={"View Credit Usage"} type={"primary"}>
          <Link
            href={"/admin/users/[id]/history"}
            as={`/admin/users/${user.id}/history`}
          >
            <A>
              <Icon name={"dollar"} color={theme.colors.white} />
            </A>
          </Link>
        </IconButton>
        <IconButton title={"View Running Bots"} type={"primary"}>
          <Icon name={"eye"} color={theme.colors.white} />
        </IconButton>
        <IconButton
          title={"Edit Remaining Credits"}
          type={"primary"}
          onClick={() => openEditModal(user)}
        >
          <Icon name={"edit"} color={theme.colors.white} />
        </IconButton>
      </td>
    </tr>
  );

  return (
    <>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter
              onChange={({ value }) => {
                setLimit(value);
                getUsers({
                  page,
                  limit: value,
                  sort: order.field,
                  order: order.value,
                  search
                });
              }}
            />
            <SearchFilter
              onChange={value => {
                searchUsers(value);
              }}
            />
          </Filters>
          <Table>
            <Thead>
              <tr>
                <OrderTh field={"name"}>Name</OrderTh>
                <OrderTh field={"email"}>Email</OrderTh>
                <OrderTh field={"role"}>Role</OrderTh>
                <OrderTh field={"credits"}>Credits</OrderTh>
                <OrderTh field={"date"}>Register Date</OrderTh>
                <OrderTh field={"status"}>Status</OrderTh>
                <th>Actions</th>
              </tr>
            </Thead>
            <tbody>{users.map(renderRow)}</tbody>
          </Table>
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={page => {
              setPage(page);
              getUsers({
                page,
                limit,
                sort: order.field,
                order: order.value,
                search
              });
            }}
          />
        </CardBody>
      </Container>
      <Modal
        ref={modal}
        title={"Edit Remaining Credits"}
        contentStyles={modalStyles}
        onClose={onModalClose}
      >
        <InputWrap>
          <label>Credits</label>
          <input
            type={"text"}
            className={"form-control"}
            value={credits}
            onChange={e => setCredits(e.target.value)}
          />
        </InputWrap>
        <Buttons>
          <Button type={"primary"} onClick={updateCredits}>
            Update
          </Button>
          <Button type={"danger"} onClick={() => modal.current.close()}>
            Cancel
          </Button>
        </Buttons>
      </Modal>
    </>
  );
};

Users.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  users: state.user.users,
  total: state.user.total
});

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload)),
  getUsers: query => dispatch(getUsers(query)),
  updateUser: (id, updateData) => dispatch(updateUser(id, updateData))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Users));
