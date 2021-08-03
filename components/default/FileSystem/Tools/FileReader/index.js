import React from 'react'
import PropTypes from 'prop-types'
import ImageViewer from './ImageViewer'
import TextViewer from './TextViewer'
import JsonViewer from './JsonViewer'
import { lookup as getMime } from 'mime-types'

const openFile = (item, onClose) => {
  const mime = getMime(item.path)
  switch (mime) {
    case 'image/jpeg':
    case 'image/gif':
    case 'image/png':
    case 'image/webp':
      return <ImageViewer item={item} onClose={onClose} />
    case 'text/plain':
      return <TextViewer item={item} onClose={onClose} />
    case 'application/json':
      return <JsonViewer item={item} onClose={onClose} />
    default:
      return (
        <div>
          Oops! Can not open file click <a href={item.url}>here</a> to download
          file
        </div>
      )
  }
}

const FileReaderComponent = ({ item, onClose }) => {
  return <div>{openFile(item, onClose)}</div>
}

FileReaderComponent.propTypes = {
  item: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default FileReaderComponent
