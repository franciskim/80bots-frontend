import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Folder, { TYPE as FOLDER_TYPE } from "./Folder";
import File, { TYPE as FILE_TYPE } from "./File";

const ItemFallback = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const renderByType = (item, props) => {
  const { type } = item;
  const { onClick } = props;
  switch (type) {
    case FOLDER_TYPE: {
      return <Folder item={item} onClick={onClick} />;
    }
    case FILE_TYPE: {
      return <File item={item} onClick={onClick} />;
    }
    default: {
      return <ItemFallback>{"Can't process item type"}</ItemFallback>;
    }
  }
};

const Item = ({ item, ...props }) => renderByType(item, props);

Item.propTypes = {
  item: PropTypes.object.isRequired
};

export default Item;
