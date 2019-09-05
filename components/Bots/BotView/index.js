import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'next/link';
import ScreenShotTab from './components/ScreenShotTab';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { withTheme } from 'emotion-theming';
import { Card, CardHeader, CardBody } from 'components/default/Card';
import { adminGetBot, getBot } from 'store/bot/actions';
import { Button, Loader } from 'components/default';

const UnderConstruction = () => <CardBody>Under construction!!</CardBody>;

const TABS = {
  SCREENSHOTS: {
    title: 'Screenshots',
    component: ScreenShotTab
  },
  LOGS: {
    title: 'Logs',
    component: UnderConstruction
  },
  OUTPUTS: {
    title: 'Outputs',
    component: UnderConstruction
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
`;

const Tabs = styled.div`
  display: flex;
  flex: 1;
  justify-self: flex-end;
  justify-content: flex-end;
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

const BotView = ({ botInstance, user, getBot, adminGetBot, theme }) => {
  const [activeTab, setActiveTab] = useState(TABS.SCREENSHOTS);
  const [customBack, setCustomBack] = useState(null);
  const router = useRouter();

  useEffect(() => {
    user.role === 'Admin'
      ? adminGetBot(router.query.id)
      : getBot(router.query.id);
  }, []);

  const renderTab = (item, idx) => <Tab type={activeTab.title === TABS[item].title ? 'success' : 'primary'}
    key={idx} onClick={() => setActiveTab(TABS[item])}
  >
    { TABS[item].title }
  </Tab>;

  const CurrentTab = activeTab.component;

  return(
    <Container>
      <Header id={'back-portal'}>
        {
          customBack || <Back type={'primary'}>
            <Link href={'/admin/bots/running'}><A>Back</A></Link>
          </Back>
        }
        <H6>
          {
            Object.keys(botInstance).length
              ? botInstance.name + ' | ' + botInstance.instance_id
              : <Loader type={'bubbles'} width={20} height={20} color={theme.colors.primary}/>
          }
        </H6>
        <Tabs>{ Object.keys(TABS).map(renderTab) }</Tabs>
      </Header>
      <CurrentTab setCustomBack={setCustomBack}/>
    </Container>
  );
};

BotView.propTypes = {
  getBot:      PropTypes.func.isRequired,
  adminGetBot: PropTypes.func.isRequired,
  botInstance: PropTypes.object.isRequired,
  user:        PropTypes.object,
  theme:       PropTypes.shape({ colors: PropTypes.object.isRequired }).isRequired
};

const mapStateToProps = state => ({
  botInstance: state.bot.botInstance,
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  getBot: (id) => dispatch(getBot(id)),
  adminGetBot: (id) => dispatch(adminGetBot(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(BotView));
