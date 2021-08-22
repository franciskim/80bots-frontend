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
import { addNotification, download } from 'lib/helpers'
import { NOTIFICATION_TYPES } from 'config'
import {
  copyInstance,
  restoreBot,
  getRunningBots,
  updateRunningBot,
  downloadInstancePemFile,
  botInstanceUpdated,
  syncBotInstances,
} from 'store/bot/actions'
import {
  addListener,
  removeAllListeners,
  subscribe as wsSubscribe,
  unsubscribe as wsUnsubscribe,
} from 'store/socket/actions'

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
  const [loadingAll, setLoadingAll] = useState(true)

  const user = useSelector((state) => state.auth.user)
  const botInstances = useSelector((state) => state.bot.botInstances)
  const total = useSelector((state) => state.bot.total)
  const syncLoading = useSelector((state) => state.bot.syncLoading)
  const settings_channel = useSelector(
    (state) => state.scriptNotification.settings_channel
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
    dispatch(getRunningBots({ page, limit, list })).then(() => {
      setLoadingAll(false)
    })
    dispatch(
      addListener(`running.${user.id}`, 'InstanceLaunched', (event) => {
        const { status } = event.instance
        if (event.instance) {
          const statusText = status === 'running' ? 'launched' : status

          addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            message: `Bot ${event.instance.bot_name} successfully ${statusText}`,
          })
          dispatch(botInstanceUpdated(event.instance))
        }
      })
    )
    dispatch(
      addListener(`running.${user.id}`, 'InstanceStatusUpdated', () => {
        setPage(1)
        setSearch(null)
        onSearch()
      })
    )
    dispatch(
      addListener(`bots.${user.id}`, 'BotsSyncSucceeded', () => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Sync completed',
        })
        setSearch(null)
        onSearch()
      })
    )
    return () => {
      dispatch(removeAllListeners())
    }
  }, [])

  useEffect(() => {
    // console.log('botInstances ****** ' + JSON.stringify(botInstances))
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

  const downloadEventHandler = (instance) => {
    dispatch(downloadInstancePemFile(instance.id))
      .then(({ data }) => {
        dispatch(
          download(
            data,
            `${instance.instance_id}.pem`,
            'application/x-pem-file'
          )
        )
      })
      .catch(({ error: { response } }) => {
        if (response && response.data) {
          addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            message: response.data.message,
          })
        } else {
          addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            message: 'Error occurred while downloading file',
          })
        }
      })
  }

  const changeBotInstanceStatus = (option, id) => {
    dispatch(updateRunningBot(id, { status: option.value }))
      .then(() =>
        addNotification({
          type: NOTIFICATION_TYPES.INFO,
          message: `Enqueued status change: ${option.value}`,
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
      <CardBody>
        <div>
          <LimitFilter
            defaultValue={limit}
            total={total}
            onChange={(value) => {
              setLimit(value)
              onSearch()
            }}
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
        <Table className="table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <SortableTableHeader field={'status'}>Status</SortableTableHeader>
              <SortableTableHeader field={'bot_name'}>Bot</SortableTableHeader>
              <SortableTableHeader field={'script_notification'}>
                Last Notification
              </SortableTableHeader>
              <SortableTableHeader field={'launched_at'}>
                Deployed At
              </SortableTableHeader>
              <SortableTableHeader field={'uptime'}>Uptime</SortableTableHeader>
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
                  downloadEventHandler={downloadEventHandler}
                />
              )
            })}
          </tbody>
        </Table>
      </CardBody>
      <CardFooter className="py-4">
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

export default RunningBots
