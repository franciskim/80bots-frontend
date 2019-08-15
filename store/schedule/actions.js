import {
  GET_SCHEDULES,
  CREATE_SCHEDULE,
  UPDATE_SCHEDULE,
  DELETE_SCHEDULE,
  ADMIN_GET_SCHEDULES,
  ADMIN_CREATE_SCHEDULE,
  ADMIN_UPDATE_SCHEDULE,
  ADMIN_DELETE_SCHEDULE
} from './types';

export const getSchedules = (query = { page: 1, limit: 1 }) => {

  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);

  return {
    type: GET_SCHEDULES,
    request: {
      method: 'GET',
      url: '/schedule',
      params: query
    },
    meta: {
      thunk: true
    }
  };
};

export const adminGetSchedules = (query = { page: 1, limit: 1 }) => {

  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);

  return {
    type: ADMIN_GET_SCHEDULES,
    request: {
      method: 'GET',
      url: '/admin/schedule',
      params: query
    },
    meta: {
      thunk: true
    }
  };
};

export const createSchedule = ({ instanceId }) => {
  return {
    type: CREATE_SCHEDULE,
    request: {
      method: 'POST',
      url: '/schedule',
      data: {
        instance_id: instanceId
      }
    },
    meta: {
      thunk: true
    }
  };
};

export const adminCreateSchedule = ({ instanceId }) => {
  return {
    type: ADMIN_CREATE_SCHEDULE,
    request: {
      method: 'POST',
      url: '/admin/schedule',
      data: {
        instance_id: instanceId
      }
    },
    meta: {
      thunk: true
    }
  };
};

export const updateSchedule = (id, updateData) => {
  return {
    type: UPDATE_SCHEDULE,
    request: {
      method: 'PUT',
      url: `/schedule/${id}`,
      data: { update: updateData }
    },
    meta: {
      thunk: true
    }
  };
};

export const adminUpdateSchedule = (id, updateData) => {
  return {
    type: ADMIN_UPDATE_SCHEDULE,
    request: {
      method: 'PUT',
      url: `/admin/schedule/${id}`,
      data: { update: updateData }
    },
    meta: {
      thunk: true
    }
  };
};

export const deleteSchedule = (id) => {
  return {
    type: DELETE_SCHEDULE,
    request: {
      method: 'DELETE',
      url: `/schedule/${id}`,
    },
    meta: {
      thunk: true
    }
  };
};

export const adminDeleteSchedule = (id) => {
  return {
    type: ADMIN_DELETE_SCHEDULE,
    request: {
      method: 'DELETE',
      url: `/admin/schedule/${id}`,
    },
    meta: {
      thunk: true
    }
  };
};
