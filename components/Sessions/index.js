import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { withTheme } from 'emotion-theming';
import { Card, CardBody } from '../default/Card';
import { Table, Thead, Filters, SearchFilter, LimitFilter } from '../default/Table';
import { addNotification } from 'store/notification/actions';
import { connect } from 'react-redux';

const Container = styled(Card)`
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const TEMP_SESSIONS = [
  { user: 'some@email.com', instance_id: 12312, type: 'start', date: new Date().toISOString() },
  { user: 'some@email.com', instance_id: 123132112, type: 'stop', date: new Date().toISOString() },
  { user: 'some@email.com', instance_id: 132132312, type: 'stop', date: new Date().toISOString() },
];

const Sessions = ({ theme, addNotification }) => {
  const renderRow = (session, idx) => <tr key={idx}>
    <td>{ session.user }</td>
    <td>{ session.instance_id }</td>
    <td>{ session.type }</td>
    <td>{ session.date }</td>
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
                <th>User</th>
                <th>Instance Id</th>
                <th>Type</th>
                <th>Date & Time</th>
              </tr>
            </Thead>
            <tbody>
              { TEMP_SESSIONS.map(renderRow) }
            </tbody>
          </Table>
        </CardBody>
      </Container>
    </>
  );
};

Sessions.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  addNotification: payload => dispatch(addNotification(payload))
});

export default connect(null, mapDispatchToProps)(withTheme(Sessions));