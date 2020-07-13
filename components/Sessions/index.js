import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { withTheme } from "emotion-theming";
import { connect } from "react-redux";
import { Card, CardBody } from "../default/Card";
import {Table, Thead, Filters, LimitFilter, SearchFilter, Th} from "../default/Table";
import { addNotification } from "/store/notification/actions";
import { getSessions } from "/store/instanceSession/actions";
import { Paginator } from "/components/default";

const Container = styled(Card)`
  background: #333;
  border: none;
  color: #fff;
`;

const Sessions = ({ getSessions, sessions, total }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(null);

  useEffect(() => {
    getSessions({ page, limit });
  }, []);

  const renderRow = (session, idx) => (
    <tr key={idx}>
      <td>{session.user}</td>
      <td>{session.instance_id}</td>
      <td>{session.type}</td>
      <td>{dayjs(session.time).format("YYYY-MM-DD hh:mm A")}</td>
      <td>{session.time_zone}</td>
      <td>{session.status}</td>
    </tr>
  );

  const searchSession = value => {
    setSearch(value);
    getSessions({
      page,
      limit,
      search: value
    });
  };

  const onOrderChange = () => {
      getSessions({ page, limit, search });
  };

  const OrderTh = props => (
    <Th
        {...props}
        onClick={onOrderChange}
    />
  );

  return (
    <>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter
                onChange={({ value }) => {
                  setLimit(value);
                  getSessions({
                    page,
                    limit: value,
                    search
                  });
                }}
            />
            <SearchFilter
                onChange={value => {
                  searchSession(value);
                }}
            />
          </Filters>
          <Table>
            <Thead>
              <tr>
                <OrderTh field={"user"}>User</OrderTh>
                <OrderTh field={"instance_id"}>Instance Id</OrderTh>
                <OrderTh field={"type"}>Type</OrderTh>
                <OrderTh field={"date"}>Date & Time</OrderTh>
                <OrderTh field={"timezone"}>Time Zone</OrderTh>
                <OrderTh field={"status"}>Status</OrderTh>
              </tr>
            </Thead>
            <tbody>{sessions.map(renderRow)}</tbody>
          </Table>
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={page => {
              setPage(page);
              getSessions({ page, limit, search });
            }}
          />
        </CardBody>
      </Container>
    </>
  );
};

Sessions.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  getSessions: PropTypes.func.isRequired,
  sessions: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  sessions: state.instanceSession.sessions,
  total: state.instanceSession.total
});

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload)),
  getSessions: query => dispatch(getSessions(query))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Sessions));
