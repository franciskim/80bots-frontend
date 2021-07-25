import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { useSelector, useDispatch } from 'react-redux'
import { Paginator } from '../default'
import { CardBody, Button, Table } from 'reactstrap'
import { SearchFilter, LimitFilter, Th } from '../default/Table'
import { NOTIFICATION_TYPES } from 'config'
import { addNotification } from 'store/notification/actions'
import { updateStatus } from 'store/user/actions'
import { getUsers } from 'store/user/actions'

const Users = () => {
  const dispatch = useDispatch()
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(null)

  useEffect(() => {
    dispatch(getUsers({ page, limit }))
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
      dispatch(
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: `User was successfully ${status}`,
        })
      )
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

  const onOrderChange = () => {
    dispatch(getUsers({ page, limit, search }))
  }

  const OrderTh = (props) => <Th {...props} onClick={onOrderChange} />

  const renderRow = (user) => (
    <tr key={user.id}>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{dayjs(user.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
      <td>
        <Button
          color={user.status === 'active' ? 'success' : 'danger'}
          onClick={() => changeUserStatus(user)}
        >
          {user.status}
        </Button>
      </td>
    </tr>
  )

  return (
    <>
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
            onChange={(value) => {
              searchUsers(value)
            }}
          />
        </div>
        <Table>
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
      </CardBody>
    </>
  )
}

export default Users
