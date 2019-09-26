import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Card, CardBody, CardHeader} from '../../default/Card';
import { adminGetCreditUsageHistory } from '../../../store/history/actions';
import {connect} from 'react-redux';
import {withTheme} from 'emotion-theming';
import {Filters, LimitFilter, ListFilter, Table, Th, Thead} from '../../default/Table';
import {Button, Loader, Paginator} from '../../default';
import styled from '@emotion/styled';
import {useRouter} from 'next/router';
import Link from 'next/link';

const Container = styled(Card)` 
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
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

const FILTERS_ACTION_OPTIONS = [
  { value: 'all', label: 'All actions' },
  { value: 'added', label: 'Added action' },
  { value: 'used', label: 'Used action' },
];

const CreditUsage = ({ adminGetCreditUsageHistory, credits, total }) => {

  const router = useRouter();
  const [action, setFilterAction] = useState('all');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState({ value: '', field: '' });

  useEffect(() => {
    adminGetCreditUsageHistory({ page, limit, action, user: router.query.id, sort: order.field, order: order.value });
  }, []);

  const onOrderChange = (field, value) => {
    setOrder({ field, value });
    adminGetCreditUsageHistory({ page, limit, action, user: router.query.id, sort: field, order: value });
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
        <Header id={'back-portal'}>
          {
            <Back type={'primary'}>
              <Link href={'/admin/users'}><A>Back</A></Link>
            </Back>
          }
        </Header>
        <CardBody>
          <Filters>
            <LimitFilter onChange={({ value }) => {setLimit(value); adminGetCreditUsageHistory({ page, limit: value, action, user: router.query.id, sort: order.field, order: order.value }); }}/>
            <ListFilter options={FILTERS_ACTION_OPTIONS}
              onChange={({ value }) => {setFilterAction(value); adminGetCreditUsageHistory({ page, limit, action: value, user: router.query.id, sort: order.field, order: order.value }); }}
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
          <Paginator total={total} pageSize={limit} onChangePage={(page) => { setPage(page); adminGetCreditUsageHistory({ page, limit, action, user: router.query.id, sort: order.field, order: order.value }); }}/>
        </CardBody>
      </Container>
    </>
  );
};

CreditUsage.propTypes = {
  adminGetCreditUsageHistory: PropTypes.func.isRequired,
  credits: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  credits: state.history.credits,
  total: state.history.total,
});

const mapDispatchToProps = dispatch => ({
  adminGetCreditUsageHistory: query => dispatch(adminGetCreditUsageHistory(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CreditUsage));