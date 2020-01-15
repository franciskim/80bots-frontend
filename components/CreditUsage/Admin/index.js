import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import AsyncSelect from 'react-select/async';
import styled from '@emotion/styled';
import {connect} from 'react-redux';
import {withTheme} from 'emotion-theming';
import {useRouter} from 'next/router';
import {Card, CardBody, CardHeader} from '/components/default/Card';
import {adminGetCreditUsageHistory} from '/store/history/actions';
import {getRunningBots} from '/store/bot/actions';
import {Filters, LimitFilter, ListFilter, Table, Th, Thead} from '/components/default/Table';
import {Button, Paginator} from '/components/default';

const Container = styled(Card)` 
  background: #333;
  border: none;
  color: #fff;
`;

const Header = styled(CardHeader)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Back = styled(Button)`
  padding: 0 5px;
  margin-right: 10px;
`;

const A = styled.a`
  color: inherit;
  text-decoration: none;
`;

const SelectWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
`;

const FILTERS_ACTION_OPTIONS = [
  {value: 'all', label: 'All actions'},
  {value: 'added', label: 'Added action'},
  {value: 'used', label: 'Used action'},
];

const CreditUsage = ({getHistory, credits, total, getRunningBots, runningBots}) => {

  const router = useRouter();
  const [action, setFilterAction] = useState('all');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState({value: '', field: ''});
  const [instanceId, setInstanceId] = useState(null);

  useEffect(() => {
    getHistory({page, limit, action, user: router.query.id});
    getRunningBots({page: 1, limit: 50});
  }, []);

  const onBotChange = (option) => {
    getHistory(
      {page, limit, action, user: router.query.id, sort: order.field, order: order.value, instanceId: option.value});
    setInstanceId(option.value);
  };

  const searchBots = (value, callback) => {
    getRunningBots({page: 1, limit: 50, search: value}).then(action => callback(action.data.data.map(toOptions)));
  };

  const toOptions = bot => ({
    value: bot.instance_id,
    label: bot.instance_id + '|' + bot.name,
  });

  const onOrderChange = (field, value) => {
    setOrder({field, value});
    getHistory({page, limit, action, user: router.query.id, sort: field, order: value, instanceId});
  };

  const onLimitChange = ({value}) => {
    setLimit(value);
    getHistory({
      page, limit, action: value, user: router.query.id, sort: order.field, order: order.value, instanceId,
    });
  };

  const onListChange = ({value}) => {
    setFilterAction(value);
    getHistory({
      page, limit, action: value, user: router.query.id, sort: order.field, order: order.value, instanceId,
    });
  };

  const onPageChange = (page) => {
    setPage(page);
    getHistory({page, limit, action, user: router.query.id, sort: order.field, order: order.value, instanceId});
  };

  const OrderTh = props => <Th {...props}
    // eslint-disable-next-line react/prop-types
                               order={(props.field === order.field) || (props.children === order.field)
                                 ? order.value
                                 : ''}
                               onClick={onOrderChange}
  />;

  const renderRow = (history, idx) => <tr key={idx}>
    <td>{history.credits}</td>
    <td>{history.total}</td>
    <td>{history.action}</td>
    <td>{history.subject}</td>
    <td>{history.date}</td>
  </tr>;

  return (
    <>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter onChange={onLimitChange}/>
            <SelectWrap>
              <AsyncSelect placeholder={'Select one of your running bots'} onChange={onBotChange}
                           loadOptions={searchBots} defaultOptions={runningBots.map(toOptions)}
              />
            </SelectWrap>
            <ListFilter options={FILTERS_ACTION_OPTIONS} onChange={onListChange}/>
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
            {credits.map(renderRow)}
            </tbody>
          </Table>
          <Paginator total={total} pageSize={limit} onChangePage={onPageChange}/>
        </CardBody>
      </Container>
    </>
  );
};

CreditUsage.propTypes = {
  getRunningBots: PropTypes.func.isRequired,
  runningBots: PropTypes.array.isRequired,
  getHistory: PropTypes.func.isRequired,
  credits: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  credits: state.history.credits,
  total: state.history.total,
  runningBots: state.bot.botInstances,
});

const mapDispatchToProps = dispatch => ({
  getHistory: query => dispatch(adminGetCreditUsageHistory(query)),
  getRunningBots: query => dispatch(getRunningBots(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CreditUsage));
