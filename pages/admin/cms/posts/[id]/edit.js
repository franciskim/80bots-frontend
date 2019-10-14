import React from 'react';
import EditPost from '/components/Cms/EditPost';
import AppLayout from '/components/default/layout';

const EditPostPage = () => <AppLayout title={'Edit Post'} hideBanner> <EditPost /> </AppLayout>;

export default EditPostPage;