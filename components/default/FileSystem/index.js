import React from 'react'
import PropTypes from 'prop-types'
import List from './List'
import FileReaderComponent from './Tools/FileReader'
import {
  close as closeItem,
  // flush,
  getItems,
  open as openItem,
  filterItems,
} from 'store/fileSystem/actions'
import { Container } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'

const FileSystem = ({
  hideNavigator,
  onFileOpen,
  onFolderOpen,
  selectedItems,
}) => {
  const dispatch = useDispatch()

  // const channel = useSelector(
  //   (state) => state.bot.botInstance?.storage?.channel
  // )
  const openedFolder = useSelector((state) => state.fileSystem.openedFolder)
  const openedFile = useSelector((state) => state.fileSystem.openedFile)
  const items = useSelector((state) => state.fileSystem.items)
  const total = useSelector((state) => state.fileSystem.total)
  const limit = useSelector((state) => state.fileSystem.query?.limit)
  const page = useSelector((state) => state.fileSystem.query?.page)
  const filter = useSelector((state) => state.fileSystem.filter)
  // const isFiltered = useSelector((state) => state.fileSystem.isFiltered)

  const handleItemClick = (item) => {
    if (item.type === 'file') {
      return dispatch(onFileOpen ? onFileOpen(item) : openItem(item))
    } else {
      return dispatch(onFolderOpen ? onFolderOpen(item) : openItem(item))
    }
  }

  const getSelectedItems = () => {
    return items.map((item) => {
      item.selected = !!selectedItems.find((i) => i.id === item.id)
      return item
    })
  }

  return (
    <>
      {openedFile?.path && (
        <FileReaderComponent
          item={openedFile}
          onClose={() => {
            dispatch(closeItem())
          }}
        />
      )}
      {openedFolder && !hideNavigator && (
        <List
          items={getSelectedItems()}
          onItemClick={handleItemClick}
          onLimitChange={(limit) =>
            dispatch(getItems({ limit, isFiltered: filter }))
          }
          onPageChange={(page) =>
            dispatch(getItems({ page, isFiltered: filter }))
          }
          page={page}
          total={total}
          limit={limit}
          filterItems={() =>
            dispatch(filterItems({ limit: 15, page: 1, isFiltered: !filter }))
          }
          filter={filter}
        />
      )}
    </>
  )
}

FileSystem.propTypes = {
  hideNavigator: PropTypes.bool,
  onFileOpen: PropTypes.func,
  onFolderOpen: PropTypes.func,
  selectedItems: PropTypes.array,
}

export default FileSystem
