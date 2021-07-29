import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import {
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  Nav,
  NavLink,
  NavItem,
  TabPane,
  TabContent,
  Col,
  Row,
} from 'reactstrap'
import { getInstance, clearInstance } from 'store/bot/actions'
import { subscribe, unsubscribe } from 'store/socket/actions'
import { Loader80bots } from 'components/default'
import ScreenShotTab from './ScreenShotTab'
import LogsTab from './LogsTab'
import OutputTab from './OutputTab'
import DisplayTab from './DisplayTab'

const TABS = {
  SCREENSHOTS: {
    title: 'Screenshots',
    component: ScreenShotTab,
  },
  LOGS: {
    title: 'Logs',
    component: LogsTab,
  },
  OUTPUTS: {
    title: 'Outputs',
    component: OutputTab,
  },
  DISPLAY: {
    title: 'Display',
    component: DisplayTab,
  },
}

const STATUSES = {
  CONNECTING: {
    label: 'Connecting',
  },
  CONNECTED: {
    label: 'Connected',
  },
  RECONNECT: {
    label: 'Reconnecting',
  },
  TIMEOUT: {
    label: 'Instance Launching or Stopped',
  },
  ERROR: {
    label: 'Stopped',
  },
  DISCONNECT: {
    label: 'Disconnected',
  },
}

// const Container = styled(Card)`
//   background: #333;
//   border: none;
//   color: #fff;
//   flex: 1;
// `

// const Header = styled(CardHeader)`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   width: 100%;
// `

// const Tabs = styled.div`
//   display: flex;
//   flex: 1;
//   align-items: center;
//   justify-self: flex-end;
//   justify-content: flex-end;
// `

const Status = styled(Badge)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  background-color: ${(props) => props.color};
`

// const Content = styled(CardBody)`
//   display: flex;
//   height: 85vh;
//   flex-flow: column;
// `

// const h6 = styled.h6`
//   text-align: start;
//   margin: 0;
// `

// const Back = styled(Button)`
//   padding: 0 5px;
//   margin-right: 10px;
// `

// const Tab = styled(Back)`
//   &:last-child {
//     margin-right: 0;
//   }
// `

// const Hint = styled.span`
//   font-size: 14px;
// `

const ConnectionStatus = ({ status, color }) => (
  <>
    <Status type={'info'} color={color} pill>
      {status}
    </Status>
    <span>&nbsp;|&nbsp;</span>
  </>
)

const BotView = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(TABS.SCREENSHOTS)
  const [status, setStatus] = useState(STATUSES.CONNECTING)
  const [customBack, setCustomBack] = useState(null)
  const router = useRouter()

  const toggle = (tab) => {
    if (
      tab.title.toUpperCase() === 'DISPLAY' &&
      window.location.protocol === 'https:'
    ) {
      window.open(`http://${botInstance.ip}:6080?autoconnect=1`)
    } else {
      if (activeTab !== tab) {
        setActiveTab(tab)
      }
    }
  }

  const botInstance = useSelector((state) => state.bot.botInstance)

  useEffect(() => {
    const { storage_channel } = botInstance
    if (storage_channel) {
      dispatch(subscribe(storage_channel, true))
      setStatus(STATUSES.CONNECTED)
    }
    return () => {
      return dispatch(unsubscribe(storage_channel))
    }
  }, [botInstance])

  useEffect(() => {
    dispatch(getInstance(router.query.id))
    return () => {
      dispatch(clearInstance())
    }
  }, [])

  useEffect(() => {
    setCustomBack(null)
  }, [activeTab])

  const CurrentTab = activeTab.component

  return (
    <Card>
      <CardHeader>
        <Button
          color="primary"
          onClick={() => (customBack ? customBack() : router.back())}
        >
          Back
        </Button>
      </CardHeader>
      <CardBody>
        <h6>
          {Object.keys(botInstance).length ? (
            botInstance.name + ' | ' + botInstance.bot_name
          ) : (
            <Loader80bots
              data={'light'}
              styled={{
                width: '50px',
                height: '25px',
              }}
            />
          )}
        </h6>
        <ConnectionStatus status={status.label} color={status.color} />
        <Nav tabs>
          {Object.values(TABS).map((tab) => {
            return (
              <NavItem key={tab.title}>
                <NavLink
                  // className={classnames({ active: activeTab === tab.title })}
                  onClick={() => {
                    toggle(tab)
                  }}
                >
                  {tab.title}
                </NavLink>
              </NavItem>
            )
          })}
        </Nav>
        {status === STATUSES.CONNECTING ? (
          <Card>
            <Loader80bots
              data={'light'}
              styled={{
                width: '200px',
              }}
            />
          </Card>
        ) : (
          <TabContent activeTab={activeTab}>
            {Object.values(TABS).map((tab) => {
              return (
                <TabPane tabId={tab.title}>
                  <CurrentTab setCustomBack={(f) => setCustomBack(() => f)} />
                </TabPane>
              )
            })}
          </TabContent>
        )}
      </CardBody>
    </Card>
  )
}

export default BotView
