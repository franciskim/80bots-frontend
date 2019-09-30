import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Card, CardBody} from '../default/Card';
import {getCreditUsageHistory} from '../../store/history/actions';
import { getRunningBots } from 'store/bot/actions';
import {connect} from 'react-redux';
import {withTheme} from 'emotion-theming';
import {Filters, LimitFilter, ListFilter, Table, Th, Thead} from '../default/Table';
import {Paginator} from '../default';
import styled from '@emotion/styled';
import AsyncSelect from 'react-select/async';

const Container = styled(Card)` 
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const SelectWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 5px;
`;

const FILTERS_ACTION_OPTIONS = [
  { value: 'all', label: 'All actions' },
  { value: 'added', label: 'Added action' },
  { value: 'used', label: 'Used action' },
];

const CreditUsage = ({ getCreditUsageHistory, credits, total, getRunningBots, runningBots }) => {

  const [action, setFilterAction] = useState('all');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState({ value: '', field: '' });
  const [instanceId, setInstanceId] = useState(null);

  useEffect(() => {
    getCreditUsageHistory({ page, limit, action });
    getRunningBots({ page: 1, limit: 50 });
  }, []);

  const onBotChange = (option) => {
    getCreditUsageHistory({ page, limit, action, sort: order.field, order: order.value, instanceId: option.value });
    setInstanceId(option.value);
  };

  const searchBots = (value, callback) => {
    getRunningBots({ page: 1, limit: 50, search: value })
      .then(action => callback(action.data.data.map(toOptions)));
  };

  const toOptions = bot => ({
    value: bot.instance_id,
    label: bot.instance_id + '|' + bot.name
  });

  const onOrderChange = (field, value) => {
    setOrder({ field, value });
    getCreditUsageHistory({ page, limit, action, sort: field, order: value, instanceId });
  };

  // eslint-disable-next-line react/prop-types
  const OrderTh = props => <Th {...props}
    // eslint-disable-next-line react/prop-types
    order={(props.field === order.field) || (props.children === order.field) ? order.value : ''}
    onClick={onOrderChange}
  />;

  const renderRow = (history, idx) => <tr key={idx}>
    <td>{ history.credits }</td>
    <td>{ history.total }</td>
    <td>{ history.action }</td>
    <td>{ history.subject }</td>
    <td>{ history.date }</td>
  </tr>;

  return(
    <>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter onChange={({ value }) => {setLimit(value); getCreditUsageHistory({ page, limit: value, action, sort: order.field, order: order.value, instanceId }); }}/>

            <SelectWrap>
              <Label>Select one of your running bots</Label>
              <AsyncSelect onChange={onBotChange} loadOptions={searchBots} defaultOptions={runningBots.map(toOptions)}/>
            </SelectWrap>

            <ListFilter options={FILTERS_ACTION_OPTIONS}
              onChange={({ value }) => {setFilterAction(value); getCreditUsageHistory({ page, limit, action: value, sort: order.field, order: order.value, instanceId }); }}
            />
          </Filters>
          <Table responsive>
            <Thead>
              <tr>
                <OrderTh field={'credits'}>Credits</OrderTh>
                <OrderTh field={'total'}>Total</OrderTh>
                <OrderTh field={'action'}>Action</OrderTh>
                <OrderTh field={'description'}>Description</OrderTh>
                <OrderTh field={'date'}>Date</OrderTh>
              </tr>
            </Thead>
            <tbody>
              { credits.map(renderRow) }
            </tbody>
          </Table>
          <Paginator total={total} pageSize={limit} onChangePage={(page) => { setPage(page); getCreditUsageHistory({ page, limit, action, sort: order.field, order: order.value, instanceId }); }}/>
        </CardBody>
      </Container>
    </>
  );
};

CreditUsage.propTypes = {
  getCreditUsageHistory: PropTypes.func.isRequired,
  credits: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  getRunningBots: PropTypes.func.isRequired,
  runningBots: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  credits: state.history.credits,
  total: state.history.total,
  runningBots: state.bot.botInstances,
});

const mapDispatchToProps = dispatch => ({
  getCreditUsageHistory: query => dispatch(getCreditUsageHistory(query)),
  getRunningBots: query => dispatch(getRunningBots(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CreditUsage));