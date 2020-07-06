import {
  GET_SCHEDULES,
  CREATE_SCHEDULE,
  UPDATE_SCHEDULE,
  DELETE_SCHEDULE,
  CREATE_SCHEDULE_DETAIL,
  UPDATE_SCHEDULE_DETAIL,
  DELETE_SCHEDULE_DETAIL,
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

export const createScheduleDetail = ({ scheduleId }) => {
  return {
    type: CREATE_SCHEDULE_DETAIL,
    request: {
      method: 'POST',
      url: `/schedule/${scheduleId}/details`,
      data: {
        instance_id: scheduleId
      }
    },
    meta: {
      thunk: true
    }
  };
};

export const updateScheduleDetail = (scheduleId, id, updateData) => {
  return {
    type: UPDATE_SCHEDULE_DETAIL,
    request: {
      method: 'PUT',
      url: `/schedule/${scheduleId}/details/${id}`,
      data: { update: updateData }
    },
    meta: {
      thunk: true
    }
  };
};

export const deleteScheduleDetail = (scheduleId,id) => {
  return {
    type: DELETE_SCHEDULE_DETAIL,
    request: {
      method: 'DELETE',
      url: `/schedule/${scheduleId}/details/${id}`,
    },
    meta: {
      thunk: true
    }
  };
};