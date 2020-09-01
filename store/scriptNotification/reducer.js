import {
  FLUSH_SCRIPT_NOTIFICATION,
  OPEN_SCRIPT_NOTIFICATION,
  CLOSE_SCRIPT_NOTIFICATION,
} from "./types";

const initialState = {
  settings: [],
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_SCRIPT_NOTIFICATION:
      console.debug("STORE:OPEN SCRIPT NOTIFICATION:", action.data.item);
      return {...state, settings: action.data.item};
    case CLOSE_SCRIPT_NOTIFICATION:
      console.debug("STORE:CLOSING SCRIPT NOTIFICATION:", state.settings);
      return {...state, settings: []};
    case FLUSH_SCRIPT_NOTIFICATION:
      return { ...initialState };
    default: return state;
  }
};

export default reducer;
