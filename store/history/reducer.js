import { success, error } from 'redux-saga-requests';
import {
  GET_CREDIT_USAGE
} from './types';

const initialState = {
  credits: [],
  total: 0,
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CREDIT_USAGE:
      return { ...state, loading: true, error: null };

    case success(GET_CREDIT_USAGE):
      return {
        ...state,
        credits: action.data.data,
        total: action.data.total,
        loading: false
      };

    case error(GET_CREDIT_USAGE):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
