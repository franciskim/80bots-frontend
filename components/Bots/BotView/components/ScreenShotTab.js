import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {withTheme} from 'emotion-theming';
import styled from '@emotion/styled';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import FileSystem from '/components/default/FileSystem';
import {flush, open, close} from '/store/fileSystem/actions';
const rootFolder = 'screenshots';
const defaultLimit = 20;

const Breadcrumbs = styled.div`
  padding: 10px 15px;
  display: flex;
  align-content: flex-start;
`;
const ScreenShotTab = ({flush, channel, openItem, closeItem, openedFolder, previous, setCustomBack }) => {
  const [breadCrumbs, setBreadcrumbs] = useState(['/']);
  const [limit, setLimit] = useState(defaultLimit);

  const router = useRouter();
  useEffect(() => {
    return () => flush();
  }, [router.query.id]);

  // Breadcrumbs builder;
  useEffect(() => {
    if(openedFolder) {
      const pathItems = [];
      const parts = openedFolder.path.split('/');
      parts.forEach((part, i) => {
        let newPath = part;
        if(pathItems[i-1]) {
          newPath = `${pathItems[i-1].path}/${part}`;
        }
        pathItems.push({
          path: newPath,
          name: part
        });
      });
      setBreadcrumbs(pathItems);
    }
    return openedFolder && !openedFolder.path.startsWith(rootFolder) ? flush() : undefined;
  }, [openedFolder]);

  useEffect(() => {
    if(channel && !!openedFolder) return;
    openItem({ path: rootFolder }, { limit });
  }, [channel, openedFolder]);

  useEffect(() => {
    if(!previous || openedFolder.path === rootFolder) {
      setCustomBack(null);
    } else {
      setCustomBack(() => {
        closeItem(openedFolder);
        openItem(previous, { limit });
      });
    }
  }, [openedFolder, previous]);

  return (
    <>
      <Breadcrumbs>
        {
          breadCrumbs.map((item, i) => {
            return (
              <span key={i}>
                {item.name !== rootFolder ? <>/&nbsp;</> : null }
                <a href='#' onClick={(e) => {e.stopPropagation(); openItem(item);}}>
                  {item.name}
                </a>
                &nbsp;
              </span>
            );
          })
        }
      </Breadcrumbs>
      <FileSystem />
    </>
  );
};

ScreenShotTab.propTypes = {
  flush: PropTypes.func.isRequired,
  channel: PropTypes.string,
  openItem: PropTypes.func.isRequired,
  closeItem: PropTypes.func.isRequired,
  openedFolder: PropTypes.object,
  previous: PropTypes.object,
  setCustomBack: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  channel: state.bot.botInstance?.storage_channel,
  openedFolder: state.fileSystem.openedFolder,
  previous: state.fileSystem.history.slice(-1)?.[0]?.openedFolder,
});


const mapDispatchToProps = dispatch => ({
  flush: () => dispatch(flush()),
  openItem: (item, query) => dispatch(open(item, query)),
  closeItem: (item) => dispatch(close(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ScreenShotTab));
