import React from 'react';
import PropTypes from 'prop-types';
import { Table, Thead } from 'components/default/Table';

const JsonType = ({ output }) => {

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
    for (let key in row) {
      if(row.hasOwnProperty(key)) {
        rowData.push(<td key={row[key]}>{ row[key] }</td>);
      }
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
        output[0] && <Thead>
          <tr>
            { getHeader(output[0]) }
          </tr>
        </Thead>
      }
      <tbody>
        { output.map(renderRow) }
      </tbody>
    </Table>
  );
};

JsonType.propTypes = {
  output: PropTypes.array.isRequired,
};
export default JsonType;
