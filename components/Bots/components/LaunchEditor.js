import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Input, Label, Select, Range } from 'components/default/inputs';
import { Button, Steps } from 'components/default';

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

const StatusButton = styled(Button)`
  text-transform: uppercase;
  min-height: 38px;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 10px;
`;

const inputStyle = {
  container: css`
    margin-top: 10px;
  `,
};

const selectStyles = {
  container: css`
    margin-top: 10px;
  `,
  select: { menuPortal: base => ({ ...base, zIndex: 5 }) }
};

const LaunchEditor = ({ bot, onSubmit, onClose }) => {
  const [values, setValues] = useState({});
  const [combinedResult, setCombinedResult] = useState([]);
  const [errors, setErrors] = useState([]);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(1);
  const [isAmountSet, amountSet] = useState(false);

  useEffect(() => {
    initializeValues();
  }, [bot]);

  const initializeValues = () => {
    let botParams = {};
    bot && bot.parameters.forEach(param => {
      if(getInputType(param.type) === 'checkbox') botParams[param.name] = false;
      if(getInputType(param.type) === 'range') botParams[param.name] = Number(param.range[0]);
      if(getInputType(param.type) === 'text' || getInputType(param.type) === 'number' ||
        getInputType(param.type) === 'password') botParams[param.name] = '';
      if(param.type === 'multiselect') botParams[param.name] = { term: '', options: [] };
    });
    setValues(botParams);
  };

  const validateValues = () => {
    let err = [];
    setErrors([]);
    bot && bot.parameters.forEach(param => {
      if (!values[param.name] && getInputType(param.type) !== 'checkbox' && getInputType(param.type) !== 'range'
        && values[param.name] !== 0 || (param.type === 'multiselect' && !values[param.name].options)) {
        err.push(param.name);
      }
    });
    if(err.length) setErrors(err);
    return !err.length;
  };

  const valuesToResult = (values) => {
    let result = {};
    let combined = [];
    values.forEach(val => {
      bot.parameters.forEach(({ name, type }) => {
        switch (type) {
          case 'multiselect': { result[name] = (values[name].options.map(item => item.value)); break; }
          case 'enum': { result[name] = values[name].value; break; }
          default: { result[name] = values[name]; break; }
        }
      });
      combined.push(val);
    });

    return combined;
  };

  const submit = () => {
    if(validateValues()) {
      if(!combinedResult[step])
        initializeValues();
      else
        setValues(combinedResult[step]);
      let result = [...combinedResult];
      result[step - 1] = values;
      setCombinedResult(result);
      setStep(step + 1);
      if(step === amount) onSubmit(valuesToResult(result));
    }
  };

  const cancel = () => {
    if(amount > 1) {
      setStep(step - 1);
      const prevResult = combinedResult[step - 2];
      setValues(prevResult);
    } else {
      onClose();
    }
  };

  const changeValue = (field, value, option) => {
    let valuesCopy = {...values};
    valuesCopy[field] = option || value;
    setValues(valuesCopy);
  };

  const toOptions = value => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    value
  });

  const getLabel = param => param.title || param.name.charAt(0).toUpperCase() + param.name.slice(1);

  const getInputType = type => {
    switch (type) {
      case 'string':
      case 'String': return 'text';

      case 'integer':
      case 'Integer':
      case 'Number': return 'number';

      case 'range': return 'range';

      case 'password': return 'password';

      case 'boolean':
      case 'Boolean':
      case 'bool': return 'checkbox';
    }
  };

  const getMultiSelectOptions = (paramName) => {
    let options = values[paramName] ? values[paramName].options: [];
    const term = values[paramName] ? values[paramName].term : '';
    if(term && options && !options.find(item => item.label.match(new RegExp(term, 'ig')))) {
      options = [{ value: term, label: term }].concat(options);
    }
    return options;
  };

  const changeMultiSelectValue = (field, options) => {
    let valuesCopy = {...values};
    valuesCopy[field].options = options;
    setValues(valuesCopy);
  };

  const onMultiSelectChange = (field, newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    let valuesCopy = { ...values };
    valuesCopy[field].term = inputValue;
    setValues(valuesCopy);
  };

  const renderParams = (item, idx) => {
    const type = getInputType(item.type);
    const label = getLabel(item);

    switch (item.type) {
      case 'enum': return(
        <Select key={idx} options={item.values.map(toOptions)} label={label}
          value={values[item.name]}
          error={errors.indexOf(item.name) > -1 ? 'This field is required' : ''}
          onChange={option => changeValue(item.name, option.value, option)} styles={selectStyles}
          menuPortalTarget={document.body}
          menuPosition={'absolute'} menuPlacement={'top'}
        />
      );

      case 'integer':
      case 'Integer': return(
        <Input key={idx} type={type} label={label} styles={inputStyle} value={values[item.name]}
          min={item.range && Number(item.range[0])} max={item.range && Number(item.range[1])}
          onChange={e => changeValue(item.name, Number(e.target.value))}
          error={errors.indexOf(item.name) > -1 ? 'This field is required' : ''}
        />
      );

      case 'bool':
      case 'boolean':
      case 'Boolean': return(
        <InputWrap key={idx}>
          <Label>{ label }</Label>
          <StatusButton type={values[item.name] ? 'primary' : 'danger'}
            onClick={() => changeValue(item.name, !values[item.name])}
          >
            { values[item.name] ? 'Yes' : 'No' }
          </StatusButton>
        </InputWrap>
      );

      case 'multiselect': return(
        <Select key={idx} label={label} isMulti error={errors.indexOf(item.name) > -1 ? 'This field is required' : ''}
          onChange={options => changeMultiSelectValue(item.name, options)} styles={selectStyles}
          options={getMultiSelectOptions(item.name)}
          onInputChange={input => onMultiSelectChange(item.name, input)}
          menuPortalTarget={document.body}
          menuPosition={'absolute'} menuPlacement={'bottom'}
          value={values[item.name].options}
        />
      );

      case 'String':
      case 'password':
      case 'string': return(
        <Input key={idx} type={type} label={label} styles={inputStyle} value={values[item.name]}
          onChange={e => changeValue(item.name, e.target.value)}
          error={errors.indexOf(item.name) > -1 ? 'This field is required' : ''}
        />
      );

      case 'range': return(
        <Range key={idx} label={label} styles={inputStyle}
          min={item.range && Number(item.range[0])} max={item.range && Number(item.range[1])}
          onChange={value => changeValue(item.name, value)} value={values[item.name]}
        />
      );
    }
  };

  return(
    !isAmountSet
      ? <>
        <Range label={'Choose amount of instances to launch'} styles={inputStyle} min={1} max={10}
          onChange={value => setAmount(value)}
        />
        <Buttons>
          <Button type={'danger'} onClick={onClose}>Cancel</Button>
          <Button type={'primary'} onClick={() => amountSet(true)}>Submit</Button>
        </Buttons>
      </>
      : <>
      { amount > 1 && <Steps amount={amount} step={step}/> }
      { bot && bot.parameters.map(renderParams) }
      <Buttons>
        <Button disabled={amount > 1 && step === 1} type={'danger'} onClick={cancel}>
          { amount === 1 ? 'Cancel' : 'Previous' }
        </Button>
        <Button type={'primary'} onClick={submit}>{ step === amount ? 'Launch' : 'Next' }</Button>
      </Buttons>
    </>
  );
};

LaunchEditor.propTypes = {
  bot:      PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose:  PropTypes.func.isRequired
};

export default LaunchEditor;
