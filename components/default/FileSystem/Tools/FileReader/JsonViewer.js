import React, { useEffect, useState } from 'react'
import { getJson } from 'store/fileSystem/actions'
import { lookup } from 'mime-types'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import styled from '@emotion/styled'
const ReactJson = dynamic(import('react-json-view'), { ssr: false })
import { Button, Input, Row, Col, Label } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import JsonTableModeView from './JsonTableModeView'

const MODS = {
  STRUCTURED: 2,
  RAW: 1,
  TABLE: 3,
}

const JSONViewerWrapper = styled.div`
  background-color: black;
`

const JsonViewer = ({ item }) => {
  const dispatch = useDispatch()

  const [mode, setMode] = useState(MODS.STRUCTURED)

  const json = useSelector((state) => state.fileSystem.json)

  const renderByMode = () => {
    switch (mode) {
      case MODS.RAW:
        return <Input type="textarea" disabled value={JSON.stringify(json)} />
      case MODS.STRUCTURED:
        return (
          json && (
            <JSONViewerWrapper>
              <ReactJson src={json} name={null} />
            </JSONViewerWrapper>
          )
        )
      case MODS.TABLE:
        return Array.isArray(json) && <JsonTableModeView output={json} />
    }
  }

  useEffect(() => {
    dispatch(getJson(item))
  }, [item])

  const getLink = (item, json) => {
    const data = btoa(JSON.stringify(json))
    const mime = lookup(item.path)
    return `data:${mime};base64,${data}`
  }

  const startCase = (str) => {
    return str
      .split(' ')
      .map((s) => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <>
      <Row>
        <Label md={4}>View mode: </Label>
        <Col md={8}>
          {Object.keys(MODS)
            .filter((modeName) => {
              if (MODS[modeName] === MODS.TABLE && !Array.isArray(json)) {
                return false
              }
              return MODS[modeName] > 0
            })
            .map((modeName, i) => {
              return (
                <Button
                  color={mode === MODS[modeName] ? 'info' : 'secondary'}
                  key={i}
                  size="sm"
                  onClick={() => setMode(MODS[modeName])}
                >
                  {startCase(modeName.toLowerCase())}
                </Button>
              )
            })}
        </Col>
      </Row>
      <>
        {json ? (
          renderByMode(item)
        ) : (
          <div>
            Could not parse JSON file. Click{' '}
            <a
              href={getLink(item, json)}
              download={`${item.name}.json`}
              target={'_blank'}
              rel="noreferrer"
            >
              here
            </a>{' '}
            to download
          </div>
        )}
      </>
    </>
  )
}

JsonViewer.propTypes = {
  item: PropTypes.object,
}

export default JsonViewer
