import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paginator, SearchFilter, LimitFilter, TableHeader } from '../default'
import { CardBody, Table, Card, CardFooter } from 'reactstrap'

import { getUsers } from 'store/user/actions'
import UserTableRow from './UserTableRow'
import Skeleton from 'react-loading-skeleton'

const Users = () => {
  const dispatch = useDispatch()
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(null)
  const [order, setOrder] = useState({ value: '', field: '' })

  const [loadingAll, setLoadingAll] = useState(true)

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
    onSearch().then(() => {
      setLoadingAll(false)
    })
  }, [page, limit])

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

export default Users
