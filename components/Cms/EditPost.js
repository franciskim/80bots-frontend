import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { withTheme } from 'emotion-theming';
import { NOTIFICATION_TIMINGS, NOTIFICATION_TYPES } from '/config';
import { Card, CardBody, CardHeader } from '/components/default/Card';
import {connect} from 'react-redux';
import {Button, Loader} from '../default';
import PostEditor from './components/PostEditor';
import {addNotification} from '../../store/notification/actions';
import { getPost, updatePost } from '../../store/cms/actions';
import { useTheme } from 'emotion-theming';

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

const Back = styled(Button)`
  padding: 0 5px;
  margin-right: 10px;
`;

const A = styled.a` 
  color: inherit;
  text-decoration: none; 
`;

const EditPost = ({ getPost, updatePost, post }) => {

  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    getPost(router.query.id);
  }, []);

  const convertPostData = postData => ({
    title: postData.title,
    content: postData.content,
    status: postData.status,
  });

  const pageEditPost = (postData) => {
    updatePost(post.id, convertPostData(postData))
      .then(() => {
        addNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: 'Post updated!' });
      })
      .catch(() => addNotification({ type: NOTIFICATION_TYPES.ERROR, message: 'Update failed!' }));
  };

  return(
    <Container>
      <Header>
        <Back type={'primary'}>
          <Link href={'/admin/cms'}><A>Back</A></Link>
        </Back>
      </Header>
      <CardBody>
        {
          Object.keys(post).length
            ? <PostEditor type={'edit'} post={post} onSubmit={pageEditPost} />
            : <Loader type={'spinning-bubbles'} width={100} height={100} color={theme.colors.primary}/>
        }
      </CardBody>
    </Container>
  );

};

EditPost.propTypes = {
  getPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.cms.post,
});

const mapDispatchToProps = dispatch => ({
  getPost: id => dispatch(getPost(id)),
  updatePost: (id, data) => dispatch(updatePost(id, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(EditPost));