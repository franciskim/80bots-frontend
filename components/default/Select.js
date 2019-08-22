import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Wrap, Label, Error } from './Input';
import { theme } from 'config';

const selectStyles = {
  container: (provided, state) => ({
    ...provided,
    boxShadow: state.isFocused && '0 0 0 0.2rem rgba(0,123,255,.25)',
    transition: 'all 200ms',
    borderRadius: '4px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 8px'
  }),
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#80bdff' : provided.borderColor,
    border: state.isFocused ? '1px solid #80bdff' : provided.border,
    '&:hover': state.isFocused ? 'none' : provided['&:hover'],
    boxShadow: state.isFocused ? 'none' : provided.boxShadow
  })
};

const errorStyles = {
  ...selectStyles,
  container: (provided, state) => ({
    ...provided,
    boxShadow: state.isFocused && '0 0 0 0.2rem rgba(229, 77 , 147, .25)',
    transition: 'all 200ms',
    borderRadius: '4px',
  }),
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? theme.colors.darkishPink : provided.borderColor,
    border: state.isFocused ? `1px solid ${theme.colors.darkishPink}` : `1px solid ${theme.colors.darkishPink}`,
    '&:hover': 'none',
    boxShadow: state.isFocused ? 'none' : provided.boxShadow
  })
};

const StyledSelect = ({ styles, label, error, ...props }) => <Wrap styles={styles && styles.container}>
  { label && <Label styles={styles && styles.label}>{ label }</Label> }
  <Select styles={{...(error ? errorStyles : selectStyles), ...(styles && styles.select)}} {...props} />
  <Error styles={styles && styles.error}>{ error }</Error>
</Wrap>;

StyledSelect.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  styles: PropTypes.shape({
    container: PropTypes.object,
    label: PropTypes.object,
    error: PropTypes.object,
    select: PropTypes.object,
  })
};

export default StyledSelect;
