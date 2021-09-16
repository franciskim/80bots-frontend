import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'reactstrap'
import Slider from 'nouislider'

export const Range = ({ onChange, min, max, value, ...props }) => {
  const [val, setVal] = useState(value || min || 0)
  const slider1Ref = React.useRef(null)
  const [slider1Value, setSlider1Value] = React.useState('100.00')

  useEffect(() => {
    if (value) {
      setVal(value)
    }
  }, [value])

  useEffect(async () => {
    Slider.create(slider1Ref.current, {
      start: [100],
      connect: [true, false],
      step: 0.01,
      range: { min: 100.0, max: 500.0 },
    }).on('update', (values) => {
      setSlider1Value(values[0])
    })
  }, [])

  // const changeValue = (e) => {
  //   onChange(Number(e.target.value))
  //   setVal(Number(e.target.value))
  // }

  return (
    <div className="input-slider-container">
      <div className="input-slider" ref={slider1Ref} />
      <Row className="mt-3">
        <Col xs="6">
          <span className="range-slider-value">{slider1Value}</span>
        </Col>
      </Row>
    </div>
  )
}

Range.propTypes = {
  id: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
}

export default Range
