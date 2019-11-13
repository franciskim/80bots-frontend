import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import dynamic from 'next/dynamic';

import { Button } from '/components/default';
import { Input, Select } from '/components/default/inputs';
import StaticPage from '../../../pages/admin/cms/posts/staticPost';

dynamic(import('jodit/build/jodit.min.css'), { ssr: false });
const JoditEditor = dynamic(import('jodit-react'), { ssr: false });

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px 0 10px 0;
`;

const InputWrap = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const Label = styled.label`
    font-size: 16px;
    margin-bottom: 5px;
`;

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    .btn {
        margin-right: 10px;
        &:last-child {
            margin-right: 0;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
    }
`;

const ErrorsList = styled.div`
    width: 100%;
    text-align: left;
`;

const Error = styled.div`
    font-size: 15px;
    color: ${props => props.theme.colors.darkishPink};
`;

const selectStyles = {
  valueContainer: provided => ({
    ...provided,
    padding: '0 8px',
    borderColor: '#ced4da',
  }),
};

const FormGroup = styled.div`
    text-align: left;
    margin-bottom: 10px;
    &:last-child {
        margin-bottom: 0;
    }
`;

const InlineInput = styled.div`
    display: flex;
    align-items: center;
    .label {
        margin-right: 5px;
        flex-shrink: 0;
    }
    .form-control {
        flex: 2;
    }
`;

const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const POST_TYPES = [
  { value: 'post', label: 'Blog post' },
  { value: 'page', label: 'Page' },
];

const JODIT_EDITOR_CONFIG = {
  height: 400,
  defaultMode: 3,
};

const PostEditor = ({ type, post = {}, onSubmit, formErrors, onShowPreview, showPreview }) => {
  setTimeout(() => setJoditEditorReady(true), 100);

  const editor = useRef(null);
  const [title, setTitle] = useState(post.title || '');
  const [content, setContent] = useState(post.content || '');
  const [postType, setPostType] = useState(post.type || 'page');
  const [postUrl, setPostUrl] = useState(post.slug || '');
  const [status, setStatus] = useState(post.status || 'draft');
  const [errors, setErrors] = useState(formErrors || []);
  const [isJoditEditorReady, setJoditEditorReady] = useState(false);

  const getData = () => ({
    title,
    content: content,
    status: status,
    slug: postUrl,
    type: postType,
  });

  const findOption = (options, value) => {
    return options.find(option => option.value === value);
  };

  const renderErrors = (errors = {}) => {
    return Object.keys(errors).map((el, index) => {
      return (
        <div key={index} className='error-list'>
          {errors[el].map((error, key) => (
            <div key={key} className='error-li'>
              {error}
            </div>
          ))}
        </div>
      );
    });
  };

  // useEffect(() => {
  //   setErrors(formErrors);
  // }, [formErrors]);

  return (
    <>
      {showPreview ? (
        <StaticPage {...getData()} standalonePage={false} />
      ) : (
        <>
          <FormContainer>
            <FormGroup>
              <Input
                type={'text'}
                label={'Title *'}
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </FormGroup>
    
            <FormGroup>
              <Select
                label={'Post type *'}
                onChange={option => setPostType(option.value)}
                options={POST_TYPES}
                value={findOption(POST_TYPES, postType)}
              />
            </FormGroup>
    
            {post.id && postType === 'post' && (
              <FormGroup>
                <div className='label'>URL</div>
                <input type={'text'} disabled='disabled' className={'form-control'} value={postUrl} />
              </FormGroup>
            )}
    
            {postType === 'page' && (
              <FormGroup>
                <Label>{'URL *'}</Label>
                <InlineInput>
                  <div className='label'>cms/</div>
                  <input
                    type={'text'}
                    className={'form-control'}
                    value={postUrl}
                    onChange={e => setPostUrl(e.target.value)}
                  />
                </InlineInput>
              </FormGroup>
            )}
    
            <FormGroup>
              <Label>{'Content *'}</Label>
              {isJoditEditorReady && (
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={JODIT_EDITOR_CONFIG}
                  onChange={setContent}
                />
              )}
            </FormGroup>
    
            <FormGroup>
              <Select
                options={STATUSES}
                value={findOption(STATUSES, status)}
                onChange={option => setStatus(option.value)}
                styles={selectStyles}
                label={'Status'}
              />
            </FormGroup>
            {errors && Object.keys(errors).length ? (
              <ErrorsList>
                <Error>Errors: {renderErrors(errors)}</Error>
              </ErrorsList>
            ) : null}
          </FormContainer>
          <Buttons>
            <Button className='btn' type={'primary'} onClick={onSubmit(getData())}>
              {type === 'add' ? 'Add' : 'Update'}
            </Button>
            <Button className='btn' type={'success'} onClick={() => onShowPreview(true)}>
              Preview
            </Button>
          </Buttons>
        </>
      )}
    </>
  );
};

PostEditor.propTypes = {
  type: PropTypes.oneOf(['edit', 'add']).isRequired,
  formErrors: PropTypes.object,
  post: PropTypes.object,
  showPreview: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onShowPreview: PropTypes.func,
};

export default PostEditor;
