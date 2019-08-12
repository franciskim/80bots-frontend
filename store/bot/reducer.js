import { success, error } from 'redux-saga-requests';
import {
  GET_BOTS,
  GET_RUNNING_BOTS
} from './types';

const initialState = {
  bots: [],
  botInstances: [],
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOTS:
    case GET_RUNNING_BOTS:
      return { ...state, loading: true, error: null };

    case success(GET_BOTS):
      return { ...state, bots: action.data.bots, loading: false };

    case success(GET_RUNNING_BOTS):
      return { ...state, botInstances: action.data.botInstances, loading: false };

    case error(GET_BOTS):
    case error(GET_RUNNING_BOTS):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
