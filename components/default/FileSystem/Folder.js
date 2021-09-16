import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Col, Media } from 'reactstrap'
import folderImage from 'assets/img/folder.png'

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
  margin-right: 20px;
  cursor: pointer;
`

const Caption = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  text-align: center;
`

export const TYPE = 'folder'

const Folder = ({ item, onClick = () => null }) => {
  return (
    <Col md={3}>
      <Wrapper onClick={() => onClick(item)}>
        <Media src={item.thumbnail || folderImage} className="w-100" alt="" />
        <Caption>{item.name}</Caption>
      </Wrapper>
    </Col>
  )
}

Folder.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func,
}

export default Folder
