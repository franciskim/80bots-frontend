import { success, error } from 'redux-saga-requests'
import {
  ADD_ITEM,
  GET_FILES,
  OPEN_ITEM,
  CLOSE_ITEM,
  SET_ITEMS,
  GET_JSON_FILE,
  GET_LOGS_FILE,
  FLUSH,
  FILTER_ITEMS,
} from './types'

const initialState = {
  json: null,
  logs: null,
  items: [],
  filter: false,
  total: 0,
  query: {},
  openedFolder: null,
  openedFile: null,
  current: null,
  loading: true,
  error: null,
  history: [],
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FILES:
      return { ...state, query: action.data.query, loading: true, error: null }
    case success(GET_FILES):
      return {
        ...state,
        items: action.data.data,
        total: action.data.total,
        loading: false,
      }
    case CLOSE_ITEM:
      if (action.data?.item?.type === 'file') {
        // console.debug('STORE:CLOSING FILE:', state.openedFile.path)
        return { ...state, openedFile: null }
      } else {
        // console.debug('STORE:CLOSING FOLDER:', state.openedFolder.path)
        const prevState = state.history.length
          ? state.history[state.history.length - 2]
          : initialState
        return { ...prevState }
      }
    case OPEN_ITEM:
      if (action.data?.item?.type === 'file') {
        // console.debug('STORE:OPENING FILE:', action.data.item)
        return { ...state, openedFile: action.data.item }
      } else {
        // console.error('STORE:OPENING FOLDER:', action.data.item)
        const { path, type } = action.data.item
        return {
          ...state,
          openedFolder: action.data.item,
          history: [...state.history, { path, type }],
        }
      }
    case ADD_ITEM:
      return {
        ...state,
        total: state.total + 1,
        items:
          state.items.length >= state.query.limit
            ? [...state.items]
            : [action.data.item, ...state.items],
      }
    case GET_JSON_FILE:
      return {
        ...state,
        json: null,
      }
    case success(GET_JSON_FILE):
      return {
        ...state,
        json: action.data,
      }
    case GET_LOGS_FILE:
      return {
        ...state,
        logs: null,
      }
    case success(GET_LOGS_FILE):
      return {
        ...state,
        logs: action.data,
      }
    case FLUSH:
      return { ...initialState }
    case FILTER_ITEMS:
      return {
        ...state,
        filter: !state.filter,
      }
    case SET_ITEMS:
      return { ...state, items: action.data.items || [] }
    case error(GET_FILES):
      return { ...state, loading: false, error: action.error }
    default:
      return state
  }
}

export default reducer
