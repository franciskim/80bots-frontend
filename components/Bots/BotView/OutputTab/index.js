import React, { useState } from 'react'
import styled from '@emotion/styled'
import ImagesType from './ImagesType'
import JsonType from './JsonType'
import { CardBody, Button, Row, Col } from 'reactstrap'
import { Loader80bots } from 'components/default'
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

  const renderCurrentType = () => {
    switch (currentType.value) {
      case OUTPUT_TYPES.IMAGES.value:
        return <ImagesType setCustomBack={setCustomBack} />
      case OUTPUT_TYPES.JSON.value:
        return <JsonType setCustomBack={setCustomBack} />
      case OUTPUT_TYPES.FILES.value:
        return <FilesType setCustomBack={setCustomBack} />
      default:
        return (
          <Loader80bots
            data={'light'}
            styled={{
              width: '200px',
            }}
          />
        )
    }
  }

  return (
    <>
      <Row className="mt-2 mb-2">
        <Col>
          {Object.values(OUTPUT_TYPES).map((item, i, all) => {
            const variant =
              item.value === currentType.value ? 'success' : 'primary'
            return (
              <>
                <Button
                  outline
                  key={i}
                  color={variant}
                  onClick={() => setCurrentType(item)}
                  size="sm"
                >
                  {item.label}
                </Button>
                {all.length - 1 > i && <Hint>&nbsp;|&nbsp;</Hint>}
              </>
            )
          })}
        </Col>
      </Row>
      <CardBody className="d-flex justify-content-center">
        {renderCurrentType()}
      </CardBody>
    </>
  )
}

OutputTab.propTypes = {
  setCustomBack: PropTypes.func.isRequired,
}

export default OutputTab
