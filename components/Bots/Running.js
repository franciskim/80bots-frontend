import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CardBody,
  Button,
  ButtonGroup,
  Card,
  Table,
  CardHeader,
  CardFooter,
} from 'reactstrap'
import {
  SearchFilter,
  Paginator,
  LimitFilter,
  ListFilter,
  TableHeader,
} from 'components/default'
import { addNotification } from 'lib/helpers'
import { NOTIFICATION_TYPES } from 'config'
import {
  copyInstance,
  restoreBot,
  getRunningBots,
  updateRunningBot,
  botInstanceUpdated,
  syncBotInstances,
} from 'store/bot/actions'
import {
  addListener,
  removeAllListeners,
  subscribe as wsSubscribe,
  unsubscribe as wsUnsubscribe,
} from 'store/socket/actions'
import Skeleton from 'react-loading-skeleton'

import RunningBotTableRow from './RunningBotTableRow'

import {
  openScriptNotification,
  closeScriptNotification,
  flushScriptNotification,
} from 'store/scriptNotification/actions'

const FILTERS_LIST_OPTIONS = [
  { value: 'all', label: 'All Instances' },
  { value: 'my', label: 'My Instances' },
]

const RunningBots = () => {
  const dispatch = useDispatch()

  const [list, setFilterList] = useState('all')
  const [limit, setLimit] = useState(20)
  const [order, setOrder] = useState({ value: '', field: '' })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(null)

  const user = useSelector((state) => state.auth.user)
  const botInstances = useSelector((state) => state.bot.botInstances)
  const total = useSelector((state) => state.bot.total)
  const syncLoading = useSelector((state) => state.bot.syncLoading)
  const loading = useSelector((state) => state.bot.loading)
  const settings_channel = useSelector(
    (state) => state.scriptNotification.settings_channel
  )
  const runningBotsLoading = useSelector(
    (state) => state.bot.runningBotsLoading
  )

  const onSearch = () => {
    return dispatch(
      getRunningBots({
        page,
        limit,
        list,
        sort: order.field,
        order: order.value,
        search,
      })
    )
  }

  useEffect(() => {
    dispatch(getRunningBots({ page, limit, list }))
  }, [])

  useEffect(() => {
    if (botInstances.length === 0) return

    dispatch(
      addListener(`running.${user.id}`, 'InstanceLaunched', (event) => {
        console.error('Received socket message InstanceLaunched', event)
        const { status } = event.instance
        if (event.instance) {
          dispatch(botInstanceUpdated(event.instance))
          addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            message: `Bot ${event.instance.bot_name} successfully ${
              status === 'running' ? 'launched' : status
            }`,
          })
        }
      })
    )

    dispatch(
      addListener(`running.${user.id}`, 'InstanceStatusUpdated', (data) => {
        const botInstance = botInstances.find(
          (instance) => instance.id === data.instanceId
        )
        if (botInstance) {
          botInstance.status = data.status
          dispatch(botInstanceUpdated(botInstance))
        } else {
          console.error('Botinstance is not found')
        }
      })
    )

    dispatch(
      addListener(`bots.${user.id}`, 'BotsSyncSucceeded', () => {
        setSearch(null)
        onSearch().then(() => {
          addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            message: 'Sync completed',
          })
        })
      })
    )

    dispatch(
      addListener(`running.${user.id}`, 'LastNotificationUpdated', (data) => {
        const botInstance = botInstances.find(
          (instance) => instance.id === data.instanceId
        )
        if (botInstance) {
          botInstance.last_notification = data.message
          dispatch(botInstanceUpdated(botInstance))
        } else {
          console.error('Botinstance is not found')
        }
      })
    )

    return () => {
      dispatch(removeAllListeners())
    }
  }, [user, botInstances])

  useEffect(() => {
    botInstances.map(async (botInstance) => {
      const { notification_channel, status } = botInstance
      // console.log('settings_channel ******', settings_channel)
      const subscribe = settings_channel.some(
        (item) => item.channel === botInstance.notification_channel
      )
      if (status === 'running' && !subscribe) {
        await dispatch(wsSubscribe(notification_channel, true))
        await dispatch(
          openScriptNotification({
            signal: 'notification',
            channel: notification_channel,
          })
        )
      } else if (status === 'pending' && subscribe) {
        await dispatch(
          closeScriptNotification({ channel: notification_channel })
        )
        await dispatch(wsUnsubscribe(notification_channel))
      }
    })
  }, [botInstances])

  useEffect(() => {
    return () => {
      botInstances.map((botInstance) => {
        const { notification_channel, status } = botInstance
        if (status === 'running') {
          dispatch(wsUnsubscribe(notification_channel))
        }
      })
      dispatch(flushScriptNotification())
    }
  }, [])

  const choiceRestoreBot = (instance) => {
    dispatch(restoreBot(instance.id))
      .then(() =>
        addNotification({
          type: NOTIFICATION_TYPES.INFO,
          message: 'The instance was successfully queued for restoring',
        })
      )
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Restore failed',
        })
      )
  }

  const choiceCopyInstance = (instance) => {
    dispatch(copyInstance(instance.id))
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.INFO,
          message: 'The instance was successfully queued for cloning',
        })
        dispatch(getRunningBots({ page, limit, list }))
      })
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Cloning failed',
        })
      )
  }

  const changeBotInstanceStatus = (id, value) => {
    dispatch(updateRunningBot(id, { status: value }))
      .then(() =>
        addNotification({
          type: NOTIFICATION_TYPES.INFO,
          message: `Enqueued status change: ${value}`,
        })
      )
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Status update failed',
        })
      )
  }

  const syncWithAWS = () => {
    dispatch(syncBotInstances())
      .then(() =>
        addNotification({
          type: NOTIFICATION_TYPES.INFO,
          message: 'Sync sequence started',
        })
      )
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: "Can't start sync sequence",
        })
      )
  }

  const startAllBots = () => {
    botInstances.map((botInstance) => {
      if (botInstance.status === 'stopped') {
        changeBotInstanceStatus(
          { value: 'running', label: 'Running' },
          botInstance.id
        )
      } else {
        console.info('status not correct', botInstance.id)
      }
    })
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
          <Button
            color="primary"
            outline
            onClick={syncWithAWS}
            loading={`${syncLoading}`}
          >
            Sync Bot Instances
          </Button>
          <Button color="info" outline onClick={startAllBots}>
            Launch Workforce
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
          <ListFilter
            options={FILTERS_LIST_OPTIONS}
            onChange={({ value }) => {
              setFilterList(value)
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
        {!loading && (
          <Table className="table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <SortableTableHeader field={'status'}>
                  Status
                </SortableTableHeader>
                <SortableTableHeader field={'bot_name'}>
                  Bot
                </SortableTableHeader>
                <SortableTableHeader field={'script_notification'}>
                  Last Notification
                </SortableTableHeader>
                <SortableTableHeader field={'launched_at'}>
                  Deployed At
                </SortableTableHeader>
                <SortableTableHeader field={'uptime'}>
                  Uptime
                </SortableTableHeader>
                <SortableTableHeader field={'name'}>Name</SortableTableHeader>
                <SortableTableHeader field={'launched_by'}>
                  Deployed By
                </SortableTableHeader>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {botInstances.map((bot) => {
                return (
                  <RunningBotTableRow
                    user={user}
                    botInstance={bot}
                    key={bot.id}
                    choiceRestoreBot={choiceRestoreBot}
                    changeBotInstanceStatus={changeBotInstanceStatus}
                    choiceCopyInstance={choiceCopyInstance}
                    runningBotsLoading={runningBotsLoading[bot.id]}
                  />
                )
              })}
            </tbody>
          </Table>
        )}
        {loading &&
          Array.from({ length: 5 }, (v, k) => {
            return <Skeleton key={k} />
          })}
      </CardBody>
      <CardFooter className="py-4">
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

export default RunningBots
