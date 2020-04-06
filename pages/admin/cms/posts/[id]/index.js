import React from 'react';
import PostView from '/components/Cms/PostView';
import AppLayout from '/components/default/layout';

const PostViewPage = () => <AppLayout title={'Post View'} hideBanner> <PostView /> </AppLayout>;

export default PostViewPage;