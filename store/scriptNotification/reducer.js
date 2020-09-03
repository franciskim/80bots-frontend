import {
  FLUSH_SCRIPT_NOTIFICATION,
  OPEN_SCRIPT_NOTIFICATION,
  CLOSE_SCRIPT_NOTIFICATION,
} from "./types";

const initialState = {
  settings: [],
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_SCRIPT_NOTIFICATION: {
      console.debug("STORE:OPEN SCRIPT NOTIFICATION:", action.data.item);
      const item = state.settings.some(item => item.channel === action.data.item.channel);
      return {
        ...state,
        settings: item ? [...state.settings] : [...state.settings, action.data.item]
      };
    }
    case CLOSE_SCRIPT_NOTIFICATION: {
      console.debug("STORE:CLOSING SCRIPT NOTIFICATION:", action.data.item);
      let newArr;
      const settingIdx = state.settings.findIndex(
        item => item.channel === action.data.item.channel
      );
      if (settingIdx > -1) {
        state.settings.splice(settingIdx, 1);
      }
      return {...state, settings: [...state.settings]};
    }
    case FLUSH_SCRIPT_NOTIFICATION:
      return { ...initialState };
    default: return state;
  }
};

export default reducer;
