import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import AsyncSelect from 'react-select/async';
import { css } from '@emotion/core';
import { connect } from 'react-redux';
import { Button } from '/components/default';
import { Textarea, Input, Select } from '/components/default/inputs';
import { adminGetBots } from '../../../store/bot/actions';
import RichEditor from '../../default/inputs/RichEditor';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0 10px 0;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  &:first-of-type {
    margin-right: 10px;
  }
  &:last-of-type {
    margin-left: 10px;
  }
`;

const TextareaWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 5px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StatusButton = styled(Button)`
  text-transform: uppercase;
  min-height: 38px;
`;

const Error = styled.span`
  font-size: 15px;
  text-align: center;
  color: ${ props => props.theme.colors.darkishPink };
`;

const selectStyles = {
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 8px',
    borderColor: '#ced4da'
  })
};

const inputStyles = {
  container: css`
    &:first-of-type {
      margin-right: 10px;
    }
    &:last-of-type {
      margin-left: 10px;
    }  
  `,
};

const SelectWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
`;

const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const PostEditor = ({ type, post, adminGetBots, bots, onSubmit }) => {

  const [title, setTitle] = useState(post ? post.title : '');
  const [content, setContent] = useState(post ? post.content : '');
  const [bot, setBot] = useState(post ? post.bot : null);
  const [status, setStatus] = useState(post ? post.status : '');
  const [isBotPost, setBotPost] = useState(post ? post.type === 'bot' : false);
  const [error, setError] = useState(null);

  const toOptions = item => {
    return({
      ...item,
      value: typeof item === 'object' ? item.id : item,
      label: typeof item === 'object' ? item.name : item
    });
  };

  useEffect(() => {
    adminGetBots({ page: 1, limit: 25 });
  }, []);

  const searchBots = (value, callback) => {
    adminGetBots({ page: 1, limit: 25, search: value })
      .then(action => callback(action.data.data.map(toOptions)));
  };

  const submit = () => {
    onSubmit({
      title,
      content,
      status: status.value,
      type: isBotPost ? 'bot' : 'post',
      botId: bot ? bot.id : null
    });
  };

  return(
    <>
      <FormContainer>
        <Input type={'text'} label={'Title *'} value={title} styles={inputStyles}
          onChange={e => setTitle(e.target.value)}
        />

        <InputWrap>
          <Label>Post type *</Label>
          <StatusButton type={isBotPost ? 'danger' : 'primary'} onClick={() => setBotPost(!isBotPost)}>
            { isBotPost ? 'Bot Post' : 'Post' }
          </StatusButton>
        </InputWrap>

        {
          isBotPost && <SelectWrap>
            <Label>{'Select bot'}</Label>

            <AsyncSelect onChange={option => setBot(option)} value={toOptions(bot)}
              loadOptions={searchBots} defaultOptions={bots.map(toOptions)}
            />
          </SelectWrap>
        }

        <RichEditor onChange={setContent} content={content}/>

        <Select options={STATUSES} value={STATUSES.find(item => item.value === status)}
          onChange={option => setStatus(option)} styles={selectStyles} label={'Status'}
        />

        { error && <Error>{ error }</Error> }
      </FormContainer>
      <Buttons>
        <Button type={'primary'} onClick={submit}>{ type === 'add' ? 'Add' : 'Update' }</Button>
      </Buttons>
    </>
  );

};

PostEditor.propTypes = {
  type: PropTypes.oneOf(['edit', 'add']).isRequired,
  post: PropTypes.object,
  adminGetBots: PropTypes.func.isRequired,
  bots: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  bots: state.bot.bots,
});

const mapDispatchToProps = dispatch => ({
  adminGetBots: query => dispatch(adminGetBots(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostEditor);