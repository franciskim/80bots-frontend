import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Button from 'components/default/Button';
import { css } from '@emotion/core';
import { Input, Label, Select, Range } from 'components/default/inputs';

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
`;

const inputStyle = {
  container: css`
    &:first-of-type {
      margin-top: 20px;
    } 
    margin-bottom: 10px;
  `,
};

const selectStyles = {
  container: css`
    margin-bottom: 10px;
  `
};

const LaunchEditor = ({ bot, onSubmit, onClose }) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let botParams = {};
    bot.parameters.forEach(param => {
      if(param.type === 'Boolean') botParams[param.name] = false;
    });
    setValues(botParams);
  }, [bot]);

  const submit = () => {
    let err = [];
    setErrors([]);
    bot.parameters.forEach(param => {
      if (!values[param.name] && param.type !== 'Boolean' && values[param.name] !== 0) {
        err.push(param.name);
      }
    });
    if(err.length > 0) setErrors(err);
    else {
      onSubmit(values);
    }
  };

  const changeValue = (field, value) => {
    let valuesCopy = {...values};
    valuesCopy[field] = value;
    setValues(valuesCopy);
  };

  const toOptions = value => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    value
  });

  const getInputType = type => {
    switch (type) {
      case 'String': return 'text';
      case 'Number': return 'number';
    }
  };

  const renderParams = (item, idx) => {
    switch (item.type) {
      case 'enum': return(
        <Select options={item.enum.map(toOptions)} key={idx}
          label={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          error={errors.indexOf(item.name) > -1 ? 'This field is required' : ''}
          onChange={({ value }) => changeValue(item.name, value)} styles={selectStyles}
        />
      );
      case 'bool': return(
        <InputWrap key={idx}>
          <Label>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Label>
          <StatusButton type={values[item.name] ? 'primary' : 'danger'}
            onClick={() => changeValue(item.name, !values[item.name])}
          >
            { values[item.name] ? 'Yes' : 'No' }
          </StatusButton>
        </InputWrap>
      );
      case 'text': return(
        <Input key={idx} type={getInputType(item.type)} label={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          styles={inputStyle} min={item.range && item.range[0]} max={item.range && item.range[1]}
          onChange={e => changeValue(item.name, e.target.value)}
          error={errors.indexOf(item.name) > -1 ? 'This field is required' : ''}
        />
      );
      case 'range': return(
        <Range key={idx} label={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          styles={inputStyle} min={item.range && item.range[0]} max={item.range && item.range[1]}
          onChange={e => changeValue(item.name, e.target.value)} value={values[item.name]}
        />
      );
    }
  };

  return(
    <>
      { bot.parameters.map(renderParams) }
      <Buttons>
        <Button type={'primary'} onClick={submit}>Launch</Button>
        <Button type={'danger'} onClick={onClose}>Cancel</Button>
      </Buttons>
    </>
  );
};

LaunchEditor.propTypes = {
  bot: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LaunchEditor;
