import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { css } from "@emotion/core";
import { connect } from "react-redux";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { getPlatforms } from "/store/platform/actions";
import { getTags } from "/store/bot/actions";
import { getUsers } from "/store/user/actions";
import { Button } from "/components/default";
import { Textarea, Input, CodeEditor } from "/components/default/inputs";

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
  color: ${props => props.theme.colors.darkishPink};
`;

const selectStyles = {
  valueContainer: provided => ({
    ...provided,
    padding: "0 8px",
    borderColor: "#ced4da",
  }),
  menuList: () => ({
    color: "#000000",
  }),
  menu: provided => ({
    ...provided,
    zIndex: "7",
  }),
};

const inputStyles = {
  container: css`
    &:first-of-type {
      margin-right: 10px;
    }
    &:last-of-type {
      margin-left: 10px;
    }
  `
};

const BotEditor = ({
  getPlatforms,
  getTags,
  platforms,
  tags,
  onSubmit,
  onClose,
  getUsers,
  users,
  bot
}) => {
  const [tagName, setTagName] = useState("");
  const [platformName, setPlatformName] = useState("");
  const [platform, setPlatform] = useState(null);
  const [botTags, setTags] = useState([]);
  const [botName, setBotName] = useState(bot ? bot.name : "");
  const [botScript, setBotScript] = useState(bot ? bot.aws_custom_script : "");
  const [botPackageJSON, setBotPackageJSON,] = useState( bot ? bot.aws_custom_package_json : "");
  const [description, setDescription] = useState(bot ? bot.description : "");
  const [isPrivate, setPrivate] = useState(
    bot ? bot.type === "private" : false
  );
  const [trustedUsers, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const toOptions = item => {
    return {
      ...item,
      value: typeof item === "object" ? item.name || item.id : item,
      label:
        typeof item === "object"
          ? item.email
            ? item.email + " | " + item.name
            : item.name
          : item
    };
  };

  useEffect(() => {
    getPlatforms({ page: 1, limit: 50 });
    getTags({ page: 1, limit: 50 });
    getUsers({ page: 1, limit: 25 });
  }, []);

  useEffect(() => {
    if (bot) {
      console.log(bot);
      setPlatform(
        toOptions(platforms.find(item => item.name === bot.platform))
      );
      setTags(
        tags.filter(item => bot.tags.indexOf(item.name) > -1).map(toOptions)
      );
      if (bot.users) {
        setUsers(
          users
            .filter(item => bot.users.find(user => user.id === item.id))
            .map(toOptions)
        );
      }
    }
  }, [tags, users, platforms]);

  const onUsersSearch = (value, callback) => {
    getUsers({ page: 1, limit: 25, search: value }).then(action =>
      callback(action.data.data.map(toOptions))
    );
  };

  const onPlatformInputChange = newValue => {
    setPlatformName(newValue);
  };

  const onTagInputChange = newValue => {
    setTagName(newValue);
  };

  const getTagOptions = () => {
    let options = tags.map(toOptions);
    if (
      tagName &&
      !options.find(item => item.label.match(new RegExp(tagName, "ig")))
    ) {
      options = [{ value: tagName, label: tagName }].concat(options);
    }
    return options;
  };

  const getPlatformOptions = () => {
    let options = platforms.map(toOptions);
    if (
      platformName &&
      !options.find(item => item.label.match(new RegExp(platformName, "ig")))
    ) {
      options = [{ value: platformName, label: platformName }].concat(options);
    }
    return options;
  };

  const submit = () => {
    if (!platform || !botName) {
      setError("You must fill in required fields marked by '*'");
    } else {
      setError(null);
      const users = isPrivate ? { users: trustedUsers } : { users: [] };
      onSubmit({
        botName,
        isPrivate,
        botScript,
        botPackageJSON,
        description,
        botTags: botTags.map(item => item.value),
        platform: platform.value,
        ...users
      });
    }
  };

  return (
    <>
      <FormContainer>
        <Row>
          <InputWrap>
            <Label>Platform *</Label>
            <Select
              onChange={option => setPlatform(option)}
              styles={selectStyles}
              value={platform}
              onInputChange={onPlatformInputChange}
              options={getPlatformOptions()}
            />
          </InputWrap>
          <Input
            type={"text"}
            label={"Bot Name *"}
            value={botName}
            styles={inputStyles}
            onChange={e => setBotName(e.target.value)}
          />
        </Row>
        <Row>
          <Label>Bot Script</Label>
        </Row>
        <Row>
          <InputWrap>
            <Tabs defaultActiveKey="script" id="uncontrolled-tab-example">
              <Tab eventKey="script" title="index.js">
                <CodeEditor
                    value={botScript}
                    onChange={code => setBotScript(code)}
                />
              </Tab>
              <Tab eventKey="json" title="package.json">
                <CodeEditor
                    value={botPackageJSON}
                    onChange={code => setBotPackageJSON(code)}
                />
              </Tab>
            </Tabs>
          </InputWrap>
        </Row>
        <Row>
          <Textarea
            label={"Description"}
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </Row>
        <Row>
          <InputWrap>
            <Label>Tags</Label>
            <Select
              isMulti
              options={getTagOptions()}
              styles={selectStyles}
              onInputChange={onTagInputChange}
              onChange={options => setTags(options)}
              value={botTags}
            />
          </InputWrap>
          <InputWrap>
            <Label>Access *</Label>
            <StatusButton
              type={isPrivate ? "danger" : "primary"}
              onClick={() => setPrivate(!isPrivate)}
            >
              {isPrivate ? "Private" : "Public"}
            </StatusButton>
          </InputWrap>
        </Row>
        {isPrivate && (
          <Row>
            <TextareaWrap>
              <Label>Trusted Users</Label>
              <AsyncSelect
                isMulti
                defaultOptions={users.map(toOptions)}
                value={trustedUsers}
                styles={selectStyles}
                onChange={options => setUsers(options)}
                loadOptions={onUsersSearch}
              />
            </TextareaWrap>
          </Row>
        )}
        {error && <Error>{error}</Error>}
      </FormContainer>
      <Buttons>
        <Button type={"danger"} onClick={onClose}>
          Cancel
        </Button>
        <Button type={"primary"} onClick={submit}>
         Update
        </Button>
      </Buttons>
    </>
  );
};

BotEditor.propTypes = {
  bot: PropTypes.object,
  platforms: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  getPlatforms: PropTypes.func.isRequired,
  getTags: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  platforms: state.platform.platforms,
  types: state.platform.types,
  tags: state.bot.tags,
  users: state.user.users
});

const mapDispatchToProps = dispatch => ({
  getPlatforms: query => dispatch(getPlatforms(query)),
  getTags: query => dispatch(getTags(query)),
  getUsers: query => dispatch(getUsers(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(BotEditor);
