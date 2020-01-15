import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Link from "next/link";
import { useTheme, withTheme } from "emotion-theming";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import { Button, Loader } from "../default";
import { NOTIFICATION_TYPES } from "/config";
import PostEditor from "./components/PostEditor";
import { addNotification } from "../../store/notification/actions";
import { Card, CardBody, CardHeader } from "/components/default/Card";
import { getPost, updatePost, forgetPost } from "../../store/cms/actions";

const Container = styled(Card)`
  border-radius: 0.25rem;
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

const EditPost = ({ getPost, updatePost, forgetPost, post }) => {
  const router = useRouter();
  const theme = useTheme();
  const [postFormErrors, setPostFormErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const pageEditPost = postData => {
    updatePost(post.id, postData)
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: "Post updated!"
        });
      })
      .catch(errors => {
        setPostFormErrors(errors.error.response.data.message);
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: "Update failed!"
        });
      });
  };

  useEffect(() => {
    getPost(router.query.id);
    return function() {
      forgetPost();
    };
  }, []);

  return (
    <Container>
      <Header>
        <Back type={"primary"}>
          {showPreview ? (
            <A onClick={() => setShowPreview(false)}>Back</A>
          ) : (
            <Link href={"/admin/cms"}>
              <A>Back</A>
            </Link>
          )}
        </Back>
      </Header>
      <CardBody>
        {Object.keys(post).length ? (
          <PostEditor
            type={"edit"}
            formErrors={postFormErrors}
            post={post}
            onSubmit={pageEditPost}
            showPreview={showPreview}
            onShowPreview={setShowPreview}
          />
        ) : (
          <Loader
            type={"spinning-bubbles"}
            width={100}
            height={100}
            color={theme.colors.primary}
          />
        )}
      </CardBody>
    </Container>
  );
};

EditPost.propTypes = {
  getPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  forgetPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  post: state.cms.post
});

const mapDispatchToProps = dispatch => ({
  getPost: id => dispatch(getPost(id)),
  forgetPost: () => dispatch(forgetPost()),
  updatePost: (id, data) => dispatch(updatePost(id, data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(EditPost));
