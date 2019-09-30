import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Icon from '../icons';
import { theme } from 'config';
import { css, keyframes } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import Tooltip from '../Tooltip';

const ERROR_ANIMATION_DURATION = 200;

export const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  ${ props => props.styles };
`;

export const Label = styled.label`
  font-size: 16px;
  margin-bottom: 5px;
  ${ props => props.styles };
`;

export const LabelWrap = styled.div`
  display: flex;
`;

export const Description = ({ text, position, ...props}) => {
  const theme = useTheme();
  const Component = styled(Icon)`
    margin-left: 3px;
  `;
  return <Tooltip text={text} position={position}>
    <Component {...props} name={'help'} color={theme.colors.grey} />
  </Tooltip>;
};

const errorAnimationIn = keyframes`
  from { font-size: 0; }
  to { font-size: 12px; }
`;

const errorAnimationOut = keyframes`
  from { font-size: 12px; }
  to { font-size: 0; }
`;

const ErrorSpan = styled.span`
  font-size: 12px;
  color: ${ props => props.theme.colors.darkishPink };
  animation: ${props => props.animation} ${ERROR_ANIMATION_DURATION}ms, fade-in-out;
  ${ props => props.styles };
`;

export const DefaultInput = styled.input`
  display: block;
  width: 100%;
  height: calc(1.5em + .75rem + 2px);
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
  overflow: visible;
  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
    ${props => props.isInputError && errorFocusStyles };
  }
  ${ props => props.styles };
  ${props => props.isInputError && errorStyles };
`;

export const Error = ({ children }) => {
  const [state, setState] = useState('closed');
  const [error, setError] = useState(children);
  const [timer, setTimer] = useState(undefined);

  useEffect(() => {
    let id;
    if(children && state !== 'in') {
      clearTimeout(timer);
      setError(children);
      setState('in');
    }
    if(!children && state === 'in') {
      setState('out');
      id = setTimeout(() => {
        setState('closed');
        setError(null);
      }, ERROR_ANIMATION_DURATION);
      setTimer(id);
    }
    return () => {
      clearTimeout(id);
    };
  }, [children]);

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return state !== 'closed' && <ErrorSpan animation={state === 'out' ? errorAnimationOut : errorAnimationIn}>
    { error }
  </ErrorSpan>;
};

export const errorStyles = css`
  border-color: ${ theme.colors.darkishPink };
`;

export const errorFocusStyles = css`
   ${ errorStyles };
   box-shadow: 0 0 0 0.2rem rgba(229, 77 , 147, .25);
`;

export const Input = ({ styles, label, description, descriptionPosition, error, ...props }) =>
  <Wrap styles={styles && styles.container}>
    <LabelWrap>
      { label && <Label styles={styles && styles.label}>{ label }</Label> }
      { description && <Description text={description} position={descriptionPosition} />}
    </LabelWrap>
    <DefaultInput styles={styles && styles.input} {...props} isInputError={!!error} />
    <Error styles={styles && styles.error}>{ error }</Error>
  </Wrap>;

Input.propTypes = {
  description: PropTypes.string,
  descriptionPosition: PropTypes.oneOf(['top', 'bottom']),
  label: PropTypes.string,
  error: PropTypes.string,
  styles: PropTypes.shape({
    container: PropTypes.object,
    label: PropTypes.object,
    error: PropTypes.object,
    input: PropTypes.input
  })
};

Error.propTypes = {
  children: PropTypes.string
};

Description.propTypes = {
  text: PropTypes.string.isRequired,
  position: PropTypes.string
};

export default Input;
