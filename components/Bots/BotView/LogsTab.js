import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CardBody } from 'reactstrap'
import { Loader80bots } from 'components/default'
import { flush, open as openItem } from 'store/fileSystem/actions'
import FileSystem from 'components/default/FileSystem'
import { Select } from 'components/default/inputs'

const rootFolder = 'logs'

const LogsTab = () => {
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!openedFolder || !openedFolder.path.startsWith(rootFolder)) {
      openItem({ path: rootFolder }, { limit: 10 })
    }
    return () => flush()
  }, [openedFolder])

  const items = useSelector((state) => state.fileSystem.items)
  const openedFile = useSelector((state) => state.fileSystem.openedFile)
  const openedFolder = useSelector((state) => state.fileSystem.openedFolder)

  useEffect(() => {
    const newOptions = items.map((item) => {
      item.value = item.name
      if (item.value === 'cloud-init-output') {
        item.label = 'Bot Initial'
      } else if (item.value === 'log') {
        item.label = 'Bot Work'
      } else {
        item.label = item.value
      }
      return item
    })
    setOptions(newOptions)
  }, [items])

  useEffect(() => {
    if (!options.length) return
    if (!selected) {
      setSelected(options[0])
    }
  }, [options])

  useEffect(() => {
    if (!selected) return
    if (!selected.path.startsWith(rootFolder)) {
      flush()
      setSelected(null)
    } else {
      openItem(selected)
    }
  }, [selected])

  const onSelected = (option) => {
    setSelected(option)
  }

  return (
    <CardBody className="d-flex justify-content-center">
      {openedFile ? (
        <>
          <Select
            onChange={onSelected}
            options={options}
            value={selected}
            styles={{
              select: {
                container: (provided) => ({
                  ...provided,
                  minWidth: '200px',
                }),
              },
            }}
          />
          <FileSystem hideNavigator={true} />
        </>
      ) : (
        <Loader80bots
          data={'light'}
          styled={{
            width: '200px',
          }}
        />
      )}
    </CardBody>
  )
}

export default LogsTab
