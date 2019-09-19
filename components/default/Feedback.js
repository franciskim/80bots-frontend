import React, { useState, useRef } from 'react';
import Modal from 'components/default/Modal';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Button, FilesDropZone } from 'components/default';
import { Input, Select, Textarea } from 'components/default/inputs';
import { css } from '@emotion/core';
import { connect } from 'react-redux';
import { supportEmail } from 'store/user/actions';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';

const TYPES = {
  BUG:         'Bug report',
  FEEDBACK:    'Feedback',
  IMPROVEMENT: 'Improvement suggestion',
  HELP:        'Help request'
};

const CATEGORIES = {
  LAUNCH: 'Bot launch process',
  SCRIPT: 'Bot script work',
  UI:     'Interface',
  OTHER:  'Other'
};

const SubTitle = styled.p`
  margin: 10px 0 0 0;
  max-width: 400px;
  text-align: center;
`;

const Submit = styled(Button)`
  padding: 0 10px;
`;

const styles = {
  input: css`
    &:first-of-type {
      margin-top: 20px;
    }
  `,
  container: css`
    &:first-of-type {
      margin-top: 20px;
    }
    margin-bottom: 20px;
  `,
  select: {
    menuPortal: base => ({ ...base, zIndex: 5 })
  }
};

const Feedback = ({ send, notify, ...props }) => {
  const [type, setType] = useState(null);
  const [category, setCategory] = useState(null);
  const [otherCategory, setOtherCategory] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);

  const modal = useRef(null);

  const submit = () => {
    send({ type, category: otherCategory || category, message})
      .then(() => {
        notify({ type: NOTIFICATION_TYPES.INFO, message: 'Report sent' });
        modal.current.close();
      })
      .catch(() => notify({ type: NOTIFICATION_TYPES.ERROR, message: 'Can\'t send report right now' }));
  };

  const toOptions = obj => {
    let options = [];
    for (let key in obj) {
      if(obj.hasOwnProperty(key)) {
        options.push({ label: obj[key], value: obj[key] });
      }
    }
    return options;
  };

  return(
    <>
      <Modal contentStyles={css`max-width: 420px; min-width: 420px;`} ref={modal} title={'Feedback'}>
        <SubTitle>
          Bug report or improvement suggestions
        </SubTitle>
        <Select styles={styles} placeholder={'Select report type'} options={toOptions(TYPES)}
          onChange={({ value }) => setType(value)} menuPortalTarget={document.body}
          menuPosition={'absolute'} menuPlacement={'bottom'}
        />
        {
          type && <Select styles={styles} placeholder={'Select category'} options={toOptions(CATEGORIES)}
            onChange={({ value }) => setCategory(value)} menuPortalTarget={document.body}
            menuPosition={'absolute'} menuPlacement={'bottom'}
          />
        }
        {
          category === CATEGORIES.OTHER && <Input styles={styles} onChange={e => setOtherCategory(e.target.value)}
            value={otherCategory} placeholder={'Write your category here'}
          />
        }
        {
          category && <Textarea rows={5} styles={styles} placeholder='Message' value={message}
            onChange={e => setMessage(e.target.value)}
            error={!message ? 'Write your message here' : ''}
          />
        }
        {
          category && <FilesDropZone onChange={files => setFiles(files)} hint={'Drop some related screenshots here'}/>
        }
        <Button disabled={!message} type={'primary'} onClick={submit}>Send</Button>
      </Modal>

      <Submit type={'primary'} onClick={() => modal.current.open()}>
        Feedback
      </Submit>
    </>
  );
};

Feedback.propTypes = {
  send:   PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  user:   PropTypes.object
};

const mapStateToProps = state => ({
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  send: data => dispatch(supportEmail(data)),
  notify: payload => dispatch(addNotification(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
