import React, { useEffect, useState } from 'react'
import { parseUrl } from 'lib/helpers'
import { lookup } from 'mime-types'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
const ReactJson = dynamic(import('react-json-view'), { ssr: false })
import { Button, Input, Row, Col, Label } from 'reactstrap'
import JsonTableModeView from './JsonTableModeView'

const MODS = {
  STRUCTURED: 2,
  RAW: 1,
  TABLE: 3,
}

const TextViewer = ({ item }) => {
  const [jsonRaw, setJsonRaw] = useState(null)
  const [json, setJson] = useState(null)
  const [mode, setMode] = useState(MODS.STRUCTURED)
  const [valid, setValid] = useState(false)

  const onLoaded = (res) => {
    const enc = new TextDecoder('utf-8')
    const newText = enc.decode(res)
    setValid(true)
    setJsonRaw(newText)
    try {
      const jsonData = JSON.parse(newText)
      setJson(jsonData)
    } catch (e) {
      return setValid(false)
    }
  }

  const renderByMode = () => {
    switch (mode) {
      case MODS.RAW:
        return <Input type="textarea" disabled value={jsonRaw} />
      case MODS.STRUCTURED:
        return (
          json && (
            <Row>
              <Col md={12}>
                <ReactJson src={json} name={null} />
              </Col>
            </Row>
          )
        )
      case MODS.TABLE:
        return Array.isArray(json) && <JsonTableModeView output={json} />
    }
  }

  useEffect(() => {
    parseUrl(item.url, lookup(item.url), onLoaded)
  }, [item])

  const getLink = (item, dataString) => {
    const data = btoa(dataString)
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
                  outline
                  onClick={() => setMode(MODS[modeName])}
                >
                  {startCase(modeName.toLowerCase())}
                </Button>
              )
            })}
        </Col>
      </Row>
      <>
        {valid ? (
          renderByMode(item)
        ) : (
          <div>
            Could not parse JSON file. Click{' '}
            <a
              href={getLink(item, jsonRaw)}
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

TextViewer.propTypes = {
  item: PropTypes.object,
}

export default TextViewer
