import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import Button from 'components/default/Button';
import Input from 'components/default/Input';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { getBotSettings, updateBotSettings } from 'store/bot/actions';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const inputStyles = {
  container: css`
    margin-bottom: 30px;
    &:first-of-type {
      margin-top: 20px;
    }
  `
};

const SettingsEditor = ({ getBotSettings, updateBotSettings, addNotification, botSettings, onClose }) => {
  const [amiId, setAmiId] = useState(botSettings.image_id || '');
  const [instanceType, setInstanceType] = useState(botSettings.type || '');
  const [storage, setStorage] = useState(botSettings.storage || 0);

  useEffect(() => {
    getBotSettings();
  }, []);

  useEffect(() => {
    setAmiId(botSettings.image_id || '');
    setInstanceType(botSettings.type || '');
    setStorage(botSettings.storage || '');
  }, [botSettings]);

  const submit = () => {
    updateBotSettings(botSettings.id, { image_id: amiId, type: instanceType, storage })
      .then(() => {
        addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Settings updated' });
        onClose();
      })
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Can\'t update settings right now' }));
  };

  return(
    <>
      <Input label={'AMI ID'} styles={inputStyles} value={amiId}
        onChange={e => setAmiId(e.target.value)}
      />
      <Input label={'Instance Type'} styles={inputStyles} value={instanceType}
        onChange={e => setInstanceType(e.target.value)}
      />
      <Input label={'Storage GB'} type={'number'} styles={inputStyles} value={storage}
        onChange={e => setStorage(e.target.value)}
      />
      <Buttons>
        <Button type={'primary'} onClick={submit}>Submit</Button>
        <Button type={'danger'} onClick={onClose}>Cancel</Button>
      </Buttons>
    </>
  );
};

SettingsEditor.propTypes = {
  botSettings: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  getBotSettings: PropTypes.func.isRequired,
  updateBotSettings: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  botSettings: state.bot.botSettings
});

const mapDispatchToProps = dispatch => ({
  getBotSettings: () => dispatch(getBotSettings()),
  updateBotSettings: (id, data) => dispatch(updateBotSettings(id, data)),
  addNotification: payload => dispatch(addNotification(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsEditor);
