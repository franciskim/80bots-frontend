import React from 'react';
import Users from '/components/Users';
import AppLayout from '/components/default/layout';

const UsersPage = () => <AppLayout title={'Users'} hideBanner> <Users /> </AppLayout>;

export default UsersPage;
