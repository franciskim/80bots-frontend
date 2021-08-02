import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Paginator } from '../default'
import { CardBody, Table, Card, CardFooter } from 'reactstrap'
import { SearchFilter, LimitFilter, Th } from '../default/Table'
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

  useEffect(() => {
    dispatch(getUsers({ page, limit })).then(() => {
      setLoadingAll(false)
    })
  }, [page, limit])

  const users = useSelector((state) => state.user.users)
  const total = useSelector((state) => state.user.total)

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
                <SortableTableHeader field={'name'}>Name</SortableTableHeader>
                <SortableTableHeader field={'email'}>Email</SortableTableHeader>
                <SortableTableHeader field={'date'}>
                  Register Date
                </SortableTableHeader>
                <SortableTableHeader field={'status'}>
                  Status
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
