import React, { useEffect, useRef, useState, useReducer } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import ScreenShot from "./ScreenShot";
import Modal from "/components/default/Modal";
import ReportEditor from "./ReportIssue";
import { css, keyframes } from "@emotion/core";
import { withTheme } from "emotion-theming";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { CardBody } from "/components/default/Card";
import { getFolders, getScreenshots } from "/store/bot/actions";
import { Loader, Button, Paginator } from "/components/default";
import { addListener, removeAllListeners } from "/store/socket/actions";
import { Filters } from "/components/default/Table";
import { NOTIFICATION_TYPES, theme } from "/config";
import Link from "next/link";
import { addNotification } from "../../../../store/notification/actions";

const EVENTS = {
  FOLDERS: "folders",
  SCREENSHOTS: "screenshots",
  SCREENSHOT: "screenshot"
};

const MESSAGES = {
  GET_FOLDERS: "get_folders",
  GET_SCREENSHOTS: "get_screenshots"
};

const Fade = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const Content = styled(CardBody)`
  display: flex;
  flex-flow: column wrap;
  height: 77vh;
  ${props => props.styles};
`;

const Image = styled(ScreenShot)`
  margin-bottom: 20px;
  margin-right: 20px;
  animation: ${Fade} 200ms ease-in-out;
  ${props => props.styles};
  ${props =>
    props.selected &&
    css`
      box-shadow: 0 0 10px ${props.theme.colors.darkishPink};
      border: 1px solid ${props.theme.colors.darkishPink};
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
  background-color: rgba(0, 0, 0, 0.8);
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
  justify-content: flex-start;
  align-items: center;
  ${props => props.styles};
`;

const Hint = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.grey};
`;

const Span = styled.span`
  font-size: 20px;
  color: ${props => props.theme.colors.blueGrey};
`;

