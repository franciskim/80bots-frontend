import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { open as openItem, close as closeItem } from 'store/fileSystem/actions'
import { Loader80bots } from 'components/default'
import FileSystem from 'components/default/FileSystem'

const ImagesType = ({ setCustomBack }) => {
  const rootFolder = 'output/images'
  const dispatch = useDispatch()

  const [isReportMode] = useState(false)
  const [reportItems, setReportItems] = useState([])
  const [limit] = useState(8)

  const channel = useSelector((state) => state.bot.botInstance?.storage_channel)
  const openedFolder = useSelector((state) => state.fileSystem.openedFolder)
  const previous = useSelector(
    (state) => state.fileSystem.history.slice(-1)?.[0]?.openedFolder
  )
  const loading = useSelector((state) => state.fileSystem.loading)
  // const items = useSelector((state) => state.fileSystem.items)

  useEffect(() => {
    if (channel && !!openedFolder) {
      return
    }
    dispatch(openItem({ path: rootFolder }, { limit }))
  }, [channel, openedFolder])

  useEffect(() => {
    if (!previous || openedFolder.path === rootFolder) {
      setCustomBack(null)
    } else {
      setCustomBack(() => {
        dispatch(closeItem(openedFolder))
        dispatch(openItem(previous, { limit }))
      })
    }
  }, [openedFolder, previous])

  useEffect(() => {
    !isReportMode && setReportItems([])
  }, [isReportMode])

  return (
    <>
      {loading ? (
        <Loader80bots
          styled={{
            width: '200px',
          }}
        />
      ) : (
        <FileSystem selectedItems={reportItems} />
      )}
    </>
  )
}

ImagesType.propTypes = {
  setCustomBack: PropTypes.func.isRequired,
}

export default ImagesType
