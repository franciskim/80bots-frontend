import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Modal from 'components/default/Modal';
import ScreenShot from '../ScreenShot';
import { Table, Thead, Filters, ListFilter } from 'components/default/Table';
import { connect } from 'react-redux';
import { CardBody } from 'components/default/Card';
import { addExternalListener, emitExternalMessage, removeAllExternalListeners } from 'store/socket/actions';
import { Button } from 'components/default';
import { Select } from 'components/default/inputs';
import {css, keyframes} from '@emotion/core';
import { arrayToCsv } from 'lib/helpers';

const EVENTS = {
  AVAILABLE: 'output.available',
  FOLDERS: 'output.folders',
  OUTPUT: 'output.data',
  FULL: 'output.full',
};

const MESSAGES = {
  GET_AVAILABLE: 'output.available',
  GET_FOLDERS: 'output.folders',
  SELECT_TYPE: 'output.set',
  GET_OUTPUT: 'output.data',
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

const OUTPUT_TYPES = {
  IMAGES: {
    value: 'images',
    label: 'Images'
  },
  JSON: {
    value: 'json',
    label: 'JSON'
  }
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

const Fade = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const Image = styled(ScreenShot)`
  margin-bottom: 20px;
  margin-right: 20px;
  animation: ${Fade} 200ms ease-in-out;
  ${ props => props.styles };
  ${ props => props.selected && css`
    box-shadow: 0 0 10px ${ props.theme.colors.darkishPink };
    border: 1px solid ${ props.theme.colors.darkishPink };
  `}
`;

const ImageViewer = styled.div`
  top: 0;
  left: 0;
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, .8);
  img {
    width: calc(100vw - 400px); 
    height: calc(100vh - 200px);
  }
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
    container: (provided) => ({ ...provided, width: '100%' })
  }
};

const OutputTab = ({ botInstance, listen, removeAllListeners, emit }) => {
  const [output, setOutput] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentType, setCurrentType] = useState(OUTPUT_TYPES.JSON);
  const [currentImage, setCurrentImage] = useState(null);
  const [exportVariant, setExportVariant] = useState(EXPORT_VARIANTS[0]);
  const [exportType, setExportType] = useState(EXPORT_TYPES[0]);
  const [fullOutput, setFullOutput] = useState(null);

  const exportModal = useRef(null);

  useEffect(() => {
    return () => { removeAllListeners(); };
  }, []);

  useEffect(() => {
    if(botInstance && Object.keys(botInstance).length > 0) {
      const handshake = { id: botInstance.instance_id };
      listen(`${botInstance.ip}:6002`, handshake, EVENTS.OUTPUT, output => {
        setOutput(output);
      });
      listen(`${botInstance.ip}:6002`, handshake, EVENTS.FOLDERS, (folders) => {
        setFolders(folders);
        if(folders.length > 0) setCurrentFolder(folders[folders.length - 1]);
      });
      listen(`${botInstance.ip}:6002`, handshake, EVENTS.FULL, (data) => {
        if(data) {
          const parsed = data.reduce((all, current) =>
            all.concat(current), []
          );
          setFullOutput(parsed);
        }
      });
    }
  }, [botInstance]);

  useEffect(() => {
    if(currentType && botInstance && Object.keys(botInstance).length > 0)
      emit(MESSAGES.GET_FOLDERS, { type: currentType.value } );
  }, [currentType, botInstance]);

  useEffect(() => {
    if(currentFolder) emit(MESSAGES.GET_OUTPUT, { folder: currentFolder, type: currentType.value });
  }, [currentFolder]);

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
              JSON.stringify(output), 'application/json', `${currentFolder}.json`);
          case TYPES.CSV:
            return download(arrayToCsv(output), 'text/csv', `${currentFolder}.csv`);
        }
        break;
      }
      case VARIANTS.ALL:
        return emit(MESSAGES.GET_FULL, { type: currentType.value });
    }
  };

  const toFile = (item) => {
    const blob = new Blob([item.thumbnail || item.data], { type: 'image/jpg' });
    return new File([blob], item.name, { type: 'image/jpg' });
  };

  const toImage = (item) => ({ src: URL.createObjectURL(toFile(item)), caption: item.name, ...item });

  const renderImages = (item, idx) => {
    if(item.data) {
      item = toImage(item);
      return <Image styles={css`margin-right: 0`} key={idx} src={item.src}
        caption={item.caption} onClick={() => setCurrentImage(item)}
      />;
    }
  };

  return(
    <>
      <Content>
        {
          <FiltersSection>
            <ListFilter onChange={option => setCurrentType(option)} options={Object.values(OUTPUT_TYPES).reverse()} />
            {
              folders.length > 0 && <ListFilter label={'Time'} onChange={({value}) => setCurrentFolder(value)}
                options={folders.map(item => ({value: item, label: item})).reverse()}
              />
            }
            <Actions>
              <Action type={'primary'} onClick={() => exportModal.current.open()}>Export</Action>
            </Actions>
          </FiltersSection>
        }
        {
          currentType.value === OUTPUT_TYPES.JSON.value
            ? <Table>
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
            : output.map(renderImages)
        }
      </Content>
      {
        currentImage && <ImageViewer onClick={() => setCurrentImage(null)}>
          <img onClick={e => e.stopPropagation()} alt={currentImage.caption} src={currentImage.src}/>
        </ImageViewer>
      }
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

OutputTab.propTypes = {
  listen:             PropTypes.func.isRequired,
  emit:               PropTypes.func.isRequired,
  removeAllListeners: PropTypes.func.isRequired,
  setCustomBack:      PropTypes.func.isRequired,
  botInstance:        PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  botInstance: state.bot.botInstance
});

const mapDispatchToProps = dispatch => ({
  listen: (...args) => dispatch(addExternalListener(...args)),
  emit: (...args) => dispatch(emitExternalMessage(...args)),
  removeAllListeners: () => dispatch(removeAllExternalListeners())
});

export default connect(mapStateToProps, mapDispatchToProps)(OutputTab);
