import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'next/link';
import ScreenShotTab from './components/ScreenShotTab';
import LogsTab from './components/LogsTab';
import OutputTab from './components/OutputTab';
import DisplayTab from './components/DisplayTab';
import { theme } from 'config';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { withTheme } from 'emotion-theming';
import { Card, CardBody, CardHeader } from 'components/default/Card';
import { adminGetBot, getBot, clearBot } from 'store/bot/actions';
import { Badge, Button, Loader } from 'components/default';
import { initExternalConnection, closeExternalConnection, addExternalListener } from 'store/socket/actions';

const TABS = {
  SCREENSHOTS: {
    title: 'Screenshots',
    component: ScreenShotTab
  },
  LOGS: {
    title: 'Logs',
    component: LogsTab
  },
  OUTPUTS: {
    title: 'Outputs',
    component: OutputTab
  },
  DISPLAY: {
    title: 'Display',
    component: DisplayTab
  }
};

const STATUSES = {
  CONNECTING: {
    label: 'Connecting',
    color: theme.colors.orange
  },
  CONNECTED: {
    label: 'Connected',
    color: theme.colors.clearGreen
  },
  RECONNECT: {
    label: 'Reconnecting',
    color: theme.colors.orange
  },
  TIMEOUT: {
    label: 'Instance Launching or Stopped',
    color: theme.colors.darkishPink
  },
  ERROR: {
    label: 'Stopped',
    color: theme.colors.darkishPink
  },
  DISCONNECT: {
    label: 'Disconnected',
    color: theme.colors.darkishPink
  }
};

const Container = styled(Card)` 
  border-radius: .25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const Header = styled(CardHeader)`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const Tabs = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-self: flex-end;
  justify-content: flex-end;
`;

const Status = styled(Badge)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  background-color: ${ props => props.color };
`;

const Content = styled(CardBody)`
  display: flex;
  height: 85vh;
  flex-flow: column;
`;

const H6 = styled.h6`
  text-align: start;
  margin: 0;
`;

const Back = styled(Button)`
  padding: 0 5px;
  margin-right: 10px;
`;

const Tab = styled(Back)`
  &:last-child {
    margin-right: 0;
  }
`;

const A = styled.a`
  color: inherit;
  text-decoration: none; 
`;

const Hint = styled.span` 
  font-size: 14px;
  color: ${ props => props.theme.colors.grey };
`;

const ConnectionStatus = ({ status, color }) => <>
  <Status type={'info'} color={color} pill>{ status }</Status>
  <Hint>&nbsp;|&nbsp;</Hint>
</>;

const BotView = ({ botInstance, user, getBot, clearBot, adminGetBot, theme, closeConnection, initConnection, listen }) => {
  const [activeTab, setActiveTab] = useState(TABS.SCREENSHOTS);
  const [status, setStatus] = useState(STATUSES.CONNECTING);
  const [customBack, setCustomBack] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if(botInstance?.ip) {
      const handshake = { id: botInstance.instance_id };
      let timer;
      initConnection(`${botInstance.ip}:6002`, handshake);
      listen('connect', () => {
        clearTimeout(timer);
        setStatus(STATUSES.CONNECTED);
      });
      listen('connect_error', () => {
        setStatus(STATUSES.ERROR);
      });
      listen('connect_timeout', () => {
        setStatus(STATUSES.TIMEOUT);
      });
      listen('reconnect_attempt', () => {
        timer = setTimeout(() => {
          setStatus(STATUSES.RECONNECT);
        }, 1000);
      });
      listen('disconnect', () => {
        setStatus(STATUSES.DISCONNECT);
      });
    }
  }, [botInstance]);

  useEffect(() => {
    user.role === 'Admin'
      ? adminGetBot(router.query.id)
      : getBot(router.query.id);
    return () => {
      clearBot();
      closeConnection();
    };
  }, []);

  useEffect(() => {
    setCustomBack(null);
  }, [activeTab]);

  const renderTab = (item, idx) => <Tab type={activeTab.title === TABS[item].title ? 'success' : 'primary'}
    key={idx} onClick={() => setActiveTab(TABS[item])}
  >
    { TABS[item].title }
  </Tab>;

  const CurrentTab = activeTab.component;

  return(
    <Container>
      <Header>
        {
          customBack || <Back type={'primary'}>
            <Link href={'/admin/bots/running'}><A>Back</A></Link>
          </Back>
        }
        <H6>
          {
            Object.keys(botInstance).length
              ? botInstance.name + ' | ' + botInstance.bot_name
              : <Loader type={'bubbles'} width={20} height={20} color={theme.colors.primary}/>
          }
        </H6>
        <Tabs>
          <ConnectionStatus status={status.label} color={status.color} />
          { Object.keys(TABS).map(renderTab) }
        </Tabs>
      </Header>
      {
        status === STATUSES.CONNECTING
          ? <Content>
            <Loader type={'spinning-bubbles'} width={100} height={100} color={status.color} caption={status.label} />
          </Content>
          : <CurrentTab setCustomBack={setCustomBack}/>
      }
    </Container>
  );
};

BotView.propTypes = {
  adminGetBot:     PropTypes.func.isRequired,
  closeConnection: PropTypes.func.isRequired,
  initConnection:  PropTypes.func.isRequired,
  clearBot:        PropTypes.func.isRequired,
  getBot:          PropTypes.func.isRequired,
  listen:          PropTypes.func.isRequired,
  botInstance:     PropTypes.object.isRequired,
  user:            PropTypes.object,
  theme:           PropTypes.shape({ colors: PropTypes.object.isRequired }).isRequired
};

ConnectionStatus.propTypes = {
  status: PropTypes.string.isRequired,
  color:  PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  botInstance: state.bot.botInstance,
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  getBot: (id) => dispatch(getBot(id)),
  clearBot: () => dispatch(clearBot()),
  adminGetBot: (id) => dispatch(adminGetBot(id)),
  initConnection: (...args) => dispatch(initExternalConnection(...args)),
  closeConnection: () => dispatch(closeExternalConnection()),
  listen: (...args) => dispatch(addExternalListener(...args))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BotView));
