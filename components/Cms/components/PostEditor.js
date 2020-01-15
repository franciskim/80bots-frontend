import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
  FormContainer,
  Label,
  Buttons,
  ErrorsList,
  Error,
  selectStyles,
  FormGroup,
  InlineInput
} from "./PostEditorStyles";
import { Button } from "/components/default";
import { Input, Select } from "/components/default/inputs";
import StaticPage from "../../../pages/admin/cms/posts/staticPost";
import { JoditEditor } from "../../commonBlocks/JoditEditor";

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" }
];

const POST_TYPES = [
  { value: "post", label: "Blog post" },
  { value: "page", label: "Page" }
];

const viewModes = {
  MODE_SPLIT: 3,
  MODE_SOURCE: 2,
  MODE_EDITOR: 1
};

const CONTENT_EDITOR_CONFIG = {
  height: 400,
  defaultMode: viewModes.MODE_SPLIT,
  controls: {
    source: {
      mode: viewModes.MODE_SPLIT,
      exec: function(e) {
        e.setMode(e.mode < 3 ? e.mode + 1 : 1);
      },
      isActive: true,
      tooltip: "Change mode"
    }
  }
};

const STYLES_EDITOR_CONFIG = {
  height: 250,
  defaultMode: 2,
  toolbar: false,
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  sourceEditorNativeOptions: {
    mode: "ace/mode/css"
  }
};

const PostEditor = ({
  type,
  post = {},
  onSubmit,
  formErrors,
  onShowPreview,
  showPreview
}) => {
  const [title, setTitle] = useState(post.title || "");
  const [content, setContent] = useState(post.content || "");
  const [styles, setStyles] = useState(post.style || "");
  const [postType, setPostType] = useState(post.type || "page");
  const [postUrl, setPostUrl] = useState(post.slug || "");
  const [status, setStatus] = useState(post.status || "draft");
  const [errors, setErrors] = useState(formErrors || {});

  const getPostData = () => ({
    title,
    content: content,
    status: status,
    slug: postUrl,
    type: postType,
    style: styles
  });

  const findOption = (options, value) => {
    return options.find(option => option.value === value);
  };

  const renderErrors = (errors = {}) => {
    return Object.keys(errors).map((el, index) => {
      return (
        <div key={index} className="error-list">
          {errors[el].map((error, key) => (
            <div key={key} className="error-li">
              {error}
            </div>
          ))}
        </div>
      );
    });
  };

  useEffect(() => {
    setErrors(formErrors);
  }, [formErrors]);

  return (
    <>
      {showPreview ? (
        <StaticPage {...getPostData()} />
      ) : (
        <>
          <FormContainer>
            <FormGroup>
              <Input
                type={"text"}
                label={"Title *"}
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Select
                label={"Post type *"}
                onChange={option => setPostType(option.value)}
                options={POST_TYPES}
                value={findOption(POST_TYPES, postType)}
              />
            </FormGroup>

            {post.id && postType === "post" && (
              <FormGroup>
                <div className="label">URL</div>
                <input
                  type={"text"}
                  disabled="disabled"
                  className={"form-control"}
                  value={postUrl}
                />
              </FormGroup>
            )}

            {postType === "page" && (
              <FormGroup>
                <Label>{"URL *"}</Label>
                <InlineInput>
                  <div className="label">cms/</div>
                  <input
                    type={"text"}
                    className={"form-control"}
                    value={postUrl}
                    onChange={e => setPostUrl(e.target.value)}
                  />
                </InlineInput>
              </FormGroup>
            )}

            <FormGroup>
              <Label>{"Content *"}</Label>
              <JoditEditor
                value={content}
                onChange={setContent}
                config={CONTENT_EDITOR_CONFIG}
              />
            </FormGroup>

            <FormGroup>
              <Label>{"Styles"}</Label>
              <JoditEditor
                value={styles}
                onChange={setStyles}
                config={STYLES_EDITOR_CONFIG}
              />
            </FormGroup>

            <FormGroup>
              <Select
                options={STATUSES}
                value={findOption(STATUSES, status)}
                onChange={option => setStatus(option.value)}
                styles={selectStyles}
                label={"Status"}
              />
            </FormGroup>
            {errors && Object.keys(errors).length ? (
              <ErrorsList>
                <Error>Errors: {renderErrors(errors)}</Error>
              </ErrorsList>
            ) : null}
          </FormContainer>
          <Buttons>
            <Button
              className="btn"
              type={"primary"}
              onClick={() => onSubmit(getPostData())}
            >
              {type === "add" ? "Add" : "Update"}
            </Button>
            <Button
              className="btn"
              type={"success"}
              disabled={!content.length}
              onClick={() => onShowPreview(true)}
            >
              Preview
            </Button>
          </Buttons>
        </>
      )}
    </>
  );
};

PostEditor.propTypes = {
  type: PropTypes.oneOf(["edit", "add"]).isRequired,
  formErrors: PropTypes.object,
  post: PropTypes.object,
  showPreview: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onShowPreview: PropTypes.func
};

export default PostEditor;
