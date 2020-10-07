import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import List from "./List";
import FileReaderComponent from "./Tools/FileReader";
import {
  close,
  flush,
  getItems,
  open,
  filterItems
} from "../../../store/fileSystem/actions";
import { connect } from "react-redux";
import { withTheme } from "emotion-theming";

const Container = styled.div`
  position: relative;
  flex: 1;
`;

const FileSystem = ({
  items,
  total,
  limit,
  page,
  openedFolder,
  openedFile,
  openItem,
  closeItem,
  getItems,
  hideNavigator,
  onFileOpen,
  onFolderOpen,
  selectedItems,
  filterItems,
  filter,
}) => {
  const handleItemClick = item => {
    if (item.type === "file") {
      return onFileOpen ? onFileOpen(item) : openItem(item);
    } else {
      return onFolderOpen ? onFolderOpen(item) : openItem(item);
    }
  };

  const getSelectedItems = () => {
    return items.map(item => {
      item.selected = !!selectedItems.find(i => i.id === item.id);
      return item;
    });
  };

  return (
    <Container>
      {openedFile?.path ? (
        <FileReaderComponent item={openedFile} onClose={closeItem} />
      ) : null}
      {openedFolder && !hideNavigator ? (
        <List
          items={getSelectedItems()}
          onItemClick={handleItemClick}
          onLimitChange={limit => getItems({ limit, isFiltered: filter })}
          onPageChange={page => getItems({ page, isFiltered: filter })}
          page={page}
          total={total}
          limit={limit}
          filterItems={f => filterItems({ limit: 15, page: 1, isFiltered: !filter })}
          filter={filter}
        />
      ) : null}
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
  hideNavigator: PropTypes.bool,
  onFileOpen: PropTypes.func,
  onFolderOpen: PropTypes.func,
  selectedItems: PropTypes.array,
  filterItems: PropTypes.func.isRequired,
  filter: PropTypes.bool,
};

const mapStateToProps = state => ({
  channel: state.bot.botInstance?.storage?.channel,
  openedFolder: state.fileSystem.openedFolder,
  openedFile: state.fileSystem.openedFile,
  items: state.fileSystem.items,
  total: state.fileSystem.total,
  limit: state.fileSystem.query?.limit,
  page: state.fileSystem.query?.page,
  filter: state.fileSystem.filter,
  isFiltered: state.fileSystem.isFiltered
});

const mapDispatchToProps = dispatch => ({
  getItems: query => dispatch(getItems(query)),
  flush: () => dispatch(flush()),
  openItem: item => dispatch(open(item)),
  closeItem: item => dispatch(close(item)),
  filterItems: (query) => dispatch(filterItems(query)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(FileSystem));
