import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { connect } from "react-redux";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { addNotification } from "/store/notification/actions";
import { NOTIFICATION_TYPES } from "/config";
import { Button } from "/components/default";
import { CodeEditor } from "/components/default/inputs";
import { getBotInstance, updateBotInstance} from "/store/botinstance/actions";
import {useRouter} from "next/router";

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
  control: (provided, state) => ({
    ...provided,
    border: "solid 1px hsl(0,0%,80%)",
    borderRadius: "4px",
    color: "#fff",
    backgroundColor: "transparent",
    "&:hover": {
      borderColor: "#7dffff"
    }
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "#fff"
  }),
  menu: (provided, state) => ({
    ...provided,
    border: "solid 1px hsl(0,0%,80%)",
    borderRadius: "4px",
    zIndex: "7",
  }),
  menuList: (provided, state) => ({
    ...provided,
    backgroundColor: "#333",
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "black" : "#fff",
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
`};

const Index = ({
 aboutBot,
 getBotInstance,
 updateBotInstance,
 notify,
}) => {
  const router = useRouter().query.id;
  const [botScript, setBotScript] = useState("");
  const [botPackageJSON, setBotPackageJSON] = useState( "");
  const [error, setError] = useState(null);

  const isEmpty = obj => {
    for(let key in obj) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    getBotInstance(router);
    return () => {};
  }, []);

  useEffect(() => {
    if (isEmpty(aboutBot)) {
      setBotScript(aboutBot.aws_custom_script);
      setBotPackageJSON(aboutBot.aws_custom_package_json);
    }
  }, [aboutBot]);

  

  const convertBotData = botData => ({
    aws_custom_script: botData.botScript,
    aws_custom_package_json: botData.botPackageJSON,
  });
  const submit = () => {
      setError(null);
      const botData = {
        botScript,
        botPackageJSON,
      };
      //const convertedData = convertBotData(botData);
      //console.log("convertedData "+JSON.stringify(convertedData));
      updateBotInstance(aboutBot.id, convertBotData(botData))
        .then(() => {
          notify({ type: NOTIFICATION_TYPES.SUCCESS, message: "BotInstance updated!" });
          Router.push("/bots");
        })
        .catch(() =>
          notify({ type: NOTIFICATION_TYPES.ERROR, message: "Update failed!" })
        );
  };



  return (
    <>
      <Container>
        {/* <Row>
          <Input
            type={"text"}
            label={"Bot Name *"}
            value={botName}
            styles={inputStyles}
            disabled={true}
            onChange={e => setBotName(e.target.value)}
          />
          <Label>Bot Script</Label>
        </Row> */}
        <Row>
          <InputWrap>
            <Tabs defaultActiveKey="script">
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
        {/* <Row>
          <Textarea
            label={"Description"}
            rows={5}
            value={description}
            styles={inputStyles}
            onChange={e => setDescription(e.target.value)}
          />
        </Row> */}
        {/* <Row>
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
        </Row> */}
        {/* {isPrivate && (
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
        )} */}
        {error && <Error>{error}</Error>}
      </Container>
      <Buttons>
        <Button type={"primary"} onClick={submit}>
          Update
        </Button>
      </Buttons>
    </>
  );
};

Index.propTypes = {
  aboutBot: PropTypes.object.isRequired,
  getBotInstance: PropTypes.func.isRequired,
  updateBotInstance: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  aboutBot: state.botInstance.aboutBot,
});

const mapDispatchToProps = dispatch => ({
  getBotInstance: id => dispatch(getBotInstance(id)),
  updateBotInstance: (id, data) => dispatch(updateBotInstance(id, data)),
  notify: payload => dispatch(addNotification(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
