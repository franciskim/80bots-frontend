import React from 'react'
import PropTypes from 'prop-types'
import List from './List'
import FileReaderComponent from './Tools/FileReader'
import {
  flush,
  close as closeItem,
  getItems,
  open as openItem,
  filterItems,
} from 'store/fileSystem/actions'
import { useDispatch, useSelector } from 'react-redux'

const FileSystem = ({
  hideNavigator,
  onFileOpen,
  onFolderOpen,
  selectedItems,
}) => {
  const dispatch = useDispatch()
  const openedFolder = useSelector((state) => state.fileSystem.openedFolder)
  const openedFile = useSelector((state) => state.fileSystem.openedFile)
  const items = useSelector((state) => state.fileSystem.items || [])
  const total = useSelector((state) => state.fileSystem.total)
  const limit = useSelector((state) => state.fileSystem.query?.limit)
  const page = useSelector((state) => state.fileSystem.query?.page || 1)
  const filter = useSelector((state) => state.fileSystem.filter)

  const handleItemClick = (item) => {
    if (item.type === 'file') {
      return dispatch(onFileOpen ? onFileOpen(item) : openItem(item))
    } else {
      dispatch(flush())
      return dispatch(
        onFolderOpen ? onFolderOpen(item) : openItem(item, { limit })
      )
    }
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
      {openedFolder && !hideNavigator && items.length > 0 && (
        <List
          items={items.map((item) => {
            item.selected = !!selectedItems.find((i) => i.id === item.id)
            return item
          })}
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
