import { success, error } from 'redux-saga-requests';
import {
  GET_SCHEDULES,
  PUT_STATUS
} from './types';

const initialState = {
  schedules: [],
  paginate: {
    total: 0,
    page: 1
  },
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULES:
    case PUT_STATUS:
      return { ...state, loading: true, error: null };

    case success(GET_SCHEDULES):
      return {
        ...state,
        schedules: action.data.schedules,
        paginate: action.data.paginate,
        loading: false
      };

    case success(PUT_STATUS):
      return { ...state, loading: false };

    case error(GET_SCHEDULES):
    case error(PUT_STATUS):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
