import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { withTheme } from 'emotion-theming';
import { Card, CardBody, CardHeader } from '/components/default/Card';
import { getPost } from '../../../store/cms/actions';
import { connect } from 'react-redux';
import { Button } from '../../default';
import { Table } from '../../default/Table';

const Container = styled(Card)`
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  margin-bottom: 2rem;
  &:last-child {
    margin-bottom: 0;
  }
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

const PostView = ({ getPost, post, postLoading }) => {
  const router = useRouter();

  useEffect(() => {
    getPost(router.query.id);
  }, []);

  return (
    <>
      {
        !postLoading && post.id && (
          <>
            <Container>
              <Header>
                <Back type={'primary'}>
                  <Link href={'/admin/cms'}>
                    <A>Back</A>
                  </Link>
                </Back>
              </Header>
              <CardBody>
                <Table responsive>
                  <tbody>
                    <tr>
                      <td>Title</td>
                      <td>{post.title}</td>
                    </tr>
                    <tr>
                      <td>Slug</td>
                      <td>{post.slug}</td>
                    </tr>
                    <tr>
                      <td>Content</td>
                      <td>{post.content}</td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td>{post.status}</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Container>

            <Container>
              <Header>Messages</Header>
              <CardBody>sdvsdv</CardBody>
            </Container>
          </>
        )
      }
      {
        !postLoading && !post.id && (
          <div>Page with this id not found!</div>
        )
      }
    </>
  );
};

PostView.propTypes = {
  postLoading: PropTypes.bool.isRequired,
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  post: state.cms.post,
  postLoading: state.cms.loading,
});

const mapDispatchToProps = dispatch => ({
  getPost: id => dispatch(getPost(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(PostView));
