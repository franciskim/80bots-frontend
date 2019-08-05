import { ADD_NOTIFICATION, REMOVE_NOTIFICATION, HIDE_NOTIFICATION } from './types';

/**
 *
 * @property {Object, Number} initialState.current Current notification being processed
 *
 */

const initialState = {
  queue: [],
  current: null
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NOTIFICATION: {
      const queue = state.queue.concat([action.data]);
      return { ...state, queue, current: !state.current ? queue[0] : state.current };
    }
    case HIDE_NOTIFICATION: {
      return { ...state, current: { hide: true, ...state.current } };
    }
    case REMOVE_NOTIFICATION: {
      const queue = state.queue.slice(1);
      const nextNotification = queue[0];
      return { ...state, queue: queue, current: nextNotification };
    }
    default: return state;
  }
};

export default reducer;