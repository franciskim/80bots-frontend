import { success, error } from 'redux-saga-requests';
import {
  GET_FILES,
  SET_ITEMS,
} from './types';

const initialState = {
  items: [],
  total: 0,
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FILES:
      return { ...state, loading: true, error: null };
    case success(GET_FILES):
      return {
        ...state,
        items: action.data.data,
        total: action.data.total,
        loading: false
      };
    case error(GET_FILES):
      return { ...state, loading: false, error: action.error };

    case SET_ITEMS:
      return { ...state, items: action.data.items || [] };
    default: return state;
  }
};

export default reducer;
