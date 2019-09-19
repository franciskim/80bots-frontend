import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Icon from 'components/default/icons';
import { theme } from 'config';
import { Textarea } from 'components/default/inputs';
import { DragDropContainer } from 'components/default';
import { Card } from 'components/default/Card';
import { css } from '@emotion/core';
import { Button } from 'components/default';

const ACCEPT_TYPES = ['image/png', 'image/jpeg'];
const THUMB_SIZE = '80px';

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

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Hint = styled.p`
  margin: 5px 0 0 0;
  padding: 0;
  font-size: 1em;
  color: ${ props => props.theme.colors.grey };
`;

const ImageDiv = styled(Card)`
  width: ${THUMB_SIZE};
  min-width: ${THUMB_SIZE};
  height: ${THUMB_SIZE};
  border: 1px dotted ${ props => props.theme.colors.primary };
  border-radius: 4px;
  display: flex;
  flex-basis: 23%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 100ms all;
  ${ props => props.imgSrc && css`
    background-image: url(${props.imgSrc}); 
    background-size: cover; 
    background-position: center center;
  `};
  margin-top: 10px;
  margin-right: 10px;
  &:nth-of-type(4n) { margin-right: 0; }
  &:hover {
    border-color: ${ props => props.theme.colors.clearBlue };
    g {
      fill: ${ props => props.theme.colors.clearBlue };
    }
  }
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
      g {
        fill: ${ props => props.theme.colors.darkishPink };
      }
    }
  }
  &:hover {
    g { fill: ${ props => props.theme.colors.white }; }
  }
`;

const Add = ({ onClick, ...props }) => <ImageDiv onClick={onClick} {...props}>
  <Icon name={'light-plus'} width={50} height={50} color={theme.colors.primary}/>
</ImageDiv>;

const Image = ({ src, onCancel, ...props }) => <ImageDivFilled imgSrc={src} {...props}>
  <Icon name={'cross'} width={10} height={10} color={theme.colors.white} onClick={onCancel}/>
</ImageDivFilled>;

const ReportEditor = ({ bot, onClose, ...props }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, set] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInput = useRef(null);

  const removeFile = (idx) => {
    setFiles([...files.slice(0, idx), ...files.slice(idx + 1)]);
  };

  const browse = e => {
    e.stopPropagation();
    e.preventDefault();
    let data = [];
    [...e.target.files].forEach((file, index) => {
      if(ACCEPT_TYPES.includes(file.type)) {
        data.push(file);
      }
    });
    setFiles([...files, ...data]);
  };

  const renderFile = (item, idx) => <Image onCancel={() => removeFile(idx)} key={idx} src={URL.createObjectURL(item)}/>;

  const submit = () => {

  };

  return(
    <>
      <Textarea styles={{ container: css`margin-top: 20px` }} rows={5} onChange={e => setMessage(e.target.value)}
        value={message} placeholder={'Describe the issue'}
      />
      <Hint>Drop some related screenshots here</Hint>
      <DropZone>
        <DropContainer onDrop={(formData, data) => setFiles([...files, ...data])} types={ACCEPT_TYPES}>
          { files.map(renderFile) }
          <Add onClick={() => fileInput.current.click()} />
        </DropContainer>
      </DropZone>
      <Buttons>
        <Button type={'primary'} disabled={!message} onClick={submit}>Submit</Button>
        <Button type={'danger'} onClick={onClose}>Cancel</Button>
      </Buttons>
      <input style={{display: 'none', position: 'absolute'}} type='file' ref={fileInput} multiple onChange={browse} />
    </>
  );
};

ReportEditor.propTypes = {
  bot:     PropTypes.object,
  onClose: PropTypes.func
};

Add.propTypes = {
  onClick: PropTypes.func.isRequired
};

Image.propTypes = {
  src:      PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ReportEditor;
