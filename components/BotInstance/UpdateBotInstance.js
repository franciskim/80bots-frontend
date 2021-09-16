import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification } from 'lib/helpers'
import { NOTIFICATION_TYPES } from 'config'
import {
  Button,
  ButtonGroup,
  Modal,
  Card,
  CardBody,
  Nav,
  NavItem,
  FormGroup,
  Label,
  NavLink,
  Col,
  Form,
  TabContent,
  TabPane,
  CardFooter,
  CardHeader,
  ModalHeader,
  ModalBody,
} from 'reactstrap'
import { CodeEditor } from 'components/default/inputs'
import {
  getBotInstance,
  updateBotInstance,
  restartInstance,
} from 'store/botinstance/actions'
import RestartEditor from './RestartEditor'
import classnames from 'classnames'

const UpdateBotInstance = () => {
  const dispatch = useDispatch()
  const { id } = useRouter().query
  const [botScript, setBotScript] = useState('')
  const [botPackageJSON, setBotPackageJSON] = useState('')
  // const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('script')
  const router = useRouter()

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const isEmpty = (obj) => {
    for (let key in obj) {
      return true
    }
    return false
  }

  const aboutBot = useSelector((state) => state.botInstance.aboutBot)

  useEffect(() => {
    dispatch(getBotInstance(id))
  }, [])

  useEffect(() => {
    if (isEmpty(aboutBot)) {
      setBotScript(aboutBot.aws_custom_script)
      setBotPackageJSON(aboutBot.aws_custom_package_json)
    }
  }, [aboutBot])

  const convertBotData = (botData) => ({
    aws_custom_script: botData.botScript,
    aws_custom_package_json: botData.botPackageJSON,
  })

  const submit = () => {
    // setError(null)
    const botData = {
      botScript,
      botPackageJSON,
    }
    dispatch(updateBotInstance(id, convertBotData(botData)))
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'BotInstance updated!',
        })
        setIsOpen(true)
      })
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Update failed!',
        })
      )
  }

  const restartSubmit = (params) => {
    dispatch(restartInstance(aboutBot.id, params))
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'BotInstance restarted!',
        })
        Router.push('/bots/running')
      })
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Restart failed!',
        })
      )
  }

  return (
    <Card>
      <CardHeader>
        <Button
          color="primary"
          onClick={() => {
            return router.back()
          }}
        >
          Back
        </Button>
      </CardHeader>
      <CardBody>
        <Form noValidate>
          <FormGroup className="row">
            <Label md={2} className="form-control-label">
              Bot Script
            </Label>
            <Col md={10}>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === 'script' })}
                    onClick={() => {
                      toggle('script')
                    }}
                  >
                    index.js
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === 'json' })}
                    onClick={() => {
                      toggle('json')
                    }}
                  >
                    package.json
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="script">
                  <CodeEditor
                    value={botScript}
                    onChange={setBotScript}
                    mode="javascript"
                  />
                </TabPane>
                <TabPane tabId="json">
                  <CodeEditor
                    value={botPackageJSON}
                    onChange={setBotPackageJSON}
                    mode="json"
                  />
                </TabPane>
              </TabContent>
            </Col>
          </FormGroup>
        </Form>
        {/* {error && <Error>{error}</Error>} */}
        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
          }}
        >
          <ModalHeader>Restart bot instance</ModalHeader>
          <ModalBody>
            <RestartEditor
              onSubmit={restartSubmit}
              onClose={() => {
                setIsOpen(false)
              }}
              botInstance={aboutBot}
            />
          </ModalBody>
        </Modal>
      </CardBody>
      <CardFooter>
        <ButtonGroup>
          <Button color="primary" onClick={submit}>
            Update & Restart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}

export default UpdateBotInstance
