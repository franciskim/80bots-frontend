import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { css } from '@emotion/core';
import { Textarea } from '/components/default/inputs';
import { Button, FilesDropZone } from '/components/default';
import { reportBot } from '/store/bot/actions';
import { addNotification } from '/store/notification/actions';
import { NOTIFICATION_TYPES } from '/config';

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ReportIssue = ({ bot, screenshots, report, notify, onClose, ...props }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);

  const submit = () => {
    let data = new FormData();
    data.append('message', message);
    files.forEach(file => data.append('screenshots[]', file));
    notify({ type: NOTIFICATION_TYPES.INFO, message: 'Uploading Report...' });
    report(bot.id, data)
      .then(() => {
        notify({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Issue report sent' });
        onClose && onClose();
      })
      .catch(err => notify({ type: NOTIFICATION_TYPES.ERROR, message: 'Report failed, please try again later' }));
  };

  return(
    <>
      <Textarea styles={{ container: css`margin-top: 20px` }} rows={5} onChange={e => setMessage(e.target.value)}
        value={message} placeholder={'Describe the issue'}
      />
      <FilesDropZone predefined={screenshots} onChange={files => setFiles(files)} hint={'Drop screenshots below'} />
      <Buttons>
        <Button type={'danger'} onClick={onClose}>Cancel</Button>
        <Button type={'primary'} disabled={!message} onClick={submit}>Submit</Button>
      </Buttons>
    </>
  );
};

ReportIssue.propTypes = {
  report:      PropTypes.func.isRequired,
  notify:      PropTypes.func.isRequired,
  bot:         PropTypes.object,
  onClose:     PropTypes.func,
  screenshots: PropTypes.array
};

const mapDispatchToProps = dispatch => ({
  notify: payload   => dispatch(addNotification(payload)),
  report: (...args) => dispatch(reportBot(...args)),
});

export default connect(null, mapDispatchToProps)(ReportIssue);
