import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import List from './List';
import FileReaderComponent from './Tools/FileReader';
import {close, flush, getItems, open} from '../../../store/fileSystem/actions';
import {connect} from 'react-redux';
import {withTheme} from 'emotion-theming';

const Container = styled.div`
  position: relative;
  flex: 1;
`;

const FileSystem = ({ items, total, limit, page, openedFolder, openedFile, openItem, closeItem, getItems, hideNavigator }) => {
  return(
    <Container>
      {
        openedFile?.path ? <FileReaderComponent item={openedFile} onClose={closeItem}/> : null
      }
      {
        openedFolder && !hideNavigator ? <List items={items}
          onItemClick={openItem}
          onLimitChange={(limit) => getItems({limit})}
          onPageChange={(page) => getItems({page})}
          page={page}
          total={total}
          limit={limit}/> : null
      }
    </Container>
  );
};

FileSystem.propTypes = {
  items: PropTypes.array,
  total: PropTypes.number,
  page: PropTypes.number,
  limit: PropTypes.number,
  getItems: PropTypes.func.isRequired,
  flush: PropTypes.func.isRequired,
  openItem: PropTypes.func.isRequired,
  closeItem: PropTypes.func.isRequired,
  openedFolder: PropTypes.object,
  openedFile: PropTypes.object,
  hideNavigator: PropTypes.bool
};

const mapStateToProps = state => ({
  channel: state.bot.botInstance?.storage?.channel,
  openedFolder: state.fileSystem.openedFolder,
  openedFile: state.fileSystem.openedFile,
  items: state.fileSystem.items,
  total: state.fileSystem.total,
  limit: state.fileSystem.query?.limit,
  page: state.fileSystem.query?.page,
});


const mapDispatchToProps = dispatch => ({
  getItems: query => dispatch(getItems(query)),
  flush: () => dispatch(flush()),
  openItem: (item) => dispatch(open(item)),
  closeItem: (item) => dispatch(close(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(FileSystem));
