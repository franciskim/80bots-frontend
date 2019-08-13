import { success, error } from 'redux-saga-requests';
import {
  GET_LOW_CREDIT_NOTIFICATIONS
} from './types';

const initialState = {
  lowCreditNotifications: [],
  loading: false,
  total: 0,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LOW_CREDIT_NOTIFICATIONS:
      return { ...state, loading: true };

    case success(GET_LOW_CREDIT_NOTIFICATIONS):
      return { ...state, lowCreditNotifications: action.data, loading: false };

    case error(GET_LOW_CREDIT_NOTIFICATIONS):
      return  { ...state, loading: false };
    default: return state;
  }
};

export default reducer;