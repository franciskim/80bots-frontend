import React from 'react'
import PropTypes from 'prop-types'
// import styled from '@emotion/styled'
import Folder, { TYPE as FOLDER_TYPE } from './Folder'
import File, { TYPE as FILE_TYPE } from './File'

const Item = ({ item, onClick }) => {
  const { type } = item

  switch (type) {
    case FOLDER_TYPE: {
      return <Folder item={item} onClick={onClick} />
    }
    case FILE_TYPE: {
      return <File item={item} onClick={onClick} />
    }
  }
  return <span>Can&apos;t process item type</span>
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Item
