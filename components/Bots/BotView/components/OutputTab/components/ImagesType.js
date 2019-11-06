import React, {useEffect, useState} from 'react';
import {withTheme} from 'emotion-theming';
import {useRouter} from 'next/router';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import FileSystem from '/components/default/FileSystem';
import {getItems, flushItems} from '/store/fileSystem/actions';
import {Paginator} from '/components/default';

const ImagesType = ({items, total, getItems, flushItems }) => {
  const router = useRouter();
  const [query, setQuery] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  useEffect(() => {
    setQuery({ page, limit, instance_id: router.query.id, entity: 'file', type: 'images' });
    return () => {
      flushItems();
    };
  }, [router.query.id]);

  useEffect(() => {
    if(query && page && limit) getItems({...query, page, limit});
  }, [query, page, limit]);

  const onFileClick = () => {};
  const onFolderClick = (item) => {
    setQuery({ page, limit, instance_id: router.query.id, entity: 'file', type: 'images' });
  };

  return (
    <>
      <FileSystem items={items} onFileClick={onFileClick} onFolderClick={onFolderClick}/>
      <Paginator total={total} pageSize={limit} onChangePage={setPage}/>
    </>
  );
};

ImagesType.propTypes = {
  items: PropTypes.array,
  total: PropTypes.number,
  getItems: PropTypes.func.isRequired,
  flushItems: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  items: state.fileSystem.items,
  total: state.fileSystem.total,
});


const mapDispatchToProps = dispatch => ({
  getItems: query => dispatch(getItems(query)),
  flushItems: () => dispatch(flushItems()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ImagesType));
