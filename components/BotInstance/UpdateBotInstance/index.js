import React, { useEffect, useState,useRef } from "react";
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
import { getBotInstance, updateBotInstance, restartInstance} from "/store/botinstance/actions";
import {useRouter} from "next/router";
import RestartEditor from "../components/RestartEditor";
import Modal from "/components/default/Modal";

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
 restartInstance,
 notify,
}) => {
  const router = useRouter().query.id;
  const [botScript, setBotScript] = useState("");
  const [botPackageJSON, setBotPackageJSON] = useState( "");
  const [error, setError] = useState(null);
  const modal = useRef(null);
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
      updateBotInstance(aboutBot.id, convertBotData(botData))
        .then(() => {
          notify({ type: NOTIFICATION_TYPES.SUCCESS, message: "BotInstance updated!" });
          modal.current.open();
        })
        .catch(() =>
          notify({ type: NOTIFICATION_TYPES.ERROR, message: "Update failed!" })
        );
  };

  const restartSubmit = params => {
    console.log("params ",params);
    modal.current.close();
    restartInstance(aboutBot.id, params)
    .then(() => {
      notify({ type: NOTIFICATION_TYPES.SUCCESS, message: "BotInstance restarted!" });
    })
    .catch(() =>
      notify({ type: NOTIFICATION_TYPES.ERROR, message: "Restart failed!" })
    );
  };

  return (
    <>
      <Container>
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
        {error && <Error>{error}</Error>}
      </Container>
      <Modal
        ref={modal}
        title={"Restart bot instance"}
        contentStyles={css`
          overflow-x: visible;
          overflow-y: hidden;
        `}
        disableSideClosing
      >
        <RestartEditor
          onSubmit={restartSubmit}
          onClose={() => modal.current.close()}
          botInstance={aboutBot}
        />
      </Modal>
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
  restartInstance: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  aboutBot: state.botInstance.aboutBot,
});

const mapDispatchToProps = dispatch => ({
  getBotInstance: id => dispatch(getBotInstance(id)),
  updateBotInstance: (id, data) => dispatch(updateBotInstance(id, data)),
  restartInstance: (id, params) => dispatch(restartInstance(id, params)),
  notify: payload => dispatch(addNotification(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
