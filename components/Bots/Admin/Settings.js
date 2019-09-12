import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Filters, LimitFilter, SearchFilter, Table, Thead } from 'components/default/Table';
import { Card, CardBody } from 'components/default/Card';
import { connect } from 'react-redux';
import { adminGetRegions } from 'store/bot/actions';
import { Paginator } from 'components/default';

const Container = styled(Card)` 
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const Settings = ({ regions, total, getRegions }) => {
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getRegions({ page, limit });
  }, []);

  const renderRow = (region, idx) => <tr key={idx}>
    <td>{ region.name }</td>
    <td>{ region.code }</td>
    <td>{ region.limit }</td>
    <td>{ region.created_instances }</td>
  </tr>;

  return(
    <Container>
      <CardBody>
        <Filters>
          <LimitFilter onChange={({ value }) => {setLimit(value); getRegions({ page, limit: value }); }}/>
          <SearchFilter onChange={console.log}/>
        </Filters>
        <Table responsive>
          <Thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Limit</th>
              <th>Used Limit</th>
            </tr>
          </Thead>
          <tbody>
            { regions.map(renderRow) }
          </tbody>
        </Table>
        <Paginator total={total} pageSize={limit}
          onChangePage={(page) => { setPage(page); getRegions({ page, limit }); }}
        />
      </CardBody>
    </Container>
  );
};

Settings.propTypes = {
  regions:    PropTypes.array.isRequired,
  total:      PropTypes.number.isRequired,
  getRegions: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  regions: state.bot.regions,
  total: state.bot.totalRegions
});

const mapDispatchToProps = dispatch => ({
  getRegions: (...args) => dispatch(adminGetRegions(...args))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
