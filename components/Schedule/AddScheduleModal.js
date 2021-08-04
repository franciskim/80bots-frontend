import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  FormGroup,
  Col,
} from 'reactstrap'
import AsyncSelect from 'react-select/async'
import { createSchedule } from 'store/schedule/actions'
import PropTypes from 'prop-types'
import { getRunningBots } from 'store/bot/actions'
import { NOTIFICATION_TYPES } from 'config'
import { addNotification } from 'lib/helpers'

const AddScheduleModal = ({ isOpen, onClose, onRefresh }) => {
  const dispatch = useDispatch()
  const [instanceId, setInstanceId] = useState(null)

  const runningBots = useSelector((state) => state.bot.botInstances)

  const addSchedule = () => {
    dispatch(createSchedule({ instanceId }))
      .then(() => {
        onClose(false)
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Schedule was successfully added',
        })
        onRefresh()
      })
      .catch((err) => {
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: err.error.message,
        })
      })
  }

  const searchBots = (value, callback) => {
    dispatch(getRunningBots({ page: 1, limit: 50, search: value })).then(
      (action) => {
        return callback(
          action.data.data.map((bot) => ({
            value: bot.instance_id,
            label: bot.instance_id + '|' + bot.name,
          }))
        )
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Add Schedule</ModalHeader>
      <ModalBody>
        <FormGroup className="row">
          <Label md={4} htmlFor="bot-selector">
            Running bots
          </Label>
          <Col md={8}>
            <AsyncSelect
              id="bot-selector"
              onChange={(option) => {
                setInstanceId(option.value)
              }}
              loadOptions={searchBots}
              defaultOptions={runningBots
                .filter((bot) => bot.status !== 'terminated')
                .map((bot) => ({
                  value: bot.instance_id,
                  label: bot.instance_id + '|' + bot.name,
                }))}
            />
          </Col>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={addSchedule} disabled={!instanceId}>
          Add
        </Button>
      </ModalFooter>
    </Modal>
  )
}

AddScheduleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
}
export default AddScheduleModal
