import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { connect } from "react-redux";
import { CardBody } from "/components/default/Card";
import { Loader80bots } from "/components/default";

const Content = styled(CardBody)`
  display: flex;
  height: 85vh;
  flex-flow: row wrap;
  flex-direction: column;
  ${props => props.styles};
`;

const Display = styled.iframe`
  display: flex;
  flex: 1 1;
  border: none;
  ${props => props.styles};
`;

const Link = styled.a`
  padding: 20px;
  text-align: right;
  display: block;
`;

const STATUSES = {
  LOAD: "Loading Display"
};

const DisplayTab = ({ botInstance }) => {
  const [status, setStatus] = useState(STATUSES.LOAD);

  return (
    <Content>
      <Link
        href={`http://${botInstance.ip}:6080?autoconnect=1&password=Uge9uuro`}
        target="_blank"
      >
        View bot in real-time
      </Link>
      <Display
        onLoad={() => setStatus(null)}
        styles={
          status &&
          css`
            display: none;
          `
        }
        id={"display"}
        src={`http://${botInstance.ip}:6080?autoconnect=1&password=Uge9uuro`}
      />
      {status && (
        <Loader80bots
          data={"light"}
          styled={{
            width: "200px"
          }}
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
