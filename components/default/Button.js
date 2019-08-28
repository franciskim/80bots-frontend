import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Loader from './Loader';
import { css } from '@emotion/core';
import { theme } from 'config';

const DefaultButton = styled.button`
  display: inline-block;
  font-size: 13px;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: .375rem 1rem;
  line-height: 1.6;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  
  &:not(&:disabled), [type=button]:not(:disabled), [type=reset]:not(:disabled), [type=submit]:not(:disabled) {
    cursor: pointer;
  }
  
  &:focus {
    outline: none;
  }

  &:active {
    box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    transition: all .20s ease;
  }
  
  &:hover {
    box-shadow: 0 13px 27px -5px rgba(50, 50, 93, .25),
     0 8px 16px -8px rgba(0, 0, 0, .3), 0 -6px 16px -6px rgba(0, 0, 0, .025);
  }
  
  &:disabled {
    opacity: .65;
    cursor: default;
  }
  
  ${ props => props.styles };
`;

const btnRound = css`
  border-radius: 50px;
`;

const btnSuccess = css`
  color: ${ theme.colors.white };
  background-color: #38c172;
  border-color: #38c172;
  &:hover {
    color: ${ theme.colors.white };
    background-color: #2fa360;
    border-color: #2d995b;
  }
`;

const btnPrimary = css`
  color: ${ theme.colors.white };
  background-color: hsl(200, 100%, 40%);
  border-color: hsl(200, 100%, 40%);
  &:hover {
    background-color: hsl(200, 100%, 35%);
    border-color: hsl(200, 100%, 35%);
  }
`;

const btnDanger = css`
  color: ${ theme.colors.white };
  background-color: ${ theme.colors.darkishPink };
  border-color: ${ theme.colors.darkishPink };
  &:hover {
    background-color: ${ theme.colors.darkishPink2 };
    border-color: ${ theme.colors.darkishPink2 };
  }
`;

export const Button = ({ rounded = false, loading = 'false', type, children, loaderWidth, loaderHeight, ...props }) => {
  const styles = css`
    ${ rounded && btnRound };
    ${ type === 'success' && btnSuccess };
    ${ type === 'primary' && btnPrimary };
    ${ type === 'danger' && btnDanger };
  `;

  return <DefaultButton styles={styles} {...props}>{
    loading === 'false'
      ? children
      : <Loader type={'spinning-bubbles'} color={theme.colors.white} width={loaderWidth} height={loaderHeight}/>
  }
  </DefaultButton>;
};

Button.propTypes = {
  type: PropTypes.oneOf(['success', 'primary', 'danger']).isRequired,
  rounded: PropTypes.bool,
  children: PropTypes.any.isRequired,
  loading: PropTypes.oneOf(['true', 'false']),
  loaderWidth: PropTypes.number,
  loaderHeight: PropTypes.number,
};

export default Button;
