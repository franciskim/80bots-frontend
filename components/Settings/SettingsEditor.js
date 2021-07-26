import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getBotSettings, updateBotSettings } from 'store/bot/actions'
import { addNotification } from 'store/notification/actions'
import { NOTIFICATION_TYPES } from 'config'
import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label,
} from 'reactstrap'

const VALIDATION = {
  SCRIPT: 'script',
  TYPE: 'instance_type',
  STORAGE: 'storage',
}

const SettingsEditor = ({ onClose }) => {
  const dispatch = useDispatch()
  const [instanceType, setInstanceType] = useState('')
  const [storage, setStorage] = useState(0)
  const [script, setScript] = useState('')
  const [errors, setErrors] = useState([])

  useEffect(() => {
    dispatch(getBotSettings())
  }, [])

  const botSettings = useSelector((state) => state.bot.botSettings)

  useEffect(() => {
    if (botSettings) {
      setInstanceType(botSettings.type || '')
      setStorage(botSettings.storage || '')
      setScript(botSettings.script || '')
    }
  }, [botSettings])

  const validate = () => {
    setErrors([])
    let err = []
    if (!instanceType) err.push(VALIDATION.TYPE)
    if (!storage) err.push(VALIDATION.STORAGE)
    if (!script) err.push(VALIDATION.SCRIPT)
    return err
  }

  const submit = () => {
    const err = validate()

    if (err.length > 0) {
      setErrors(err)
    } else {
      dispatch(
        updateBotSettings(botSettings.id, {
          type: instanceType,
          storage,
          script,
        })
      )
        .then(() => {
          dispatch(
            addNotification({
              type: NOTIFICATION_TYPES.SUCCESS,
              message: 'Settings updated',
            })
          )
          onClose()
        })
        .catch(() =>
          dispatch(
            addNotification({
              type: NOTIFICATION_TYPES.ERROR,
              message: "Can't update settings right now",
            })
          )
        )
    }
  }

  return (
    <>
      <ModalHeader>Edit Global Settings</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label className="form-control-label" htmlFor="example-time-input">
            Instance Type
          </Label>
          <Input
            value={instanceType}
            onChange={(e) => setInstanceType(e.target.value)}
            error={
              errors.indexOf(VALIDATION.TYPE) > -1
                ? 'This field is required'
                : ''
            }
          />
        </FormGroup>
        <FormGroup>
          <Label className="form-control-label" htmlFor="example-time-input">
            Storage GB
          </Label>
          <Input
            type={'number'}
            value={storage}
            onChange={(e) => setStorage(e.target.value)}
            error={
              errors.indexOf(VALIDATION.STORAGE) > -1
                ? 'This field is required'
                : ''
            }
          />
        </FormGroup>
        <FormGroup>
          <Label className="form-control-label" htmlFor="example-time-input">
            Startup Script
          </Label>
          <Input
            type="textarea"
            rows={10}
            value={script}
            onChange={(e) => setScript(e.target.value)}
            error={
              errors.indexOf(VALIDATION.SCRIPT) > -1
                ? 'This field is required'
                : ''
            }
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Cancel</Button>
        <Button color={'primary'} onClick={submit}>
          Submit
        </Button>
      </ModalFooter>
    </>
  )
}
export default SettingsEditor
