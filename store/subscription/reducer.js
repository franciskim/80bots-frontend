import { success, error } from 'redux-saga-requests';
import {
  GET_SUBSCRIPTIONS, GET_SUBSCRIPTIONS_ADMIN, SUBSCRIBE, UPDATE_SUBSCRIPTION_ADMIN
} from './types';

const initialState = {
  plans: [],
  subscriptionEnded: true,
  activePlan: {},
  loading: true,
  subscribeLoading: false,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SUBSCRIPTIONS_ADMIN:
    case GET_SUBSCRIPTIONS:
      return { ...state, loading: true, error: null };

    case SUBSCRIBE:
      return { ...state, subscribeLoading: true };

    case success(GET_SUBSCRIPTIONS):
      return {
        ...state,
        plans: action.data.plans,
        subscriptionEnded: action.data.subscriptionEnded,
        activePlan: action.data.activePlan,
        loading: false
      };

    case success(SUBSCRIBE):
    case error(SUBSCRIBE):
      return { ...state, subscribeLoading: false };

    case success(GET_SUBSCRIPTIONS_ADMIN):
      return { ...state, plans: action.data, loading: false };

    case success(UPDATE_SUBSCRIPTION_ADMIN): {
      const planIdx = state.plans.findIndex(item => item.id === action.data.id);
      if(planIdx || planIdx === 0) state.plans[planIdx] = action.data;
      return { ...state, plans: [...state.plans], loading: false };
    }

    case error(GET_SUBSCRIPTIONS_ADMIN):
    case error(GET_SUBSCRIPTIONS):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
