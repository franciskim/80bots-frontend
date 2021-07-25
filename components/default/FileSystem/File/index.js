import React from "react";
import PropTypes from "prop-types";
import styled from 'styled-components';
import CardWithPreview from "../../CardWithPreview";
import {formatScreenshot, formatTimezone} from "../../../../lib/helpers";
import {connect} from "react-redux";

const Fade = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const Wrapper = styled(CardWithPreview)`
  position: relative;
  margin-bottom: 20px;
  margin-right: 20px;
  animation: ${Fade} 200ms ease-in-out;
  ${props => props.styles};
`;

const TemplateList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
`;

const Date = styled.span`
  color: rgb(125, 255, 255);
`;

export const TYPE = "file";

const File = ({ item, onClick, user }) => {

  const formatName = formatScreenshot(item.name);
  const formatDate = formatTimezone(user.timezone, formatName);

  return (
    <TemplateList>
      <Wrapper
        selected={item.selected}
        src={item.url}
        caption={item.name}
        onClick={() => onClick(item)}
      />
      {/*<Date>{formatDate}</Date>*/}
    </TemplateList>
  );
};

File.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(
  mapStateToProps
)(File);