const Fallback = props => {
  const Div = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  `;
  return (
    <Div>
      <Span {...props} />
    </Div>
  );
};

const A = styled.a`
  color: inherit;
  text-decoration: none;
`;

const STATUSES = {
  FOLDERS: {
    label: "Receiving Folders",
    color: theme.colors.primary
  },
  DATA: {
    label: "Receiving Data",
    color: theme.colors.mediumGreen
  }
};

const Old_ScreenShotTab = ({
  botInstance,
  getFolders,
  getScreenshots,
  folders,
  screenshots,
  total,
  listen,
  removeAll,
  emit,
  setCustomBack
}) => {
  //const [folders, setFolders] = useState([]);
  const [offset, setOffset] = useReducer((state, offset) => offset, 0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalFolders, setTotalFolders] = useState(null);
  const [totalScreenshots, setTotalScreenshots] = useState(null);
  const [fallback, setFallback] = useState(null);
  const [status, setStatus] = useState(STATUSES.FOLDERS);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [reportMode, setReportMode] = useState(false);
  const [issuedScreenshots, setIssuedScreenshots] = useState([]);

  const reportModal = useRef(null);
  const router = useRouter();

  const imagesReducer = (state, action) => {
    switch (action.type) {
      case EVENTS.SCREENSHOTS:
        return [...action.data];
      case EVENTS.SCREENSHOT: {
        if (state.length >= limit) {
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

  const BackButton = (
    <Back type={"primary"} onClick={() => setCurrentFolder(null)}>
      Back
    </Back>
  );

  useEffect(() => {
    getFolders({ instance_id: router.query.id, page, limit }).then(() => {
      setTotalFolders(total);
    });

    // addListener(`instance.${router.query.id}.show`, 'S3ObjectAdded', event => {
    //   if(event) {
    //     console.log(event);
    //   }
    // });
    // return () => {
    //   removeAllListeners();
    // };
  }, []);

  useEffect(() => {
    return () => {
      removeAll();
    };
  }, []);

  useEffect(() => {
    if (!reportMode) setIssuedScreenshots([]);
  }, [reportMode]);

  // useEffect(() => {
  //   if(botInstance && Object.keys(botInstance).length > 0) {
  //     listen(EVENTS.FOLDERS, (folders) => {
  //       setStatus(null);
  //       setFolders(folders.map(toImage));
  //       setFallback(!folders.length && 'No folders are created');
  //     });
  //     listen(EVENTS.SCREENSHOTS, (screenshots) => {
  //       setStatus(null);
  //       setImages({ type: EVENTS.SCREENSHOTS, data: screenshots.map(toImage) });
  //     });
  //     listen(EVENTS.SCREENSHOT, (screenshot) => {
  //       if(offset === 0) {
  //         setImages({ type: EVENTS.SCREENSHOT, data: toImage(screenshot) });
  //       } else {
  //         setStatus(STATUSES.DATA);
  //         emit(MESSAGES.GET_SCREENSHOTS, { folder: currentFolder.date, offset, limit });
  //       }
  //     });
  //     emit(MESSAGES.GET_FOLDERS);
  //   }
  // }, [botInstance]);
  //
  // useEffect(() => {
  //   if(currentFolder) {
  //     setStatus(STATUSES.DATA);
  //     emit(MESSAGES.GET_SCREENSHOTS, { folder: currentFolder.date, offset, limit });
  //     setCustomBack(BackButton);
  //   } else {
  //     setImages({ type: EVENTS.SCREENSHOTS, data: [] });
  //     setCustomBack(null);
  //   }
  // }, [currentFolder, offset]);

  const backToFolders = () => {
    setCurrentFolder(null);
  };

  const selectCurrentFolder = item => {
    setCurrentFolder(item);
    getScreenshots({
      instance_id: router.query.id,
      folder: item.id,
      page: 1,
      limit
    }).then(() => {
      setTotalScreenshots(total);
    });
  };

  const toFile = item => {
    const blob = new Blob([item.thumbnail || item.data], { type: "image/jpg" });
    return new File([blob], item.name, { type: "image/jpg" });
  };

  const toImage = item => ({
    src: item.src || URL.createObjectURL(toFile(item)),
    caption: item.name,
    ...item
  });

  const selectImage = image => {
    const idx = issuedScreenshots.findIndex(item => item.name === image.name);
    if (idx === -1) {
      setIssuedScreenshots([...issuedScreenshots, image]);
    } else {
      setIssuedScreenshots([
        ...issuedScreenshots.slice(0, idx),
        ...issuedScreenshots.slice(idx + 1)
      ]);
    }
  };

  return (
    <>
      <Content>
        {folders ? (
          <>
            {currentFolder ? (
              <Button type={"primary"} onClick={backToFolders}>
                Back to folders
              </Button>
            ) : null}
            <ScreenShots>
              {!currentFolder
                ? folders.map((item, idx) => (
                    <Image
                      key={idx}
                      src={item.thumbnail.url}
                      caption={item.name}
                      onClick={() => selectCurrentFolder(item)}
                    />
                  ))
                : screenshots.map((item, idx) => (
                    <Image
                      key={idx}
                      src={item.thumbnail.url}
                      selected={
                        issuedScreenshots.findIndex(
                          image => item.name === image.name
                        ) > -1
                      }
                      caption={item.name}
                      onClick={() =>
                        reportMode ? selectImage(item) : setCurrentImage(item)
                      }
                    />
                  ))}
            </ScreenShots>
            <Paginator
              total={!currentFolder ? totalFolders : totalScreenshots}
              pageSize={limit}
              onChangePage={page => {
                setPage(page);
                !currentFolder
                  ? getFolders({ instance_id: router.query.id, page, limit })
                  : getScreenshots({
                      instance_id: router.query.id,
                      folder: currentFolder.id,
                      page,
                      limit
                    });
              }}
            />
          </>
        ) : (
          <Loader
            type={"spinning-bubbles"}
            width={100}
            height={100}
            color={status.color}
            caption={status.label}
          />
        )}
      </Content>

      {/*{*/}
      {/*  !status && currentFolder && <FiltersSection>*/}
      {/*    { reportMode && <Hint>Select issued screenshots |&nbsp;</Hint> }*/}
      {/*    <Report type={'danger'} onClick={() => setReportMode(!reportMode)}>*/}
      {/*      { reportMode ? 'Cancel' : 'Report Issue' }*/}
      {/*    </Report>*/}
      {/*    {*/}
      {/*      reportMode && <>*/}
      {/*        <Hint>&nbsp;|&nbsp;</Hint>*/}
      {/*        <Report type={'success'} onClick={() => reportModal.current.open()}>Proceed</Report>*/}
      {/*      </>*/}
      {/*    }*/}
      {/*  </FiltersSection>*/}
      {/*}*/}
      {/*<Content>*/}
      {/*  {*/}
      {/*    !status*/}
      {/*      ? fallback*/}
      {/*        ? <Fallback>{ fallback }</Fallback>*/}
      {/*        : <ScreenShots>*/}
      {/*          {*/}
      {/*            !currentFolder*/}
      {/*              ? folders.map((item, idx) => <Image key={idx} src={item.src} caption={item.caption}*/}
      {/*                onClick={() => setCurrentFolder(item)} />)*/}
      {/*              : images.map((item, idx) => <Image key={idx} src={item.src}*/}
      {/*                selected={issuedScreenshots.findIndex(image => item.name === image.name) > -1}*/}
      {/*                caption={item.caption} onClick={() => reportMode ? selectImage(item) : setCurrentImage(item)}*/}
      {/*              />)*/}
      {/*          }*/}
      {/*        </ScreenShots>*/}
      {/*      : <Loader type={'spinning-bubbles'} width={100} height={100} color={status.color}*/}
      {/*        caption={status.label}*/}
      {/*      />*/}
      {/*  }*/}
      {/*</Content>*/}
      {/*{*/}
      {/*  currentFolder && <Paginator total={currentFolder.total} pageSize={limit}*/}
      {/*    onChangePage={page => setOffset((page * limit) - limit)}*/}
      {/*  />*/}
      {/*}*/}
      {/*{*/}
      {/*  currentImage && <ImageViewer onClick={() => setCurrentImage(null)}>*/}
      {/*    <img onClick={e => e.stopPropagation()} alt={currentImage.caption} src={currentImage.src}/>*/}
      {/*  </ImageViewer>*/}
      {/*}*/}
      {/*<Modal ref={reportModal} title={'Report Issue'} contentStyles={css`min-width: 420px; max-width: 420px;`}*/}
      {/*  onClose={() => setReportMode(false)}*/}
      {/*>*/}
      {/*  <ReportEditor bot={botInstance} screenshots={issuedScreenshots.map(toFile)}/>*/}
      {/*</Modal>*/}
    </>
  );
};

Old_ScreenShotTab.propTypes = {
  setCustomBack: PropTypes.func.isRequired,
  botInstance: PropTypes.object.isRequired,
  getFolders: PropTypes.func.isRequired,
  getScreenshots: PropTypes.func.isRequired,
  folders: PropTypes.array.isRequired,
  screenshots: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  removeAll: PropTypes.func.isRequired,
  listen: PropTypes.func.isRequired,
  theme: PropTypes.shape({ colors: PropTypes.object.isRequired }).isRequired,
  emit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  botInstance: state.bot.botInstance,
  folders: state.bot.folders,
  screenshots: state.bot.screenshots,
  total: state.bot.total
});

const mapDispatchToProps = dispatch => ({
  getFolders: query => dispatch(getFolders(query)),
  getScreenshots: query => dispatch(getScreenshots(query))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Old_ScreenShotTab));
