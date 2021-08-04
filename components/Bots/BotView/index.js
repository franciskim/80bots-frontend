import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import ConnectionStatus, { STATUSES } from './ConnectionStatus'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Nav,
  NavLink,
  NavItem,
  TabPane,
  TabContent,
  Navbar,
} from 'reactstrap'
import classnames from 'classnames'
import { getInstance, clearInstance } from 'store/bot/actions'
import { subscribe, unsubscribe } from 'store/socket/actions'
import { Loader80bots } from 'components/default'
import ScreenShotTab from './ScreenShotTab'
import LogsTab from './LogsTab'
import OutputTab from './OutputTab'
import DisplayTab from './DisplayTab'

const botTabs = [
  {
    title: 'Screenshots',
    component: ScreenShotTab,
  },
  {
    title: 'Logs',
    component: LogsTab,
  },
  {
    title: 'Outputs',
    component: OutputTab,
  },
  {
    title: 'Display',
    component: DisplayTab,
  },
]

const BotView = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(botTabs[0])
  const [status, setStatus] = useState(STATUSES.CONNECTING)
  const [customBack, setCustomBack] = useState(null)
  const router = useRouter()
  const {
    query: { id },
  } = router

  const toggle = (tab) => {
    if (tab.title === 'Display' && window.location.protocol === 'https:') {
      window.open(`http://${botInstance.ip}:6080?autoconnect=1`)
    } else {
      if (activeTab.title !== tab.title) {
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
    dispatch(getInstance(id))
    return () => {
      dispatch(clearInstance())
    }
  }, [])

  useEffect(() => {
    setCustomBack(null)
  }, [activeTab])

  const { component: CurrentTab } = activeTab
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
        <h3>
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
        </h3>
        <Nav tabs>
          <NavItem className="mr-5">
            <ConnectionStatus status={status.label} color={status.color} />
          </NavItem>
          {botTabs.map((tab) => {
            return (
              <NavItem key={tab.title}>
                <NavLink
                  className={classnames({
                    active: activeTab.title === tab.title,
                  })}
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
          <TabContent activeTab={activeTab.title}>
            {botTabs.map((tab) => {
              return (
                <TabPane tabId={tab.title} key={tab.title}>
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
