import React, { useEffect, useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Textarea } from 'components/default/inputs';
import { css } from '@emotion/core';
import { connect } from 'react-redux';
import { CardBody } from 'components/default/Card';
import { addExternalListener, emitExternalMessage, removeAllExternalListeners } from 'store/socket/actions';
import { Button } from 'components/default';

const EVENTS = {
  LOG: 'log'
};

const MESSAGES = {
  GET_LOGS: 'get_logs'
};

const Content = styled(CardBody)`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  ${ props => props.styles };
`;

const Back = styled(Button)`
  padding: 0 5px;
  margin-right: 10px;
`;

const LogsTab = ({
  botInstance, addExternalListener, removeAllExternalListeners, emitExternalMessage, setCustomBack
}) => {
  const [logs, setLogs] = useReducer((state, data) => state + data, '');

  useEffect(() => {
    return () => { removeAllExternalListeners(); };
  }, []);

  useEffect(() => {
    if(botInstance && Object.keys(botInstance).length > 0) {
      addExternalListener(`${botInstance.ip}:6002`, 'default', EVENTS.LOG, (chunk) => {
        setLogs(String.fromCharCode.apply(null, new Uint8Array(chunk)));
      });
      emitExternalMessage(MESSAGES.GET_LOGS, null, `${botInstance.ip}:6002`);
    }
  }, [botInstance]);

  return(
    <>
      <Content>
        <Textarea rows={20} disabled={true} value={logs}>

        </Textarea>
      </Content>
    </>
  );
};

LogsTab.propTypes = {
  addExternalListener:        PropTypes.func.isRequired,
  emitExternalMessage:        PropTypes.func.isRequired,
  removeAllExternalListeners: PropTypes.func.isRequired,
  setCustomBack:              PropTypes.func.isRequired,
  botInstance:                PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  botInstance: state.bot.botInstance
});

const mapDispatchToProps = dispatch => ({
  addExternalListener: (...args) => dispatch(addExternalListener(...args)),
  emitExternalMessage: (...args) => dispatch(emitExternalMessage(...args)),
  removeAllExternalListeners: () => dispatch(removeAllExternalListeners())
});

export default connect(mapStateToProps, mapDispatchToProps)(LogsTab);
