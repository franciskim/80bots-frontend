import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Card, CardBody} from '../default/Card';
import {getCreditUsageHistory} from '../../store/history/actions';
import {connect} from 'react-redux';
import {withTheme} from 'emotion-theming';
import {Filters, LimitFilter, ListFilter, Table, Thead} from '../default/Table';
import {Paginator} from '../default';
import styled from '@emotion/styled';

const Container = styled(Card)` 
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const FILTERS_ACTION_OPTIONS = [
  { value: 'all', label: 'All actions' },
  { value: 'added', label: 'Added action' },
  { value: 'used', label: 'Used action' },
];

const Subscription = ({ getCreditUsageHistory, credits, total }) => {

  const [action, setFilterAction] = useState('all');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getCreditUsageHistory({ limit, page, action });
  }, []);

  const renderRow = (history, idx) => <tr key={idx}>
    <td>{ history.credit }</td>
    <td>{ history.action }</td>
    <td>{ history.subject }</td>
    <td>{ history.date }</td>
  </tr>;

  return(
    <>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter onChange={({ value }) => {setLimit(value); getCreditUsageHistory({ page, limit: value, action }); }}/>
            <ListFilter options={FILTERS_ACTION_OPTIONS}
              onChange={({ value }) => {setFilterAction(value); getCreditUsageHistory({ page, limit, action: value }); }}
            />
          </Filters>
          <Table responsive>
            <Thead>
              <tr>
                <th>Credits</th>
                <th>Action</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </Thead>
            <tbody>
              { credits.map(renderRow) }
            </tbody>
          </Table>
          <Paginator total={total} pageSize={limit} onChangePage={(page) => { setPage(page); getCreditUsageHistory({ page, limit, action }); }}/>
        </CardBody>
      </Container>
    </>
  );
};

Subscription.propTypes = {
  getCreditUsageHistory: PropTypes.func.isRequired,
  credits: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  credits: state.history.credits,
  total: state.history.total,
});

const mapDispatchToProps = dispatch => ({
  getCreditUsageHistory: query => dispatch(getCreditUsageHistory(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Subscription));