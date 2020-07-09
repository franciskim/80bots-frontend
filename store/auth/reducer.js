import { success, error } from 'redux-saga-requests';
import {
  LOGIN, REGISTER, LOGOUT, AUTH_CHECK, RESET, RESET_PASSWORD, UPDATE_USER_PROFILE
} from './types';

const initialState = {
  user: null,
  isAuthorized: false,
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case LOGOUT:
    case REGISTER:
    case AUTH_CHECK:
    case RESET:
    case RESET_PASSWORD:
    case UPDATE_USER_PROFILE:
      return { ...state, loading: true, error: null };

    case success(LOGIN):
    case success(REGISTER):
    case success(RESET_PASSWORD): {
      localStorage.setItem('token', action.data.token);
      return { ...state, user: action.data.user, loading: false, isAuthorized: true };
    }

    case success(UPDATE_USER_PROFILE):
      return { ...state, user: action.data.user, loading: false };

    case success(AUTH_CHECK):
      return { ...state, user: action.data.user, loading: false, isAuthorized: true };

    case success(LOGOUT): {
      localStorage.clear();
      return { ...state, user: null, loading: false, isAuthorized: false };
    }

    case success(RESET):
      return { ...state, loading: true, error: null };

    case error(LOGIN):
    case error(LOGOUT):
    case error(REGISTER):
    case error(AUTH_CHECK):
    case error(RESET):
    case error(RESET_PASSWORD):
    case error(UPDATE_USER_PROFILE):
      return { ...state, loading: false, error: action.error, isAuthorized: false };

    default: return state;
  }
};

export default reducer;
