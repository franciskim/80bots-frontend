import { success, error } from 'redux-saga-requests';
import {
  GET_POSTS,
  GET_POST,
  UPDATE_POST
} from './types';

const initialState = {
  posts: [],
  post: {},
  total: 0,
  limit: 10,
  loading: true,
  error: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_POSTS:
    case GET_POST:
    case UPDATE_POST:
      return { ...state, loading: true, error: null };

    case success(GET_POSTS):
      return {
        ...state,
        posts: action.data.data,
        total: action.data.total,
        loading: false
      };

    case success(GET_POST):
      return {
        ...state,
        post: action.data.data,
        loading: false
      };

    case success(UPDATE_POST): {
      const userIdx = state.posts.findIndex(item => item.id === action.data.id);
      if(userIdx || userIdx === 0) state.posts[userIdx] = action.data;
      return { ...state, posts: [...state.posts], loading: false };
    }

    case error(GET_POSTS):
    case error(GET_POST):
    case error(UPDATE_POST):
      return { ...state, loading: false, error: action.error };

    default: return state;
  }
};

export default reducer;
