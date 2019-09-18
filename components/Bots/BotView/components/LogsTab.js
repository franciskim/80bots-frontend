import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Textarea } from 'components/default/inputs';
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
  height: 85vh;
  flex-flow: row wrap;
  justify-content: space-between;
  ${ props => props.styles };
`;

const TextArea = styled(Textarea)`
  flex: 1 1 auto;
  font-size: 14px;
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
      const handshake = { id: botInstance.instance_id };
      addExternalListener(`${botInstance.ip}:6002`, handshake, EVENTS.LOG, (chunk) => {
        setLogs(String.fromCharCode.apply(null, new Uint8Array(chunk)));
      });
      emitExternalMessage(MESSAGES.GET_LOGS, null, `${botInstance.ip}:6002`, handshake);
    }
  }, [botInstance]);

  return(
    <>
      <Content>
        <TextArea disabled={true} value={logs}/>
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
