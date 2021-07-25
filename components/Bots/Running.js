import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
// import Select from "react-select";
// import Link from "next/link";
// import Router from "next/router";
import { useSelector } from 'react-redux'
import { Card, CardBody, Button, ButtonGroup, Container } from 'reactstrap'
import {
  Table,
  Thead,
  Th,
  Filters,
  LimitFilter,
  ListFilter,
  SearchFilter,
} from 'components/default/Table'
import { addNotification } from 'store/notification/actions'
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
import { addListener, removeAllListeners } from 'store/socket/actions'
import { Paginator, Loader80bots } from 'components/default'
// import {download} from "lib/helpers";
// import Uptime from "components/default/Uptime";
import {
  subscribe as wsSubscribe,
  unsubscribe as wsUnsubscribe,
} from 'store/socket/actions'
import {
  openScriptNotification,
  closeScriptNotification,
  flushScriptNotification,
} from 'store/scriptNotification/actions'
// import {formatTimezone} from "../../lib/helpers";

// const Container = styled(Card)`
//   background: #333;
//   border: none;
//   color: #fff;
// `;

// const Td = styled.td`
//   position: absolute;
//   left: 20px;
//   width: calc(100% - 40px);
// `;

// const NotificationTd = styled.td`
//   min-width: 400px;
// `;

// const IdTd = styled.td`
//   white-space: nowrap;
// `;

// const Tr = styled.tr`
//   position: relative;
//   background-color: ${props =>
//           props.disabled ? "rgba(221, 221, 221, .5)" : "none"};
// `;

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

const AddButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;

  button {
    &:last-child {
      margin-left: 20px;
    }
  }
`

// const A = styled.a`
//   cursor: pointer;
//   color: #ff7d7d !important;

//   &:hover {
//     text-decoration: underline !important;
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

// const OPTIONS = [
//     {value: "pending", label: "Pending", readOnly: true},
//     {value: "running", label: "Running"},
//     {value: "stopped", label: "Stopped"},
//     {value: "terminated", label: "Terminated"}
// ];

const FILTERS_LIST_OPTIONS = [
  { value: 'all', label: 'All Instances' },
  { value: 'my', label: 'My Instances' },
]

