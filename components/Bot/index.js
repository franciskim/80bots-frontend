import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import { useDispatch, useSelector } from 'react-redux'
import {
  Nav,
  NavItem,
  TabContent,
  NavLink,
  TabPane,
  Card,
  CardBody,
  Form,
  Col,
  Label,
  CardFooter,
  FormGroup,
  FormFeedback,
  Button,
  Input,
} from 'reactstrap'
import { addBot } from 'store/bot/actions'
import { getUsers } from 'store/user/actions'
import { addNotification } from 'lib/helpers'
import { CodeEditor } from 'components/default/inputs'
import { NOTIFICATION_TYPES } from 'config'
import Router from 'next/router'
import * as yup from 'yup'
import classnames from 'classnames'

const Index = () => {
  const dispatch = useDispatch()
  const [tagName, setTagName] = useState('')
  const [botTags, setTags] = useState([])
  const [botName, setBotName] = useState('')
  const [botScript, setBotScript] = useState('')
  const [botPackageJSON, setBotPackageJSON] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setPrivate] = useState(false)
  const [trustedUsers, setUsers] = useState([])
  const [errors, setErrors] = useState({})
  const [activeTab, setActiveTab] = useState('script')

  const tags = useSelector((state) => state.bot.tags)
  const users = useSelector((state) => state.user.users)

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

  useEffect(() => {
    dispatch(getUsers({ page: 1, limit: 25 }))
  }, [])

  const onUsersSearch = (value, callback) => {
    dispatch(getUsers({ page: 1, limit: 25, search: value })).then((action) =>
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
  })

  const submitForm = (e) => {
    e.preventDefault()
    try {
      const schema = yup.object().shape({
        botName: yup.string().required(),
      })
      schema.validateSync(
        {
          botName,
        },
        {
          abortEarly: false,
        }
      )
    } catch (err) {
      setErrors(
        err.inner.reduce((accr, validationError) => {
          accr[validationError.path] = validationError.message
          return accr
        }, {})
      )
      return
    }

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
    dispatch(addBot(convertBotData(botData)))
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Bot added!',
        })
        Router.push('/bots')
      })
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Add failed!',
        })
      )
  }

  return (
    <Card>
      <CardBody>
        <Form noValidate>
          <FormGroup className="row">
            <Label htmlFor="bot-name" md={2} className="form-control-label">
              Bot Name *
            </Label>
            <Col md={10}>
              <Input
                id="bot-name"
                type="text"
                value={botName}
                onChange={({ target }) => {
                  setBotName(target.value)
                  setErrors({
                    ...errors,
                    botName: null,
                  })
                }}
                autoFocus
                invalid={!!errors['botName']}
              />
              <FormFeedback valid={false}>
                You must fill in bot name
              </FormFeedback>
            </Col>
          </FormGroup>
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
          <FormGroup className="row">
            <Label htmlFor="description" md={2} className="form-control-label">
              Description
            </Label>
            <Col md={10}>
              <Input
                id="description"
                type="textarea"
                label={'Description'}
                rows={5}
                value={description}
                onChange={({ target }) => setDescription(target.value)}
              />
            </Col>
          </FormGroup>
          <FormGroup className="row">
            <Label
              htmlFor="tags-selector"
              md={2}
              className="form-control-label"
            >
              Tags
            </Label>
            <Col md={10}>
              <Select
                id="tags-selector"
                isMulti
                options={getTagOptions()}
                onInputChange={onTagInputChange}
                onChange={(options) => setTags(options)}
                value={botTags}
              />
            </Col>
          </FormGroup>
          <FormGroup className="row">
            <Label htmlFor="visible-btn" md={2} className="form-control-label">
              Access *
            </Label>
            <Col md={2}>
              <Button
                id="visible-btn"
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
              <Label
                htmlFor="user-selector"
                md={2}
                className="form-control-label"
              >
                Trusted Users
              </Label>
              <Col md={10}>
                <AsyncSelect
                  id="user-selector"
                  isMulti
                  defaultOptions={users.map(toOptions)}
                  value={trustedUsers}
                  onChange={(options) => setUsers(options)}
                  loadOptions={onUsersSearch}
                />
              </Col>
            </FormGroup>
          )}
        </Form>
      </CardBody>
      <CardFooter>
        <Button color="primary" onClick={submitForm}>
          Add Bot
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Index
