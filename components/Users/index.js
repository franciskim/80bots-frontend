import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { withTheme } from "emotion-theming";
import { connect } from "react-redux";
import { Paginator, Button } from "../default";
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

const StatusButton = styled(Button)`
  padding: 2px 10px;
  font-size: 13px;
  text-transform: uppercase;
`;

const Users = ({
  addNotification,
  getUsers,
  updateUser,
  users,
  total,
}) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(null);

  useEffect(() => {
    getUsers({ page, limit });
  }, []);

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

  const searchUsers = value => {
    setSearch(value);
    getUsers({
      page,
      limit,
      search: value
    });
  };

  const onOrderChange = () => {
    getUsers({ page, limit, search });
  };

  const OrderTh = props => (
    <Th
      {...props}
      onClick={onOrderChange}
    />
  );

  const renderRow = (user, idx) => (
    <tr key={idx}>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{dayjs(user.created_at).format("YYYY-MM-DD HH:mm:ss")}</td>
      <td>
        <StatusButton
          type={user.status === "active" ? "success" : "danger"}
          onClick={() => changeUserStatus(user)}
        >
          {user.status}
        </StatusButton>
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
                <OrderTh field={"date"}>Register Date</OrderTh>
                <OrderTh field={"status"}>Status</OrderTh>
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
                search
              });
            }}
          />
        </CardBody>
      </Container>
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
