import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {withTheme} from 'emotion-theming';
import styled from '@emotion/styled';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import FileSystem from '/components/default/FileSystem';
import {flush, open, close} from '/store/fileSystem/actions';
import {Loader} from '../../../default';
import {theme} from "../../../../config";
const rootFolder = 'screenshots';
const defaultLimit = 20;

const Breadcrumbs = styled.div`
  padding: 10px 15px;
  display: flex;
  align-content: flex-start;
`;

const Container = styled.div`
  position: relative;
  flex: 1;
  bottom: 0;
  display: flex;
`;

const STATUSES = {
  ERROR: {
    label: 'Oops! Some error occurs...',
    color: theme.colors.pink,
  },
  LOADING: {
    label: 'Receiving Data',
    color: theme.colors.mediumGreen
  },
  EMPTY: {
    label: 'There is no data here yet, we are waiting for the updates...',
    color: theme.colors.primary
  },
  READY: {
    label: 'Success',
    color: theme.colors.primary
  },
};

const ScreenShotTab = ({flush, channel, openItem, closeItem, openedFolder, previous, setCustomBack, loading, items }) => {
  const [limit, setLimit] = useState(defaultLimit);
  const [status, setStatus] = useState({});

  const router = useRouter();
  useEffect(() => {
    return () => flush();
  }, [router.query.id]);

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

  useEffect(() => {
    if(loading) {
      setStatus(STATUSES.LOADING);
    } else if (items.length) {
      setStatus(STATUSES.READY);
    } else if (!items.length) {
      setStatus(STATUSES.EMPTY);
    }
  }, [loading, items]);

  return (
    <>
      <Container>
        {
          loading || !items.length ?
            <Loader type={'spinning-bubbles'} width={100} height={100} color={status.color} caption={status.label} /> :
            <FileSystem />
        }
      </Container>
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
  loading: state.fileSystem.loading,
  items: state.fileSystem.items,
});


const mapDispatchToProps = dispatch => ({
  flush: () => dispatch(flush()),
  openItem: (item, query) => dispatch(open(item, query)),
  closeItem: (item) => dispatch(close(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ScreenShotTab));
