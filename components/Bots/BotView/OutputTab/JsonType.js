import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useSelector, useDispatch } from 'react-redux'
import { CardBody } from 'reactstrap'
import { Loader80bots } from 'components/default'
import { open as openItem } from 'store/fileSystem/actions'
import FileSystem from 'components/default/FileSystem'
import Select from 'react-select'

const Content = styled(CardBody)`
  display: flex;
  height: 85vh;
  flex-flow: column nowrap;
  overflow-y: hidden;
  ${(props) => props.styles};
`

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
    <Content>
      <style jsx global>{`
        .pretty-json-container * {
          color: #fff !important;
        }
      `}</style>
      {openedFile ? (
        <>
          <Select
            class="col-md-3"
            onChange={setSelected}
            options={options}
            value={selected}
          />
          <FileSystem hideNavigator={true} />
        </>
      ) : (
        <Loader80bots
          styled={{
            width: '200px',
          }}
        />
      )}
    </Content>
  )
}

export default JsonType
