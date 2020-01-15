import React, { useState } from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { css, keyframes } from "@emotion/core";

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 14px;
  display: flex;
  position: absolute;
  text-align: center;
  justify-self: center;
  align-self: center;
  margin: 0;
  padding: 0;
`;

const borderBoxAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const BorderDiv = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 100ms ease-in-out;
  border: 4px dashed ${props => props.theme.colors.primary};
  width: 100%;
  height: 100%;
  position: absolute;
  ${props => props.css};
  z-index: 4;
  animation: ${borderBoxAnimation} 100ms ease-in-out;
`;

const DropDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  transition: all 100ms ease-in-out;
`;

export const DragDropContainer = ({
  children,
  onDrop,
  types,
  dropDivStyle,
  takeFirst,
  ...props
}) => {
  const [isDragOverStarted, toggleDragOver] = useState(false);
  const [counter, setCount] = useState(0);

  const onDragEnter = e => {
    let count = counter + 1;
    e.preventDefault();
    e.stopPropagation();
    toggleDragOver(count > 0);
    setCount(count);
  };

  const onDragLeave = e => {
    let count = counter - 1;
    toggleDragOver(count > 0);
    setCount(count);
  };

  const onFileDrop = e => {
    e.preventDefault();
    setCount(0);
    toggleDragOver(false);
    let filesFormData = new FormData(),
      files = [];
    [...e.dataTransfer.files].forEach((file, index) => {
      if (takeFirst && index >= 1) return;
      if (!types || (types && types.includes(file.type))) {
        filesFormData.append("files", file);
        files.push(file);
      }
    });
    onDrop(filesFormData, files);
  };

  const onDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <DropDiv
      onDrop={onFileDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      {...props}
    >
      {isDragOverStarted && (
        <BorderDiv
          style={dropDivStyle}
          css={
            isDragOverStarted &&
            css`
              background-color: rgba(255, 255, 255, 0.75);
            `
          }
        >
          <Title>Drop Your Files Here</Title>
        </BorderDiv>
      )}
      {children}
    </DropDiv>
  );
};

DragDropContainer.propTypes = {
  children: PropTypes.any.isRequired,
  onDrop: PropTypes.func.isRequired,
  types: PropTypes.array,
  dropDivStyle: PropTypes.object,
  takeFirst: PropTypes.bool
};

export default DragDropContainer;
