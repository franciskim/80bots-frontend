import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { withTheme } from "emotion-theming";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FileSystem from "/components/default/FileSystem";
import { flush, open, close } from "/store/fileSystem/actions";
import { Loader80bots } from "/components/default";
const rootFolder = "output/images";
const defaultLimit = 20;

const ImagesType = ({
  flush,
  channel,
  openItem,
  closeItem,
  openedFolder,
  previous,
  setCustomBack,
  loading,
  items
}) => {
  const limit = defaultLimit;
  const isReportMode = false;
  const [reportItems, setReportItems] = useState([]);

  const router = useRouter();
  useEffect(() => {
    return () => flush();
  }, [router.query.id]);

  useEffect(() => {
    if (channel && !!openedFolder) return;
    openItem({ path: rootFolder }, { limit });
  }, [channel, openedFolder]);

  useEffect(() => {
    if (!previous || openedFolder.path === rootFolder) {
      setCustomBack(null);
    } else {
      setCustomBack(() => {
        closeItem(openedFolder);
        openItem(previous, { limit });
      });
    }
  }, [openedFolder, previous]);

  useEffect(() => {
    !isReportMode && setReportItems([]);
  }, [isReportMode]);


  return (
    <>
      {loading || !items.length ? (
        <Loader80bots
          data={"light"}
          styled={{
            width: "200px"
          }}
        />
      ) : (
        <FileSystem
          selectedItems={reportItems}
        />
      )}
    </>
  );
};

ImagesType.propTypes = {
  flush: PropTypes.func.isRequired,
  channel: PropTypes.string,
  openItem: PropTypes.func.isRequired,
  closeItem: PropTypes.func.isRequired,
  openedFolder: PropTypes.object,
  previous: PropTypes.object,
  setCustomBack: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  items: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  channel: state.bot.botInstance?.storage_channel,
  openedFolder: state.fileSystem.openedFolder,
  previous: state.fileSystem.history.slice(-1)?.[0]?.openedFolder,
  loading: state.fileSystem.loading,
  items: state.fileSystem.items
});

const mapDispatchToProps = dispatch => ({
  flush: () => dispatch(flush()),
  openItem: (item, query) => dispatch(open(item, query)),
  closeItem: item => dispatch(close(item))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(ImagesType));
