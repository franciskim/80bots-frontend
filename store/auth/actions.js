import {
  AUTH_CHECK, LOGIN, REGISTER, LOGOUT, RESET, RESET_PASSWORD
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

export const register = (email, password, password_confirmation) => {
  return {
    type: REGISTER,
    request: {
      method: 'POST',
      url: '/auth/register',
      data: {
        email, password, password_confirmation
      }
    },
    meta: {
      thunk: true
    }
  };
};

export const reset = (email) => {
  return {
    type: RESET,
    request: {
      method: 'POST',
      url: '/auth/password/email',
      data: {
        email
      }
    },
    meta: {
      thunk: true
    }
  };
};

export const resetPassword = (token, email, password, password_confirmation) => {
  return {
    type: RESET_PASSWORD,
    request: {
      method: 'POST',
      url: '/auth/password/reset',
      data: {
        token, email, password, password_confirmation
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
}).catch(() => Router.push('/'));

export const logout = () => ({
  type: LOGOUT
});
