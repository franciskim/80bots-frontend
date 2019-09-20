import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Textarea } from 'components/default/inputs';
import { css } from '@emotion/core';
import { Button, FilesDropZone } from 'components/default';

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ReportIssue = ({ bot, screenshots, onClose, ...props }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);

  const submit = () => {
    console.log(message, files);
  };

  return(
    <>
      <Textarea styles={{ container: css`margin-top: 20px` }} rows={5} onChange={e => setMessage(e.target.value)}
        value={message} placeholder={'Describe the issue'}
      />
      <FilesDropZone predefined={screenshots} onChange={files => setFiles(files)} hint={'Drop screenshots below'} />
      <Buttons>
        <Button type={'primary'} disabled={!message} onClick={submit}>Submit</Button>
        <Button type={'danger'} onClick={onClose}>Cancel</Button>
      </Buttons>
    </>
  );
};

ReportIssue.propTypes = {
  bot:         PropTypes.object,
  onClose:     PropTypes.func,
  screenshots: PropTypes.array
};

export default ReportIssue;
