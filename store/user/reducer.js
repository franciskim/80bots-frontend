import { success, error } from 'redux-saga-requests';
import {
  TIMEZONES, USERS, UPDATE_USER
} from './types';

const initialState = {
  timeZones: [],
  users: [],
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TIMEZONES:
    case USERS:
      return { ...state, loading: true, error: null };

    case success(TIMEZONES):
      return { ...state, timeZones: action.data, loading: false };

    case success(USERS):
      return { ...state, users: action.data.data, loading: false };

    case success(UPDATE_USER): {
      const userIdx = state.users.findIndex(item => item.id === action.data.id);
      if(userIdx || userIdx === 0) state.users[userIdx] = action.data;
      return { ...state, users: [...state.users], loading: false };
    }

    case error(TIMEZONES):
    case error(USERS):
    case error(UPDATE_USER):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
