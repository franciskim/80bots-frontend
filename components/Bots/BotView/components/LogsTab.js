import React, { useEffect, useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { CardBody } from '/components/default/Card';
import { Filters } from '/components/default/Table';
import { abtos } from '/lib/helpers';
import { Textarea, Select } from '/components/default/inputs';
import { addExternalListener, emitExternalMessage, removeAllExternalListeners } from '/store/socket/actions';
import { theme } from '/config';
import { Loader } from '/components/default';
import { getLogs } from '/store/bot/actions';
import {useRouter} from 'next/router';

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

const STATUSES = {
  DATA: {
    label: 'Receiving Logs',
    color: theme.colors.mediumGreen
  }
};

const LogsTab = ({ botInstance, getLogs, listen, removeAll, emit, setCustomBack, user }) => {
  const [status, setStatus] = useState(STATUSES.DATA);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();

  const logReducer = (state, action) => {
    switch (action.type) {
      case 'add': return state + action.data;
      case 'new': return action.data;
    }
  };

  const [logs, setLogs] = useReducer(logReducer, '');
  const [folder, setFolder] = useState(LOG_TYPES[0]);

  useEffect(() => {
    getLogs({ instance_id: router.query.id });
  }, []);

  // useEffect(() => {
  //   return () => { removeAll(); };
  // }, []);
  //
  // useEffect(() => {
  //   setLogs({ type: 'new', data: '' });
  //   if(Object.keys(botInstance).length > 0) {
  //     setStatus(STATUSES.DATA);
  //     emit(MESSAGES.GET_LOGS, { init: folder.value === 'init' });
  //   }
  // }, [folder, botInstance]);
  //
  // useEffect(() => {
  //   if(Object.keys(botInstance).length > 0) {
  //     listen(EVENTS.LOG, chunk => {
  //       if(status) setStatus(null);
  //       setLogs({ type: 'add', data: abtos(chunk) });
  //     });
  //   }
  // }, [botInstance]);
  //
  // useEffect(() => {
  //   if(logs && !scrolled) {
  //     document.getElementById('logs').scrollTop = document.getElementById('logs').scrollHeight;
  //     setScrolled(true);
  //   }
  // }, [logs, scrolled]);

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
        {
          !status
            ? <TextArea id={'logs'} disabled={true} value={logs}/>
            : <Loader type={'spinning-bubbles'} width={100} height={100} color={status.color}
              caption={status.label}
            />
        }
      </Content>
    </>
  );
};

LogsTab.propTypes = {
  listen:         PropTypes.func.isRequired,
  emit:           PropTypes.func.isRequired,
  removeAll:      PropTypes.func.isRequired,
  setCustomBack:  PropTypes.func.isRequired,
  getLogs:        PropTypes.func.isRequired,
  botInstance:    PropTypes.object.isRequired,
  logs:           PropTypes.object.isRequired,
  user:           PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  botInstance:  state.bot.botInstance,
  logs:         state.bot.logs,
  user:         state.auth.user
});

const mapDispatchToProps = dispatch => ({
  getLogs: (query) => dispatch(getLogs(query)),
  listen: (...args) => dispatch(addExternalListener(...args)),
  emit: (...args) => dispatch(emitExternalMessage(...args)),
  removeAll: () => dispatch(removeAllExternalListeners())
});

export default connect(mapStateToProps, mapDispatchToProps)(LogsTab);
