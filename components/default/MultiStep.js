import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { theme } from 'config';
import {Button} from './Button';

const Container = styled.div`
  position: relative;
`;

/* Circles which indicates the steps of the form: */
const BlockCircleSteps = styled.div`
  text-align:center;
  margin-top:20px;
  margin-bottom:20px;
`;

/* Make circles that indicate the steps of the form: */
const CircleStep = styled.span`
  height: 15px;
  width: 15px;
  margin: 0 2px;
  background-color: #bbbbbb;
  border: none;
  border-radius: 50%;
  display: inline-block;
  opacity: 0.5;
`;

/* Mark the active step: */
const activeStepStyles = css`
  opacity: 1;
`;

/* Hide all steps by default: */
const TabStep = styled.div`
  display: block;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

export const MultiStep = ({ count, children, ...props }) => {

  const [step, setStep] = useState(1);

  const styles = css`
    ${ activeStepStyles };
  `;

  let listCircleStep = [];

  for (let i = 0; i < count; i++) {
    listCircleStep.push(<CircleStep key={i} />);
  }

  return(
    <Container>

      <BlockCircleSteps>
        {listCircleStep}
      </BlockCircleSteps>

      <TabStep>
        {children}
      </TabStep>

      <Buttons>
        <Button type={'primary'} onClick={() => console.log('Previous')}>Previous</Button>
        <Button type={'danger'} onClick={() => console.log('Next')}>Next</Button>
      </Buttons>

    </Container>
  );
};

MultiStep.propTypes = {
  count: PropTypes.number,
  children: PropTypes.any
};

export default MultiStep;