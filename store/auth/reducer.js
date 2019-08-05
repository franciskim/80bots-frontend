import { success, error } from 'redux-saga-requests';
import {
  LOGIN, REGISTER, LOGOUT
} from './types';

const initialState = {
  user: null,
  isAuthorized: false,
  loading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case LOGOUT:
    case REGISTER:
      return { ...state, loading: true, error: null };

    case success(LOGIN):
    case success(REGISTER):
      return { ...state, user: action.data.user, loading: false, localLoading: false, isAuthorized: true };

    case success(LOGOUT):
      return { ...state, user: null, loading: false, isAuthorized: false };

    case error(LOGIN):
    case error(LOGOUT):
    case error(REGISTER):
      return { ...state, loading: false, error: action.error, isAuthorized: false };

    default: return state;
  }
};

export default reducer;
