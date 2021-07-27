import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useDispatch } from 'react-redux'

import { Button, Input, Container, ButtonGroup } from 'reactstrap'
import { reportBot as report } from 'store/bot/actions'
import { addNotification } from 'lib/helper'
import { NOTIFICATION_TYPES } from 'config'

// const Buttons = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
// `

const ScreenshotsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -5px;
  padding: 10px 0;
  img {
    margin: 5px;
  }
`

const ReportIssue = ({ bot, screenshots, onClose }) => {
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')

  const submit = () => {
    addNotification({
      type: NOTIFICATION_TYPES.INFO,
      message: 'Uploading Report...',
    })

    dispatch(
      report(bot.id, { message, screenshots: screenshots.map((el) => el.id) })
    )
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Issue report sent',
        })

        onClose && onClose()
      })
      .catch((err) =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Report failed, please try again later',
        })
      )
  }
  return (
    <>
      <Input
        type="text"
        // styles={{
        //   container: css`
        //     margin-top: 20px;
        //   `,
        // }}
        rows={5}
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        placeholder={'Describe the issue'}
      />
      {screenshots.length && (
        <ScreenshotsContainer>
          {screenshots.map((image, key) => {
            return <img key={key} src={image.url} width={'75'} height={'75'} />
          })}
        </ScreenshotsContainer>
      )}
      <ButtonGroup>
        <Button type={'danger'} onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" disabled={!message} onClick={submit}>
          Submit
        </Button>
      </ButtonGroup>
    </>
  )
}

ReportIssue.propTypes = {
  bot: PropTypes.object,
  onClose: PropTypes.func,
  screenshots: PropTypes.array,
}

export default ReportIssue
