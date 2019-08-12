import React from 'react';
import Subscription from 'components/Subscription/Admin';
import AppLayout from 'components/default/layout';

const SubscriptionsPage = () => <AppLayout title={'Subscription Plans'} hideBanner> <Subscription /> </AppLayout>;

export default SubscriptionsPage;