import React, { useEffect, useRef, useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import ScreenShot from './ScreenShot';
import Modal from 'components/default/Modal';
import { css, keyframes } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import { connect } from 'react-redux';
import { CardBody } from 'components/default/Card';
import { addExternalListener, emitExternalMessage, removeAllExternalListeners } from 'store/socket/actions';
import { Loader, Button, Paginator } from 'components/default';
import { Filters } from 'components/default/Table';
import ReportEditor from './ReportIssue';

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
  justify-content: space-between;
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

const ScreenShotTab = ({
  botInstance, addExternalListener, removeAllExternalListeners, emitExternalMessage, setCustomBack, theme
}) => {
  const [folders, setFolders] = useState([]);
  const [offset, setOffset] = useReducer((state, offset) => offset, 0);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
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
    return () => removeAllExternalListeners();
  }, []);

  useEffect(() => {
    if(!reportMode) setIssuedScreenshots([]);
  }, [reportMode]);

  useEffect(() => {
    if(botInstance && Object.keys(botInstance).length > 0) {
      const handshake = { id: botInstance.instance_id };
      addExternalListener(`${botInstance.ip}:6002`, handshake, EVENTS.FOLDERS, (folders) => {
        setLoading(false);
        setFolders(folders.map(toImage));
      });
      addExternalListener(`${botInstance.ip}:6002`, handshake, EVENTS.SCREENSHOTS, (screenshots) => {
        setLoading(false);
        setImages({ type: EVENTS.SCREENSHOTS, data: screenshots.map(toImage) });
      });
      addExternalListener(`${botInstance.ip}:6002`, handshake, EVENTS.SCREENSHOT, (screenshot) => {
        if(offset === 0) {
          setImages({ type: EVENTS.SCREENSHOT, data: toImage(screenshot) });
        } else {
          emitExternalMessage(MESSAGES.GET_SCREENSHOTS, { date: currentFolder.date, offset, limit });
        }
      });
    }
  }, [botInstance]);

  useEffect(() => {
    if(currentFolder) {
      setLoading(true);
      emitExternalMessage(MESSAGES.GET_SCREENSHOTS, { date: currentFolder.date, offset, limit });
      setCustomBack(BackButton);
    } else {
      setImages({ type: EVENTS.SCREENSHOTS, data: [] });
      setCustomBack(null);
    }
  }, [currentFolder, offset]);

  const toFile = (item) => {
    const blob = new Blob([item.thumbnail || item.data], { type: 'image/png' });
    return new File([blob], 'image.png', { type: 'image/png' });
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
      <Content styles={!currentFolder && css`justify-content: flex-start;`}>
        {
          !loading && currentFolder && <FiltersSection>
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
        <ScreenShots>
          {
            loading
              ? <Loader type={'spinning-bubbles'} width={100} height={100} color={theme.colors.primary}/>
              : !currentFolder
                ? folders.map((item, idx) => <Image key={idx} src={item.src} caption={item.caption}
                  onClick={() => setCurrentFolder(item)} />)
                : images.map((item, idx) => <Image styles={css`margin-right: 0`} key={idx} src={item.src}
                  selected={issuedScreenshots.findIndex(image => item.name === image.name) > -1}
                  caption={item.caption} onClick={() => reportMode ? selectImage(item) : setCurrentImage(item)}
                />)
          }
        </ScreenShots>
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
        <ReportEditor screenshots={issuedScreenshots.map(toFile)}/>
      </Modal>
    </>
  );
};

ScreenShotTab.propTypes = {
  addExternalListener:        PropTypes.func.isRequired,
  emitExternalMessage:        PropTypes.func.isRequired,
  removeAllExternalListeners: PropTypes.func.isRequired,
  setCustomBack:              PropTypes.func.isRequired,
  botInstance:                PropTypes.object.isRequired,
  theme:                      PropTypes.shape({ colors: PropTypes.object.isRequired }).isRequired
};

const mapStateToProps = state => ({
  botInstance: state.bot.botInstance
});

const mapDispatchToProps = dispatch => ({
  addExternalListener: (...args) => dispatch(addExternalListener(...args)),
  emitExternalMessage: (...args) => dispatch(emitExternalMessage(...args)),
  removeAllExternalListeners: () => dispatch(removeAllExternalListeners())
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ScreenShotTab));
