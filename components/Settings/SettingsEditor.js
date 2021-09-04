import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { getBotSettings, updateBotSettings } from 'store/bot/actions'
import { addNotification } from 'lib/helpers'
import { NOTIFICATION_TYPES } from 'config'
import * as yup from 'yup'
import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label,
  Modal,
  Col,
  Form,
  FormFeedback,
} from 'reactstrap'

const SettingsEditor = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const [instanceType, setInstanceType] = useState('')
  const [storage, setStorage] = useState(0)
  const [script, setScript] = useState('')

  const [errors, setErrors] = useState({})

  useEffect(() => {
    dispatch(getBotSettings())
  }, [])

  const botSettings = useSelector((state) => state.bot.botSettings)

  useEffect(() => {
    if (botSettings) {
      setInstanceType(botSettings.type)
      setStorage(botSettings.storage)
      setScript(botSettings.script)
    }
  }, [botSettings])

  const submitForm = () => {
    try {
      const schema = yup.object().shape({
        storage: yup.string().required(),
        script: yup.string().required(),
      })
      schema.validateSync(
        {
          instanceType,
          storage,
          script,
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
    setErrors({})
    dispatch(
      updateBotSettings(botSettings.id, {
        type: instanceType,
        storage,
        script,
      })
    )
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Settings updated',
        })
        onClose()
      })
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: "Can't update settings right now",
        })
      )
  }

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>Edit Global Settings</ModalHeader>
      <ModalBody>
        <Form noValidate>
          <FormGroup className="row">
            <Label md={4} className="form-control-label" htmlFor="storage">
              Storage(GB)
            </Label>
            <Col md={8}>
              <Input
                id="storage"
                type={'number'}
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                invalid={!!errors['storage']}
              />
              <FormFeedback valid={false}>This field is required</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup>
            <Label className="form-control-label" htmlFor="script">
              Startup Script
            </Label>
            <Input
              id="script"
              type="textarea"
              value={script}
              rows={6}
              onChange={(e) => setScript(e.target.value)}
              invalid={!!errors['script']}
            />
            <FormFeedback valid={false}>This field is required</FormFeedback>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Cancel</Button>
        <Button color={'primary'} onClick={submitForm}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  )
}

SettingsEditor.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default SettingsEditor
