import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { connect } from "react-redux";
import { css } from "@emotion/core";
import { getBotSettings, updateBotSettings } from "/store/bot/actions";
import { addNotification } from "/store/notification/actions";
import { NOTIFICATION_TYPES } from "/config";
import { Button } from "/components/default";
import { Input, Textarea } from "/components/default/inputs";

const VALIDATION = {
  SCRIPT: "script",
  TYPE: "instance_type",
  STORAGE: "storage"
};

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

const SettingsEditor = ({
  getBotSettings,
  updateBotSettings,
  addNotification,
  botSettings,
  onClose
}) => {
  const [instanceType, setInstanceType] = useState(botSettings.type || "");
  const [storage, setStorage] = useState(botSettings.storage || 0);
  const [script, setScript] = useState(botSettings.script || "");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    getBotSettings();
  }, []);

  useEffect(() => {
    setInstanceType(botSettings.type || "");
    setStorage(botSettings.storage || "");
    setScript(botSettings.script || "");
  }, [botSettings]);

  const validate = () => {
    setErrors([]);
    let err = [];
    if (!instanceType) err.push(VALIDATION.TYPE);
    if (!storage) err.push(VALIDATION.STORAGE);
    if (!script) err.push(VALIDATION.SCRIPT);
    return err;
  };

  const submit = () => {
    const err = validate();

    if (err.length > 0) setErrors(err);
    else
      updateBotSettings(botSettings.id, { type: instanceType, storage, script })
        .then(() => {
          addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            message: "Settings updated"
          });
          onClose();
        })
        .catch(() =>
          addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            message: "Can't update settings right now"
          })
        );
  };

  return (
    <>
      <Input
        label={"Instance Type"}
        styles={inputStyles}
        value={instanceType}
        onChange={e => setInstanceType(e.target.value)}
        error={
          errors.indexOf(VALIDATION.TYPE) > -1 ? "This field is required" : ""
        }
      />
      <Input
        label={"Storage GB"}
        type={"number"}
        styles={inputStyles}
        value={storage}
        onChange={e => setStorage(e.target.value)}
        error={
          errors.indexOf(VALIDATION.STORAGE) > -1
            ? "This field is required"
            : ""
        }
      />
      <Textarea
        label={"Startup Script"}
        rows={10}
        styles={inputStyles}
        value={script}
        onChange={e => setScript(e.target.value)}
        error={
          errors.indexOf(VALIDATION.SCRIPT) > -1 ? "This field is required" : ""
        }
      />
      <Buttons>
        <Button type={"danger"} onClick={onClose}>
          Cancel
        </Button>
        <Button type={"primary"} onClick={submit}>
          Submit
        </Button>
      </Buttons>
    </>
  );
};

SettingsEditor.propTypes = {
  onClose: PropTypes.func.isRequired,
  getBotSettings: PropTypes.func.isRequired,
  updateBotSettings: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  botSettings: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  botSettings: state.bot.botSettings
});

const mapDispatchToProps = dispatch => ({
  getBotSettings: () => dispatch(getBotSettings()),
  updateBotSettings: (id, data) => dispatch(updateBotSettings(id, data)),
  addNotification: payload => dispatch(addNotification(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsEditor);
