import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Table, Thead } from 'components/default/Table';
import { Button } from 'components/default';

const LinkTd = styled.td`
  cursor: pointer;
  color: ${ props => props.theme.colors.primary };
  &:hover {
    color: ${ props => props.theme.colors.clearBlue };
  }
`;

const Back = styled(Button)`
  padding: 0 5px;
  margin-right: 10px;
`;

const JsonType = ({ output, setCustomBack }) => {
  const [data, setData] = useState(output || []);

  const BackButton = <Back type={'danger'} onClick={() => { setData(output); setCustomBack(null); }}>Back</Back>;

  useEffect(() => {
    if(output) {
      setData(output);
    }
  }, [output]);

  const viewNestedData = data => {
    setData(data);
    setCustomBack(BackButton);
  };

  const getHeader = (row) => {
    let columns = [];
    for (let key in row) {
      if(row.hasOwnProperty(key)) {
        columns.push(<th key={key}>{ key }</th>);
      }
    }
    return columns;
  };

  const renderRow = (row, idx) => {
    let rowData = [];
    let rowIdx = 0;
    for (let key in row) {
      if(row.hasOwnProperty(key)) {
        if(typeof row[key] !== 'object') {
          rowData.push(<td key={rowIdx}>{ row[key] }</td>);
        } else {
          if(row[key].length) {
            rowData.push(<LinkTd onClick={() => viewNestedData(row[key])} key={rowIdx}>{ `See ${key}` }</LinkTd>);
          } else {
            rowData.push(<td key={rowIdx}>{ `No ${key}` }</td>);
          }
        }
      }
      rowIdx++;
    }
    return(
      <tr key={idx}>
        { rowData }
      </tr>
    );
  };

  return (
    <Table>
      {
        data[0] && <Thead>
          <tr>
            { getHeader(data[0]) }
          </tr>
        </Thead>
      }
      <tbody>
        { data.map(renderRow) }
      </tbody>
    </Table>
  );
};

JsonType.propTypes = {
  output:        PropTypes.array.isRequired,
  setCustomBack: PropTypes.func.isRequired,
};
export default JsonType;
