import { success, error } from 'redux-saga-requests';
import {
  GET_FILES
} from './types';

const initialState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
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
        page: action.data.page,
        loading: false
      };
    case error(GET_FILES):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
