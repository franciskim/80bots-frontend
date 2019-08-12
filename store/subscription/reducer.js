import { success, error } from 'redux-saga-requests';
import {
  GET_SUBSCRIPTIONS
} from './types';

const initialState = {
  plans: [],
  subscriptionEnded: true,
  activePlan: null,
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SUBSCRIPTIONS:
      return { ...state, loading: true, error: null };

    case success(GET_SUBSCRIPTIONS):
      return {
        ...state,
        plans: action.data.plans,
        subscriptionEnded: action.data.subscriptionEnded,
        activePlan: action.data.activePlan,
        loading: false
      };

    case error(GET_SUBSCRIPTIONS):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
