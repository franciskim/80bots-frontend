import { success, error } from 'redux-saga-requests'
import {
  GET_SCHEDULES,
  CREATE_SCHEDULE,
  UPDATE_SCHEDULE,
  DELETE_SCHEDULE,
} from './types'

const initialState = {
  schedules: [],
  total: 0,
  loading: true,
  error: null,
  scheduleLoading: {},
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SCHEDULES:
    case CREATE_SCHEDULE:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case DELETE_SCHEDULE:
    case UPDATE_SCHEDULE: {
      const id = action.meta.id
      return {
        ...state,
        scheduleLoading: {
          ...state.scheduleLoading,
          [id]: true,
        },
      }
    }
    case success(GET_SCHEDULES): {
      const schedules = action.data.data
      return {
        ...state,
        schedules,
        total: action.data.total,
        loading: false,
        scheduleLoading: schedules.reduce((accr, schedule) => {
          return {
            ...accr,
            [schedule.id]: false,
          }
        }, {}),
      }
    }
    case success(CREATE_SCHEDULE):
      return {
        ...state,
        loading: false,
      }
    case success(DELETE_SCHEDULE): {
      const id = action.data.id
      const schedules = state.schedules.filter((schedule) => schedule.id !== id)
      return {
        ...state,
        schedules: [...schedules],
        scheduleLoading: schedules.reduce((accr, schedule) => {
          return {
            ...accr,
            [schedule.id]: false,
          }
        }, {}),
      }
    }
    case success(UPDATE_SCHEDULE): {
      const id = action.data.id
      const scheduleIdx = state.schedules.findIndex(
        (item) => item.id === action.data.id
      )
      if (scheduleIdx || scheduleIdx === 0) {
        state.schedules[scheduleIdx] = action.data
      }
      return {
        ...state,
        schedules: [...state.schedules],
        scheduleLoading: {
          ...state.scheduleLoading,
          [id]: false,
        },
      }
    }
    case error(GET_SCHEDULES):
    case error(CREATE_SCHEDULE):
    case error(UPDATE_SCHEDULE):
    case error(DELETE_SCHEDULE):
      return { ...state, loading: false, error: action.error }

    default:
      return state
  }
}

export default reducer
