import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paginator, SearchFilter, LimitFilter, TableHeader } from '../default'
import { CardBody, Table, Card, CardFooter } from 'reactstrap'

import { getUsers } from 'store/user/actions'
import UserTableRow from './UserTableRow'
import Skeleton from 'react-loading-skeleton'

const Users = () => {
  const dispatch = useDispatch()
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(null)
  const [order, setOrder] = useState({ value: '', field: '' })

  const loading = useSelector((state) => state.user.loading)

  /***
   * Dispatch the action
   */
  const onSearch = () => {
    return dispatch(
      getUsers({
        page,
        limit,
        sort: order.field,
        order: order.value,
        search,
      })
    )
  }

  useEffect(() => {
    onSearch()
  }, [])

  const users = useSelector((state) => state.user.users)
  const total = useSelector((state) => state.user.total)

  const onOrderChange = (field, value) => {
    setOrder({ field, value })
    onSearch()
  }

  const SortableTableHeader = (props) => (
    <TableHeader
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
      <CardBody className="table-wrapper">
        <div>
          <LimitFilter
            defaultValue={limit}
            onChange={(value) => {
              setLimit(value)
              onSearch()
            }}
            loading={loading}
          />
          <SearchFilter
            onChange={(value) => {
              setSearch(value)
              onSearch()
            }}
          />
        </div>
        {loading && <Skeleton count={5} />}
        {!loading && (
          <Table className="table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <SortableTableHeader field={'name'}>Name</SortableTableHeader>
                <SortableTableHeader field={'email'}>Email</SortableTableHeader>
                <SortableTableHeader field={'date'}>
                  Register Date
                </SortableTableHeader>
                <SortableTableHeader field={'status'}>
                  Active
                </SortableTableHeader>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return <UserTableRow user={user} key={user.id} />
              })}
            </tbody>
          </Table>
        )}
      </CardBody>
      <CardFooter>
        {!loading && (
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

export default Users
