import React, { useEffect, useRef, useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import ScreenShot from './ScreenShot';
import Modal from 'components/default/Modal';
import ReportEditor from './ReportIssue';
import { css, keyframes } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import { connect } from 'react-redux';
import { CardBody } from 'components/default/Card';
import { addExternalListener, emitExternalMessage, removeAllExternalListeners } from 'store/socket/actions';
import { Loader, Button, Paginator } from 'components/default';
import { Filters } from 'components/default/Table';
import { theme } from 'config';

const EVENTS = {
  FOLDERS: 'folders',
  SCREENSHOTS: 'screenshots',
  SCREENSHOT: 'screenshot'
};

const MESSAGES = {
  GET_FOLDERS: 'get_folders',
  GET_SCREENSHOTS: 'get_screenshots'
};

const Fade = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const Content = styled(CardBody)`
  display: flex;
  flex-flow: column wrap;
  height: 77vh;
  ${ props => props.styles };
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

const Back = styled(Button)`
  padding: 0 5px;
  margin-right: 10px;
`;

const Report = styled(Button)`
  padding: 0 5px;
  animation: ${Fade} 200ms ease-in;
`;

const FiltersSection = styled(Filters)`
  display: flex;
  align-self: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 20px 20px 0 20px;
`;

const ScreenShots = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  ${ props => props.styles };
`;

const Hint = styled.span`
  font-size: 14px;
  color: ${ props => props.theme.colors.grey };
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

const STATUSES = {
  FOLDERS: {
    label: 'Receiving Folders',
    color: theme.colors.primary
  },
  DATA: {
    label: 'Receiving Data',
    color: theme.colors.mediumGreen
  }
};

const ScreenShotTab = ({ botInstance, listen, removeAll, emit, setCustomBack }) => {
  const [folders, setFolders] = useState([]);
  const [offset, setOffset] = useReducer((state, offset) => offset, 0);
  const [limit, setLimit] = useState(20);
  const [fallback, setFallback] = useState(null);
  const [status, setStatus] = useState(STATUSES.FOLDERS);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [reportMode, setReportMode] = useState(false);
  const [issuedScreenshots, setIssuedScreenshots] = useState([]);

  const reportModal = useRef(null);

  const imagesReducer = (state, action) => {
    switch (action.type) {
      case EVENTS.SCREENSHOTS:
        return [...action.data];
      case EVENTS.SCREENSHOT: {
        if(state.length >= limit) {
          let temp = [...state];
          temp.pop();
          return [action.data, ...temp];
        } else {
          return [action.data, ...state];
        }
      }
    }
  };

  const [images, setImages] = useReducer(imagesReducer, []);

  const BackButton = <Back type={'primary'} onClick={() => setCurrentFolder(null)}>Back</Back>;

  useEffect(() => {
    return () => { removeAll(); };
  }, []);

  useEffect(() => {
    if(!reportMode) setIssuedScreenshots([]);
  }, [reportMode]);

  useEffect(() => {
    if(botInstance && Object.keys(botInstance).length > 0) {
      listen(EVENTS.FOLDERS, (folders) => {
        setStatus(null);
        setFolders(folders.map(toImage));
        setFallback(!folders.length && 'No folders are created');
      });
      listen(EVENTS.SCREENSHOTS, (screenshots) => {
        setStatus(null);
        setImages({ type: EVENTS.SCREENSHOTS, data: screenshots.map(toImage) });
      });
      listen(EVENTS.SCREENSHOT, (screenshot) => {
        if(offset === 0) {
          setImages({ type: EVENTS.SCREENSHOT, data: toImage(screenshot) });
        } else {
          setStatus(STATUSES.DATA);
          emit(MESSAGES.GET_SCREENSHOTS, { folder: currentFolder.date, offset, limit });
        }
      });
      emit(MESSAGES.GET_FOLDERS);
    }
  }, [botInstance]);

  useEffect(() => {
    if(currentFolder) {
      setStatus(STATUSES.DATA);
      emit(MESSAGES.GET_SCREENSHOTS, { folder: currentFolder.date, offset, limit });
      setCustomBack(BackButton);
    } else {
      setImages({ type: EVENTS.SCREENSHOTS, data: [] });
      setCustomBack(null);
    }
  }, [currentFolder, offset]);

  const toFile = (item) => {
    const blob = new Blob([item.thumbnail || item.data], { type: 'image/jpg' });
    return new File([blob], item.name, { type: 'image/jpg' });
  };

  const toImage = (item) => ({ src: URL.createObjectURL(toFile(item)), caption: item.name, ...item });

  const selectImage = image => {
    const idx = issuedScreenshots.findIndex(item => item.name === image.name);
    if(idx === -1) {
      setIssuedScreenshots([...issuedScreenshots, image]);
    } else {
      setIssuedScreenshots([...issuedScreenshots.slice(0, idx), ...issuedScreenshots.slice(idx + 1)]);
    }
  };

  return(
    <>
      {
        !status && currentFolder && <FiltersSection>
          { reportMode && <Hint>Select issued screenshots |&nbsp;</Hint> }
          <Report type={'danger'} onClick={() => setReportMode(!reportMode)}>
            { reportMode ? 'Cancel' : 'Report Issue' }
          </Report>
          {
            reportMode && <>
              <Hint>&nbsp;|&nbsp;</Hint>
              <Report type={'success'} onClick={() => reportModal.current.open()}>Proceed</Report>
            </>
          }
        </FiltersSection>
      }
      <Content>
        {
          !status
            ? fallback
              ? <Fallback>{ fallback }</Fallback>
              : <ScreenShots styles={!currentFolder && css`justify-content: flex-start;`}>
                {
                  !currentFolder
                    ? folders.map((item, idx) => <Image key={idx} src={item.src} caption={item.caption}
                      onClick={() => setCurrentFolder(item)} />)
                    : images.map((item, idx) => <Image styles={css`margin-right: 0`} key={idx} src={item.src}
                      selected={issuedScreenshots.findIndex(image => item.name === image.name) > -1}
                      caption={item.caption} onClick={() => reportMode ? selectImage(item) : setCurrentImage(item)}
                    />)
                }
              </ScreenShots>
            : <Loader type={'spinning-bubbles'} width={100} height={100} color={status.color}
              caption={status.label}
            />
        }
      </Content>
      {
        currentFolder && <Paginator total={currentFolder.total} pageSize={limit}
          onChangePage={page => setOffset((page * limit) - limit)}
        />
      }
      {
        currentImage && <ImageViewer onClick={() => setCurrentImage(null)}>
          <img onClick={e => e.stopPropagation()} alt={currentImage.caption} src={currentImage.src}/>
        </ImageViewer>
      }
      <Modal ref={reportModal} title={'Report Issue'} contentStyles={css`min-width: 420px; max-width: 420px;`}
        onClose={() => setReportMode(false)}
      >
        <ReportEditor bot={botInstance} screenshots={issuedScreenshots.map(toFile)}/>
      </Modal>
    </>
  );
};

ScreenShotTab.propTypes = {
  setCustomBack: PropTypes.func.isRequired,
  botInstance:   PropTypes.object.isRequired,
  removeAll:     PropTypes.func.isRequired,
  listen:        PropTypes.func.isRequired,
  theme:         PropTypes.shape({ colors: PropTypes.object.isRequired }).isRequired,
  emit:          PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  botInstance: state.bot.botInstance
});

const mapDispatchToProps = dispatch => ({
  listen: (...args) => dispatch(addExternalListener(...args)),
  emit: (...args) => dispatch(emitExternalMessage(...args)),
  removeAll: () => dispatch(removeAllExternalListeners())
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ScreenShotTab));
