import React, { useEffect, useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import ScreenShot from './ScreenShot';
import { css } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import { connect } from 'react-redux';
import { CardBody } from 'components/default/Card';
import { addExternalListener, emitExternalMessage, removeAllExternalListeners } from 'store/socket/actions';
import { Loader, Button, Paginator } from 'components/default';

const EVENTS = {
  FOLDERS: 'folders',
  SCREENSHOTS: 'screenshots',
  SCREENSHOT: 'screenshot'
};

const MESSAGES = {
  GET_FOLDERS: 'get_folders',
  GET_SCREENSHOTS: 'get_screenshots'
};

const Content = styled(CardBody)`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  ${ props => props.styles };
`;

const Image = styled(ScreenShot)`
  margin-bottom: 20px;
  margin-right: 20px;
  ${ props => props.styles };
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

const ScreenShotTab = ({
  botInstance, addExternalListener, removeAllExternalListeners, emitExternalMessage, setCustomBack, theme
}) => {
  const [folders, setFolders] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const initialImageState = [];
  const imagesReducer = (state, action) => {
    switch (action.type) {
      case EVENTS.SCREENSHOTS:
        return [...action.data];
      case EVENTS.SCREENSHOT: {
        let temp = [...state];
        temp.pop();
        return [action.data, ...temp];
      }
    }
  };

  const [images, setImages] = useReducer(imagesReducer, initialImageState);

  const BackButton = <Back type={'primary'} onClick={() => setCurrentFolder(null)}>Back</Back>;

  useEffect(() => {
    return () => removeAllExternalListeners();
  }, []);

  useEffect(() => {
    if(botInstance && Object.keys(botInstance).length > 0) {
      addExternalListener(`${botInstance.ip}:6002`, 'default', EVENTS.FOLDERS, (folders) => {
        setLoading(false);
        setFolders(folders.map(toImage));
      });
      addExternalListener(`${botInstance.ip}:6002`, 'default', EVENTS.SCREENSHOTS, (screenshots) => {
        setLoading(false);
        setImages({ type: EVENTS.SCREENSHOTS, data: screenshots.map(toImage) });
      });
      addExternalListener(`${botInstance.ip}:6002`, 'default', EVENTS.SCREENSHOT, (screenshot) => {
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

  const toImage = (item) => {
    const blob = new Blob([item.thumbnail || item.data], { type: 'image/png' });
    const file = new File([blob], 'image.png', { type: 'image/png' });
    return { src: URL.createObjectURL(file), caption: item.name, ...item };
  };

  return(
    <>
      <Content styles={!currentFolder && css`justify-content: flex-start;`}>
        {
          loading
            ? <Loader type={'spinning-bubbles'} width={100} height={100} color={theme.colors.primary}/>
            : !currentFolder
              ? folders.map((item, idx) => <Image key={idx} src={item.src} caption={item.caption}
                onClick={() => setCurrentFolder(item)} />)
              : images.map((item, idx) => <Image styles={css`margin-right: 0`} key={idx} src={item.src}
                caption={item.caption} onClick={() => setCurrentImage(item)} />)
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
