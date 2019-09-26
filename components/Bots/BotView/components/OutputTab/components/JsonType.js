import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/default/Modal';
import { Table, Thead } from 'components/default/Table';
import { css } from '@emotion/core';
import { Select } from 'components/default/inputs';
import { Button } from 'components/default';
import { connect } from 'react-redux';
import { addExternalListener, emitExternalMessage, removeExternalListener } from 'store/socket/actions';
import { arrayToCsv } from 'lib/helpers';
import styled from '@emotion/styled';

const EVENTS = {
  FULL: 'output.full',
};

const MESSAGES = {
  GET_FULL: 'output.full'
};

const TYPES = {
  CSV: 'csv',
  JSON: 'json'
};

const VARIANTS = {
  ALL: 'all',
  CURRENT: 'current'
};

const EXPORT_TYPES = [
  { label: 'CSV', value: TYPES.CSV },
  { label: 'JSON', value: TYPES.JSON },
];

const EXPORT_VARIANTS = [
  { label: 'All', value: VARIANTS.ALL },
  { label: 'Current', value: VARIANTS.CURRENT },
];

const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Action = styled(Button)`
  padding: 5px 10px;
  margin-right: 10px;
  &:last-child {
    margin-right: 0;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const selectStyles = {
  container: css`align-items: flex-start; margin-bottom: 10px;`,
  select: {
    container: (provided) => ({ ...provided, width: '100%' })
  }
};

const JsonType = ({ output, folder, type, emit, listen, botInstance }) => {
  const [exportVariant, setExportVariant] = useState(EXPORT_VARIANTS[0]);
  const [exportType, setExportType] = useState(EXPORT_TYPES[0]);
  const [fullOutput, setFullOutput] = useState(null);

  const exportModal = useRef(null);

  useEffect(() => {
    if(botInstance && Object.keys(botInstance).length > 0) {
      const handshake = { id: botInstance.instance_id };
/*      listen(`${botInstance.ip}:6002`, handshake, EVENTS.FULL, (data) => {
        if(data) {
          const parsed = data.reduce((all, current) =>
            all.concat(current), []
          );
          setFullOutput(parsed);
        }
      });*/
    }
  }, []);

  useEffect(() => {
    if(fullOutput) {
      switch (exportType.value) {
        case TYPES.JSON:
          return download(JSON.stringify(fullOutput), 'application/json', 'output.json');
        case TYPES.CSV:
          return download(arrayToCsv(fullOutput), 'text/csv', 'output.csv');
      }
      setFullOutput(null);
    }
  }, [fullOutput]);

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

  const download = (data, type, name) => {
    const blob = new Blob([data], { type });
    const file = new File([blob], name, { type });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
    }, 0);
  };

  const exportOutput = () => {
    switch (exportVariant.value) {
      case VARIANTS.CURRENT: {
        switch (exportType.value) {
          case TYPES.JSON:
            return download(
              JSON.stringify(output), 'application/json', `${folder}.json`);
          case TYPES.CSV:
            return download(arrayToCsv(output), 'text/csv', `${folder}.csv`);
        }
        break;
      }
      case VARIANTS.ALL:
        return emit(MESSAGES.GET_FULL, { type });
    }
  };

  return (
    <>
      <Actions>
        <Action type={'primary'} onClick={() => exportModal.current.open()}>Export</Action>
      </Actions>
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
      <Modal title={'Choose export options'} ref={exportModal} contentStyles={css`overflow: visible;`}>
        <Inputs>
          <Select label={'Export Variant'} options={EXPORT_VARIANTS} value={exportVariant}
            onChange={(option) => setExportVariant(option)} styles={selectStyles}
          />
          <Select label={'Export Data Type'} options={EXPORT_TYPES} defaultValue={exportType}
            onChange={(option) => setExportType(option)} styles={selectStyles}
          />
        </Inputs>
        <Buttons>
          <Button type={'primary'} onClick={exportOutput}>Export</Button>
          <Button type={'danger'} onClick={() => exportModal.current.close()}>Cancel</Button>
        </Buttons>
      </Modal>
    </>
  );
};

JsonType.propTypes = {
  botInstance: PropTypes.object.isRequired,
  listen:      PropTypes.func.isRequired,
  remove:      PropTypes.func.isRequired,
  folder:      PropTypes.string.isRequired,
  output:      PropTypes.array.isRequired,
  emit:        PropTypes.func.isRequired,
  type:        PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  botInstance: state.bot.botInstance
});

const mapDispatchToProps = dispatch => ({
  listen: (...args) => dispatch(addExternalListener(...args)),
  emit: (...args) => dispatch(emitExternalMessage(...args)),
  remove: () => dispatch(removeExternalListener())
});

export default connect(mapStateToProps, mapDispatchToProps)(JsonType);
