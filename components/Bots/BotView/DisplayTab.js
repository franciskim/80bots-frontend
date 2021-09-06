import React, { useState } from 'react'
import styled from '@emotion/styled'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { CardBody, Row, Col } from 'reactstrap'
import { Loader80bots } from 'components/default'

const Display = styled.iframe`
  display: flex;
  flex: 1 1;
  border: none;
  width: 100%;
  height: 640px;
  background-color: #999;
`

const DisplayTab = ({ botInstance }) => {
  const [loadingPage, setLoadingPage] = useState(true)

  const url = `http://${botInstance.ip}:6080?autoconnect=1&password=Uge9uuro`
  return (
    <CardBody>
      <Row>
        <Col>
          <Link href={url} passHref>
            <a target="_blank" rel="noreferrer">
              View bot in real-time
            </a>
          </Link>
        </Col>
      </Row>
      {loadingPage && (
        <Loader80bots
          styled={{
            width: '200px',
          }}
        />
      )}
      <Display onLoad={() => setLoadingPage(false)} id={'display'} src={url} />
    </CardBody>
  )
}

DisplayTab.propTypes = {
  botInstance: PropTypes.object,
}

export default DisplayTab
