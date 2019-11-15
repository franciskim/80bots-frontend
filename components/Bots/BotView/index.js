import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'next/link';
import ScreenShotTab from './components/ScreenShotTab';
import LogsTab from './components/LogsTab';
import OutputTab from './components/OutputTab';
import DisplayTab from './components/DisplayTab';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { withTheme } from 'emotion-theming';
import { theme } from '/config';
import { Card, CardBody, CardHeader } from '/components/default/Card';
import {adminGetBot, getBot, clearBot} from '/store/bot/actions';
import { subscribe, unsubscribe } from '/store/socket/actions';
import { Badge, Button, Loader } from '/components/default';
import Icon from "../../default/icons";
import DropDown from "../../default/DropDown";

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
  flex: 1;
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

const Arrow = styled.div`
  display: inline-block;
  color: white;
  transform: rotate(90deg);
  margin: 1px 0 0 6px;
`;


const BotView = ({ botInstance, user, getBot, clearBot, adminGetBot, theme, wsSubscribe, wsUnsubscribe }) => {
  const [activeTab, setActiveTab] = useState(TABS.SCREENSHOTS);
  const [status, setStatus] = useState(STATUSES.CONNECTING);
  const [customBack, setCustomBack] = useState(null);
  const [viewMode, setViewMode] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const { storage_channel } = botInstance;
    if(storage_channel) {
      wsSubscribe(storage_channel, true);
      setStatus(STATUSES.CONNECTED);
    }
    return () => {
      return wsUnsubscribe(storage_channel);
    };
  }, [botInstance]);

  useEffect(() => {
    user.role === 'Admin'
      ? adminGetBot(router.query.id)
      : getBot(router.query.id);
    return () => {
      clearBot();
    };
  }, []);

  useEffect(() => {
    setCustomBack(null);
  }, [activeTab]);

  const renderTab = (item, idx) => {
    const isOffline = viewMode === 'OFFLINE';
    const isDisabled = isOffline && item === 'DISPLAY';
    return (
      <Tab disabled={isDisabled} type={activeTab.title === TABS[item].title ? 'success' : 'primary'}
        key={idx} onClick={() => setActiveTab(TABS[item])}>
        { TABS[item].title }
      </Tab>
    );
  };

  const CurrentTab = activeTab.component;
  return(
    <Container>
      <Header>
        {
          <Back type={'primary'}>
            <A onClick={() => customBack ? customBack() : router.back()}>Back</A>
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
          : <CurrentTab setCustomBack={(f) => setCustomBack(() => f )}/>
      }
    </Container>
  );
};

BotView.propTypes = {
  adminGetBot:     PropTypes.func.isRequired,
  clearBot:        PropTypes.func.isRequired,
  getBot:          PropTypes.func.isRequired,
  wsSubscribe:     PropTypes.func.isRequired,
  wsUnsubscribe:   PropTypes.func.isRequired,
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
  wsSubscribe: (channel, isPrivate) => dispatch(subscribe(channel, isPrivate)),
  wsUnsubscribe: (channel) => dispatch(unsubscribe(channel)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BotView));
