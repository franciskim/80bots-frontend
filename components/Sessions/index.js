import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { withTheme } from "emotion-theming";
import { connect } from "react-redux";
import { Card, CardBody } from "../default/Card";
import { Table, Thead, Filters, LimitFilter } from "../default/Table";
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

  useEffect(() => {
    getSessions();
  }, []);

  const renderRow = (session, idx) => (
    <tr key={idx}>
      <td>{session.user}</td>
      <td>{session.instance_id}</td>
      <td>{session.type}</td>
      <td>{dayjs(session.time).format("YYYY-MM-DD HH:mm:ss")}</td>
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
                getSessions({ page, limit: value });
              }}
            />
          </Filters>
          <Table>
            <Thead>
              <tr>
                <th>User</th>
                <th>Instance Id</th>
                <th>Type</th>
                <th>Date & Time</th>
              </tr>
            </Thead>
            <tbody>{sessions.map(renderRow)}</tbody>
          </Table>
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={page => {
              setPage(page);
              getSessions({ page, limit });
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
