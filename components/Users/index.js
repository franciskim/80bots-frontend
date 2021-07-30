import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { useSelector, useDispatch } from 'react-redux'
import { Paginator } from '../default'
import { CardBody, Button, Table, Card, CardFooter } from 'reactstrap'
import { SearchFilter, LimitFilter, Th } from '../default/Table'
import { NOTIFICATION_TYPES } from 'config'
import { addNotification } from 'lib/helpers'
import { updateStatus, getUsers } from 'store/user/actions'

import Skeleton from 'react-loading-skeleton'

const Users = () => {
  const dispatch = useDispatch()
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(null)
  const [order, setOrder] = useState({ value: '', field: '' })
  const [loadingAll, setLoadingAll] = useState(true)

  useEffect(() => {
    dispatch(getUsers({ page, limit })).then(() => {
      setLoadingAll(false)
    })
  }, [page, limit])

  const users = useSelector((state) => state.user.users)
  const total = useSelector((state) => state.user.total)

  const changeUserStatus = (user) => {
    dispatch(
      updateStatus(user.id, {
        status: user.status === 'active' ? 'inactive' : 'active',
      })
    ).then(() => {
      const status = user.status === 'active' ? 'deactivated' : 'activated'
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: `User was successfully ${status}`,
      })
    })
  }

  const searchUsers = (value) => {
    setSearch(value)
    dispatch(
      getUsers({
        page,
        limit,
        search: value,
      })
    )
  }

  const onOrderChange = (field, value) => {
    setOrder({ field, value })
    dispatch(getUsers({ page, limit, search }))
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

  const renderRow = (user) => (
    <tr key={user.id}>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{dayjs(user.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
      <td>
        <Button
          color={user.status === 'active' ? 'success' : 'danger'}
          size="sm"
          onClick={() => changeUserStatus(user)}
        >
          {user.status}
        </Button>
      </td>
    </tr>
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
                getUsers({
                  page,
                  limit: value,
                  search,
                })
              )
            }}
          />
          <SearchFilter
            searchProps={{
              onSearch: (value) => {
                searchUsers(value)
              },
            }}
          />
        </div>
        {loadingAll && <Skeleton count={5} />}
        {!loadingAll && (
          <Table responsive>
            <thead>
              <tr>
                <OrderTh field={'name'}>Name</OrderTh>
                <OrderTh field={'email'}>Email</OrderTh>
                <OrderTh field={'date'}>Register Date</OrderTh>
                <OrderTh field={'status'}>Status</OrderTh>
              </tr>
            </thead>
            <tbody>{users.map(renderRow)}</tbody>
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
              dispatch(
                getUsers({
                  page,
                  limit,
                  search,
                })
              )
            }}
          />
        )}
      </CardFooter>
    </Card>
  )
}

export default Users
