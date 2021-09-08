import React from 'react'
import PropTypes from 'prop-types'
import ImageViewer from './ImageViewer'
import TextViewer from './TextViewer'
import JsonViewer from './JsonViewer'
import { lookup as getMime } from 'mime-types'

const FileReaderComponent = ({ item, onClose }) => {
  const mime = getMime(item.path)
  let component = (
    <div>
      Oops! Can not open file click <a href={item.url}>here</a> to download file
    </div>
  )
  switch (mime) {
    case 'image/jpeg':
    case 'image/gif':
    case 'image/png':
    case 'image/webp':
      component = <ImageViewer item={item} onClose={onClose} />
      break
    case 'text/plain':
      component = <TextViewer item={item} onClose={onClose} />
      break
    case 'application/json':
      component = <JsonViewer item={item} onClose={onClose} />
      break
  }

  return <>{component}</>
}

FileReaderComponent.propTypes = {
  item: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default FileReaderComponent
