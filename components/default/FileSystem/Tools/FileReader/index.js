import React from 'react';
import PropTypes from 'prop-types';
import ImageViewer from './ImageViewer';
import TextViewer from './TextViewer';
import { lookup as getMime } from 'mime-types';
import styled from "@emotion/styled";

const Wrapper = styled.div`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
`;
const openFile = (item, onClose) => {
  const mime = getMime(item.path);
  switch (mime) {
    case 'image/jpeg':
    case 'image/gif':
    case 'image/png':
    case 'image/webp':
      return <ImageViewer item={item} onClose={onClose} />;
    case 'text/plain':
      return <TextViewer item={item} onClose={onClose}/>;
    default:
      return <div>Oops! Can not open file click <a href={item.url}>here</a> to download file</div>;
  }
};

const FileReaderComponent = ({ item, onClose, ...props }) => {
  return <Wrapper>
    {openFile(item, onClose)}
  </Wrapper>;
};

FileReaderComponent.propTypes = {
  item: PropTypes.object.isRequired
};

export default FileReaderComponent;