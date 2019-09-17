import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Modal from 'components/default/Modal';
import { Table, Thead, Filters, ListFilter } from 'components/default/Table';
import { connect } from 'react-redux';
import { CardBody } from 'components/default/Card';
import { addExternalListener, emitExternalMessage, removeAllExternalListeners } from 'store/socket/actions';
import { Button } from 'components/default';
import { Select } from 'components/default/inputs';
import { css } from '@emotion/core';
import { arrayToCsv } from 'lib/helpers';

const EVENTS = {
  OUTPUT: 'output',
  FOLDERS: 'output_folders',
  FULL: 'output_full'
};

const MESSAGES = {
  GET_OUTPUT: 'get_output',
  GET_FOLDERS: 'get_output_folders',
  GET_FULL_OUTPUT: 'get_full_output'
};

const TYPES = {
  CSV: 'csv',
  JSON: 'json'
};

const VARIANTS = {
  ALL: 'all',
  CURRENT: 'current'
};

const Content = styled(CardBody)`
  display: flex;
  height: 85vh;
  flex-flow: row wrap;
  justify-content: space-between;
  ${ props => props.styles };
`;

// useless right now
const Tbody = styled.tbody`
  overflow-y: scroll;
`;

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

const FiltersSection = styled(Filters)`
  display: flex;
  width: 100%;
  align-self: flex-start;
  justify-content: space-between;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const EXPORT_TYPES = [
  { label: 'CSV', value: TYPES.CSV },
  { label: 'JSON', value: TYPES.JSON },
];

const EXPORT_VARIANTS = [
  { label: 'All', value: VARIANTS.ALL },
  { label: 'Current', value: VARIANTS.CURRENT },
];

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const selectStyles = {
  container: css`align-items: flex-start; margin-bottom: 10px;`,
  select: {
    container: (provided) => ({ ...provided, width: '100%' }),
    menuPortal: base => ({...base, zIndex: 4})
  }
};

const OutputTab = ({ botInstance, addExternalListener, removeAllExternalListeners, emitExternalMessage }) => {
  const [output, setOutput] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [exportVariant, setExportVariant] = useState(EXPORT_VARIANTS[0]);
  const [exportType, setExportType] = useState(EXPORT_TYPES[0]);
  const [fullOutput, setFullOutput] = useState(null);

  const exportModal = useRef(null);

  useEffect(() => {
    return () => { removeAllExternalListeners(); };
  }, []);

  useEffect(() => {
    if(botInstance && Object.keys(botInstance).length > 0) {
      const handshake = { id: botInstance.instance_id };
      addExternalListener(`${botInstance.ip}:6002`, handshake, EVENTS.OUTPUT, (output) => {
        setOutput(output);
      });
      addExternalListener(`${botInstance.ip}:6002`, handshake, EVENTS.FOLDERS, (folders) => {
        setFolders(folders);
        if(folders.length > 0) setCurrentFolder(folders[folders.length - 1]);
      });
      addExternalListener(`${botInstance.ip}:6002`, handshake, EVENTS.FULL, (data) => {
        if(data) setFullOutput(data);
      });
      emitExternalMessage(MESSAGES.GET_FOLDERS, null, `${botInstance.ip}:6002`, handshake);
    }
  }, [botInstance]);

  useEffect(() => {
    if(currentFolder) {
      emitExternalMessage(MESSAGES.GET_OUTPUT, { folder: currentFolder });
    }
  }, [currentFolder]);

  useEffect(() => {
    if(fullOutput) {
      switch (exportType.value) {
        case TYPES.JSON:
          return download(JSON.stringify(fullOutput), 'application/json', 'output.json');
        case TYPES.CSV: {
          let data = '';
          for (let key in fullOutput) {
            if(fullOutput.hasOwnProperty(key)) {
              data += arrayToCsv(fullOutput[key]);
            }
          }
          return download(data, 'text/csv', 'output.csv');
        }
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
              JSON.stringify(output), 'application/json', `${currentFolder}.json`);
          case TYPES.CSV:
            return download(arrayToCsv(output), 'text/csv', `${currentFolder}.csv`);
        }
        break;
      }
      case VARIANTS.ALL:
        return emitExternalMessage(MESSAGES.GET_FULL_OUTPUT, null);
    }
  };

  return(
    <>
      <Content>
        {
          folders.length
            ? <FiltersSection>
              <ListFilter onChange={({value}) => setCurrentFolder(value)}
                options={folders.map(item => ({value: item, label: item}))}
              />
              <Actions>
                <Action type={'primary'} onClick={() => exportModal.current.open()}>Export</Action>
              </Actions>
            </FiltersSection>
            : null
        }
        <Table>
          {
            output[0] && <Thead>
              <tr>
                { getHeader(output[0]) }
              </tr>
            </Thead>
          }
          <Tbody>
            { output.map(renderRow) }
          </Tbody>
        </Table>
      </Content>
      <Modal title={'Choose export options'} ref={exportModal} contentStyles={css`overflow: visible;`}>
        <Inputs>
          <Select label={'Export Variant'} options={EXPORT_VARIANTS} value={exportVariant}
            onChange={(option) => setExportVariant(option)} styles={selectStyles}
            menuPortalTarget={document.body}
            menuPosition={'absolute'} menuPlacement={'bottom'}
          />
          <Select label={'Export Data Type'} options={EXPORT_TYPES} defaultValue={exportType}
            onChange={(option) => setExportType(option)} styles={selectStyles}
            menuPortalTarget={document.body}
            menuPosition={'absolute'} menuPlacement={'bottom'}
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

OutputTab.propTypes = {
  addExternalListener:        PropTypes.func.isRequired,
  emitExternalMessage:        PropTypes.func.isRequired,
  removeAllExternalListeners: PropTypes.func.isRequired,
  setCustomBack:              PropTypes.func.isRequired,
  botInstance:                PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  botInstance: state.bot.botInstance
});

const mapDispatchToProps = dispatch => ({
  addExternalListener: (...args) => dispatch(addExternalListener(...args)),
  emitExternalMessage: (...args) => dispatch(emitExternalMessage(...args)),
  removeAllExternalListeners: () => dispatch(removeAllExternalListeners())
});

export default connect(mapStateToProps, mapDispatchToProps)(OutputTab);
