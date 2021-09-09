import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { formatScreenshot, formatTimezone } from 'lib/helpers'
import { useSelector } from 'react-redux'
import { Col, Media } from 'reactstrap'

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
  margin-right: 20px;
  cursor: pointer;
  width: 100%;
  transition: 100ms all;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  border: none;
  &:hover {
    transform: scale(1.05);
  }
`
const SelectionBox = styled.i`
  position: absolute;
  left: 5px;
  top: 5px;
  color: green;
`

const Caption = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  text-align: center;
`
export const TYPE = 'file'

const File = ({ item, onClick }) => {
  const user = useSelector((state) => state.auth.user)
  const instance = useSelector((state) => state.bot.botInstance)
  const formatName = formatScreenshot(item.name)
  const formatDate = formatTimezone(user.timezone, formatName)
  const token = localStorage.getItem('token')

  return (
    <Col md={3}>
      <Wrapper onClick={() => onClick(item)}>
        {instance && (
          <>
            {item.selected && <SelectionBox className="fas fa-check-circle" />}
            <Media
              src={`${process.env.API_URL}/instances/${instance.id}/file/${item.id}?token=${token}`}
              className="w-100"
              alt=""
            />
          </>
        )}
        <Caption>{formatDate}</Caption>
      </Wrapper>
    </Col>
  )
}

File.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func,
}

export default File
