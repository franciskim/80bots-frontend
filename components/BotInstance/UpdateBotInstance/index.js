import React, { useEffect, useState, useRef } from 'react'
import Router, { useRouter } from 'next/router'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification } from 'lib/helper'
import { NOTIFICATION_TYPES } from 'config'
import { Button, ButtonGroup, Modal, Row, Container } from 'reactstrap'
import { CodeEditor } from 'components/default/inputs'
import {
  getBotInstance,
  updateBotInstance,
  restartInstance,
} from 'store/botinstance/actions'

import RestartEditor from '../RestartEditor'

const Error = styled.span`
  font-size: 15px;
  text-align: center;
`

// const selectStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     border: 'solid 1px hsl(0,0%,80%)',
//     borderRadius: '4px',
//     color: '#fff',
//     backgroundColor: 'transparent',
//     '&:hover': {
//       borderColor: '#7dffff',
//     },
//   }),
//   singleValue: (provided, state) => ({
//     ...provided,
//     color: '#fff',
//   }),
//   menu: (provided, state) => ({
//     ...provided,
//     border: 'solid 1px hsl(0,0%,80%)',
//     borderRadius: '4px',
//     zIndex: '7',
//   }),
//   menuList: (provided, state) => ({
//     ...provided,
//     backgroundColor: '#333',
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     color: state.isFocused ? 'black' : '#fff',
//   }),
// }

// const inputStyles = {
//   container: css`
//     color: #fff;
//     font-size: 16px;
//     &:first-of-type {
//       margin-right: 10px;
//     }
//     &:last-of-type {
//       margin-left: 10px;
//     }
//   `,
// }

const Index = () => {
  const dispatch = useDispatch()
  const router = useRouter().query.id
  const [botScript, setBotScript] = useState('')
  const [botPackageJSON, setBotPackageJSON] = useState('')
  const [error, setError] = useState(null)
  const modal = useRef(null)

  const isEmpty = (obj) => {
    for (let key in obj) {
      return true
    }
    return false
  }

  const aboutBot = useSelector((state) => state.botInstance.aboutBot)

  useEffect(() => {
    dispatch(getBotInstance(router))
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
    setError(null)
    const botData = {
      botScript,
      botPackageJSON,
    }
    dispatch(updateBotInstance(aboutBot.id, convertBotData(botData)))
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'BotInstance updated!',
        })
        modal.current.open()
      })
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Update failed!',
        })
      )
  }

  const restartSubmit = (params) => {
    modal.current.close()
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
    <>
      <Container>
        <Row>
          <div>
            <Tabs defaultActiveKey="script">
              <Tab eventKey="script" title="index.js">
                <CodeEditor
                  value={botScript}
                  onChange={(code) => setBotScript(code)}
                />
              </Tab>
              <Tab eventKey="json" title="package.json">
                <CodeEditor
                  value={botPackageJSON}
                  onChange={(code) => setBotPackageJSON(code)}
                />
              </Tab>
            </Tabs>
          </div>
        </Row>
        {error && <Error>{error}</Error>}
      </Container>
      <Modal ref={modal} title={'Restart bot instance'} disableSideClosing>
        <RestartEditor
          onSubmit={restartSubmit}
          onClose={() => modal.current.close()}
          botInstance={aboutBot}
        />
      </Modal>
      <ButtonGroup>
        <Button color="primary" onClick={submit}>
          Update & Restart
        </Button>
      </ButtonGroup>
    </>
  )
}

export default Index
