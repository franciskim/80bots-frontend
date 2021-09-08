import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col } from 'reactstrap'
import { Loader80bots } from 'components/default'
import { open as openItem } from 'store/fileSystem/actions'
import FileSystem from 'components/default/FileSystem'
import Select from 'react-select'

const JsonType = () => {
  const rootFolder = 'output/json'
  const limit = 20
  const dispatch = useDispatch()
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)

  const items = useSelector((state) => state.fileSystem.items)
  const openedFile = useSelector((state) => state.fileSystem.openedFile)
  const openedFolder = useSelector((state) => state.fileSystem.openedFolder)

  useEffect(() => {
    if (!openedFolder || !openedFolder.path.startsWith(rootFolder)) {
      dispatch(openItem({ path: rootFolder }, { limit }))
    }
  }, [rootFolder])

  useEffect(() => {
    setOptions(
      items.map((item) => {
        item.value = item.name
        item.label = item.name
        return item
      })
    )
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
      setSelected(null)
    } else {
      dispatch(openItem(selected))
    }
  }, [selected])

  return (
    <>
      {openedFile ? (
        <>
          <Row>
            <Col md="3">
              <Select
                onChange={setSelected}
                options={options}
                value={selected}
              />
            </Col>
          </Row>
          <FileSystem hideNavigator={true} />
        </>
      ) : (
        <Loader80bots
          styled={{
            width: '200px',
          }}
        />
      )}
    </>
  )
}

export default JsonType
