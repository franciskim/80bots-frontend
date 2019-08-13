import { success, error } from 'redux-saga-requests';
import {
  GET_BOTS,
  GET_RUNNING_BOTS,
  POST_LAUNCH_INSTANCE,
  PUT_STATUS
} from './types';

const initialState = {
  bots: [],
  botInstances: [],
  total: 0,
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOTS:
    case GET_RUNNING_BOTS:
    case POST_LAUNCH_INSTANCE:
      return { ...state, loading: true, error: null };

    case success(GET_BOTS):
      return {
        ...state,
        bots: action.data.data,
        total: action.data.total,
        loading: false
      };

    case success(GET_RUNNING_BOTS):
      return {
        ...state,
        botInstances: action.data.data,
        total: action.data.total,
        loading: false
      };

    case success(POST_LAUNCH_INSTANCE):
      return { ...state, loading: false };

    case error(GET_BOTS):
    case error(GET_RUNNING_BOTS):
    case error(POST_LAUNCH_INSTANCE):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
