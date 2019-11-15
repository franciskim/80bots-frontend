import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Table, Thead } from '/components/default/Table';
import { Button } from '/components/default';
import {css} from '@emotion/core';
import {Select} from '../../../../../default/inputs';
import Modal from '../../../../../default/Modal';

const VARIANTS = {
  ALL: 'all',
  CURRENT: 'current'
};

const TYPES = {
  CSV: 'csv',
  JSON: 'json',
  IMAGE: 'image'
};

const EXPORT_TYPES = [
  { label: 'CSV', value: TYPES.CSV },
  { label: 'JSON', value: TYPES.JSON },
];

const EXPORT_VARIANTS = [
  { label: 'All', value: VARIANTS.ALL },
  { label: 'Current', value: VARIANTS.CURRENT },
];

const LinkTd = styled.td`
  cursor: pointer;
  color: ${ props => props.theme.colors.primary };
  &:hover {
    color: ${ props => props.theme.colors.clearBlue };
  }
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const Back = styled(Button)`
  padding: 0 5px;
  margin-right: 10px;
`;

const JsonType = ({ output, setCustomBack }) => {
  const [data, setData] = useState(output || []);
  const exportModal = useRef(null);

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
          if(row[key] && row[key].length) {
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
      <Modal title={'Choose export options'} ref={exportModal} contentStyles={css`overflow: visible;`}>
        {/*<Inputs>*/}
        {/*  <Select label={'Export Variant'} options={EXPORT_VARIANTS} value={exportVariant}*/}
        {/*    onChange={(option) => setExportVariant(option)} styles={selectStyles}*/}
        {/*  />*/}
        {/*  <Select label={'Export Data Type'} options={EXPORT_TYPES} defaultValue={exportType}*/}
        {/*    onChange={(option) => setExportType(option)} styles={selectStyles}*/}
        {/*  />*/}
        {/*</Inputs>*/}
        {/*<Buttons>*/}
        {/*  <Button type={'danger'} onClick={() => exportModal.current.close()}>Cancel</Button>*/}
        {/*  <Button type={'primary'} onClick={exportOutput}>Export</Button>*/}
        {/*</Buttons>*/}
      </Modal>
    </Table>
  );
};

JsonType.propTypes = {
  output:        PropTypes.array.isRequired,
  setCustomBack: PropTypes.func.isRequired,
};
export default JsonType;
