import React, { Fragment, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import styled from '@emotion/styled';
import { css, keyframes, Global } from '@emotion/core';
import { globalStyles } from 'config';
import Icon from 'components/default/icons';
import PropTypes from 'prop-types';

const bodyStyles = css`
  ${ globalStyles };
  body {
    overflow-y: hidden;
  }
`;

const ModalContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  flex: 1 1 auto;
  overflow: visible;
`;

const ModalBody = styled.div`
  display: flex;
  flex: 1 1 auto;
  position: relative;
  ${props => props.styles};
`;

const ModalDiv = styled.div`
  display: flex;
  flex: 1 1 auto;
  position: fixed;
  flex-direction: column;
  border-radius: 5px;
  margin-top: 10rem;
  background-color: ${ props => props.theme.colors.paleGrey };
  box-shadow: 0 0 10px ${ props => props.theme.colors.silver };
  border: 1px solid ${ props => props.theme.colors.silver };
  ${ props => props.styles };
  
  @media (max-width: 900px) {
    margin-top: 50px;
    min-width: 90%;
  }
`;

const Container = styled.div`
  z-index: 3;
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${ props => props.theme.colors.white };
  ${ props => props.styles };
`;

const IconContainer = styled.div`
  position: absolute;
  top: 2px;
  right: 4px;
  opacity: 0.35;
  g {
    fill: ${ props => props.theme.colors.slate };
  }
  &:hover {
    cursor: pointer;
    opacity: 1;
    g {
      fill: ${ props => props.theme.colors.clearBlue };
    }
  }
`;

const ModalBodyContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  min-width: 200px;
  min-height: 200px;
  max-height: 90%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
    background-color: transparent;border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: ${ props => props.theme.colors.clearBlue }
  }
  
  @media (max-width: 900px) {
    width: 100%;
  }
  
  ${ props => props.styles };
`;

const ModalHeader = styled.h3`
  text-align: center;
  color: ${ props => props.theme.colors.slate };
  font-size: 22px;
  display: flex;
  align-self: center;
  margin: 0;
`;

const DefaultModal = ({ children, title, styles, containerStyles, contentStyles, onClose, mode, close,
  enableScroll }) => {
  useEffect(() => {
    if(mode === 'closed') {
      onClose && onClose();
    }
  }, [mode]);

  const getContainerStyle = (mode = 'in') => {
    const animation = keyframes`
      ${mode === 'in' ? 'to' : 'from'} {
        background-color: rgba(255, 255, 255, 0.6);
      }
      ${mode !== 'in' ? 'to' : 'from'} {
        background-color: rgba(255, 255, 255, 0);
      }
    `;
    return css`
      animation: ${animation} 200ms ease-in-out;
      background-color: ${mode === 'in' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0)'};
    `;
  };

  const getModalStyle = (mode = 'in') => {
    const animation = keyframes`
      ${mode === 'in' ? 'to' : 'from'} {
        top: 5%;
        opacity: 1;
      }
      ${mode !== 'in' ? 'to' : 'from'} {
        opacity: 0;
        top: 10%;
      }
    `;
    return css`
      animation: ${animation} 200ms ease-in-out;
      opacity: ${mode === 'in' ? 1 : 0};
      top: ${mode === 'in' ? '5%' : '10%'};
    `;
  };

  const combinedStyles = css`
    ${getModalStyle(mode)};
    ${containerStyles};
  `;

  return(
    mode !== 'closed'
      ? <Fragment>
        <Global styles={bodyStyles}/>
        <Container styles={getContainerStyle(mode)}>
          <ModalContainer onClick={() => close()}>
            {/* preventing parent component to fire onClick by stopping event propagation */}
            <ModalDiv styles={combinedStyles} onClick={e => e.stopPropagation()}>
              <ModalBody styles={styles}>
                <IconContainer onClick={() => close()}>
                  <Icon name={'cross'} />
                </IconContainer>
                <ModalBodyContent styles={contentStyles}>
                  { title && <ModalHeader>{title}</ModalHeader> }
                  { children }
                </ModalBodyContent>
              </ModalBody>
            </ModalDiv>
          </ModalContainer>
        </Container>
      </Fragment>
      : null
  );
};

// Using higher order component here because forwardRef does not support propTypes
const Modal = (props, ref) => {
  const [mode, setMode] = useState('closed');

  const close = () => {
    setMode('out');
    setTimeout(() => setMode( 'closed' ), 200);
  };

  const open = () => {
    setMode('in');
  };

  useImperativeHandle(ref, () => ({ open, close }));

  return <DefaultModal close={close} mode={mode} {...props} />;
};

DefaultModal.propTypes = {
  children: PropTypes.any.isRequired,
  mode: PropTypes.oneOf(['closed', 'in', 'out']).isRequired,
  close: PropTypes.func.isRequired,
  title: PropTypes.string,
  styles: PropTypes.object,
  containerStyles: PropTypes.object,
  contentStyles: PropTypes.object,
  onClose: PropTypes.func,
  enableScroll: PropTypes.bool
};

export default forwardRef(Modal);

