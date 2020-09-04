import {
  FLUSH_SCRIPT_NOTIFICATION,
  OPEN_SCRIPT_NOTIFICATION,
  CLOSE_SCRIPT_NOTIFICATION,
} from "./types";

export const flushScriptNotification = () => {
  return {
    type: FLUSH_SCRIPT_NOTIFICATION
  };
};

export const openScriptNotification = (item) => {
  return {
    type: OPEN_SCRIPT_NOTIFICATION,
    data: {
      item
    }
  };
};

export const closeScriptNotification = (item) => {
  return {
    type: CLOSE_SCRIPT_NOTIFICATION,
    data: {
      item
    }
  };
};
