import React, { useEffect, useState, useReducer, useRef } from 'react'
import { Input } from 'reactstrap'
import { parseUrl } from 'lib/helpers'
import { lookup } from 'mime-types'
import PropTypes from 'prop-types'

const TextViewer = ({ item }) => {
  const [text, setText] = useState('')
  const [error, serError] = useState('')
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [currentScroll, setCurrentScroll] = useReducer((current, newVal) => {
    return newVal
  }, 0)

  const input = useRef(null)

  const [placeholder, setPlaceholder] = useState('Receiving data...')

  const onLoaded = (res) => {
    const enc = new TextDecoder('utf-8')
    const newText = enc.decode(res)
    if (!newText) setPlaceholder('File is empty. Waiting for updates...')
    setText(newText)
    if (input.current) {
      if (shouldAutoScroll) {
        input.current.scrollTop = input.current.scrollHeight
      } else {
        input.current.scrollTop = currentScroll
      }
    }
  }

  const onScroll = (e) => {
    const isBottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight <= 0
    setCurrentScroll(e.target.scrollTop)
    setShouldAutoScroll(isBottom)
    return null
  }

  const onError = (err) => {
    serError(err)
    return null
  }

  useEffect(() => {
    const { current = {} } = input
    current.onscroll = onScroll
    return () => {
      if (input.current) {
        input.current.onscroll = null
      }
    }
  }, [input])

  useEffect(() => {
    parseUrl(item.url, lookup(item.url), onLoaded, onError)
    return () => {}
  }, [item])

  return (
    <Input
      type="textarea"
      ref={input}
      id="text-viewer"
      placeholder={placeholder}
      disabled
      value={text}
      error={error}
    />
  )
}

TextViewer.propTypes = {
  item: PropTypes.object,
}

export default TextViewer
