import React, { useState, Fragment } from 'react'
import styled from '@emotion/styled'
import ImagesType from './ImagesType'
import JsonType from './JsonType'
import { CardBody, Button, Row, Col } from 'reactstrap'
import FilesType from './FileType'
import PropTypes from 'prop-types'

const OUTPUT_TYPES = {
  JSON: {
    value: 'json',
    label: 'JSON',
  },
  IMAGES: {
    value: 'images',
    label: 'Images',
  },
  FILES: {
    value: 'files',
    label: 'Files',
  },
}

const Hint = styled.span`
  font-size: 14px;
  color: #fff;
`

const OutputTab = ({ setCustomBack }) => {
  const [currentType, setCurrentType] = useState(OUTPUT_TYPES.JSON)

  return (
    <>
      <Row className="mt-2 mb-2">
        <Col>
          {Object.values(OUTPUT_TYPES).map((item, i, all) => {
            const color =
              item.value === currentType.value ? 'success' : 'primary'
            return (
              <Fragment key={i}>
                <Button
                  outline
                  color={color}
                  onClick={() => setCurrentType(item)}
                  size="sm"
                >
                  {item.label}
                </Button>
                {all.length - 1 > i && <Hint>&nbsp;|&nbsp;</Hint>}
              </Fragment>
            )
          })}
        </Col>
      </Row>
      <CardBody className="d-flex justify-content-center">
        {currentType.value === OUTPUT_TYPES.IMAGES.value && (
          <ImagesType setCustomBack={setCustomBack} />
        )}
        {currentType.value === OUTPUT_TYPES.JSON.value && (
          <JsonType setCustomBack={setCustomBack} />
        )}
        {currentType.value === OUTPUT_TYPES.FILES.value && (
          <FilesType setCustomBack={setCustomBack} />
        )}
      </CardBody>
    </>
  )
}

OutputTab.propTypes = {
  setCustomBack: PropTypes.func.isRequired,
}

export default OutputTab
