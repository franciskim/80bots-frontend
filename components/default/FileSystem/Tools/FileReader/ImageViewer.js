import React from "react";
import styled from "@emotion/styled";

const BaseImageViewer = styled.div`
  top: 0;
  left: 0;
  display: flex;
  position: fixed;
  z-index: 1000;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  img {
    width: calc(100vw - 400px);
  }
`;

const ImageViewer = ({ item, onClose }) => {
  return (
    <BaseImageViewer onClick={() => onClose(item)}>
      <img
        width={100}
        onClick={e => e.stopPropagation()}
        alt={item.name}
        src={item.url}
      />
    </BaseImageViewer>
  );
};

export default ImageViewer;
