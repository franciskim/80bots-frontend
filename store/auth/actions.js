import {
  LOGIN, REGISTER, LOGOUT
} from './types';

export const login = (email, password) => {
  return {
    type: LOGIN,
    request: {
      method: 'POST',
      url: '/auth/login',
      data: {
        email, password
      }
    },
    meta: {
      thunk: true
    }
  };
};

export const register = (email, password) => {
  return {
    type: REGISTER,
    request: {
      method: 'POST',
      url: '/auth/register',
      data: {
        email, password
      }
    },
    meta: {
      thunk: true
    }
  };
};

export const logout = () => ({
  type: LOGOUT
});