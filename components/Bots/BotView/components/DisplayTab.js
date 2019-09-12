import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { CardBody } from 'components/default/Card';

const Content = styled(CardBody)`
  display: flex;
  height: 85vh;
  flex-flow: row wrap;
  justify-content: space-between;
  ${ props => props.styles };
`;

const Display = styled.iframe`
  display: flex;
  flex: 1 1;
  border: none;
`;

const DisplayTab = ({ botInstance }) => <Content>
  <Display src={`http://${botInstance.ip}:6080`}/>
</Content>;

DisplayTab.propTypes = {
  botInstance: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  botInstance: state.bot.botInstance
});

export default connect(mapStateToProps, null)(DisplayTab);
