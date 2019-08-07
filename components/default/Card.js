import React from 'react';
import styled from '@emotion/styled';

export const Card = styled.div`
  position: relative;
  display: flex;
  text-align: center;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  width: 100%;
`;

export const CardBody = styled.div`
  flex: 1 1 auto;
  padding: 1.25rem;
`;

export const CardFooter = styled.div`
  padding: 0.75rem 1.25rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.125);
`;