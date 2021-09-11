import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CardBody, Row, Col } from 'reactstrap'
import { Loader80bots } from 'components/default'
import { open as openItem } from 'store/fileSystem/actions'
import FileSystem from 'components/default/FileSystem'
import Select from 'react-select'

const rootFolder = 'logs'

const LogsTab = () => {
  const dispatch = useDispatch()
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)
  const [limit] = useState(16)

  useEffect(() => {
    if (!openedFolder || !openedFolder.path.startsWith(rootFolder)) {
      dispatch(openItem({ path: rootFolder }, { limit }))
    }
    // return () => flush()
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
    if (!options.length) {
      return
    }
    if (!selected) {
      setSelected(options[0])
    }
  }, [options])

  useEffect(() => {
    if (!selected) return
    if (!selected.path.startsWith(rootFolder)) {
      // flush()
      setSelected(null)
    } else {
      dispatch(openItem(selected))
    }
  }, [selected])

  const onSelected = (option) => {
    setSelected(option)
  }

  return (
    <CardBody>
      {openedFile ? (
        <Row>
          <Col md={4}>
            <Select onChange={onSelected} options={options} value={selected} />
          </Col>
          <Col md={8}>
            <FileSystem hideNavigator={true} />
          </Col>
        </Row>
      ) : (
        <Loader80bots
          styled={{
            width: '200px',
          }}
        />
      )}
    </CardBody>
  )
}

export default LogsTab
