import React from 'react';
import PropTypes from 'prop-types';
import ImageViewer from './ImageViewer';
import { lookup as getMime } from 'mime-types';
const openFile = (item, onClose) => {
  const mime = getMime(item.path);
  console.log({path: item.path, mime})
  switch (mime) {
    case 'image/jpeg':
    case 'image/gif':
    case 'image/png':
    case 'image/webp':
      return <ImageViewer item={item} onClose={onClose}/>;
    default:
      return <div>Oops! Can not open file click <a href={item.url}>here</a> to download file</div>;
  }
};

const FileReaderComponent = ({ item, onClose, ...props }) => {
  return openFile(item, onClose);
};

FileReaderComponent.propTypes = {
  item: PropTypes.object.isRequired
};

export default FileReaderComponent;