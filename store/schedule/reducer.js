import { success, error } from 'redux-saga-requests';
import {
  GET_SCHEDULES
} from './types';

const initialState = {
  schedules: [],
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULES:
      return { ...state, loading: true, error: null };

    case success(GET_SCHEDULES):
      return { ...state, schedules: action.data.schedules, loading: false };

    case error(GET_SCHEDULES):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
