import { success, error } from "redux-saga-requests";
import {
  GET_FOLDERS,
  GET_SCREENSHOTS,
  GET_IMAGES,
  GET_LOGS,
  GET_OUTPUT_JSON,
  COPY_INSTANCE,
  RESTORE_INSTANCE,
  UPDATE_RUNNING_BOT,
  GET_BOTS,
  GET_RUNNING_BOTS,
  UPDATE_BOT,
  UPDATE_STATUS,
  POST_LAUNCH_INSTANCE,
  DOWNLOAD_INSTANCE_PEM_FILE,
  GET_TAGS,
  BOT_SETTINGS,
  SYNC_BOT_INSTANCES,
  SYNC_BOTS,
  GET_BOT,
  CLEAR_BOT,
  REGIONS,
  UPDATE_REGION,
  LIMIT_CHANGE,
  ADD_SCRIPT_NOTIFICATION,
} from "./types";

const initialState = {
  folders: [],
  screenshots: [],
  images: [],
  logs: [],
  jsons: [],
  bots: [],
  tags: [],
  amis: [],
  regions: [],
  botInstances: [],
  botInstance: {
    storage_channel: undefined,
    notification_channel: undefined
  },
  platforms: [],
  botSettings: {},
  totalRegions: 0,
  total: 0,
  limit: 10,
  loading: true,
  syncLoading: false,
  error: null
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FOLDERS:
    case GET_SCREENSHOTS:
    case GET_IMAGES:
    case GET_LOGS:
    case GET_OUTPUT_JSON:
    case GET_BOTS:
    case GET_RUNNING_BOTS:
    case GET_BOT:
    case COPY_INSTANCE:
    case RESTORE_INSTANCE:
    case POST_LAUNCH_INSTANCE:
    case UPDATE_RUNNING_BOT:
    case UPDATE_BOT:
    case UPDATE_STATUS:
    case DOWNLOAD_INSTANCE_PEM_FILE:
    case UPDATE_REGION:
      return { ...state, loading: true, error: null };

    case SYNC_BOT_INSTANCES:
    case SYNC_BOTS:
      return { ...state, syncLoading: true };

    case CLEAR_BOT:
      return { ...state, botInstance: {} };

    case LIMIT_CHANGE: {
      localStorage.setItem("bot.limit", action.data);
      return { ...state, limit: action.data };
    }

    case success(GET_BOT):
      return { ...state, botInstance: { ...action.data }, loading: false };

    case success(GET_FOLDERS):
      return {
        ...state,
        folders: action.data.data,
        total: action.data.total,
        loading: false
      };

    case success(GET_SCREENSHOTS):
      return {
        ...state,
        screenshots: action.data.data,
        total: action.data.total,
        loading: false
      };

    case success(GET_IMAGES):
      return {
        ...state,
        images: action.data.data,
        total: action.data.total,
        loading: false
      };

    case success(GET_LOGS):
      return {
        ...state,
        logs: action.data.data,
        loading: false
      };

    case success(GET_OUTPUT_JSON):
      return {
        ...state,
        jsons: action.data.data,
        total: action.data.total,
        loading: false
      };

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

    case success(COPY_INSTANCE):
    case success(RESTORE_INSTANCE):
    case success(POST_LAUNCH_INSTANCE):
    case success(DOWNLOAD_INSTANCE_PEM_FILE):
      return { ...state, loading: false };

    case success(UPDATE_STATUS):
    case success(UPDATE_BOT): {
      const botIdx = state.bots.findIndex(item => item.id === action.data.id);
      if (botIdx || botIdx === 0) state.bots[botIdx] = action.data;
      return { ...state, bots: [...state.bots], loading: false };
    }

    case success(UPDATE_RUNNING_BOT): {
      const userIdx = state.botInstances.findIndex(
        item => item.id === action.data.id
      );
      if (userIdx || userIdx === 0) state.botInstances[userIdx] = action.data;
      return {
        ...state,
        botInstances: [...state.botInstances],
        loading: false
      };
    }

    case success(UPDATE_REGION): {
      const userIdx = state.regions.findIndex(
        item => item.id === action.data.id
      );
      if (userIdx || userIdx === 0) state.regions[userIdx] = action.data;
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

    case success(REGIONS):
      return {
        ...state,
        regions: action.data.data,
        totalRegions: action.data.total,
        loading: false
      };

    case ADD_SCRIPT_NOTIFICATION: {
      const {notification, instanceId } = action.data.item;
      const scriptIdx = state.botInstances.findIndex(
        item => item.instance_id === instanceId
      );

      if (scriptIdx || scriptIdx === 0) {
        state.botInstances[scriptIdx].notification = notification;
      }
      return {
        ...state,
        botInstances: [...state.botInstances],
        loading: false
      };
    }

    case error(GET_FOLDERS):
    case error(GET_SCREENSHOTS):
    case error(GET_IMAGES):
    case error(GET_LOGS):
    case error(GET_OUTPUT_JSON):
    case error(GET_BOT):
    case error(GET_BOTS):
    case error(GET_RUNNING_BOTS):
    case error(COPY_INSTANCE):
    case error(RESTORE_INSTANCE):
    case error(POST_LAUNCH_INSTANCE):
    case error(UPDATE_RUNNING_BOT):
    case error(UPDATE_BOT):
    case error(DOWNLOAD_INSTANCE_PEM_FILE):
    case error(UPDATE_REGION):
    case error(UPDATE_STATUS):
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
};

export default reducer;
