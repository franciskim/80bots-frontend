import { success, error } from 'redux-saga-requests';
import {
  GET_SCHEDULES,
  CREATE_SCHEDULE,
  UPDATE_SCHEDULE,
  DELETE_SCHEDULE,
  ADMIN_GET_SCHEDULES,
  ADMIN_CREATE_SCHEDULE,
  ADMIN_UPDATE_SCHEDULE,
  ADMIN_DELETE_SCHEDULE
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
    case ADMIN_GET_SCHEDULES:
    case ADMIN_CREATE_SCHEDULE:
    case ADMIN_UPDATE_SCHEDULE:
    case ADMIN_DELETE_SCHEDULE:
      return { ...state, loading: true, error: null };

    case success(GET_SCHEDULES):
    case success(ADMIN_GET_SCHEDULES):
      return {
        ...state,
        schedules: action.data.data,
        total: action.data.total,
        loading: false
      };

    case success(CREATE_SCHEDULE):
    case success(ADMIN_CREATE_SCHEDULE):
    case success(DELETE_SCHEDULE):
    case success(ADMIN_DELETE_SCHEDULE):
      return { ...state, loading: false };

    case success(UPDATE_SCHEDULE):
    case success(ADMIN_UPDATE_SCHEDULE): {
      const scheduleIdx = state.schedules.findIndex(item => item.id === action.data.id);
      if(scheduleIdx || scheduleIdx === 0) state.schedules[scheduleIdx] = action.data;
      return { ...state, schedules: [...state.schedules], loading: false };
    }

    case error(GET_SCHEDULES):
    case error(CREATE_SCHEDULE):
    case error(UPDATE_SCHEDULE):
    case error(DELETE_SCHEDULE):
    case error(ADMIN_GET_SCHEDULES):
    case error(ADMIN_CREATE_SCHEDULE):
    case error(ADMIN_UPDATE_SCHEDULE):
    case error(ADMIN_DELETE_SCHEDULE):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
