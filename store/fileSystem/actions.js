import {
  GET_FILES,
  FLUSH,
  OPEN_ITEM,
  CLOSE_ITEM,
  ADD_ITEM,
  FILTER_ITEMS,
} from './types';

export const flush = () => {
  return {
    type: FLUSH
  };
};

export const filterItems = () => {
  return {
    type: FILTER_ITEMS
  };
};

export const open = (item, query) => (dispatch) => {
  if(!['folder', 'file'].includes(item.type)) {
    item.type = 'folder';
  }
  if(item.type === 'folder') {
    dispatch(getItems({ ...query, parent: item.path }));
  }
  return dispatch({
    type: OPEN_ITEM,
    data: {
      item
    }
  });
};

export const close = (item) => {
  return {
    type: CLOSE_ITEM,
    data: {
      item
    }
  };
};

export const addItem = (item) => {
  return {
    type: ADD_ITEM,
    data: {
      item
    }
  };
};

export const getItems = (query) => (dispatch, getState) => {
  const state = getState();
  const currentQuery = state.fileSystem?.query || {};
  const instance_id = state.bot?.botInstance.id || null;
  if(!instance_id) {
    return false;
  }
  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);
  const finalQuery = {
    ...currentQuery,
    ...query,
    instance_id
  };
  return dispatch({
    type: GET_FILES,
    request: {
      method: 'GET',
      url: `/instances/${finalQuery.instance_id}/objects`,
      params: {...finalQuery}
    },
    data: {
      query: finalQuery
    },
    meta: {
      thunk: true
    }
  });
};