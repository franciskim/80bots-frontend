import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { connect } from "react-redux";
import { useTheme } from "emotion-theming";
import { CardBody } from "/components/default/Card";
import { Loader } from "/components/default";

const Content = styled(CardBody)`
  display: flex;
  height: 85vh;
  flex-flow: row wrap;
  justify-content: space-between;
  ${props => props.styles};
`;

const Display = styled.iframe`
  display: flex;
  flex: 1 1;
  border: none;
  ${props => props.styles};
`;

const STATUSES = {
  LOAD: "Loading Display"
};

const DisplayTab = ({ botInstance }) => {
  const [status, setStatus] = useState(STATUSES.LOAD);
  const theme = useTheme();

  return (
    <Content>
      <Display
        onLoad={() => setStatus(null)}
        styles={
          status &&
          css`
            display: none;
          `
        }
        id={"display"}
        src={`http://${botInstance.ip}:6080?autoconnect=1`}
      />
      {status && (
        <Loader
          type={"spinning-bubbles"}
          width={100}
          height={100}
          color={theme.colors.primary}
          caption={status}
        />
      )}
    </Content>
  );
};

DisplayTab.propTypes = {
  botInstance: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  botInstance: state.bot.botInstance
});

export default connect(mapStateToProps, null)(DisplayTab);
