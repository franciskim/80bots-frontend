import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'

import { useDispatch, useSelector } from 'react-redux'
import { getTags } from 'store/bot/actions'
import { getUsers } from 'store/user/actions'
import { addNotification } from 'lib/helper'
import {
  Button,
  Input,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Nav,
  TabContent,
  NavItem,
  NavLink,
  TabPane,
  CardFooter,
  FormGroup,
} from 'reactstrap'
import { CodeEditor } from 'components/default/inputs'
import { NOTIFICATION_TYPES } from 'config'
import { getBot, clearBot, updateBot } from 'store/bot/actions'
import Router, { useRouter } from 'next/router'

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

const UpdateBot = () => {
  const dispatch = useDispatch()

  const { id } = useRouter().query
  const [tagName, setTagName] = useState('')
  const [botTags, setTags] = useState([])
  const [botName, setBotName] = useState('')
  const [botScript, setBotScript] = useState('')
  const [botPackageJSON, setBotPackageJSON] = useState('')
  const [status, setStatus] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setPrivate] = useState(false)
  const [trustedUsers, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('script')

  const tags = useSelector((state) => state.bot.tags)
  const users = useSelector((state) => state.user.users)
  const aboutBot = useSelector((state) => state.bot.aboutBot)

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const toOptions = (item) => {
    return {
      ...item,
      value: typeof item === 'object' ? item.name || item.id : item,
      label:
        typeof item === 'object'
          ? item.email
            ? item.email + ' | ' + item.name
            : item.name
          : item,
    }
  }

  const isEmpty = (obj) => {
    for (let key in obj) {
      return true
    }
    return false
  }

  useEffect(() => {
    dispatch(getBot(id))
    return () => {
      clearBot()
    }
  }, [])

  useEffect(() => {
    getTags({ page: 1, limit: 50 })
    getUsers({ page: 1, limit: 25 })
    return () => {}
  }, [])

  useEffect(() => {
    if (isEmpty(aboutBot)) {
      setBotName(aboutBot.name)
      setBotScript(aboutBot.aws_custom_script)
      setBotPackageJSON(aboutBot.aws_custom_package_json)
      setDescription(aboutBot.description)
      setStatus(aboutBot.status)
      setPrivate(aboutBot ? aboutBot.type === 'private' : false)
      setTags(aboutBot.tags.map(toOptions))
      if (aboutBot.users) {
        setUsers(
          users
            .filter((item) =>
              aboutBot.users.find((user) => user.id === item.id)
            )
            .map(toOptions)
        )
      }
    }
  }, [tags, users, aboutBot])

  const onUsersSearch = (value, callback) => {
    getUsers({ page: 1, limit: 25, search: value }).then((action) =>
      callback(action.data.data.map(toOptions))
    )
  }

  const onTagInputChange = (newValue) => {
    setTagName(newValue)
  }

  const getTagOptions = () => {
    let options = tags.map(toOptions)
    if (
      tagName &&
      !options.find((item) => item.label.match(new RegExp(tagName, 'ig')))
    ) {
      options = [{ value: tagName, label: tagName }].concat(options)
    }
    return options
  }

  const convertBotData = (botData) => ({
    name: botData.botName,
    description: botData.description,
    aws_custom_script: botData.botScript,
    aws_custom_package_json: botData.botPackageJSON,
    tags: botData.botTags,
    users: botData.users.map((user) => user.id),
    type: botData.isPrivate ? 'private' : 'public',
    status: status,
  })

  const submit = () => {
    if (!botName) {
      setError("You must fill in required fields marked by '*'")
    } else {
      setError(null)
      const users = isPrivate ? { users: trustedUsers } : { users: [] }
      const botData = {
        botName,
        isPrivate,
        botScript,
        botPackageJSON,
        description,
        botTags: botTags.map((item) => item.value),
        ...users,
      }

      dispatch(updateBot(aboutBot.id, convertBotData(botData)))
        .then(() => {
          addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            message: 'Bot updated!',
          })
          Router.push('/bots')
        })
        .catch(() =>
          addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            message: 'Update failed!',
          })
        )
    }
  }

  return (
    <Card>
      <CardBody>
        <FormGroup className="row">
          <Label md={2} className="form-control-label">
            Bot Name *
          </Label>
          <Col md={10}>
            <Input
              type={'text'}
              value={botName}
              // styles={inputStyles}
              onChange={(e) => setBotName(e.target.value)}
            />
          </Col>
        </FormGroup>
        <FormGroup className="row">
          <Label md={2} className="form-control-label">
            {' '}
            Bot Script
          </Label>
          <Col md={10}>
            <Nav tabs>
              <NavItem>
                <NavLink
                  // className={classnames({ active: activeTab === 'script' })}
                  onClick={() => {
                    toggle('script')
                  }}
                >
                  index.js
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  // className={classnames({ active: activeTab === 'json' })}
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
                  onChange={(code) => setBotScript(code)}
                />
              </TabPane>
              <TabPane tabId="json">
                <CodeEditor
                  value={botPackageJSON}
                  onChange={(code) => setBotPackageJSON(code)}
                />
              </TabPane>
            </TabContent>
          </Col>
        </FormGroup>
        <FormGroup className="row">
          <Label md={2} className="form-control-label">
            Description
          </Label>
          <Col md={10}>
            <Input
              type="textarea"
              label={'Description'}
              rows={5}
              value={description}
              // styles={inputStyles}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Col>
        </FormGroup>
        <FormGroup className="row">
          <Label md={2} className="form-control-label">
            Tags
          </Label>
          <Col md={10}>
            <Select
              id="tags-selector"
              instanceId="tags-selector"
              isMulti
              options={getTagOptions()}
              // styles={selectStyles}
              onInputChange={onTagInputChange}
              onChange={(options) => setTags(options)}
              value={botTags}
            />
          </Col>
        </FormGroup>
        <FormGroup className="row">
          <Label md={2} className="form-control-label">
            Access *
          </Label>
          <Col md={10}>
            <Button
              className="form-control"
              color={isPrivate ? 'danger' : 'secondary'}
              onClick={() => setPrivate(!isPrivate)}
            >
              {isPrivate ? 'Private' : 'Public'}
            </Button>
          </Col>
        </FormGroup>
        {isPrivate && (
          <FormGroup className="row">
            <Label md={2} className="form-control-label">
              Trusted Users
            </Label>
            <Col md={10}>
              <AsyncSelect
                isMulti
                defaultOptions={users.map(toOptions)}
                value={trustedUsers}
                // styles={selectStyles}
                onChange={(options) => setUsers(options)}
                loadOptions={onUsersSearch}
              />
            </Col>
          </FormGroup>
        )}
        {error && <Error>{error}</Error>}
      </CardBody>
      <CardFooter>
        <Button color="primary" onClick={submit}>
          Update
        </Button>
      </CardFooter>
    </Card>
  )
}

export default UpdateBot
