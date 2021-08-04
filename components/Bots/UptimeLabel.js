import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { minToTime } from 'lib/helpers'

const UTLabel = styled.label`
  white-space: nowrap;
`

const UptimeLabel = ({ uptime, status }) => {
  const [time, setTime] = useState(null)
  let current = uptime

  useEffect(() => {
    setTime(uptime)
    const tikMinutes = setInterval(() => {
      if (status === 'running' || status === 'pending') {
        current++
        setTime(current)
      }
    }, 60000)
    return () => {
      clearInterval(tikMinutes)
    }
  }, [uptime])

  return <UTLabel>{minToTime(time)}</UTLabel>
}

UptimeLabel.propTypes = {
  uptime: PropTypes.number,
  status: PropTypes.string,
}

export default UptimeLabel
