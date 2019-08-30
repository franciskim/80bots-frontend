import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { getBotSettings, updateBotSettings, getAMIs } from 'store/bot/actions';
import { addNotification } from 'store/notification/actions';
import { NOTIFICATION_TYPES } from 'config';
import { css } from '@emotion/core';
import { Button } from 'components/default';
import { Input, Select } from 'components/default/inputs';

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

const selectStyles = {
  ...inputStyles,
  select: { menuPortal: base => ({ ...base, zIndex: 5 }) }
};

const SettingsEditor = ({
  getBotSettings, updateBotSettings, addNotification, botSettings, getAMIs, amis, onClose
}) => {
  const [amiId, setAmiId] = useState(null);
  const [instanceType, setInstanceType] = useState(botSettings.type || '');
  const [storage, setStorage] = useState(botSettings.storage || 0);

  const toOption = item => ({
    value: item.id, label: item.name
  });

  useEffect(() => {
    getBotSettings();
    getAMIs();
  }, []);

  useEffect(() => {
    if(amis && botSettings) {
      const ami = amis.find( item => item.id === botSettings.image_id);
      setAmiId(ami ? toOption(ami) : '');
    }
    setInstanceType(botSettings.type || '');
    setStorage(botSettings.storage || '');
  }, [botSettings, amis]);

  const submit = () => {
    updateBotSettings(botSettings.id, { image_id: amiId.value, type: instanceType, storage })
      .then(() => {
        addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Settings updated' });
        onClose();
      })
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Can\'t update settings right now' }));
  };

  return(
    <>
      <Select label={'AMI ID'} styles={selectStyles} value={amiId}
        onChange={option => setAmiId(option)} options={amis.map(toOption)}
        menuPortalTarget={document.body}
        menuPosition={'absolute'} menuPlacement={'bottom'}
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
  onClose:           PropTypes.func.isRequired,
  getBotSettings:    PropTypes.func.isRequired,
  updateBotSettings: PropTypes.func.isRequired,
  addNotification:   PropTypes.func.isRequired,
  getAMIs:           PropTypes.func.isRequired,
  amis:              PropTypes.array.isRequired,
  botSettings:       PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  botSettings: state.bot.botSettings,
  amis:        state.bot.amis
});

const mapDispatchToProps = dispatch => ({
  getBotSettings: () => dispatch(getBotSettings()),
  updateBotSettings: (id, data) => dispatch(updateBotSettings(id, data)),
  addNotification: payload => dispatch(addNotification(payload)),
  getAMIs: () => dispatch(getAMIs())
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsEditor);
