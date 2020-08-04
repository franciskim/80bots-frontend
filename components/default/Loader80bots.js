import React, {useEffect, useState} from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";

const LoaderContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Loader80bots = ({ data, styled, ...props }) => {

  useEffect(() => {
    if (data === "light") {
      setIcon("/images/loader/80bots_loader_light.svg");
    } else if (data === "dark") {
      setIcon("/images/loader/80bots_loader_dark.svg");
    }
  }, [data]);

  const [icon, setIcon] = useState("");

  return (
    <LoaderContainer>
      <object
        type="image/svg+xml"
        data={icon}
        className={"loader80bots"}
        style={styled}
      />
    </LoaderContainer>
  );
};

Loader80bots.propTypes = {
  data: PropTypes.oneOf(["light", "dark"]),
  styled: PropTypes.object,
};

export default Loader80bots;
