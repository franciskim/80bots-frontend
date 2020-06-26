import React from 'react';
import Sessions from '/components/Sessions';
import AppLayout from '/components/default/layout';

const SessionsPage = () => <AppLayout title={'Bot Sessions'} hideBanner> <Sessions /> </AppLayout>;

export default SessionsPage;
