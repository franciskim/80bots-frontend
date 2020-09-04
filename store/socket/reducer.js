const initialState = {};
import {
  SUBSCRIBE_CHANNEL,
  UNSUBSCRIBE_CHANNEL,
} from './types';

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBSCRIBE_CHANNEL: {
      console.log('SUBSCRIBE');
      const {channel} = action.data;
      return {
        ...state,
        [channel]: {}
      };
    }
    case UNSUBSCRIBE_CHANNEL: {
      console.log('UNSUBSCRIBE');
      const {channel} = action.data;
      delete state[channel];
      return {...state};
    }
    default: return state;
  }
};

export default reducer;
