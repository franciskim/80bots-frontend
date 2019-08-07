import { success, error } from 'redux-saga-requests';
import {
  TIMEZONES
} from './types';

const initialState = {
  timeZones: [],
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TIMEZONES:
      return { ...state, loading: true, error: null };

    case success(TIMEZONES):
      return { ...state, timeZones: action.data, loading: false };

    case error(TIMEZONES):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
