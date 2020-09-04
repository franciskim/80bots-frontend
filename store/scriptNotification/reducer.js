import {
  FLUSH_SCRIPT_NOTIFICATION,
  OPEN_SCRIPT_NOTIFICATION,
  CLOSE_SCRIPT_NOTIFICATION,
} from "./types";

const initialState = {
  settings_channel: [],
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_SCRIPT_NOTIFICATION: {
      console.debug("STORE:OPEN SCRIPT NOTIFICATION:", action.data.item);
      const item = state.settings_channel.some(item => item.channel === action.data.item.channel);
      return {
        ...state,
        settings_channel: item ? [...state.settings_channel] : [...state.settings_channel, action.data.item]
      };
    }
    case CLOSE_SCRIPT_NOTIFICATION: {
      console.debug("STORE:CLOSING SCRIPT NOTIFICATION:", action.data.item);
      let newArr;
      const settingIdx = state.settings_channel.findIndex(
        item => item.channel === action.data.item.channel
      );
      if (settingIdx > -1) {
        state.settings_channel.splice(settingIdx, 1);
      }
      return {...state, settings_channel: [...state.settings_channel]};
    }
    case FLUSH_SCRIPT_NOTIFICATION:
      return { ...initialState };
    default: return state;
  }
};

export default reducer;
