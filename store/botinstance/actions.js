import {
  GET_BOT_INSTANCE,
  UPDATE_BOT_INSTANCE,
  POST_RESTART_INSTANCE,
} from "./types";
export const getBotInstance = id => ({
  type: GET_BOT_INSTANCE,
  request: {
    method: "GET",
    url: `/botinstances/${id}`
  },
  meta: {
    thunk: true,
  }
});

export const updateBotInstance = (id, updateData) => {
  return {
    type: UPDATE_BOT_INSTANCE,
    request: {
      method: "PUT",
      url: `/botinstances/${id}`,
      data: { update: updateData }
    },
    meta: {
      thunk: true,
    }
  };
};
export const restartInstance = (id, params) => {
  return {
    type: POST_RESTART_INSTANCE,
    request: {
      method: "POST",
      url: "/botinstances/restart",
      data: { id: id, params }
    },
    meta: {
      thunk: true
    }
  };
};

