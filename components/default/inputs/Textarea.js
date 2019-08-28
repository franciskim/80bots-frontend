import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Error, Label, Wrap, errorStyles, errorFocusStyles } from './Input';

export const DefaultTextarea = styled.textarea`
  display: block;
  width: 100%;
  height: auto;
  padding: .375rem .75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: .25rem;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  overflow: auto;
  resize: vertical;
  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    ${props => props.isInputError && errorFocusStyles };
  }
  ${ props => props.styles };
  ${props => props.isInputError && errorStyles };
`;

export const Textarea = ({ styles, label, error, ...props }) => <Wrap styles={styles && styles.container}>
  { label && <Label styles={styles && styles.label}>{ label }</Label> }
  <DefaultTextarea styles={styles && styles.textarea} {...props} isInputError={!!error} />
  <Error styles={styles && styles.error}>{ error }</Error>
</Wrap>;

Textarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  styles: PropTypes.shape({
    container: PropTypes.object,
    label: PropTypes.object,
    error: PropTypes.object,
    textarea: PropTypes.input
  })
};

export default Textarea;
