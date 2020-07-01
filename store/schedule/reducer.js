import { success, error } from 'redux-saga-requests';
import {
  GET_SCHEDULES,
  CREATE_SCHEDULE,
  UPDATE_SCHEDULE,
  DELETE_SCHEDULE,
} from './types';

const initialState = {
  schedules: [],
  total: 0,
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULES:
    case CREATE_SCHEDULE:
    case UPDATE_SCHEDULE:
    case DELETE_SCHEDULE:
      return { ...state, loading: true, error: null };

    case success(GET_SCHEDULES):
      return {
        ...state,
        schedules: action.data.data,
        total: action.data.total,
        loading: false
      };

    case success(CREATE_SCHEDULE):
    case success(DELETE_SCHEDULE):
      return { ...state, loading: false };

    case success(UPDATE_SCHEDULE): {
      const scheduleIdx = state.schedules.findIndex(item => item.id === action.data.id);
      if(scheduleIdx || scheduleIdx === 0) state.schedules[scheduleIdx] = action.data;
      return { ...state, schedules: [...state.schedules], loading: false };
    }

    case error(GET_SCHEDULES):
    case error(CREATE_SCHEDULE):
    case error(UPDATE_SCHEDULE):
    case error(DELETE_SCHEDULE):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
