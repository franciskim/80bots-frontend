import {
  GET_SUBSCRIPTIONS, GET_SUBSCRIPTIONS_ADMIN, UPDATE_SUBSCRIPTION_ADMIN, DELETE_SUBSCRIPTION_ADMIN, SUBSCRIBE
} from './types';

export const getSubscriptions = () => ({
  type: GET_SUBSCRIPTIONS,
  request: {
    method: 'GET',
    url: '/subscriptions',
  },
  meta: {
    thunk: true
  }
});

export const subscribe = (planId, tokenId) =>({
  type: SUBSCRIBE,
  request: {
    method: 'POST',
    url: '/subscriptions/subscribe',
    data: {
      plan_id: planId,
      token_id: tokenId
    }
  },
  meta: {
    thunk: true
  }
});

export const getSubscriptionsAdmin = () => ({
  type: GET_SUBSCRIPTIONS_ADMIN,
  request: {
    method: 'GET',
    url: '/admin/subscription',
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const updateSubscriptionAdmin = (id, updateData) => ({
  type: UPDATE_SUBSCRIPTION_ADMIN,
  request: {
    method: 'PUT',
    url: `/admin/subscription/${id}`,
    data: {
      update: updateData
    }
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const deleteSubscriptionAdmin = (id) => ({
  type: UPDATE_SUBSCRIPTION_ADMIN,
  request: {
    method: 'DELETE',
    url: `/admin/subscription/${id}`
  },
  meta: {
    thunk: true,
    admin: true
  }
});
