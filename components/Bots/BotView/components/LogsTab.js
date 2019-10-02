import React, { useEffect, useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { CardBody } from 'components/default/Card';
import { Filters } from 'components/default/Table';
import { abtos } from 'lib/helpers';
import { Textarea, Select } from 'components/default/inputs';
import { addExternalListener, emitExternalMessage, removeAllExternalListeners } from 'store/socket/actions';

const EVENTS = {
  LOG: 'log'
};

const MESSAGES = {
  GET_LOGS: 'get_logs'
};

const LOG_TYPES = [
  { value: 'work', label: 'Script Work' },
  { value: 'init', label: 'Instance Init' }
];

const FiltersSection = styled(Filters)`
  display: flex;
  align-self: flex-start;
  justify-content: space-between;
`;

const Content = styled(CardBody)`
  display: flex;
  height: 85vh;
  flex-flow: column wrap;
  ${ props => props.styles };
`;

const TextArea = styled(Textarea)`
  flex: 1 1 auto;
  font-size: 14px;
`;

const LogsTab = ({ botInstance, listen, removeAll, emit, setCustomBack, user }) => {
  const logReducer = (state, action) => {
    switch (action.type) {
      case 'add': return state + action.data;
      case 'new': return action.data;
    }
  };

  const [logs, setLogs] = useReducer(logReducer, '');
  const [folder, setFolder] = useState(LOG_TYPES[0]);

  useEffect(() => {
    return () => { removeAll(); };
  }, []);

  useEffect(() => {
    setLogs({ type: 'new', data: '' });
    if(botInstance && Object.keys(botInstance).length > 0) {
      emit(MESSAGES.GET_LOGS, { init: folder.value === 'init' });
    }
  }, [folder, botInstance]);

  useEffect(() => {
    if(botInstance && Object.keys(botInstance).length > 0) {
      listen(EVENTS.LOG, chunk => {
        setLogs({ type: 'add', data: abtos(chunk) });
      });
    }
  }, [botInstance]);

  return(
    <>
      <Content>
        {
          user.role === 'Admin' && <FiltersSection>
            <Select onChange={(option) => setFolder(option)} options={LOG_TYPES} value={folder}
              styles={{select: {container: (provided) => ({...provided, minWidth: '200px'})}}}
            />
          </FiltersSection>
        }
        <TextArea disabled={true} value={logs}/>
      </Content>
    </>
  );
};

LogsTab.propTypes = {
  listen:        PropTypes.func.isRequired,
  emit:          PropTypes.func.isRequired,
  removeAll:     PropTypes.func.isRequired,
  setCustomBack: PropTypes.func.isRequired,
  botInstance:   PropTypes.object.isRequired,
  user:          PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  botInstance: state.bot.botInstance,
  user:        state.auth.user
});

const mapDispatchToProps = dispatch => ({
  listen: (...args) => dispatch(addExternalListener(...args)),
  emit: (...args) => dispatch(emitExternalMessage(...args)),
  removeAll: () => dispatch(removeAllExternalListeners())
});

export default connect(mapStateToProps, mapDispatchToProps)(LogsTab);
