import React from 'react'
import PropTypes from 'prop-types'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import LaunchEditor from './LaunchEditor'
import { useDispatch } from 'react-redux'
import { launchInstance } from 'store/bot/actions'
import { addNotification } from 'lib/helpers'
import { NOTIFICATION_TYPES } from 'config'

const DeployBotModal = ({ isOpen, bot, onClose }) => {
  const dispatch = useDispatch()

  const launchBot = (params) => {
    dispatch(launchInstance(bot.id, params))
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.INFO,
          message: 'New bot instance is deploying',
        })
        onClose()
      })
      .catch((action) => {
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message:
            action.error?.response?.data?.message ||
            'Error occurred during new instance launch',
          delay: 1500,
        })
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>Deploy selected bot?</ModalHeader>
      <ModalBody>
        {bot && (
          <LaunchEditor
            onSubmit={launchBot}
            onClose={() => onClose(false)}
            bot={bot}
          />
        )}
      </ModalBody>
    </Modal>
  )
}

DeployBotModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  bot: PropTypes.object,
  onClose: PropTypes.func.isRequired,
}

export default DeployBotModal
