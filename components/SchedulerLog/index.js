import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardBody, CardFooter, Table } from 'reactstrap'
import { LimitFilter, SearchFilter, Th } from '../default/Table'
import { getSessions } from 'store/instanceSession/actions'
import { Paginator } from 'components/default'
import Skeleton from 'react-loading-skeleton'

const SchedulerLog = () => {
  const dispatch = useDispatch()
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(null)
  const [order, setOrder] = useState({ value: '', field: '' })
  const [loadingAll, setLoadingAll] = useState(true)

  useEffect(() => {
    dispatch(getSessions({ page, limit })).then(() => {
      setLoadingAll(false)
    })
  }, [])

  const sessions = useSelector((state) => state.instanceSession.sessions)
  const total = useSelector((state) => state.instanceSession.total)

  const renderRow = (session) => (
    <tr key={session.id}>
      <td>{session.user}</td>
      <td>{session.instance_id}</td>
      <td>{session.type}</td>
      <td>{dayjs(session.date).format('YYYY-MM-DD hh:mm A')}</td>
      <td>{session.time_zone}</td>
      <td>{session.status}</td>
    </tr>
  )

  const onOrderChange = (field, value) => {
    setOrder({ field, value })
    dispatch(getSessions({ page, limit, search }))
  }

  const OrderTh = (props) => (
    <Th
      {...props}
      order={
        props.field === order.field || props.children === order.field
          ? order.value
          : ''
      }
      onClick={onOrderChange}
    />
  )

  return (
    <Card>
      <CardBody>
        <div>
          <LimitFilter
            id="limitfilter"
            instanceId="limitfilter"
            onChange={({ value }) => {
              setLimit(value)
              dispatch(
                getSessions({
                  page,
                  limit: value,
                  search,
                })
              )
            }}
          />
          <SearchFilter
            searchProps={{
              onSearch: (e) => {
                console.error('onSearch', e)
              },
            }}
          />
        </div>
        {loadingAll && <Skeleton count={5} />}
        {!loadingAll && (
          <Table responsive>
            <thead>
              <tr>
                <OrderTh field={'user'}>User</OrderTh>
                <OrderTh field={'instance_id'}>Instance Id</OrderTh>
                <OrderTh field={'type'}>Type</OrderTh>
                <OrderTh field={'date'}>Date & Time</OrderTh>
                <OrderTh field={'timezone'}>Time Zone</OrderTh>
                <OrderTh field={'status'}>Status</OrderTh>
              </tr>
            </thead>
            <tbody>{sessions.map(renderRow)}</tbody>
          </Table>
        )}
      </CardBody>
      <CardFooter>
        {!loadingAll && (
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={(page) => {
              setPage(page)
              dispatch(getSessions({ page, limit, search }))
            }}
          />
        )}
      </CardFooter>
    </Card>
  )
}

export default SchedulerLog
