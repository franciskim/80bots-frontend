import {
  GET_SCHEDULES,
  CREATE_SCHEDULE,
  UPDATE_SCHEDULE,
  DELETE_SCHEDULE
} from './types';

export const getSchedules = (query = { page: 1, limit: 1 }) => {

  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);

  return {
    type: GET_SCHEDULES,
    request: {
      method: 'GET',
      url: '/schedules',
      params: query
    },
    meta: {
      thunk: true
    }
  };
};

/**
 *
 * details[0][type] = stop | start
 * details[0][time] = 6:00 PM
 * details[0][day] = Friday
 *
 * @param instanceId
 * @param timezone
 * @param details
 * @returns {{request: {method: string, data: {instance_id: *, timezone: *, details: *}, url: string}, meta: {thunk: boolean}, type: *}}
 */
export const createSchedule = (instanceId, timezone, details) => {
  return {
    type: CREATE_SCHEDULE,
    request: {
      method: 'POST',
      url: '/schedules',
      data: {
        instance_id: instanceId,
        timezone,
        details
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
      url: `/schedules/${id}`,
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
      url: `/schedules/${id}`,
    },
    meta: {
      thunk: true
    }
  };
};