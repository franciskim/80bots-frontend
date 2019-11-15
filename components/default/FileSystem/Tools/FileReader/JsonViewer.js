import React, { useEffect, useState, useReducer, useRef } from 'react';
import styled from '@emotion/styled';
import {parseUrl} from '/lib/helpers';
import {lookup} from 'mime-types';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
const ReactJson = dynamic(import('react-json-view'), { ssr: false });
import {Textarea as BaseTextarea} from '/components/default/inputs';
import BaseButton from '/components/default/Button';
import JsonTableModeView from './JsonTableModeView';
import _ from 'lodash';
import {Loader} from '/components/default/Loader';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  flex-wrap: nowrap;
  flex-direction: column;
`;

const Textarea = styled(BaseTextarea)`
  height: 100%;
  width: 100%;
  padding: 15px;
`;

const Viewer = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: nowrap;
  flex-direction: column;
  overflow: hidden;
`;

const Controls = styled.div`
  flex-direction: row;
  width: 100%;
  text-align: left;
  margin-bottom: 15px;
  margin-top: 15px;
`;

const Button = styled(BaseButton)`
  margin-right: 10px;
`;

const ReactJsonWrapper = styled.div`
  display: block;
  text-align: left;
  overflow-y: scroll;
  width: 100%;
`;

const MODS = {
  STRUCTURED: 2,
  RAW: 1,
  TABLE: 3,
};

const TextViewer = ({item}) => {
  const [jsonRaw, setJsonRaw] = useState(null);
  const [json, setJson] = useState(null);
  const [mode, setMode] = useState(MODS.STRUCTURED);
  const [error, serError] = useState('');
  const [availableMods, setAvailableMods] = useState([MODS.RAW]);
  const [valid, setValid] = useState(false);

  const onLoaded = (res) => {
    const enc = new TextDecoder('utf-8');
    const newText = enc.decode(res);
    setValid(true);
    setJsonRaw(newText);
    try {
      const jsonData = JSON.parse(newText);
      setJson(jsonData);
    } catch (e) {
      return setValid(false);
    }
  };

  const onError = (err) => {
    serError(err);
    return null;
  };

  const renderByMode = () => {
    switch (mode) {
      case MODS.RAW: {
        return <Textarea disabled value={jsonRaw} onChange={() => null}/>;
      }
      case MODS.STRUCTURED: {
        return json && <ReactJsonWrapper><ReactJson src={json} name={null} /></ReactJsonWrapper>;
      }
      case MODS.TABLE: {
        return _.isArray(json) && <JsonTableModeView output={json} />;
      }
    }
  };

  useEffect(() => {
    parseUrl(item.url, lookup(item.url), onLoaded, onError);
  }, [item]);

  const getLink = (item, dataString) => {
    const data = btoa(dataString);
    const mime = lookup(item.path);
    return `data:${mime};base64,${data}`;
  };

  return (
    <Wrapper>
      {
        jsonRaw ?
          <>
            <Controls>
              <strong>View mode: </strong>
              {
                Object.keys(MODS).filter(modeName => {
                  if(MODS[modeName] === MODS.TABLE && !_.isArray(json)) {
                    return false;
                  }
                  return MODS[modeName] > 0;
                }).map((modeName, i) => {
                  return (
                    <Button
                      type={mode === MODS[modeName] ? 'success' : 'primary' }
                      key={i}
                      onClick={() => setMode(MODS[modeName])}
                    >
                      {_.startCase(_.toLower(modeName))}
                    </Button>
                  );
                })
              }
            </Controls>
            <Viewer>
              {
                valid ?
                  renderByMode(item) :
                  <div>Could not parse json file. Click <a href={getLink(item, jsonRaw)} download={`${item.name}.json`} target={'_blank'}>here</a> to download</div>
              }
            </Viewer>
          </> :
          <Loader type={'spinning-bubbles'} width={100} height={100} caption={'Loading file..'}/>
      }
    </Wrapper>
  );
};

TextViewer.propTypes = {
  item: PropTypes.object
};

export default TextViewer;