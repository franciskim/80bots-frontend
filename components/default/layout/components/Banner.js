import React from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.purple};
  margin-bottom: 1rem;
  padding: 1rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border-radius: 0.25rem;
  color: rgba(255, 255, 255, 0.5);
`;

const Banner = () => {
  return (
    <Container>
      <h4 className="border mb-0 mr-2 pb-2 pl-3 pr-3 pt-2 rounded text-white">
        8
      </h4>
      <div className="lh-100">
        <h6 className="mb-0 text-white lh-100">80bots</h6>
        <small>Since 2018</small>
      </div>
    </Container>
  );
};

export default Banner;
