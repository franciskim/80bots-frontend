import { success, error } from 'redux-saga-requests';
import {
  GET_BOTS,
  GET_RUNNING_BOTS,
  POST_LAUNCH_INSTANCE,
  UPDATE_RUNNING_BOT,
  ADMIN_GET_BOTS,
  ADMIN_GET_RUNNING_BOTS,
  ADMIN_UPDATE_BOT,
  ADMIN_POST_LAUNCH_INSTANCE,
  ADMIN_UPDATE_RUNNING_BOT,
  DOWNLOAD_INSTANCE_PEM_FILE,
  GET_TAGS, BOT_SETTINGS
} from './types';

const initialState = {
  bots: [],
  tags: [],
  botInstances: [],
  platforms: [],
  botSettings: {},
  total: 0,
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOTS:
    case ADMIN_GET_BOTS:
    case GET_RUNNING_BOTS:
    case ADMIN_GET_RUNNING_BOTS:
    case POST_LAUNCH_INSTANCE:
    case ADMIN_POST_LAUNCH_INSTANCE:
    case UPDATE_RUNNING_BOT:
    case ADMIN_UPDATE_BOT:
    case ADMIN_UPDATE_RUNNING_BOT:
    case DOWNLOAD_INSTANCE_PEM_FILE:
      return { ...state, loading: true, error: null };

    case success(GET_BOTS):
    case success(ADMIN_GET_BOTS):
      return {
        ...state,
        bots: action.data.data,
        total: action.data.total,
        loading: false
      };

    case success(GET_RUNNING_BOTS):
    case success(ADMIN_GET_RUNNING_BOTS):
      return {
        ...state,
        botInstances: action.data.data,
        total: action.data.total,
        loading: false
      };

    case success(POST_LAUNCH_INSTANCE):
    case success(ADMIN_POST_LAUNCH_INSTANCE):
    case success(DOWNLOAD_INSTANCE_PEM_FILE):
      return { ...state, loading: false };

    case success(ADMIN_UPDATE_BOT): {
      const userIdx = state.bots.findIndex(item => item.id === action.data.id);
      if(userIdx || userIdx === 0) state.bots[userIdx] = action.data;
      return { ...state, bots: [...state.bots], loading: false };
    }

    case success(UPDATE_RUNNING_BOT):
    case success(ADMIN_UPDATE_RUNNING_BOT): {
      const userIdx = state.botInstances.findIndex(item => item.id === action.data.id);
      if(userIdx || userIdx === 0) state.botInstances[userIdx] = action.data;
      return { ...state, botInstances: [...state.botInstances], loading: false };
    }

    case success(GET_TAGS):
      return { ...state, tags: action.data.data };

    case success(BOT_SETTINGS):
      return { ...state, botSettings: action.data.settings };

    case error(GET_BOTS):
    case error(ADMIN_GET_BOTS):
    case error(GET_RUNNING_BOTS):
    case error(ADMIN_GET_RUNNING_BOTS):
    case error(POST_LAUNCH_INSTANCE):
    case error(ADMIN_POST_LAUNCH_INSTANCE):
    case error(UPDATE_RUNNING_BOT):
    case error(ADMIN_UPDATE_BOT):
    case error(ADMIN_UPDATE_RUNNING_BOT):
    case error(DOWNLOAD_INSTANCE_PEM_FILE):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
