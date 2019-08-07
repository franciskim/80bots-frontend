import { success, error } from 'redux-saga-requests';
import {
  LOGIN, REGISTER, LOGOUT, AUTH_CHECK
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
      return { ...state, loading: true, error: null };

    case success(LOGIN):
    case success(REGISTER): {
      localStorage.setItem('token', action.data.token);
      return { ...state, user: action.data.user, loading: false, isAuthorized: true };
    }

    case success(AUTH_CHECK):
      return { ...state, user: action.data.user, loading: false, isAuthorized: true };

    case success(LOGOUT): {
      localStorage.clear();
      return { ...state, user: null, loading: false, isAuthorized: false };
    }

    case error(LOGIN):
    case error(LOGOUT):
    case error(REGISTER):
    case error(AUTH_CHECK):
      return { ...state, loading: false, error: action.error, isAuthorized: false };

    default: return state;
  }
};

export default reducer;
