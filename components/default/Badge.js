import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import PropTypes from 'prop-types';
import { theme } from 'config';

const DefaultBadge = styled.span`
  display: inline-block;
  padding: .25em .6em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25rem;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,
   box-shadow .15s ease-in-out;
  ${ props => props.styles };
`;

const pillLikeBadge = css`
  padding-right: .6em;
  padding-left: .6em;
  border-radius: 10rem; 
`;

const infoStyles = css`
  color: ${ theme.colors.white };
  background-color: ${ theme.colors.darkBlue };
`;

const successStyles = css`
  color: ${ theme.colors.white };
  background-color: #38c172;
`;

const Badge = ({ pill = false, type, ...props }) => {
  const styles = css`
    ${ pill && pillLikeBadge };
    ${ type === 'info' && infoStyles };
    ${ type === 'success' && successStyles };
  `;

  return <DefaultBadge styles={styles} {...props}/>;
};

Badge.propTypes = {
  pill: PropTypes.bool,
  type: PropTypes.oneOf(['info', 'success'])
};

export default Badge;