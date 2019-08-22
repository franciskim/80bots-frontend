import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { connect } from 'react-redux';
import Button from 'components/default/Button';
import Input, { Label } from 'components/default/Input';
import StyledSelect from 'components/default/Select';

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

  const submit = () => {
    let err = [];
    setErrors([]);
    bot.parameters.forEach(param => {
      if (!values[param.name]) {
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
    return item.enum
      ? <StyledSelect options={item.enum.map(toOptions)} key={idx}
        label={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        error={errors.indexOf(item.name) > -1 ? 'This field is required' : ''}
        onChange={({ value }) => changeValue(item.name, value)} styles={selectStyles}
      />
      : item.type === 'Boolean'
        ? <InputWrap key={idx}>
          <Label>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Label>
          <StatusButton type={values[item.name] ? 'primary' : 'danger'}
            onClick={() => changeValue(item.name, !values[item.name])}>
            { values[item.name] ? 'Yes' : 'No' }
          </StatusButton>
        </InputWrap>
        : <Input key={idx} type={getInputType(item.type)} label={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          styles={inputStyle} min={item.range && item.range[0]} max={item.range && item.range[1]}
          onChange={e => changeValue(item.name, e.target.value)}
          error={errors.indexOf(item.name) > -1 ? 'This field is required' : ''}
        />;
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

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(LaunchEditor);
