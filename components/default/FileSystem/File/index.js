import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import CardWithPreview from '../../CardWithPreview';
import {css, keyframes} from '@emotion/core';

const Fade = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const Wrapper = styled(CardWithPreview)`
  position: relative;
   margin-bottom: 20px;
  margin-right: 20px;
  animation: ${Fade} 200ms ease-in-out;
  ${ props => props.styles };
  ${ props => props.selected && css`
    box-shadow: 0 0 10px ${ props.theme.colors.darkishPink };
    border: 1px solid ${ props.theme.colors.darkishPink };
  `}
`;

export const TYPE = 'file';

const File = ({ item, onClick }) => {
  return(
    <Wrapper src={item.url} caption={item.name} onClick={() => onClick(item)} />
  );
};

File.propTypes = {
  item: PropTypes.object.isRequired
};

export default File;