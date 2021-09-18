import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import DeployBotModal from './DeployBotModal'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Table,
} from 'reactstrap'
import {
  Paginator,
  SearchFilter,
  LimitFilter,
  TableHeader,
} from 'components/default'

import { useDispatch, useSelector } from 'react-redux'
import SweetAlert from 'react-bootstrap-sweetalert'
import Skeleton from 'react-loading-skeleton'
import BotTableRow from './BotTableRow'
import { syncLocalBots, getBots, deleteBot } from 'store/bot/actions'
import { addNotification } from 'lib/helpers'
import { NOTIFICATION_TYPES } from 'config'
import { addListener, removeAllListeners } from 'store/socket/actions'

const Bots = () => {
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState({ value: '', field: '' })
  const [search, setSearch] = useState(null)
  const [limit, setLimit] = useState(20)
  const [clickedBot, setClickedBot] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const syncLoading = useSelector((state) => state.bot.syncLoading)
  const bots = useSelector((state) => state.bot.bots)
  const total = useSelector((state) => state.bot.total)
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.bot.loading)
  const botsLoading = useSelector((state) => state.bot.botsLoading)

  useEffect(() => {
    dispatch(getBots({ page, limit })).then(() => {
      setPage(1)
    })
    dispatch(
      addListener(`bots.${user.id}`, 'BotsSyncSucceeded', () => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Sync completed',
        })
      })
    )
    return () => {
      dispatch(removeAllListeners())
    }
  }, [page, limit])

  const onSearch = () => {
    return dispatch(
      getBots({
        page,
        limit,
        sort: order.field,
        order: order.value,
        search,
      })
    )
  }

  const handleDeleteBot = () => {
    dispatch(deleteBot(clickedBot.id))
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Bot removed!',
        })
        setClickedBot(null)
        setIsDeleteModalOpen(false)
      })
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Bot delete failed',
        })
      )
  }

  const sync = () => {
    dispatch(syncLocalBots())
      .then(() =>
        addNotification({
          type: NOTIFICATION_TYPES.INFO,
          message: 'Sync started',
        })
      )
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Sync cannot be started',
        })
      )
  }

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
      <CardHeader>
        <ButtonGroup>
          <Button color="success" outline onClick={() => Router.push('bot')}>
            Add Bot
          </Button>
          <Button
            color="primary"
            outline
            onClick={sync}
            loading={`${syncLoading}`}
          >
            Sync Bots
          </Button>
        </ButtonGroup>
      </CardHeader>
      <CardBody className="table-wrapper">
        <div>
          <LimitFilter
            defaultValue={limit}
            total={total}
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
                <SortableTableHeader field={'name'}>
                  Bot Name
                </SortableTableHeader>
                <SortableTableHeader field={'type'}>
                  Bot Type
                </SortableTableHeader>
                <th field={'description'}>Description</th>
                <th>Tags</th>
                <SortableTableHeader field={'status'}>
                  Active
                </SortableTableHeader>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bots.map((bot) => {
                return (
                  <BotTableRow
                    bot={bot}
                    setIsModalOpen={setIsModalOpen}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    setClickedBot={setClickedBot}
                    key={bot.id}
                    botsLoading={botsLoading[bot.id]}
                  />
                )
              })}
            </tbody>
          </Table>
        )}

        <DeployBotModal
          bot={clickedBot}
          isOpen={isModalOpen}
          onClose={() => {
            setClickedBot(null)
            setIsModalOpen(false)
          }}
        />

        {isDeleteModalOpen && (
          <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes"
            confirmBtnBsStyle="danger"
            title="Delete selected bot?"
            onConfirm={handleDeleteBot}
            onCancel={() => {
              setIsDeleteModalOpen(false)
            }}
            focusCancelBtn
          />
        )}
      </CardBody>
      <CardFooter>
        {!loading && (
          <Paginator
            total={total}
            pageSize={limit}
            initialPage={page}
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

export default Bots
