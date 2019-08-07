import {
  AUTH_CHECK, LOGIN, REGISTER, LOGOUT
} from './types';
import Router from 'next/router';

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

export const checkAuth = () => dispatch => dispatch({
  type: AUTH_CHECK,
  request: {
    method: 'GET',
    url: '/auth/login'
  },
  meta: {
    thunk: true
  }
}).catch(() => Router.push('/login'));

export const logout = () => ({
  type: LOGOUT
});