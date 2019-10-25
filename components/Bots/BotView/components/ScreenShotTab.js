import React, {useEffect} from 'react';
import {withTheme} from 'emotion-theming';
import {useRouter} from 'next/router';
import {connect} from 'react-redux';
import FileSystem from '../../../default/FileSystem';
import {getItems} from '../../../../store/fileSystem/actions';

const ScreenShotTab = ({items, getItems, page, limit }) => {
  const router = useRouter();
  useEffect(() => {
    getItems({ instance_id: router.query.id, page, limit, entity: 'folder' });
  }, []);

  const onFileClick = () => {};
  const onFolderClick = (item) => {
    getItems({ instance_id: router.query.id, page: 1, limit: 10, folder: item.id });
  };

  return <FileSystem items={items} onFileClick={onFileClick} onFolderClick={onFolderClick}/>;
};

const mapStateToProps = state => ({
  limit: state.fileSystem.limit,
  page: state.fileSystem.page,
  items: state.fileSystem.items,
});

const mapDispatchToProps = dispatch => ({
  getItems: query => dispatch(getItems(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ScreenShotTab));
