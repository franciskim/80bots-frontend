import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { Badge } from 'reactstrap'

const Status = styled(Badge)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  background-color: ${(props) => props.color};
`

export const STATUSES = {
  CONNECTING: {
    label: 'Connecting',
    color: 'info',
  },
  CONNECTED: {
    label: 'Connected',
    color: 'success',
  },
  RECONNECT: {
    label: 'Reconnecting',
  },
  TIMEOUT: {
    label: 'Instance Launching or Stopped',
    color: 'warning',
  },
  ERROR: {
    label: 'Stopped',
    color: 'danger',
  },
  DISCONNECT: {
    label: 'Disconnected',
    color: 'info',
  },
}

const ConnectionStatus = ({ status, color }) => (
  <Status type={'info'} color={color} pill>
    {status}
  </Status>
)

ConnectionStatus.propTypes = {
  status: PropTypes.string,
  color: PropTypes.string,
}

export default ConnectionStatus
