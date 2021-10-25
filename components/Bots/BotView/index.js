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
  Spinner,
} from 'reactstrap'
import classnames from 'classnames'
import { getInstance, clearInstance } from 'store/bot/actions'
import { subscribe, unsubscribe } from 'store/socket/actions'
import { Loader80bots } from 'components/default'
import ScreenShotTab from './ScreenShotTab'
import LogsTab from './LogsTab'
import OutputTab from './OutputTab'
import DisplayTab from './DisplayTab'
import { flush } from 'store/fileSystem/actions'

const botTabs = [
  {
    title: 'Screenshots',
    key: 'screenshots',
  },
  {
    title: 'Logs',
    key: 'logs',
  },
  {
    title: 'Outputs',
    key: 'output',
  },
  {
    title: 'Display',
    key: 'display',
  },
]

const BotView = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState(botTabs[0])
  const [status, setStatus] = useState(STATUSES.CONNECTING)
  const [customBack, setCustomBack] = useState(null)
  const {
    query: { id },
  } = router

  const botInstance = useSelector((state) => state.bot.botInstance)

  const toggle = (tab) => {
    if (tab.key === 'display' && window.location.protocol === 'https:') {
      window.open(
        `${process.env.WEB_CLIENT_URL}:${botInstance.novnc_port}/vnc.html?autoconnect=1&password=${botInstance.vnc_passport}`
      )
    } else {
      if (activeTab.key !== tab.key) {
        dispatch(flush())
        setActiveTab(tab)
      }
    }
  }

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

  return (
    <Card>
      <CardHeader>
        <Button
          color="primary"
          onClick={() => {
            if (customBack) customBack()
            else router.back()
          }}
        >
          Back
        </Button>
      </CardHeader>
      <CardBody>
        <h3>
          {Object.keys(botInstance).length ? (
            botInstance.container_id + ' | ' + botInstance.bot_name
          ) : (
            <Spinner type="grow" size="sm" color="primary" />
          )}
        </h3>
        <Nav tabs>
          <NavItem className="mr-5">
            <ConnectionStatus status={status.label} color={status.color} />
          </NavItem>
          {botTabs.map((tab) => {
            return (
              <NavItem key={tab.key}>
                <NavLink
                  className={classnames({
                    active: activeTab.key === tab.key,
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
          <Loader80bots
            styled={{
              width: '200px',
            }}
          />
        ) : (
          <TabContent activeTab={activeTab.key}>
            {activeTab.key === 'screenshots' && (
              <TabPane tabId="screenshots">
                <ScreenShotTab
                  botInstance={botInstance}
                  setCustomBack={setCustomBack}
                />
              </TabPane>
            )}
            <TabPane tabId="display">
              <DisplayTab
                botInstance={botInstance}
                setCustomBack={setCustomBack}
              />
            </TabPane>
            {activeTab.key === 'output' && (
              <TabPane tabId="output">
                <OutputTab
                  botInstance={botInstance}
                  setCustomBack={setCustomBack}
                />
              </TabPane>
            )}
            {activeTab.key === 'logs' && (
              <TabPane tabId="logs">
                <LogsTab
                  botInstance={botInstance}
                  setCustomBack={setCustomBack}
                />
              </TabPane>
            )}
          </TabContent>
        )}
      </CardBody>
    </Card>
  )
}

export default BotView
