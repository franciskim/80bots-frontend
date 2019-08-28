import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Button } from 'components/default';
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
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let botParams = {};
    bot.parameters.forEach(param => {
      if(getInputType(param.type) === 'checkbox') botParams[param.name] = false;
      if(getInputType(param.type) === 'range') botParams[param.name] = Number(param.range[0]);
    });
    setValues(botParams);
  }, [bot]);

  const submit = () => {
    let err = [];
    setErrors([]);
    bot.parameters.forEach(param => {
      if (!values[param.name] && getInputType(param.type) !== 'checkbox' && getInputType(param.type) !== 'range'
        && values[param.name] !== 0) {
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

  const getLabel = param => param.title || param.name.charAt(0).toUpperCase() + param.name.slice(1);

  const getInputType = type => {
    switch (type) {
      case 'string':
      case 'String': return 'text';

      case 'integer':
      case 'Integer':
      case 'Number': return 'number';

      case 'range': return 'range';

      case 'boolean':
      case 'Boolean':
      case 'bool': return 'checkbox';
    }
  };

  const renderParams = (item, idx) => {
    const type = getInputType(item.type);
    const label = getLabel(item);

    switch (item.type) {
      case 'enum': return(
        <Select key={idx} options={item.enum.map(toOptions)} label={label}
          error={errors.indexOf(item.name) > -1 ? 'This field is required' : ''}
          onChange={({ value }) => changeValue(item.name, value)} styles={selectStyles}
          menuPortalTarget={document.body}
          menuPosition={'absolute'} menuPlacement={'top'}
        />
      );

      case 'integer':
      case 'Integer': return(
        <Input key={idx} type={type} label={label} styles={inputStyle}
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

      case 'String':
      case 'string': return(
        <Input key={idx} type={type} label={label} styles={inputStyle}
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
