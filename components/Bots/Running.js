import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import {
  CardBody,
  Button,
  ButtonGroup,
  Card,
  Table,
  CardHeader,
  List,
  CardFooter,
} from 'reactstrap'
import {
  LimitFilter,
  ListFilter,
  SearchFilter,
  Th,
} from 'components/default/Table'
import { addNotification, download, formatTimezone } from 'lib/helpers'
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
import { Paginator, Loader80bots } from 'components/default'

import UptimeLabel from './UptimeLabel'

import {
  openScriptNotification,
  closeScriptNotification,
  flushScriptNotification,
} from 'store/scriptNotification/actions'

// const Ip = styled.span`
//   cursor: pointer;
// `;

// const Notify = styled.span`
//   color: #7dffff;

//   &:hover {
//     color: #00ffff;
//   }
// `;

// const NotifyErr = styled.span`
//   color: #CC0000;

//   &:hover {
//     color: #FF0000;
//   }
// `;
// const selectStyles = {
//     container: (provided, state) => ({
//         ...provided,
//         width: state.selectProps.width,
//         minWidth: "150px"
//     }),
//     menuPortal: base => ({...base, zIndex: 5}),
//     control: (provided, state) => ({
//         ...provided,
//         background: "rgba(0,0,0,0.2)",
//         // match with the menu
//         borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
//         // Overrides the different states of border
//         borderColor: state.isFocused ? "black" : "rgba(0,0,0,0.2)",
//         // Removes weird border around container
//         boxShadow: state.isFocused ? null : null,
//         "&:hover": {
//             // Overrides the different states of border
//             borderColor: "black"
//         }
//     }),
//     singleValue: (provided, state) => ({
//         ...provided,
//         color: "#fff"
//     })
// };

