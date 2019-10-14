import {
  GET_POSTS,
  GET_POST,
  ADD_POST,
  UPDATE_POST,
  DELETE_POST
} from './types';

export const getPosts = (query = { page: 1, limit: 1 }) => {
  Object.keys(query).forEach((key) => (query[key] === '') && delete query[key]);
  return {
    type: GET_POSTS,
    request: {
      method: 'GET',
      url: '/admin/posts',
      params: query
    },
    meta: {
      thunk: true
    }
  };
};

export const addPost = (data) => ({
  type: ADD_POST,
  request: {
    method: 'POST',
    url: '/admin/posts',
    data
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const updatePost = (id, updateData) => {
  return {
    type: UPDATE_POST,
    request: {
      method: 'PUT',
      url: `/admin/posts/${id}`,
      data: { update: updateData }
    },
    meta: {
      thunk: true,
      admin: true
    }
  };
};

export const deletePost = (id) => ({
  type: DELETE_POST,
  request: {
    method: 'DELETE',
    url: `/admin/posts/${id}`
  },
  meta: {
    thunk: true,
    admin: true
  }
});

export const getPost = (id) => ({
  type: GET_POST,
  request: {
    method: 'GET',
    url: `/admin/posts/${id}`
  },
  meta: {
    thunk: true,
    admin: true
  }
});