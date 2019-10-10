import React from 'react';
import RunningBots from '/components/Bots/Admin/Running';
import AppLayout from '/components/default/layout';

const RunningBotsPage = () => <AppLayout title={'Running Bots'} hideBanner> <RunningBots /> </AppLayout>;

export default RunningBotsPage;
