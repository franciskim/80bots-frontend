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
  GET_TAGS, BOT_SETTINGS, SYNC_BOT_INSTANCES, AMIS, SYNC_BOTS, GET_BOT, CLEAR_BOT,
  ADMIN_REGIONS, ADMIN_UPDATE_REGION, LIMIT_CHANGE
} from './types';

const initialState = {
  bots: [],
  tags: [],
  amis: [],
  regions: [],
  botInstances: [],
  botInstance: {},
  platforms: [],
  botSettings: {},
  totalRegions: 0,
  total: 0,
  limit: 10,
  loading: true,
  syncLoading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOT:
    case POST_LAUNCH_INSTANCE:
    case ADMIN_POST_LAUNCH_INSTANCE:
    case UPDATE_RUNNING_BOT:
    case ADMIN_UPDATE_BOT:
    case ADMIN_UPDATE_RUNNING_BOT:
    case DOWNLOAD_INSTANCE_PEM_FILE:
    case ADMIN_UPDATE_REGION:
      return { ...state, loading: true, error: null };

    case GET_BOTS:
    case ADMIN_GET_BOTS:
    case GET_RUNNING_BOTS:
    case ADMIN_GET_RUNNING_BOTS:
      return { ...state, loading: true, error: null, total: 0 };

    case SYNC_BOT_INSTANCES:
    case SYNC_BOTS:
      return { ...state, syncLoading: true };

    case CLEAR_BOT:
      return { ...state, botInstance: {} };

    case LIMIT_CHANGE: {
      localStorage.setItem('bot.limit', action.data);
      return { ...state, limit: action.data };
    }

    case success(GET_BOT): {
      let data = action.data;
      data.ip = 'localhost';
      return { ...state, botInstance: data, loading: false };
    }

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
      const botIdx = state.bots.findIndex(item => item.id === action.data.id);
      if(botIdx || botIdx === 0) state.bots[botIdx] = action.data;
      return { ...state, bots: [...state.bots], loading: false };
    }

    case success(UPDATE_RUNNING_BOT):
    case success(ADMIN_UPDATE_RUNNING_BOT): {
      const userIdx = state.botInstances.findIndex(item => item.id === action.data.id);
      if(userIdx || userIdx === 0) state.botInstances[userIdx] = action.data;
      return { ...state, botInstances: [...state.botInstances], loading: false };
    }

    case success(ADMIN_UPDATE_REGION): {
      const userIdx = state.regions.findIndex(item => item.id === action.data.id);
      if(userIdx || userIdx === 0) state.regions[userIdx] = action.data;
      return { ...state, regions: [...state.regions], loading: false };
    }

    case success(GET_TAGS):
      return { ...state, tags: action.data.data };

    case success(BOT_SETTINGS):
      return { ...state, botSettings: action.data.settings };

    case success(SYNC_BOT_INSTANCES):
    case success(SYNC_BOTS):
    case error(SYNC_BOT_INSTANCES):
    case error(SYNC_BOTS):
      return { ...state, syncLoading: false };

    case success(AMIS):
      return { ...state, amis: action.data.data };

    case success(ADMIN_REGIONS):
      return { ...state, regions: action.data.data, totalRegions: action.data.total, loading: false };

    case error(GET_BOT):
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
    case error(ADMIN_UPDATE_REGION):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
