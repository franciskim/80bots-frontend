import { success, error } from "redux-saga-requests";
import {
  GET_BOT_INSTANCE, UPDATE_BOT_INSTANCE
} from "./types";

const initialState = {
  aboutBot:{},
  bot:{},
  error: null
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOT_INSTANCE:
    case UPDATE_BOT_INSTANCE:
      return { ...state, loading: true, error: null };
    case success(GET_BOT_INSTANCE):
      return { ...state, aboutBot: { ...action.data }, loading: false };
    case success(UPDATE_BOT_INSTANCE): {
      return { ...state, aboutBot: { ...action.data }, loading: false };
    }
    case error(GET_BOT_INSTANCE):
    case error(UPDATE_BOT_INSTANCE):
    default:
      return state;
  }
};

export default reducer;
