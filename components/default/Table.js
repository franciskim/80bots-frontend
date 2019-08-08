import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

export const Table = styled.table`
  width: 100%;
  color: #212529;
  border-collapse: collapse;
  vertical-align: middle;
  td, th {
    text-align: start;
    padding: 0.75rem;
    border-top: 1px solid #dee2e6;
  }
`;

Table.propTypes = {
  responsive: PropTypes.bool
};

export const Thead = styled.thead`
  tr {
    background-color: #e8e9ef;
    color: #868e96;
    text-transform: uppercase;
    border: none;
    th {
      font-weight: 300;
      border: none;
    }
  }
`;