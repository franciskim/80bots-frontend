import { success, error } from 'redux-saga-requests';
import {
  GET_PLATFORMS, GET_INSTANCE_TYPES
} from './types';

const initialState = {
  platforms: [],
  types: [],
  total: 0,
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PLATFORMS:
      return { ...state, loading: true, error: null };

    case success(GET_PLATFORMS):
      return { ...state, platforms: action.data.data, loading: false };

    case success(GET_INSTANCE_TYPES):
      return { ...state, types: action.data, loading: false };

    default: return state;
  }
};

export default reducer;
