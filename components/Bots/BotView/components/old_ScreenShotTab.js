import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/core";
import { withTheme } from "emotion-theming";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { CardBody } from "/components/default/Card";
import { getFolders, getScreenshots } from "/store/bot/actions";
import { Loader80bots, Button, Paginator } from "/components/default";

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

const Image = styled.div`
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

const ScreenShots = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  ${props => props.styles};
`;

const Old_ScreenShotTab = ({
  getFolders,
  getScreenshots,
  folders,
  screenshots,
  total,
  removeAll,
}) => {
  const limit = 10;
  const reportMode = false;
  const [page, setPage] = useState(1);
  const [totalFolders, setTotalFolders] = useState(null);
  const [totalScreenshots, setTotalScreenshots] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [issuedScreenshots, setIssuedScreenshots] = useState([]);

  const router = useRouter();

  useEffect(() => {
    getFolders({ instance_id: router.query.id, page, limit }).then(() => {
      setTotalFolders(total);
    });

  }, []);

  useEffect(() => {
    return () => {
      removeAll();
    };
  }, []);

  useEffect(() => {
    if (!reportMode) setIssuedScreenshots([]);
  }, [reportMode]);

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
          <Loader80bots
            data={"light"}
            styled={{
              width: "200px"
            }}
          />
        )}
      </Content>
    </>
  );
};

Old_ScreenShotTab.propTypes = {
  getFolders: PropTypes.func.isRequired,
  getScreenshots: PropTypes.func.isRequired,
  folders: PropTypes.array.isRequired,
  screenshots: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  removeAll: PropTypes.func.isRequired,
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
