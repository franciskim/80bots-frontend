import React, { useState } from "react";
import styled from "@emotion/styled";
import ImagesType from "./components/ImagesType";
import JsonType from "./components/JsonType";
import { keyframes } from "@emotion/core";
import { CardBody } from "/components/default/Card";
import { Button, Loader80bots } from "/components/default";
import FilesType from "./components/FileType";

const OUTPUT_TYPES = {
  JSON: {
    value: "json",
    label: "JSON"
  },
  IMAGES: {
    value: "images",
    label: "Images"
  },
  FILES: {
    value: "files",
    label: "Files"
  }
};

const Content = styled(CardBody)`
  display: flex;
  flex-flow: column;
  ${props => props.styles};
`;

const TypesNavigation = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 23px;
`;

const Fade = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const Type = styled(Button)`
  padding: 0 5px;
  animation: ${Fade} 200ms ease-in;
`;

const Hint = styled.span`
  font-size: 14px;
  color: #fff;
`;

// eslint-disable-next-line react/prop-types
const OutputTab = ({ setCustomBack }) => {
  const [currentType, setCurrentType] = useState(OUTPUT_TYPES.JSON);

  const renderCurrentType = () => {
    switch (currentType.value) {
      case OUTPUT_TYPES.IMAGES.value:
        return <ImagesType setCustomBack={setCustomBack} />;
      case OUTPUT_TYPES.JSON.value:
        return <JsonType setCustomBack={setCustomBack} />;
      case OUTPUT_TYPES.FILES.value:
        return <FilesType setCustomBack={setCustomBack} />;
      default:
        return (
          <Loader80bots
            data={"light"}
            styled={{
              width: "200px"
            }}
          />
        );
    }
  };

  return (
    <>
      <Content>
        <TypesNavigation>
          {Object.values(OUTPUT_TYPES).map((item, i, all) => {
            const variant =
              item.value === currentType.value ? "success" : "primary";
            return (
              <>
                <Type
                  key={i}
                  type={variant}
                  onClick={() => setCurrentType(item)}
                >
                  {item.label}
                </Type>
                {all.length - 1 > i && <Hint>&nbsp;|&nbsp;</Hint>}
              </>
            );
          })}
        </TypesNavigation>
        {renderCurrentType()}
      </Content>
    </>
  );
};

export default OutputTab;
