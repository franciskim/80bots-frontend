import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Link from "next/link";
import Router from "next/router";
import { withTheme } from "emotion-theming";
import { NOTIFICATION_TIMINGS, NOTIFICATION_TYPES, theme } from "/config";
import { Card, CardBody, CardHeader } from "/components/default/Card";
import { connect } from "react-redux";
import { Button, Loader } from "../default";
import PostEditor from "./components/PostEditor";
import { addNotification } from "../../store/notification/actions";
import { addPost } from "../../store/cms/actions";

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

const AddPost = ({ addPost }) => {
  const [postFormErrors, setPostFormErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const pageAddPost = postData => {
    addPost(postData)
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: "Post added!"
        });
        setTimeout(() => {
          Router.push("/admin/cms");
        }, NOTIFICATION_TIMINGS.DURATION * 2 + NOTIFICATION_TIMINGS.INFO_HIDE_DELAY);
      })
      .catch(errors => {
        setPostFormErrors(errors.error.response.data.message);
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: "Add failed!"
        });
      });
  };

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
        <PostEditor
          type={"add"}
          formErrors={postFormErrors}
          onSubmit={pageAddPost}
          showPreview={showPreview}
          onShowPreview={setShowPreview}
        />
      </CardBody>
    </Container>
  );
};

AddPost.propTypes = {
  addPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  addPost: data => dispatch(addPost(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AddPost));