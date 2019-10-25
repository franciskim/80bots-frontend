import React, { useEffect, useState, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Modal from '/components/default/Modal';
import ImagesType from './components/ImagesType';
import JsonType from './components/JsonType';
import { css, keyframes } from '@emotion/core';
import { connect } from 'react-redux';
import { Filters, ListFilter } from '/components/default/Table';
import { CardBody } from '/components/default/Card';
import { addExternalListener, emitExternalMessage, removeAllExternalListeners } from '/store/socket/actions';
import { Button, Loader, Paginator } from '/components/default';
import { Select } from '/components/default/inputs';
import { arrayToCsv, download } from '/lib/helpers';
import { theme } from '/config';

const EVENTS = {
  AVAILABLE: 'output.available',
  FOLDERS: 'output.folders',
  APPEND: 'output.append',
  OUTPUT: 'output.data',
  FULL: 'output.full'
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
  JSON: 'json',
  IMAGE: 'image'
};

const VARIANTS = {
  ALL: 'all',
  CURRENT: 'current'
};

const OUTPUT_TYPES = {
  IMAGES: {
    value: 'images',
    label: 'Images',
    component: ImagesType
  },
  JSON: {
    value: 'json',
    label: 'JSON',
    component: JsonType
  }
};

const Content = styled(CardBody)`
  display: flex;
  height: 85vh;
  flex-flow: column;
  ${ props => props.styles };
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Fade = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const Action = styled(Button)`
  padding: 0 5px;
  margin-right: 10px;
  animation: ${Fade} 200ms ease-in;
  &:last-child {
    margin-right: 0;
  }
`;

const FiltersSection = styled(Filters)`
  display: flex;
  width: 100%;
  align-self: flex-start;
  justify-content: space-between;
  height: 39px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Type = styled(Button)`
  padding: 0 5px;
  animation: ${Fade} 200ms ease-in;
`;

const Hint = styled.span` 
  font-size: 14px;
  color: ${ props => props.theme.colors.grey };
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

const Span = styled.span`
  font-size: 20px;
  color: ${ props => props.theme.colors.blueGrey };
`;

const Fallback = (props) => {
  const Div = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  `;
  return <Div><Span {...props}/></Div>;
};

const selectStyles = {
  container: css`align-items: flex-start; margin-bottom: 10px;`,
  select: {
    container: (provided) => ({ ...provided, width: '100%' })
  }
};

const STATUSES = {
  TYPES: {
    label: 'Receiving Available Output Types',
    color: theme.colors.darkishPink
  },
  FOLDERS: {
    label: 'Receiving Folders',
    color: theme.colors.primary
  },
  DATA: {
    label: 'Receiving Data',
    color: theme.colors.mediumGreen
  }
};

const outputReducer = (state, action) => {
  switch (action.type) {
    case EVENTS.OUTPUT:
      console.debug(action.data);
      return [...action.data];
    case EVENTS.APPEND: {
      return [...state].concat(action.data);
    }
  }
};

