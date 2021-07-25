import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from 'styled-components';
import Icon from "components/default/icons";
import { DragDropContainer } from "components/default";
import { Card } from "reactstrap";

const ACCEPT_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const THUMB_SIZE = "80px";

const DropZone = styled.div`
  display: flex;
  flex-flow: row wrap;
  flex: 1;
  position: relative;
  padding-bottom: 10px;
`;

const DropContainer = styled(DragDropContainer)`
  flex-flow: row wrap;
  flex: 1;
`;

const Hint = styled.p`
  margin: 5px 0 0 0;
  padding: 0;
  font-size: 1em;
  color: gray;
`;

const ImageDiv = styled(Card)`
  width: ${THUMB_SIZE};
  min-width: ${THUMB_SIZE};
  height: ${THUMB_SIZE};
  border: 1px dotted blue;
  border-radius: 4px;
  display: flex;
  flex-basis: 23%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 100ms all;
`;

const ImageDivFilled = styled(ImageDiv)`
  border: none;
  position: relative;
  cursor: default;
  svg {
    position: absolute;
    top: 5px;
    right: 5px;
    &:hover {
      cursor: pointer;
    }
  }
`;

const Add = ({ onClick, ...props }) => (
  <ImageDiv onClick={onClick} {...props}>
    <Icon
      name={"light-plus"}
      width={50}
      height={50}
    />
  </ImageDiv>
);

const Image = ({ src, onCancel, ...props }) => (
  <ImageDivFilled imgSrc={src} {...props}>
    <Icon
      name={"cross"}
      width={10}
      height={10}
      onClick={onCancel}
    />
  </ImageDivFilled>
);

export const FilesDropZone = ({ onChange, predefined, hint, ...props }) => {
  const [files, setFiles] = useState([]);

  const fileInput = useRef(null);

  useEffect(() => {
    onChange(files);
  }, [files]);

  useEffect(() => {
    if (predefined?.length) {
      setFiles(predefined);
    }
  }, [predefined]);

  const removeFile = idx => {
    setFiles([...files.slice(0, idx), ...files.slice(idx + 1)]);
  };

  const browse = e => {
    e.stopPropagation();
    e.preventDefault();
    let data = [];
    [...e.target.files].forEach((file, index) => {
      if (ACCEPT_TYPES.includes(file.type)) {
        data.push(file);
      }
    });
    setFiles([...files, ...data]);
  };

  const renderFile = (item, idx) => (
    <Image
      onCancel={() => removeFile(idx)}
      key={idx}
      src={URL.createObjectURL(item)}
    />
  );

  return (
    <>
      <Hint>{hint || "Drop your files below"}</Hint>
      <DropZone>
        <DropContainer
          onDrop={(formData, data) => setFiles([...files, ...data])}
          types={ACCEPT_TYPES}
        >
          {files.map(renderFile)}
          <Add onClick={() => fileInput.current.click()} />
        </DropContainer>
      </DropZone>
      <input
        style={{ display: "none", position: "absolute" }}
        type="file"
        ref={fileInput}
        multiple
        onChange={browse}
      />
    </>
  );
};

FilesDropZone.propTypes = {
  onChange: PropTypes.func.isRequired,
  hint: PropTypes.string,
  predefined: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired
    })
  )
};

Add.propTypes = {
  onClick: PropTypes.func.isRequired
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default FilesDropZone;
