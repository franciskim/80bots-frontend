import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Button from '../default/Button';
import Badge from '../default/Badge';
import { Card, CardBody } from '../default/Card';
import { Table, Thead } from '../default/Table';
import { connect } from 'react-redux';
import { getBots, launchInstance } from 'store/bot/actions';
import Paginator from '../default/Paginator';
import {NOTIFICATION_TYPES} from '../../config';

const Container = styled(Card)`
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const Launch = styled(Button)`
  padding: 0 10px;
  font-size: 16px;
`;

const Tag = styled(Badge)`
  margin-right: .5rem;
  font-size: 14px;
  &:last-child {
    margin-right: 0;
  }
`;

const Bots = ({ getBots, launchInstance, bots, paginate }) => {

  useEffect(() => {
    getBots();
  }, []);

  const renderRow = (bot, idx) => <tr key={idx}>
    <td>{ bot.name }</td>
    <td>{ bot.description }</td>
    <td>{ bot.platform }</td>
    <td>{ bot.tags.map((tag, idx) => <Tag key={idx} pill type={'info'}>{ tag['name'] }</Tag>) }</td>
    <td><Launch type={'primary'} onClick={(e) => launchInstance(bot.id, e)}>Launch</Launch></td>
  </tr>;

  return(
    <Container>
      <CardBody>
        <Table responsive>
          <Thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Platform</th>
              <th>Tags</th>
              <th>Action</th>
            </tr>
          </Thead>
          <tbody>
            { bots.map(renderRow) }
          </tbody>
        </Table>
        <Paginator total={paginate.total} pageSize={1} onChangePage={getBots}/>
      </CardBody>
    </Container>
  );
};

Bots.propTypes = {
  getBots: PropTypes.func.isRequired,
  launchInstance: PropTypes.func.isRequired,
  bots: PropTypes.array.isRequired,
  paginate: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  bots: state.bot.bots,
  paginate: state.bot.paginate,
});

const mapDispatchToProps = dispatch => ({
  getBots: (page) => dispatch(getBots(page)),
  launchInstance: (id) => dispatch(launchInstance(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Bots);