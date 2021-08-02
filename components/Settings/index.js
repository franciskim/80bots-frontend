import React, { useState, useEffect } from 'react'
import SettingsEditor from './SettingsEditor'
import { useSelector, useDispatch } from 'react-redux'
import { LimitFilter, SearchFilter, Th } from 'components/default/Table'
import {
  CardBody,
  Button,
  Table,
  Card,
  CardHeader,
  CardFooter,
} from 'reactstrap'
import { getRegions } from 'store/bot/actions'
import { Paginator } from 'components/default'
import { NOTIFICATION_TYPES } from 'config'
import { addNotification } from 'lib/helpers'
import { addListener, removeAllListeners } from 'store/socket/actions'
import Skeleton from 'react-loading-skeleton'
import SettingTableRow from './SettingTableRow'
import EditDefaultAMIModal from './EditDefaultAMIModal'

const Settings = () => {
  const dispatch = useDispatch()
  const [clickedRegion, setClickedRegion] = useState(null)
  const [limit, setLimit] = useState(20)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState({ value: '', field: '' })
  const [search, setSearch] = useState(null)
  const [loadingAll, setLoadingAll] = useState(true)
  const [loadingAllAfterSync, setLoadingAllAfterSync] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditSettingsModalOpened, setIsEditSettingsModalOpened] =
    useState(false)

  const user = useSelector((state) => state.auth.user)
  const regions = useSelector((state) => state.bot.regions)
  const total = useSelector((state) => state.bot.totalRegions)

  useEffect(() => {
    dispatch(getRegions({ page, limit })).then(() => {
      setLoadingAll(false)
    })

    dispatch(
      addListener(`regions.${user.id}`, 'RegionsSyncSucceeded', () => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Sync completed',
        })
        setLoadingAllAfterSync(true)
      })
    )
    return () => {
      dispatch(removeAllListeners())
    }
  }, [])

  useEffect(() => {
    if (loadingAllAfterSync) {
      dispatch(
        getRegions({
          page,
          limit,
          sort: order.field,
          order: order.value,
          search,
        }).then(() => {
          setLoadingAll(false)
          setLoadingAllAfterSync(false)
        })
      )
    }
  }, [loadingAllAfterSync])

  const openEditModal = (region) => {
    setClickedRegion(region)
    setIsModalOpen(true)
  }

  const onOrderChange = (field, value) => {
    setOrder({ field, value })
    dispatch(getRegions({ page, limit, sort: field, order: value, search }))
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

  const searchRegions = (value) => {
    setSearch(value)
    dispatch(
      getRegions({
        page,
        limit,
        sort: order.field,
        order: order.value,
        search: value,
      })
    )
  }

  return (
    <Card>
      <CardHeader>
        <Button
          color="success"
          outline
          onClick={() => {
            setIsEditSettingsModalOpened(true)
          }}
        >
          Edit Global Bot Settings
        </Button>
      </CardHeader>
      <CardBody>
        <div>
          <LimitFilter
            id="limitfilter"
            instanceId="limitfilter"
            onChange={({ value }) => {
              setLimit(value)
              getRegions({
                page,
                limit: value,
                sort: order.field,
                order: order.value,
                search,
              })
            }}
          />
          <SearchFilter
            searchProps={{
              onSearch: (value) => {
                searchRegions(value)
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
                <SortableTableHeader field={'code'}>Code</SortableTableHeader>
                <SortableTableHeader field={'limit'}>Limit</SortableTableHeader>
                <SortableTableHeader field={'used_limit'}>
                  Used Limit
                </SortableTableHeader>
                <th>Default AMI</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => {
                return (
                  <SettingTableRow
                    region={region}
                    openEditModal={openEditModal}
                    key={region.id}
                  />
                )
              })}
            </tbody>
          </Table>
        )}
        <EditDefaultAMIModal
          onClose={() => {
            setIsModalOpen(false)
            setClickedRegion(null)
          }}
          isOpen={isModalOpen}
          region={clickedRegion}
        />
        <SettingsEditor
          isOpen={isEditSettingsModalOpened}
          onClose={() => {
            setIsEditSettingsModalOpened(false)
          }}
        />
      </CardBody>
      <CardFooter>
        {!loadingAll && (
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={(page) => {
              setPage(page)
              dispatch(
                getRegions({
                  page,
                  limit,
                  sort: order.field,
                  order: order.value,
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

export default Settings
