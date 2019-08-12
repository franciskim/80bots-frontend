import { applyMiddleware, createStore, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { requestsPromiseMiddleware } from 'redux-saga-requests';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import saga from './saga';

import auth from './auth/reducer';
import notification from './notification/reducer';
import user from './user/reducer';
import bot from './bot/reducer';

const loggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  auth, notification, user, bot
});

export function initializeStore(initialState = undefined) {
  const middlewares = [
    thunkMiddleware,
    requestsPromiseMiddleware({ auto: true }),
    sagaMiddleware,
  ];

  // Disable Logger at server side.
  if ( process.browser && process.env.NODE_ENV !== 'production' ) {
    middlewares.push(loggerMiddleware);
  }

  const store = createStore(rootReducer, initialState,  composeWithDevTools(applyMiddleware(...middlewares)));

  sagaMiddleware.run(() => saga(store.dispatch, store.getState));

  return store;
}