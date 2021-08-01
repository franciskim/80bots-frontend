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
import { Paginator } from 'components/default'
import { LimitFilter, SearchFilter, Th } from 'components/default/Table'
import { useDispatch, useSelector } from 'react-redux'
import SweetAlert from 'react-bootstrap-sweetalert'
import Skeleton from 'react-loading-skeleton'
import BotTableRow from './BotTableRow'
import { syncLocalBots, getBots, deleteBot } from 'store/bot/actions'
import { addNotification } from 'lib/helpers'
import { NOTIFICATION_TYPES } from 'config'
import { addListener } from 'store/socket/actions'

const Bots = () => {
  const dispatch = useDispatch()
  const [clickedBot, setClickedBot] = useState(null)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState({ value: '', field: '' })
  const [search, setSearch] = useState(null)
  const [loadingAll, setLoadingAll] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const syncLoading = useSelector((state) => state.bot.syncLoading)
  const bots = useSelector((state) => state.bot.bots)
  const total = useSelector((state) => state.bot.total)
  const user = useSelector((state) => state.auth.user)
  const limit = useSelector((state) => state.bot.limit)

  useEffect(() => {
    dispatch(getBots({ page, limit })).then(() => {
      setLoadingAll(false)
    })
    dispatch(
      addListener(`bots.${user.id}`, 'BotsSyncSucceeded', () => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Sync completed',
        })
        dispatch(
          getBots({
            page,
            limit,
            sort: order.field,
            order: order.value,
            search,
          })
        )
        setPage(1)
      })
    )
    return setPage(1)
  }, [page, limit])

  // const launchBot = (params) => {
  //   setIsDeleteModalOpen(false)
  //   dispatch(launchInstance(clickedBot.id, params))
  //     .then(() => {
  //       addNotification({
  //         type: NOTIFICATION_TYPES.INFO,
  //         message: 'New bot instance is deploying',
  //       })
  //     })
  //     .catch((action) => {
  //       addNotification({
  //         type: NOTIFICATION_TYPES.ERROR,
  //         message:
  //           action.error?.response?.data?.message ||
  //           'Error occurred during new instance launch',
  //         delay: 1500,
  //       })
  //     })
  // }

  const getDeleteBot = () => {
    dispatch(deleteBot(clickedBot.id))
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Bot removed!',
        })
        setClickedBot(null)
        dispatch(
          getBots({
            page,
            limit,
            sort: order.field,
            order: order.value,
            search,
          })
        )
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
    dispatch(getBots({ page, limit, sort: field, order: value, search }))
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

  const searchBots = (value) => {
    setSearch(value)
    dispatch(
      getBots({
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
            Sync Bots From Repo
          </Button>
        </ButtonGroup>
      </CardHeader>
      <CardBody>
        <div>
          <LimitFilter
            id="limitfilter"
            instanceId="limitfilter"
            defaultValue={limit}
            onChange={({ value }) => {
              // setLimit(value)
              dispatch(
                getBots({
                  page,
                  limit: value,
                  sort: order.field,
                  order: order.value,
                  search,
                })
              )
            }}
          />
          <SearchFilter
            searchProps={{
              onSearch: (value) => {
                searchBots(value)
              },
            }}
          />
        </div>
        {loadingAll && <Skeleton count={5} />}
        {!loadingAll && (
          <Table responsive>
            <thead>
              <tr>
                <OrderTh field={'name'}>Bot Name</OrderTh>
                <OrderTh field={'type'}>Bot Type</OrderTh>
                <OrderTh field={'description'}>Description</OrderTh>
                <th>Tags</th>
                <OrderTh field={'status'}>Status</OrderTh>
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
                  />
                )
              })}
            </tbody>
          </Table>
        )}

        <DeployBotModal
          bot={clickedBot}
          isModalOpen={isModalOpen}
          setClickedBot={setClickedBot}
          setIsModalOpen={setIsModalOpen}
        />

        {isDeleteModalOpen && (
          <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes"
            confirmBtnBsStyle="danger"
            title="Delete selected bot?"
            onConfirm={getDeleteBot}
            onCancel={() => {
              setIsDeleteModalOpen(false)
            }}
            focusCancelBtn
          />
        )}
      </CardBody>
      <CardFooter>
        {!loadingAll && (
          <Paginator
            total={total}
            pageSize={limit}
            initialPage={page}
            onChangePage={(page) => {
              setPage(page)
              dispatch(
                getBots({
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

export default Bots
