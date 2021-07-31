import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { Button, Input, Label, FormGroup, Col, Tooltip } from 'reactstrap'

const LaunchEditor = ({ bot, onSubmit, onClose }) => {
  const [values, setValues] = useState({})
  const [combinedResult, setCombinedResult] = useState([])
  const [errors, setErrors] = useState([])
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState(1)
  const [isAmountSet, amountSet] = useState(true)
  const [tooltipOpenMapping, setTooltipOpenMapping] = useState({})

  const toggle = (tooltipOpenKey) => {
    setTooltipOpenMapping({
      ...tooltipOpenMapping,
      [tooltipOpenKey]: !tooltipOpenMapping[tooltipOpenKey],
    })
  }

  useEffect(() => {
    console.error(bot.parameters, '>>>')
    initializeValues(bot.parameters)
  }, [bot])

  const initializeValues = (params) => {
    let botParams = {}

    params.forEach((param) => {
      const paramType = getInputType(param.type)

      if (paramType === 'checkbox') {
        botParams[param.name] = false
      }
      if (paramType === 'range') {
        botParams[param.name] = Number(
          Math.floor((Number(param.range[0]) + Number(param.range[1])) / 2)
        )
      }
      if (['text', 'number', 'password'].indexOf(paramType) > -1) {
        botParams[param.name] = ''
      }
      if (paramType === 'multiselect') {
        botParams[param.name] = { term: '', options: [] }
      }

      setTooltipOpenMapping({
        ...tooltipOpenMapping,
        [param.title]: false,
      })
    })
    setValues(botParams)
  }

  const validateValues = () => {
    let err = []
    setErrors([])
    bot &&
      bot.parameters.forEach((param) => {
        if (
          (!values[param.name] &&
            getInputType(param.type) !== 'checkbox' &&
            getInputType(param.type) !== 'range' &&
            values[param.name] !== 0) ||
          (param.type === 'multiselect' && !values[param.name].options)
        ) {
          err.push(param.name)
        }
      })
    if (err.length) setErrors(err)
    return !err.length
  }

  const valuesToResult = (values) => {
    let result = {}
    let combined = []
    values.forEach((val) => {
      bot.parameters.forEach(({ name, type }) => {
        switch (type) {
          case 'multiselect': {
            result[name] = val[name].options.map((item) => item.value)
            break
          }
          case 'enum': {
            result[name] = val[name].value
            break
          }
          default: {
            result[name] = val[name]
            break
          }
        }
      })
      combined.push(result)
    })
    return combined
  }

  const submitForm = () => {
    if (validateValues()) {
      if (!combinedResult[step]) {
        initializeValues(bot.parameters)
      } else {
        setValues(combinedResult[step])
      }
      let result = [...combinedResult]
      result[step - 1] = values
      setCombinedResult(result)
      if (step === amount) {
        onSubmit(valuesToResult(result))
      } else {
        setStep(step + 1)
      }
    }
  }

  const cancel = () => {
    if (amount > 1) {
      setStep(step - 1)
      const prevResult = combinedResult[step - 2]
      setValues(prevResult)
    } else {
      onClose()
    }
  }

  const changeValue = (field, value, option) => {
    let valuesCopy = { ...values }
    valuesCopy[field] = option || value
    setValues(valuesCopy)
  }

  const toOptions = (value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    value,
  })

  const getLabel = (param) =>
    param.title || param.name.charAt(0).toUpperCase() + param.name.slice(1)

  const getInputType = (type) => {
    switch (type.toLowerCase()) {
      case 'string':
        return 'text'
      case 'integer':
      case 'number':
        return 'number'
      case 'range':
        return 'range'
      case 'password':
        return 'password'
      case 'boolean':
      case 'bool':
        return 'checkbox'
    }
  }

  const getMultiSelectOptions = (paramName) => {
    let options = values[paramName] ? values[paramName].options : []
    const term = values[paramName] ? values[paramName].term : ''
    if (
      term &&
      options &&
      !options.find((item) => item.label.match(new RegExp(term, 'ig')))
    ) {
      options = [{ value: term, label: term }].concat(options)
    }
    return options
  }

  const changeMultiSelectValue = (field, options) => {
    let valuesCopy = { ...values }
    valuesCopy[field].options = options
    setValues(valuesCopy)
  }

  const onMultiSelectChange = (field, newValue) => {
    let valuesCopy = { ...values }
    valuesCopy[field].term = newValue
    setValues(valuesCopy)
  }

  const renderParams = (item, idx) => {
    console.error(item, '>>>', idx)
    const type = getInputType(item.type)
    const label = getLabel(item)

    switch (item.type.toLowerCase()) {
      case 'enum':
        return (
          <Select
            key={idx}
            options={item.values.map(toOptions)}
            label={label}
            value={values[item.name]}
            menuPlacement={'top'}
            error={
              errors.indexOf(item.name) > -1 ? 'This field is required' : ''
            }
            description={item.description}
            onChange={(option) => changeValue(item.name, option.value, option)}
          />
        )

      case 'integer':
        return (
          <Input
            key={idx}
            type={type}
            label={label}
            // styles={inputStyle}
            value={values[item.name]}
            min={item.range && Number(item.range[0])}
            max={item.range && Number(item.range[1])}
            onChange={(e) => changeValue(item.name, Number(e.target.value))}
            description={item.description}
            error={
              errors.indexOf(item.name) > -1 ? 'This field is required' : ''
            }
            // descriptionPosition={idx === 0 ? 'bottom' : 'top'}
          />
        )

      case 'bool':
      case 'boolean':
        return (
          <div key={idx}>
            <div>
              <Label>{label}</Label>
              {item.description && (
                <span
                  text={item.description}
                  position={idx === 0 ? 'bottom' : 'top'}
                />
              )}
            </div>
            <Button
              color={values[item.name] ? 'primary' : 'danger'}
              onClick={() => changeValue(item.name, !values[item.name])}
            >
              {values[item.name] ? 'Yes' : 'No'}
            </Button>
          </div>
        )
      case 'multiselect':
        return (
          <Select
            key={idx}
            label={label}
            isMulti
            error={
              errors.indexOf(item.name) > -1 ? 'This field is required' : ''
            }
            onChange={(options) => changeMultiSelectValue(item.name, options)}
            options={getMultiSelectOptions(item.name)}
            description={item.description}
            onInputChange={(input) => onMultiSelectChange(item.name, input)}
            value={values[item.name].options}
            // descriptionPosition={idx === 0 ? 'bottom' : 'top'}
          />
        )
      case 'string':
      case 'password':
        return (
          <FormGroup className="row">
            <Label md={3}>
              {label}
              <i className="far fa-question-circle" id={item.name}></i>
              <Tooltip
                placement="right"
                isOpen={tooltipOpenMapping[item.name]}
                target={item.name}
                toggle={() => toggle(item.name)}
              >
                {item.description}
              </Tooltip>
            </Label>
            <Col md={9}>
              <Input
                key={idx}
                type={type}
                value={values[item.name]}
                onChange={(e) => changeValue(item.name, e.target.value)}
                // error={
                //   errors.indexOf(item.name) > -1 ? 'This field is required' : ''
                // }
                // descriptionPosition={idx === 0 ? 'bottom' : 'top'}
              />
            </Col>
          </FormGroup>
        )
      case 'range':
        return (
          <Range
            key={idx}
            label={label}
            // styles={inputStyle}
            description={item.description}
            min={item.range && Number(item.range[0])}
            max={item.range && Number(item.range[1])}
            onChange={(value) => changeValue(item.name, value)}
            value={values[item.name]}
            // descriptionPosition={idx === 0 ? 'bottom' : 'top'}
          />
        )
    }
  }

  return !isAmountSet ? (
    <>
      <Range
        label={'Number of bot instances to launch'}
        // styles={inputStyle}
        min={1}
        max={10}
        onChange={(value) => setAmount(value)}
      />
      <Button onClick={onClose}>Cancel</Button>
      <Button color="primary" onClick={() => amountSet(true)}>
        Submit
      </Button>
    </>
  ) : (
    <>
      {amount > 1 && <Steps amount={amount} step={step} />}
      {bot.parameters.map(renderParams)}
      <Button disabled={amount > 1 && step === 1} onClick={cancel}>
        {amount === 1 ? 'Cancel' : 'Previous'}
      </Button>
      <Button color="primary" onClick={submitForm}>
        {step === amount ? 'Launch' : 'Next'}
      </Button>
    </>
  )
}

LaunchEditor.propTypes = {
  bot: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default LaunchEditor
