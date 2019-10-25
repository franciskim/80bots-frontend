import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import List from './List';
import File from './File';
import Folder from './Folder';

const Container = styled.div`
  position: relative;
`;

const FileSystem = ({ items, ...props }) => {
  return(
    <Container>
      <List items={items} {...props} />
    </Container>
  );
};

FileSystem.propTypes = {
  // items: PropTypes.arrayOf({
  //   type: PropTypes.oneOf(['folder', 'file'])
  // })
};

export default FileSystem;