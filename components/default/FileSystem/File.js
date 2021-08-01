import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { formatScreenshot, formatTimezone } from 'lib/helpers'
import { useSelector } from 'react-redux'
import { Col, Media } from 'reactstrap'

// const Fade = keyframes`
//   from { opacity: 0 }
//   to { opacity: 1 }
// `

// const Wrapper = styled(CardWithPreview)`
//   position: relative;
//   margin-bottom: 20px;
//   margin-right: 20px;
//   animation: ${Fade} 200ms ease-in-out;
//   ${(props) => props.styles};
// `

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
  margin-right: 20px;
  cursor: pointer;
  width: 320px;
  height: 200px;
  transition: 100ms all;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  border: none;
  &:hover {
    transform: scale(1.05);
  }
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
  const formatName = formatScreenshot(item.name)
  const formatDate = formatTimezone(user.timezone, formatName)

  return (
    <Col md={3}>
      <Wrapper onClick={() => onClick(item)} selected={item.selected}>
        <Media src={item.url} className="w-100" alt="" />
        <Caption>{formatDate}</Caption>
      </Wrapper>
    </Col>
  )
}

File.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  user: PropTypes.object,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
})

export default File
