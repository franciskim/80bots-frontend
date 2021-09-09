import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useDispatch } from 'react-redux'
import {
  Button,
  Input,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormGroup,
  Modal,
} from 'reactstrap'
import { reportBot as report } from 'store/bot/actions'
import { addNotification } from 'lib/helpers'
import { NOTIFICATION_TYPES } from 'config'

const ScreenshotsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -5px;
  padding: 10px 0;
  img {
    margin: 5px;
  }
`

const ReportEditor = ({
  bot,
  screenshots,
  onClose,
  isModalOpen,
  setIsModalOpen,
}) => {
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')
  const token = localStorage.getItem('token')

  const submitForm = () => {
    dispatch(
      report(bot.id, { message, screenshots: screenshots.map((el) => el.id) })
    )
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Issue report sent',
        })

        onClose()
      })
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Report failed, please try again later',
        })
      )
  }
  return (
    <Modal
      // mode={showReportModal ? 'in' : 'closed'}
      isOpen={isModalOpen}
      close={() => setIsModalOpen(false)}
    >
      <ModalHeader>Report Issue</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Input
            type="textarea"
            rows={5}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder={'Describe the issue'}
          />
        </FormGroup>
        {screenshots.length && (
          <ScreenshotsContainer>
            {screenshots.map((image, key) => {
              return (
                <img
                  key={key}
                  src={`${process.env.API_URL}/instances/${bot.id}/file/${image.id}?token=${token}`}
                  width={'75'}
                  height={'75'}
                />
              )
            })}
          </ScreenshotsContainer>
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" disabled={!message} onClick={submitForm}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  )
}

ReportEditor.propTypes = {
  bot: PropTypes.object,
  onClose: PropTypes.func,
  screenshots: PropTypes.array,
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
}

export default ReportEditor