const OPTIONS = [
  { value: 'pending', label: 'Pending', readOnly: true },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'terminated', label: 'Terminated' },
]

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
  const botNotifications = useSelector((state) => state.bot.botNotifications)
  const total = useSelector((state) => state.bot.total)
  const syncLoading = useSelector((state) => state.bot.syncLoading)
  const settings_channel = useSelector(
    (state) => state.scriptNotification.settings_channel
  )

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
        dispatch(
          getRunningBots({
            page: 1,
            limit,
            list,
            sort: order.field,
            order: order.value,
          })
        )
      })
    )
    dispatch(
      addListener(`bots.${user.id}`, 'BotsSyncSucceeded', () => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Sync completed',
        })
        dispatch(
          getRunningBots({
            page,
            limit,
            list,
            sort: order.field,
            order: order.value,
          })
        )
      })
    )
    return () => {
      dispatch(removeAllListeners())
    }
  }, [])

  useEffect(() => {
    console.log('botInstances ****** ' + JSON.stringify(botInstances))
    botInstances.map(async (botInstance) => {
      const { notification_channel, status } = botInstance
      console.log('settings_channel ******', settings_channel)
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

  // const copyToClipboard = (bot) => {
  //   const text =
  //     process.env.NODE_ENV === 'development'
  //       ? `chmod 400 ${bot.instance_id}.pem && ssh -i ${bot.instance_id}.pem ubuntu@${bot.ip}`
  //       : bot.ip
  //   navigator.clipboard.writeText(text).then(() =>
  //     addNotification({
  //       type: NOTIFICATION_TYPES.INFO,
  //       message: 'Copied to clipboard',
  //     })
  //   )
  // }

  const hasBotNotification = (botInstanceId) => {
    return !!botNotifications[botInstanceId]
  }

  const getBotNotificationMessage = (botInstanceId) => {
    const text = botNotifications[botInstanceId].notification
    return text.split('(/break/)').map((str, i) => <div key={i}>{str}</div>)
  }

  const getServerTime = (botInstanceId) => {
    return formatTimezone(user.timezone, botNotifications[botInstanceId].date)
  }

  const getBotNotificationError = (botInstanceId) => {
    return !!botNotifications[botInstanceId].error
  }

  const getBotNotificationErrorString = (botInstanceId) => {
    return botNotifications[botInstanceId].error || ''
  }

  const getBotLastNotificationTime = (botInstanceId) => {
    const bot = botInstances.filter((bot) => bot.instance_id === botInstanceId)
    if (!bot[0].last_notification) return ''
    return formatTimezone(
      user.timezone,
      bot[0].last_notification.split('(/break/)')[0]
    )
  }

  const getBotLastNotificationString = (botInstanceId) => {
    const bot = botInstances.filter((bot) => bot.instance_id === botInstanceId)
    if (!bot[0].last_notification) return ''
    let notification = bot[0].last_notification
      .split('(/break/)')
      .map((str, i) => <div key={i}>{str}</div>)
    notification.shift()
    return notification
  }

  const Loading = (
    <Loader80bots
      data={'dark'}
      styled={{
        width: '100px',
        height: '75px',
      }}
    />
  )

  // const getData = (botInstance) => {
  // if(botInstance.difference && botInstance.difference.length > 2) {
  //   let difference = [];
  //   let prevTime = null;
  //   botInstance.difference.forEach((data, index)=>{
  //       if(prevTime){
  //           const prev = Date.parse(prevTime);
  //           const current = Date.parse(data.created_at);
  //           const diffSeconds = (current - prev)/1000 ;
  //           if(diffSeconds> 300){
  //               let startTime = Date.parse(prevTime);
  //               const endTime = Date.parse(data.created_at);
  //               while(startTime < endTime){
  //                   difference.push(0)
  //                   startTime = startTime+ 60000;
  //               }
  //           }
  //           difference.push(data.difference);
  //       }
  //       prevTime = data.created_at;
  //   });
  //   botInstance.difference  = difference;
  // }
  //   return {
  //     labels: botInstance.difference,
  //     datasets: [
  //       {
  //         label: [],
  //         lineTension: 0,
  //         backgroundColor: 'rgba(125,255,255,0.2)',
  //         borderColor: 'rgba(125,255,255,1)',
  //         borderWidth: 0.5,
  //         data: botInstance.difference,
  //       },
  //     ],
  //   }
  // }

  // const legendOpt = {
  //   display: false,
  // }

  // const chartOptions = {
  //   scales: {
  //     xAxes: [
  //       {
  //         ticks: {
  //           display: false,
  //         },
  //         gridLines: {
  //           display: false,
  //         },
  //       },
  //     ],
  //     yAxes: [
  //       {
  //         ticks: {
  //           display: false,
  //         },
  //         gridLines: {
  //           display: false,
  //         },
  //       },
  //     ],
  //   },
  //   elements: {
  //     point: {
  //       radius: 0,
  //     },
  //   },
  //   tooltips: {
  //     enabled: false,
  //   },
  // }

  const renderRow = (botInstance) => {
    return (
      <tr
        key={botInstance.id}
        disabled={botInstance.status === 'pending'}
        className={
          botInstance.status === 'running'
            ? 'running'
            : botInstance.status === 'terminated'
            ? 'terminated'
            : 'not-running'
        }
      >
        <td>
          <Select
            options={OPTIONS}
            value={OPTIONS.find((item) => item.value === botInstance.status)}
            onChange={(option) =>
              changeBotInstanceStatus(option, botInstance.id)
            }
            // styles={selectStyles}
            isOptionDisabled={(option) => option.readOnly}
            isDisabled={
              botInstance.status === 'pending' ||
              botInstance.status === 'terminated'
            }
            menuPortalTarget={document.body}
            menuPosition={'absolute'}
            menuPlacement={'bottom'}
          />
        </td>
        <td>
          <List type="unstyled">
            <li>
              <Link
                href={'running/[id]'}
                as={`running/${botInstance.id}`}
                passHref
              >
                <a>&gt;&nbsp;View</a>
              </Link>
            </li>
            {botInstance.status === 'terminated' && (
              <li>
                <a
                  href="#pablo"
                  title={'Restore Bot'}
                  onClick={() => choiceRestoreBot(botInstance)}
                >
                  &gt;&nbsp;Restore
                </a>
              </li>
            )}
            {botInstance.status === 'running' && (
              <li>
                <Link
                  title={'New Script'}
                  href={`/botinstance/${botInstance.id}`}
                  passHref
                >
                  <a>&gt;&nbsp;New Script</a>
                </Link>
              </li>
            )}
            <li>
              <a
                href="#pablo"
                title={'Copy Instance'}
                onClick={() => choiceCopyInstance(botInstance)}
              >
                &gt;&nbsp;Clone
              </a>
            </li>
            <li>
              <a
                href="#pablo"
                disabled={botInstance.status === 'terminated'}
                title={'Download PEM'}
                type={'success'}
                onClick={() => downloadEventHandler(botInstance)}
              >
                &gt;&nbsp;Key
              </a>
            </li>
          </List>
        </td>
        <td>{botInstance.bot_name}</td>
        <td>
          {hasBotNotification(botInstance.instance_id) ? (
            !getBotNotificationError(botInstance.instance_id) ? (
              <span>
                {getServerTime(botInstance.instance_id)}
                <br />
                {getBotNotificationMessage(botInstance.instance_id)}
              </span>
            ) : (
              <span color="danger">
                {getBotNotificationErrorString(botInstance.instance_id)}
              </span>
            )
          ) : (
            <span>
              {getBotLastNotificationTime(botInstance.instance_id)}
              <br />
              {getBotLastNotificationString(botInstance.instance_id)}
            </span>
          )}
        </td>
        <td>{formatTimezone(user.timezone, botInstance.launched_at)}</td>
        <td>
          <UptimeLabel
            uptime={botInstance.uptime}
            status={botInstance.status}
          />
        </td>
        <td>{botInstance.ip}</td>
        <td>{botInstance.name}</td>
        <td>{botInstance.instance_id}</td>
        <td>{botInstance.launched_by}</td>
        <td>{botInstance.region}</td>
        {botInstance.status === 'pending' && <td colSpan={'9'}>{Loading}</td>}
      </tr>
    )
  }

  const onOrderChange = (field, value) => {
    setOrder({ field, value })
    getRunningBots({
      page,
      limit,
      list,
      sort: field,
      order: value,
      search,
    })
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

  const searchRunningBots = (value) => {
    setSearch(value)
    dispatch(
      getRunningBots({
        page,
        limit,
        list,
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
            id="limitfilter"
            instanceId="limitfilter"
            onChange={({ value }) => {
              setLimit(value)
              dispatch(
                getRunningBots({
                  page,
                  limit: value,
                  list,
                  sort: order.field,
                  order: order.value,
                  search,
                })
              )
            }}
          />
          <ListFilter
            id="listfilter1"
            instanceId="listfilter1"
            options={FILTERS_LIST_OPTIONS}
            onChange={({ value }) => {
              setFilterList(value)
              dispatch(
                getRunningBots({
                  page,
                  limit,
                  list: value,
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
                searchRunningBots(value)
              },
            }}
          />
        </div>
        <Table responsive>
          <thead>
            <tr>
              <SortableTableHeader field={'status'}>Status</SortableTableHeader>
              <th>Actions</th>
              <SortableTableHeader field={'bot_name'}>Bot</SortableTableHeader>
              <SortableTableHeader field={'script_notification'}>
                Last Notification
              </SortableTableHeader>
              <SortableTableHeader field={'launched_at'}>
                Deployed At
              </SortableTableHeader>
              <SortableTableHeader field={'uptime'}>Uptime</SortableTableHeader>
              <SortableTableHeader field={'ip'}>IP</SortableTableHeader>
              <SortableTableHeader field={'name'}>Name</SortableTableHeader>
              <th>Instance ID</th>
              <SortableTableHeader field={'launched_by'}>
                Deployed By
              </SortableTableHeader>
              <SortableTableHeader field={'region'}>Region</SortableTableHeader>
            </tr>
          </thead>
          <tbody>{botInstances.map(renderRow)}</tbody>
        </Table>
      </CardBody>
      <CardFooter className="py-4">
        {!loadingAll && (
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={(page) => {
              setPage(page)
              dispatch(
                getRunningBots({
                  page,
                  limit,
                  list,
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

export default RunningBots