const OutputTab = ({ botInstance, listen, removeAllListeners, emit, setCustomBack }) => {
  const [output, setOutput] = useReducer(outputReducer, []);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [types, setTypes] = useState([]);
  const [currentType, setCurrentType] = useState(OUTPUT_TYPES.JSON);
  const [exportVariant, setExportVariant] = useState(EXPORT_VARIANTS[0]);
  const [exportType, setExportType] = useState(EXPORT_TYPES[0]);
  const [fullOutput, setFullOutput] = useState(null);
  const [offset, setOffset] = useReducer((state, offset) => offset, 0);
  const [limit, setLimit] = useState(20);
  const [status, setStatus] = useState(STATUSES.TYPES);
  const [fallback, setFallback] = useState(null);

  const exportModal = useRef(null);

  useEffect(() => {
    return () => { removeAllListeners(); };
  }, []);

  useEffect(() => {
    if(botInstance && Object.keys(botInstance).length > 0) {
      listen(EVENTS.AVAILABLE, (types) => {
        setStatus(null);
        setTypes(types);
        setFallback(!types.length && 'No available types was provided');
      });
      listen(EVENTS.OUTPUT, output => {
        setStatus(null);
        setOutput({ type: EVENTS.OUTPUT, data: output });
        setFallback(!output.length && 'No output was provided');
      });
      listen(EVENTS.FOLDERS, (folders) => {
        setStatus(null);
        setFolders(folders);
        setFallback(!folders.length && 'No folders are created');
        if(folders.length > 0) setCurrentFolder(folders[folders.length - 1]);
      });
      listen(EVENTS.FULL, (data) => {
        if(data) setFullOutput(data);
      });
      listen(EVENTS.APPEND, (data) => {
        if(data) setOutput({ type: EVENTS.APPEND, data }) ;
        setFallback(null);
      });
      emit(MESSAGES.GET_AVAILABLE);
    }
  }, [botInstance]);

  useEffect(() => {
    if(currentType && Object.keys(botInstance).length > 0) {
      emit(MESSAGES.GET_FOLDERS, { type: currentType.value } );
      setStatus(STATUSES.FOLDERS);
    }
  }, [currentType, botInstance]);

  useEffect(() => {
    if(currentFolder) {
      emit(MESSAGES.GET_OUTPUT, {
        folder: currentFolder.name || currentFolder,
        type: currentType.value, offset, limit
      });
      setStatus(STATUSES.DATA);
    }
  }, [currentFolder, offset]);

  useEffect(() => {
    if(fullOutput) {
      switch (exportType.value) {
        case TYPES.JSON: {
          const parsed = fullOutput.reduce((all, current) => all.concat(current), []);
          return download(JSON.stringify(parsed), 'output.json', 'application/json');
        }
        case TYPES.CSV: {
          const parsed = fullOutput.reduce((all, current) => all.concat(current), []);
          return download(arrayToCsv(parsed), 'output.csv', 'text/csv');
        }
        case TYPES.IMAGE: {
          setExportType(EXPORT_TYPES[0]);
          return download(fullOutput, 'images.zip', 'application/zip');
        }
      }
      setFullOutput(null);
    }
  }, [fullOutput]);

  const triggerExport = () => {
    if(currentType.value === OUTPUT_TYPES.JSON.value) {
      exportModal.current.open();
    } else {
      setExportType({ label: 'Image', value: TYPES.IMAGE });
      exportOutput();
    }
  };

  const exportOutput = () => {
    switch (exportVariant.value) {
      case VARIANTS.CURRENT: {
        switch (exportType.value) {
          case TYPES.JSON:
            return download(JSON.stringify(output), `${currentFolder}.json`, 'application/json');
          case TYPES.CSV:
            return download(arrayToCsv(output), `${currentFolder}.csv`, 'text/csv');
        }
        break;
      }
      case VARIANTS.ALL:
        return emit(MESSAGES.GET_FULL, { type: currentType.value });
    }
  };

  const renderTypes = (Wrapper, current, idx) => {
    const type = <Type key={idx} type={current.value === currentType.value ? 'success' : 'primary'}
      onClick={() => { setCurrentType(current); setOutput({ type: EVENTS.OUTPUT, data: [] }); }}
      disabled={!types.includes(current.value)}
    >
      { current.label }
    </Type>;
    if(Wrapper.props?.children) {
      Wrapper.props.children.push(
        <Hint key={-idx}>&nbsp;|&nbsp;</Hint>,
        type
      );
      return Wrapper;
    } else {
      return <Wrapper>{ [ type ] }</Wrapper>;
    }
  };

  const CurrentType = currentType.component;
  return(
    <>
      <Content>
        {
          !status
            ? <FiltersSection>
              { Object.values(OUTPUT_TYPES).reverse().reduce(renderTypes, Actions) }
              {
                folders.length > 0 && currentType.value === OUTPUT_TYPES.JSON.value &&
                <ListFilter label={'Time'} onChange={({value}) => setCurrentFolder(value)}
                  options={folders.map(item => ({value: item, label: item})).reverse()}
                  value={{ value: currentFolder?.name || currentFolder, label: currentFolder?.name || currentFolder }}
                />
              }
              <Actions>
                <Action type={'primary'} onClick={triggerExport}>Export</Action>
              </Actions>
            </FiltersSection>
            : <Loader type={'spinning-bubbles'} width={100} height={100} color={status.color}
              caption={status.label}
            />
        }
        {
          !status && fallback
            ? <Fallback>{ fallback }</Fallback>
            : <CurrentType output={output} setCustomBack={setCustomBack} />
        }
      </Content>
      {
        currentType.value === OUTPUT_TYPES.IMAGES.value
          ? <Paginator total={currentFolder?.total || 0} pageSize={limit}
            onChangePage={page => setOffset((page * limit) - limit)}
          /> : null
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
          <Button type={'danger'} onClick={() => exportModal.current.close()}>Cancel</Button>
          <Button type={'primary'} onClick={exportOutput}>Export</Button>
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