const RunningBots = ({
  notify,
  getRunningBots,
  copyInstance,
  restoreBot,
  downloadInstancePemFile,
  updateRunningBot,
  // botInstances,
  // botNotifications,
  // total,
  addListener,
  removeAllListeners,
  botInstanceUpdated,
  syncBotInstances,
  // syncLoading,
  // wsSubscribe,
  // wsUnsubscribe,
  // openScriptNotification,
  // closeScriptNotification,
  flushScriptNotification,
  // settings_channel,
}) => {
  const [list, setFilterList] = useState('all')
  const [limit, setLimit] = useState(20)
  const [order, setOrder] = useState({ value: '', field: '' })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(null)

  const user = useSelector((state) => state.auth.user)
  const botInstances = useSelector((state) => state.bot.botInstances)
  const botNotifications = useSelector((state) => state.bot.botNotifications)
  const total = useSelector((state) => state.bot.total)
  const syncLoading = useSelector((state) => state.bot.syncLoading)
  const settings_channel = useSelector(
    (state) => state.scriptNotification.settings_channel
  )

  console.error('running robots', user)
  // useEffect(() => {
  //     getRunningBots({page, limit, list});
  //     addListener(`running.${user.id}`, "InstanceLaunched", event => {
  //         if (event.instance) {
  //             const status =
  //                 event.instance.status === "running"
  //                     ? "launched"
  //                     : event.instance.status;
  //             notify({
  //                 type: NOTIFICATION_TYPES.SUCCESS,
  //                 message: `Bot ${event.instance.bot_name} successfully ${status}`
  //             });
  //             botInstanceUpdated(event.instance);
  //         }
  //     });
  //     addListener(`running.${user.id}`, "InstanceStatusUpdated", () => {
  //         getRunningBots({
  //             page: 1,
  //             limit,
  //             list,
  //             sort: order.field,
  //             order: order.value
  //         });
  //     });
  //     addListener(`bots.${user.id}`, "BotsSyncSucceeded", () => {
  //         notify({type: NOTIFICATION_TYPES.SUCCESS, message: "Sync completed"});
  //         getRunningBots({
  //             page,
  //             limit,
  //             list,
  //             sort: order.field,
  //             order: order.value
  //         });
  //     });
  //     return () => {
  //         removeAllListeners();
  //     };
  // }, []);

  // useEffect(() => {
  //     console.log('botInstances ****** ' + JSON.stringify(botInstances));
  //     botInstances.map(async (botInstance) => {
  //         const {notification_channel, status} = botInstance;
  //         console.log("settings_channel ******", settings_channel);
  //         const subscribe = settings_channel.some((item) => item.channel === botInstance.notification_channel);
  //         if ((status === "running") && !subscribe) {
  //             await wsSubscribe(notification_channel, true);
  //             await openScriptNotification({signal: "notification", channel: notification_channel});
  //         } else if (status === "pending" && subscribe) {
  //             await closeScriptNotification({channel: notification_channel});
  //             await wsUnsubscribe(notification_channel);
  //         }
  //     });
  // }, [botInstances]);

  // useEffect(() => {
  //     return () => {
  //         botInstances.map((botInstance) => {
  //             const {notification_channel, status} = botInstance;
  //             if (status === "running") {
  //                 wsUnsubscribe(notification_channel);
  //             }
  //         });
  //         flushScriptNotification();
  //     };
  // }, []);

  // const choiceRestoreBot = instance => {
  //     restoreBot(instance.id)
  //         .then(() =>
  //             notify({
  //                 type: NOTIFICATION_TYPES.INFO,
  //                 message: "The instance was successfully queued for restoring"
  //             })
  //         )
  //         .catch(() =>
  //             notify({type: NOTIFICATION_TYPES.ERROR, message: "Restore failed"})
  //         );
  // };

  // const choiceCopyInstance = instance => {
  //     copyInstance(instance.id)
  //         .then(() => {
  //             notify({
  //                 type: NOTIFICATION_TYPES.INFO,
  //                 message: "The instance was successfully queued for cloning"
  //             });
  //             getRunningBots({page, limit, list});
  //         })
  //         .catch(() =>
  //             notify({type: NOTIFICATION_TYPES.ERROR, message: "Cloning failed"})
  //         );
  // };

  // const downloadEventHandler = instance => {
  //     downloadInstancePemFile(instance.id)
  //         .then(({data}) => {
  //             download(data, `${instance.instance_id}.pem`, "application/x-pem-file");
  //         })
  //         .catch(({error: {response}}) => {
  //             if (response && response.data) {
  //                 notify({
  //                     type: NOTIFICATION_TYPES.ERROR,
  //                     message: response.data.message
  //                 });
  //             } else {
  //                 notify({
  //                     type: NOTIFICATION_TYPES.ERROR,
  //                     message: "Error occurred while downloading file"
  //                 });
  //             }
  //         });
  // };

  const changeBotInstanceStatus = (option, id) => {
    updateRunningBot(id, { status: option.value })
      .then(() =>
        notify({
          type: NOTIFICATION_TYPES.INFO,
          message: `Enqueued status change: ${option.value}`,
        })
      )
      .catch(() =>
        notify({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Status update failed',
        })
      )
  }

  const syncWithAWS = () => {
    syncBotInstances()
      .then(() =>
        notify({
          type: NOTIFICATION_TYPES.INFO,
          message: 'Sync sequence started',
        })
      )
      .catch(() =>
        notify({
          type: NOTIFICATION_TYPES.ERROR,
          message: "Can't start sync sequence",
        })
      )
  }

  const startAllBots = () => {
    botInstances.map(function (botInstance) {
      if (botInstance.status === 'stopped') {
        changeBotInstanceStatus(
          { value: 'running', label: 'Running' },
          botInstance.id
        )
      }
    })
  }

  // const copyToClipboard = bot => {
  //     const text =
  //         process.env.NODE_ENV === "development"
  //             ? `chmod 400 ${bot.instance_id}.pem && ssh -i ${bot.instance_id}.pem ubuntu@${bot.ip}`
  //             : bot.ip;
  //     navigator.clipboard.writeText(text).then(() =>
  //         notify({
  //             type: NOTIFICATION_TYPES.INFO,
  //             message: "Copied to clipboard"
  //         })
  //     );
  // };

  // const hasBotNotification = botInstanceId => {
  //     return !!botNotifications[botInstanceId];
  // };

  // const getBotNotificationMessage = botInstanceId => {
  //     const text = botNotifications[botInstanceId].notification;
  //     return text.split('(/break/)').map((str, i) => <div key={i}>{str}</div>);
  // };

  // const getServerTime = botInstanceId => {
  //     return formatTimezone(user.timezone, botNotifications[botInstanceId].date);
  // };

  // const getBotNotificationError = botInstanceId => {
  //     return !!botNotifications[botInstanceId].error;
  // };

  // const getBotNotificationErrorString = botInstanceId => {
  //     return botNotifications[botInstanceId].error || '';
  // };

  // const getBotLastNotificationTime = botInstanceId => {
  //     const bot = botInstances.filter(
  //         bot => bot.instance_id === botInstanceId
  //     );
  //     if (!bot[0].last_notification)
  //         return '';
  //     return formatTimezone(user.timezone, bot[0].last_notification.split("(/break/)")[0]);
  // };

  // const getBotLastNotificationString = botInstanceId => {
  //     const bot = botInstances.filter(
  //         bot => bot.instance_id === botInstanceId
  //     );
  //     if (!bot[0].last_notification)
  //         return '';
  //     let notification = bot[0].last_notification.split('(/break/)').map((str, i) => <div key={i}>{str}</div>);
  //     notification.shift();
  //     return notification;
  // };

  // const Loading = (
  //     <Loader80bots
  //         data={"dark"}
  //         styled={{
  //             width: "100px",
  //             height: "75px"
  //         }}
  //     />
  // );

  const getData = (botInstance) => {
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
    return {
      labels: botInstance.difference,
      datasets: [
        {
          label: [],
          lineTension: 0,
          backgroundColor: 'rgba(125,255,255,0.2)',
          borderColor: 'rgba(125,255,255,1)',
          borderWidth: 0.5,
          data: botInstance.difference,
        },
      ],
    }
  }

  const legendOpt = {
    display: false,
  }

  const chartOptions = {
    scales: {
      xAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    tooltips: {
      enabled: false,
    },
  }

  const renderRow = (botInstance, idx) => {
    return (
      <Tr
        key={idx}
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
            styles={selectStyles}
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
          <Link
            href={'/bots/running/[id]'}
            as={`/bots/running/${botInstance.id}`}
          >
            <A>&gt;&nbsp;View</A>
          </Link>
          {botInstance.status === 'terminated' ? (
            <div
              title={'Restore Bot'}
              onClick={() => choiceRestoreBot(botInstance)}
            >
              <A>&gt;&nbsp;Restore</A>
            </div>
          ) : null}
          {botInstance.status === 'running' ? (
            <div
              title={'New Script'}
              onClick={() => {
                Router.push(`/botinstance/${botInstance.id}`)
              }}
            >
              <A>&gt;&nbsp;New Script</A>
            </div>
          ) : null}
          <div
            title={'Copy Instance'}
            onClick={() => choiceCopyInstance(botInstance)}
          >
            <A>&gt;&nbsp;Clone</A>
          </div>
          <div
            disabled={botInstance.status === 'terminated'}
            title={'Download PEM'}
            type={'success'}
            onClick={() => downloadEventHandler(botInstance)}
          >
            <A>&gt;&nbsp;Key</A>
          </div>
        </td>
        <td>{botInstance.bot_name}</td>
        <NotificationTd>
          {hasBotNotification(botInstance.instance_id) ? (
            !getBotNotificationError(botInstance.instance_id) ? (
              <Notify>
                {getServerTime(botInstance.instance_id)}
                <br />
                {getBotNotificationMessage(botInstance.instance_id)}
              </Notify>
            ) : (
              <NotifyErr>
                {getBotNotificationErrorString(botInstance.instance_id)}
              </NotifyErr>
            )
          ) : (
            <Notify>
              {getBotLastNotificationTime(botInstance.instance_id)}
              <br />
              {getBotLastNotificationString(botInstance.instance_id)}
            </Notify>
          )}
        </NotificationTd>
        <td>{formatTimezone(user.timezone, botInstance.launched_at)}</td>
        <Uptime uptime={botInstance.uptime} status={botInstance.status} />
        <td>{botInstance.ip}</td>
        <td>{botInstance.name}</td>
        <IdTd>{botInstance.instance_id}</IdTd>
        <td>{botInstance.launched_by}</td>
        <td>{botInstance.region}</td>
        {/* {botInstance.status === "pending" && <Td colSpan={"9"}>{Loading}</Td>} */}
      </Tr>
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

  const OrderTh = (props) => (
    <Th
      {...props}
      // eslint-disable-next-line react/prop-types
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
    getRunningBots({
      page,
      limit,
      list,
      sort: order.field,
      order: order.value,
      search: value,
    })
  }

  return (
    <>
      <ButtonGroup>
        <Button
          color="primary"
          onClick={syncWithAWS}
          loading={`${syncLoading}`}
        >
          Sync Bot Instances
        </Button>
        <Button color="secondary" onClick={startAllBots}>
          Launch Workforce
        </Button>
      </ButtonGroup>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter
              id="limitfilter"
              instanceId="limitfilter"
              onChange={({ value }) => {
                setLimit(value)
                getRunningBots({
                  page,
                  limit: value,
                  list,
                  sort: order.field,
                  order: order.value,
                  search,
                })
              }}
            />
            <ListFilter
              id="listfilter1"
              instanceId="listfilter1"
              options={FILTERS_LIST_OPTIONS}
              onChange={({ value }) => {
                setFilterList(value)
                getRunningBots({
                  page,
                  limit,
                  list: value,
                  sort: order.field,
                  order: order.value,
                  search,
                })
              }}
            />
            <SearchFilter
              onChange={(value) => {
                searchRunningBots(value)
              }}
            />
          </Filters>
          <Table>
            <Thead>
              <tr>
                <OrderTh field={'status'}>Status</OrderTh>
                <th>Actions&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                <OrderTh field={'bot_name'}>Bot</OrderTh>
                <OrderTh field={'script_notification'}>
                  Last Notification
                </OrderTh>
                <OrderTh field={'launched_at'}>Deployed At</OrderTh>
                <OrderTh field={'uptime'}>Uptime</OrderTh>
                <OrderTh field={'ip'}>IP</OrderTh>
                <OrderTh field={'name'}>Name</OrderTh>
                <th>Instance ID</th>
                <OrderTh field={'launched_by'}>Deployed By</OrderTh>
                <OrderTh field={'region'}>Region</OrderTh>
              </tr>
            </Thead>
            <tbody>{botInstances.map(renderRow)}</tbody>
          </Table>
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={(page) => {
              setPage(page)
              getRunningBots({
                page,
                limit,
                list,
                sort: order.field,
                order: order.value,
                search,
              })
            }}
          />
        </CardBody>
      </Container>
    </>
  )
}

RunningBots.propTypes = {
  // notify: PropTypes.func.isRequired,
  // copyInstance: PropTypes.func.isRequired,
  // restoreBot: PropTypes.func.isRequired,
  // getRunningBots: PropTypes.func.isRequired,
  // downloadInstancePemFile: PropTypes.func.isRequired,
  // updateRunningBot: PropTypes.func.isRequired,
  // addListener: PropTypes.func.isRequired,
  // removeAllListeners: PropTypes.func.isRequired,
  // botInstanceUpdated: PropTypes.func.isRequired,
  // syncBotInstances: PropTypes.func.isRequired,
  // botInstances: PropTypes.array.isRequired,
  // botNotifications: PropTypes.array.isRequired,
  // total: PropTypes.number.isRequired,
  // syncLoading: PropTypes.bool.isRequired,
  // user: PropTypes.object,
  // wsSubscribe: PropTypes.func.isRequired,
  // wsUnsubscribe: PropTypes.func.isRequired,
  // openScriptNotification: PropTypes.func.isRequired,
  // closeScriptNotification: PropTypes.func.isRequired,
  // flushScriptNotification: PropTypes.func.isRequired,
  // settings_channel: PropTypes.array.isRequired,
}

// const mapStateToProps = (state) => ({
//   botInstances: state.bot.botInstances,
//   botNotifications: state.bot.botNotifications,
//   total: state.bot.total,
//   user: state.auth.user,
//   syncLoading: state.bot.syncLoading,
//   settings_channel: state.scriptNotification.settings_channel,
// })

// const mapDispatchToProps = (dispatch) => ({
//   // notify: (payload) => dispatch(addNotification(payload)),
//   copyInstance: (id) => dispatch(copyInstance(id)),
//   restoreBot: (id) => dispatch(restoreBot(id)),
//   getRunningBots: (query) => dispatch(getRunningBots(query)),
//   downloadInstancePemFile: (id) => dispatch(downloadInstancePemFile(id)),
//   updateRunningBot: (id, data) => dispatch(updateRunningBot(id, data)),
//   addListener: (room, eventName, handler) =>
//     dispatch(addListener(room, eventName, handler)),
//   removeAllListeners: () => dispatch(removeAllListeners()),
//   botInstanceUpdated: (botInstance) =>
//     dispatch(botInstanceUpdated(botInstance)),
//   syncBotInstances: () => dispatch(syncBotInstances()),
//   wsSubscribe: (channel, isPrivate) => dispatch(subscribe(channel, isPrivate)),
//   wsUnsubscribe: (channel) => dispatch(unsubscribe(channel)),
//   openScriptNotification: (item) => dispatch(openScriptNotification(item)),
//   closeScriptNotification: (item) => dispatch(closeScriptNotification(item)),
//   flushScriptNotification: () => dispatch(flushScriptNotification()),
// })

export default RunningBots
