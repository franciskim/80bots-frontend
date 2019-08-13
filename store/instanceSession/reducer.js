import { success, error } from 'redux-saga-requests';
import {
  GET_SESSIONS
} from './types';

const initialState = {
  sessions: [],
  botInstances: [],
  total: 0,
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SESSIONS:
      return { ...state, loading: true, error: null };

    case success(GET_SESSIONS):
      return { ...state, sessions: action.data.data, total: action.data.total, loading: false };

    case error(GET_SESSIONS):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
