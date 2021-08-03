import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardBody, CardFooter, Table } from 'reactstrap'
import { SearchFilter, Paginator, LimitFilter } from 'components/default'
import { Th } from '../default/Table'
import ScheduleLogTableRow from './ScheduleLogTableRow'
import { getSessions } from 'store/instanceSession/actions'

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

  const onSearch = () => {
    return dispatch(
      getSessions({
        page,
        limit,
        sort: order.field,
        order: order.value,
        search,
      })
    )
  }

  const sessions = useSelector((state) => state.instanceSession.sessions)
  const total = useSelector((state) => state.instanceSession.total)

  const onOrderChange = (field, value) => {
    setOrder({ field, value })
    dispatch(getSessions({ page, limit, search }))
  }

  const SortableTableHeader = (props) => (
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
              onSearch()
            }}
          />
          <SearchFilter
            onChange={(value) => {
              setSearch(value)
              onSearch()
            }}
          />
        </div>
        {loadingAll && <Skeleton count={5} />}
        {!loadingAll && (
          <Table responsive>
            <thead>
              <tr>
                <SortableTableHeader field={'user'}>User</SortableTableHeader>
                <SortableTableHeader field={'instance_id'}>
                  Instance Id
                </SortableTableHeader>
                <SortableTableHeader field={'type'}>Type</SortableTableHeader>
                <SortableTableHeader field={'date'}>
                  Date & Time
                </SortableTableHeader>
                <SortableTableHeader field={'timezone'}>
                  Time Zone
                </SortableTableHeader>
                <SortableTableHeader field={'status'}>
                  Status
                </SortableTableHeader>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                return (
                  <ScheduleLogTableRow session={session} key={session.id} />
                )
              })}
            </tbody>
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
              onSearch()
            }}
          />
        )}
      </CardFooter>
    </Card>
  )
}

export default SchedulerLog
