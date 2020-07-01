import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { css } from "@emotion/core";
import { connect } from "react-redux";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { getTags, addBot } from "/store/bot/actions";
import { getUsers } from "/store/user/actions";
import { addNotification } from "/store/notification/actions";
import { Button } from "/components/default";
import { Textarea, Input, CodeEditor } from "/components/default/inputs";
import { NOTIFICATION_TYPES } from "/config";
import Router from "next/router";

const Container = styled.div`
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
  color: #fff;
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
    color: #fff;
    font-size: 16px;
    &:first-of-type {
      margin-right: 10px;
    }
    &:last-of-type {
      margin-left: 10px;
    }
  `
};

const AddBot = ({
   getTags,
   tags,
   getUsers,
   users,
   bot,
   notify,
  ...props
}) => {
    const [tagName, setTagName] = useState("");
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
        getTags({ page: 1, limit: 50 });
        getUsers({ page: 1, limit: 25 });
    }, []);

    useEffect(() => {
        if (bot) {
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
    }, [tags, users]);

    const onUsersSearch = (value, callback) => {
        getUsers({ page: 1, limit: 25, search: value }).then(action =>
            callback(action.data.data.map(toOptions))
        );
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

    const convertBotData = botData => ({
        name: botData.botName,
        description: botData.description,
        aws_custom_script: botData.botScript,
        aws_custom_package_json: botData.botPackageJSON,
        tags: botData.botTags,
        users: botData.users.map(user => user.id),
        type: botData.isPrivate ? "private" : "public"
    });

    const submit = () => {
        if (!botName) {
            setError("You must fill in required fields marked by '*'");
        } else {
            setError(null);
            const users = isPrivate ? { users: trustedUsers } : { users: [] };
            const botData = {
                botName,
                isPrivate,
                botScript,
                botPackageJSON,
                description,
                botTags: botTags.map(item => item.value),
                ...users
            };
            props
            .addBot(convertBotData(botData))
                .then(() => {
                    notify({ type: NOTIFICATION_TYPES.SUCCESS, message: "Bot added!" });
                    Router.push("/bots");
                })
                .catch(() =>
                    notify({ type: NOTIFICATION_TYPES.ERROR, message: "Add failed!" })
                );
        }
    };

    return (
        <>
            <Container>
                <Row>
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
                        <Tabs defaultActiveKey="script" id="tabs-script">
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
                        styles={inputStyles}
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
            </Container>
            <Buttons>
                <Button type={"primary"} onClick={submit}>
                    Add
                </Button>
            </Buttons>
        </>
    );
};

AddBot.propTypes = {
    bot: PropTypes.object,
    tags: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    getTags: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    addBot: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    tags: state.bot.tags,
    users: state.user.users
});

const mapDispatchToProps = dispatch => ({
    getTags: query => dispatch(getTags(query)),
    getUsers: query => dispatch(getUsers(query)),
    addBot: data => dispatch(addBot(data)),
    notify: payload => dispatch(addNotification(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddBot);
