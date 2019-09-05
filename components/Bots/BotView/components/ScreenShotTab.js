import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import ScreenShot from './ScreenShot';
import { css } from '@emotion/core';
import { connect } from 'react-redux';
import { CardBody } from 'components/default/Card';
import { addExternalListener, emitExternalMessage, removeAllExternalListeners } from 'store/socket/actions';
import { Button, Paginator } from 'components/default';

const EVENTS = {
  FOLDERS: 'folders',
  SCREENSHOTS: 'screenshots'
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
  botInstance, addExternalListener, removeAllExternalListeners, emitExternalMessage, setCustomBack
}) => {
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const BackButton = <Back type={'primary'} onClick={() => setCurrentFolder(null)}>Back</Back>;

  useEffect(() => {
    return () => { removeAllExternalListeners(); };
  }, []);

  useEffect(() => {
    if(botInstance && Object.keys(botInstance).length > 0) {
      addExternalListener(`${botInstance.ip}:6002`, 'default', EVENTS.FOLDERS, (folders) => {
        setFolders(folders.map(toImage));
      });
      addExternalListener(`${botInstance.ip}:6002`, 'default', EVENTS.SCREENSHOTS, (screenshots) => {
        setImages(screenshots.map(toImage));
      });
    }
  }, [botInstance]);

  useEffect(() => {
    if(currentFolder) {
      emitExternalMessage(MESSAGES.GET_SCREENSHOTS, { date: currentFolder.date, offset, limit });
      setCustomBack(BackButton);
    } else {
      setImages([]);
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
          !currentFolder
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

export default connect(mapStateToProps, mapDispatchToProps)(ScreenShotTab);
