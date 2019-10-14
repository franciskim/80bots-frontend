import React from 'react';
import AddPost from '/components/Cms/AddPost';
import AppLayout from '/components/default/layout';

const AddPostPage = () => <AppLayout title={'Add Post'} hideBanner> <AddPost /> </AppLayout>;

export default AddPostPage;