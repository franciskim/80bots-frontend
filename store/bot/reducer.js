import { success, error } from 'redux-saga-requests';
import {
  GET_BOTS,
  GET_ADMIN_BOTS,
  GET_RUNNING_BOTS,
  GET_ADMIN_RUNNING_BOTS,
  POST_LAUNCH_INSTANCE,
  POST_ADMIN_LAUNCH_INSTANCE,
  UPDATE_RUNNING_BOT,
  UPDATE_ADMIN_BOT,
  UPDATE_ADMIN_RUNNING_BOT
} from './types';
import {UPDATE_USER} from '../user/types';

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
    case GET_ADMIN_BOTS:
    case GET_RUNNING_BOTS:
    case GET_ADMIN_RUNNING_BOTS:
    case POST_LAUNCH_INSTANCE:
    case UPDATE_RUNNING_BOT:
    case UPDATE_ADMIN_BOT:
    case UPDATE_ADMIN_RUNNING_BOT:
      return { ...state, loading: true, error: null };

    case success(GET_BOTS):
    case success(GET_ADMIN_BOTS):
      return {
        ...state,
        bots: action.data.data,
        total: action.data.total,
        loading: false
      };

    case success(GET_RUNNING_BOTS):
    case success(GET_ADMIN_RUNNING_BOTS):
      return {
        ...state,
        botInstances: action.data.data,
        total: action.data.total,
        loading: false
      };

    case success(POST_LAUNCH_INSTANCE):
      return { ...state, loading: false };

    case success(UPDATE_ADMIN_BOT): {
      const userIdx = state.bots.findIndex(item => item.id === action.data.id);
      if(userIdx || userIdx === 0) state.bots[userIdx] = action.data;
      return { ...state, bots: [...state.bots], loading: false };
    }

    case success(UPDATE_RUNNING_BOT):
    case success(UPDATE_ADMIN_RUNNING_BOT): {
      const userIdx = state.botInstances.findIndex(item => item.id === action.data.id);
      if(userIdx || userIdx === 0) state.botInstances[userIdx] = action.data;
      return { ...state, botInstances: [...state.botInstances], loading: false };
    }

    case error(GET_BOTS):
    case error(GET_ADMIN_BOTS):
    case error(GET_RUNNING_BOTS):
    case error(GET_ADMIN_RUNNING_BOTS):
    case error(POST_LAUNCH_INSTANCE):
    case error(UPDATE_RUNNING_BOT):
    case error(UPDATE_ADMIN_BOT):
    case error(UPDATE_ADMIN_RUNNING_BOT):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
