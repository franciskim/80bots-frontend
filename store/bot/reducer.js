import { success, error } from 'redux-saga-requests'
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
  GET_TAGS,
  BOT_SETTINGS,
  SYNC_BOT_INSTANCES,
  SYNC_BOTS,
  GET_BOT,
  GET_INSTANCE,
  CLEAR_BOT,
  CLEAR_INSTANCE,
  LIMIT_CHANGE,
  ADD_SCRIPT_NOTIFICATION,
  UPDATE_LAST_NOTIFICATION,
} from './types'

const initialState = {
  folders: [],
  screenshots: [],
  images: [],
  logs: [],
  jsons: [],
  bots: [],
  tags: [],
  botInstances: [],
  botNotifications: [],
  botInstance: {
    storage_channel: undefined,
    notification_channel: undefined,
  },
  aboutBot: {},
  botSettings: {},
  total: 0,
  limit: 10,
  loading: true,
  syncLoading: false,
  botUpdateLoading: {},
  error: null,
}

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
    case GET_INSTANCE:
    case COPY_INSTANCE:
    case POST_LAUNCH_INSTANCE:
    case UPDATE_BOT:
    case UPDATE_STATUS:
      return { ...state, loading: true, error: null }
    case RESTORE_INSTANCE:
    case UPDATE_RUNNING_BOT: {
      return {
        ...state,
        botUpdateLoading: {
          ...state.botUpdateLoading,
          [action.meta.id]: true,
        },
      }
    }
    case SYNC_BOT_INSTANCES:
    case SYNC_BOTS:
      return { ...state, syncLoading: true }
    case CLEAR_INSTANCE:
      return { ...state, botInstance: {} }

    case CLEAR_BOT:
      return { ...state, aboutBot: {} }

    case LIMIT_CHANGE: {
      localStorage.setItem('bot.limit', action.data)
      return { ...state, limit: action.data }
    }

    case success(GET_INSTANCE):
      return { ...state, botInstance: { ...action.data }, loading: false }

    case success(GET_BOT):
      return { ...state, aboutBot: { ...action.data }, loading: false }

    case success(GET_FOLDERS):
      return {
        ...state,
        folders: action.data.data,
        total: action.data.total,
        loading: false,
      }

    case success(GET_SCREENSHOTS):
      return {
        ...state,
        screenshots: action.data.data,
        total: action.data.total,
        loading: false,
      }

    case success(GET_IMAGES):
      return {
        ...state,
        images: action.data.data,
        total: action.data.total,
        loading: false,
      }

    case success(GET_LOGS):
      return {
        ...state,
        logs: action.data.data,
        loading: false,
      }

    case success(GET_OUTPUT_JSON):
      return {
        ...state,
        jsons: action.data.data,
        total: action.data.total,
        loading: false,
      }

    case success(GET_BOTS):
      return {
        ...state,
        bots: action.data.data,
        total: action.data.total,
        loading: false,
      }

    case success(GET_RUNNING_BOTS):
      return {
        ...state,
        botUpdateLoading: action.data.data.reduce((accr, instance) => {
          return {
            ...accr,
            [instance.id]: false,
          }
        }, {}),
        botInstances: action.data.data,
        total: action.data.total,
        loading: false,
      }
    case success(COPY_INSTANCE):
    case success(POST_LAUNCH_INSTANCE):
      return {
        ...state,
        loading: false,
      }
    case success(UPDATE_STATUS):
    case success(RESTORE_INSTANCE):
    case success(UPDATE_BOT): {
      const botIdx = state.bots.findIndex((item) => item.id === action.data.id)
      if (botIdx || botIdx === 0) state.bots[botIdx] = action.data
      return {
        ...state,
        bots: [...state.bots],
        loading: false,
      }
    }
    case success(UPDATE_RUNNING_BOT): {
      const idx = state.botInstances.findIndex(
        (item) => item.id === action.data.id
      )
      if (idx > -1) {
        state.botInstances[idx] = action.data
      }
      return {
        ...state,
        botInstances: [...state.botInstances],
        botUpdateLoading: {
          ...state.botUpdateLoading,
          [action.data.id]: false,
        },
      }
    }
    case success(GET_TAGS):
      return { ...state, tags: action.data.data }

    case success(BOT_SETTINGS):
      return { ...state, botSettings: action.data.settings }

    case success(SYNC_BOT_INSTANCES):
    case success(SYNC_BOTS):
    case error(SYNC_BOT_INSTANCES):
    case error(SYNC_BOTS):
      return { ...state, syncLoading: false }
    case ADD_SCRIPT_NOTIFICATION: {
      const notification = { ...state.botNotifications }
      notification[action.data.item.instanceId] = { ...action.data.item }
      return {
        ...state,
        botNotifications: notification,
        loading: false,
      }
    }

    case error(GET_FOLDERS):
    case error(GET_SCREENSHOTS):
    case error(GET_IMAGES):
    case error(GET_LOGS):
    case error(GET_OUTPUT_JSON):
    case error(GET_BOT):
    case error(GET_INSTANCE):
    case error(GET_BOTS):
    case error(GET_RUNNING_BOTS):
    case error(COPY_INSTANCE):
    case error(RESTORE_INSTANCE):
    case error(POST_LAUNCH_INSTANCE):
    case error(UPDATE_RUNNING_BOT):
    case error(UPDATE_BOT):
    case error(UPDATE_LAST_NOTIFICATION):
    case error(UPDATE_STATUS):
      return { ...state, loading: false, error: action.error }
    default:
      return state
  }
}

export default reducer
