import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import { connect } from 'react-redux'
import { CardBody } from 'reactstrap'
import { Loader80bots } from 'components/default'

const Display = styled.iframe`
  display: flex;
  flex: 1 1;
  border: none;
`
const STATUSES = {
  LOAD: 'Loading Display',
}

const DisplayTab = ({ botInstance }) => {
  const [status, setStatus] = useState(STATUSES.LOAD)

  return (
    <CardBody className="d-flex justify-content-center">
      <a
        href={`http://${botInstance.ip}:6080?autoconnect=1&password=Uge9uuro`}
        target="_blank"
        rel="noreferrer"
      >
        View bot in real-time
      </a>
      <Display
        onLoad={() => setStatus(null)}
        id={'display'}
        src={`http://${botInstance.ip}:6080?autoconnect=1&password=Uge9uuro`}
      />
      {status && (
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

DisplayTab.propTypes = {
  botInstance: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  botInstance: state.bot.botInstance,
})

export default connect(mapStateToProps, null)(DisplayTab)
