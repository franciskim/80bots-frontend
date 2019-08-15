import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { connect } from 'react-redux';
import { getPlatforms, getInstanceTypes } from 'store/platform/actions';
import { getTags } from 'store/bot/actions';
import { getUsers } from 'store/user/actions';
import Button from 'components/default/Button';

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

const BotEditor = ({ getPlatforms, getInstanceTypes, getTags, platforms, types, tags, onSubmit, onClose,
  getUsers, users, type, bot }) => {
  const [tagName, setTagName] = useState('');
  const [platformName, setPlatformName] = useState('');
  const [platform, setPlatform] = useState(null);
  const [botTags, setTags] = useState([]);
  const [instanceType, setInstanceType] = useState(null);
  const [botName, setBotName] = useState(bot ? bot.name : '');
  const [imageId, setImageId] = useState(bot ? bot.ami_id : '');
  const [imageName, setImageName] = useState(bot ? bot.ami_name : '');
  const [storage, setStorage] = useState(bot ? bot.storage : '');
  const [startupScript, setStartupScript] = useState(bot ? bot.aws_startup_script : '');
  const [botScript, setBotScript] = useState(bot ? bot.aws_custom_script : '');
  const [description, setDescription] = useState(bot ? bot.description : '');
  const [isPrivate, setPrivate] = useState(bot ? bot.type === 'private' : false);
  const [trustedUsers, setUsers] = useState(null);
  const [error, setError] = useState(null);

  const toOptions = item => {
    return({
      ...item,
      value: typeof item === 'object' ? ( item.name || item.id) : item,
      label: typeof item === 'object' ? (item.email ? item.email + ' | ' + item.name : item.name) : item
    });
  };

  useEffect(() => {
    getPlatforms({ page: 1, limit: 50 });
    getInstanceTypes({ page: 1, limit: 50 });
    getTags({ page: 1, limit: 50 });
    getUsers({ page: 1, limit: 25 });
  }, []);

  useEffect(() => {
    if(bot) {
      setPlatform(toOptions(platforms.find(item => item.name === bot.platform)));
      setTags(tags.filter(item => bot.tags.indexOf(item.name) > -1).map(toOptions));
      setInstanceType(toOptions(types.find(item => bot.instance_type === item)));
      setUsers(users.filter(item => bot.users.find(user => user.id === item.id)).map(toOptions));
    }
  }, [tags, types, users, platforms]);

  const onUsersSearch = (value, callback) => {
    getUsers({ page: 1, limit: 25, search: value })
      .then(action => callback(action.data.data.map(toOptions)));
  };

  const onPlatformInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    setPlatformName(inputValue);
  };

  const onTagInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    setTagName(inputValue);
  };

  const getTagOptions = () => {
    let options = tags.map(toOptions);
    if(tagName && !options.find(item => item.label.match(new RegExp(tagName, 'ig')))) {
      options = [{ value: tagName, label: tagName }].concat(options);
    }
    return options;
  };

  const getPlatformOptions = () => {
    let options = platforms.map(toOptions);
    if(platformName && !options.find(item => item.label.match(new RegExp(platformName, 'ig')))) {
      options = [{ value: platformName, label: platformName }].concat(options);
    }
    return options;
  };

  const submit = () => {
    if(!platform || !instanceType || !imageId || !imageName || !storage || !botName) {
      setError('You must fill in required fields marked by \'*\'');
    } else {
      setError(null);
      const users = isPrivate ? { users: trustedUsers } : {};
      onSubmit({
        botName, storage, instanceType: instanceType.value, imageId, imageName, isPrivate, startupScript, botScript,
        description, botTags: botTags.map(item => item.value), platform: platform.value,
        ...users
      });
    }
  };

  return(
    <>
      <FormContainer>
        <Row>
          <InputWrap>
            <Label>Platform *</Label>
            <Select onChange={option => setPlatform(option)} styles={selectStyles} value={platform}
              onInputChange={onPlatformInputChange} options={getPlatformOptions()}
            />
          </InputWrap>
          <InputWrap>
            <Label>Instance Type *</Label>
            <Select options={types.map(toOptions)} onChange={option => setInstanceType(option)} styles={selectStyles}
              value={instanceType}
            />
          </InputWrap>
        </Row>
        <Row>
          <InputWrap>
            <Label>AMI Image ID *</Label>
            <input type={'text'} className={'form-control'} value={imageId}
              onChange={e => setImageId(e.target.value)}
            />
          </InputWrap>
          <InputWrap>
            <Label>AMI Name *</Label>
            <input type={'text'} className={'form-control'} value={imageName}
              onChange={e => setImageName(e.target.value)}
            />
          </InputWrap>
        </Row>
        <Row>
          <InputWrap>
            <Label>Bot Name *</Label>
            <input type={'text'} className={'form-control'} value={botName}
              onChange={e => setBotName(e.target.value)}
            />
          </InputWrap>
          <InputWrap>
            <Label>Storage GB *</Label>
            <input type={'text'} className={'form-control'} value={storage}
              onChange={e => setStorage(e.target.value)}
            />
          </InputWrap>
        </Row>
        <Row>
          <InputWrap>
            <Label>Startup Script</Label>
            <textarea rows={10} className={'form-control'} value={startupScript}
              onChange={e => setStartupScript(e.target.value)}/>
          </InputWrap>
          <InputWrap>
            <Label>Bot Script</Label>
            <textarea rows={10} className={'form-control'} value={botScript}
              onChange={e => setBotScript(e.target.value)}/>
          </InputWrap>
        </Row>
        <Row>
          <TextareaWrap>
            <Label>Description</Label>
            <textarea rows={5} className={'form-control'} value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </TextareaWrap>
        </Row>
        <Row>
          <InputWrap>
            <Label>Tags</Label>
            <Select isMulti options={getTagOptions()} styles={selectStyles} onInputChange={onTagInputChange}
              onChange={options => setTags(options)} value={botTags}
            />
          </InputWrap>
          <InputWrap>
            <Label>Access *</Label>
            <StatusButton type={isPrivate ? 'danger' : 'primary'} onClick={() => setPrivate(!isPrivate)}>
              { isPrivate ? 'Private' : 'Public' }
            </StatusButton>
          </InputWrap>
        </Row>
        {
          isPrivate && <Row>
            <TextareaWrap>
              <Label>Trusted Users</Label>
              <AsyncSelect isMulti defaultOptions={users.map(toOptions)} value={trustedUsers} styles={selectStyles}
                onChange={options => setUsers(options)} loadOptions={onUsersSearch}
              />
            </TextareaWrap>
          </Row>
        }
        { error && <Error>{ error }</Error> }
      </FormContainer>
      <Buttons>
        <Button type={'primary'} onClick={submit}>{ type === 'add' ? 'Add' : 'Update' }</Button>
        <Button type={'danger'} onClick={onClose}>Cancel</Button>
      </Buttons>
    </>
  );
};

BotEditor.propTypes = {
  type: PropTypes.oneOf(['edit', 'add']).isRequired,
  bot: PropTypes.object,
  platforms: PropTypes.array.isRequired,
  types: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  getPlatforms: PropTypes.func.isRequired,
  getInstanceTypes: PropTypes.func.isRequired,
  getTags: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  platforms: state.platform.platforms,
  types: state.platform.types,
  tags: state.bot.tags,
  users: state.user.users
});

const mapDispatchToProps = dispatch => ({
  getPlatforms: query => dispatch(getPlatforms(query)),
  getInstanceTypes: query => dispatch(getInstanceTypes(query)),
  getTags: query => dispatch(getTags(query)),
  getUsers: query => dispatch(getUsers(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(BotEditor);