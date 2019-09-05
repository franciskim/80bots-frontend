import { applyMiddleware, createStore, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { requestsPromiseMiddleware } from 'redux-saga-requests';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import createWebSocketMiddleware from './socket/middleware';

import saga from './saga';

import auth from './auth/reducer';
import notification from './notification/reducer';
import user from './user/reducer';
import history from './history/reducer';
import bot from './bot/reducer';
import schedule from './schedule/reducer';
import subscription from './subscription/reducer';
import eventNotification from './eventNotification/reducer';
import instanceSession from './instanceSession/reducer';
import platform from './platform/reducer';

const loggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();
const socketMiddleware = createWebSocketMiddleware();

const rootReducer = combineReducers({
  auth, notification, user, history, bot, schedule, subscription, eventNotification, instanceSession, platform
});

export function initializeStore(initialState = undefined) {
  const middlewares = [
    thunkMiddleware,
    requestsPromiseMiddleware({ auto: true }),
    sagaMiddleware,
    socketMiddleware
  ];

  // Disable Logger at server side.
  if ( process.browser && process.env.NODE_ENV !== 'production' ) {
    middlewares.push(loggerMiddleware);
  }

  const store = createStore(rootReducer, initialState,  composeWithDevTools(applyMiddleware(...middlewares)));

  sagaMiddleware.run(() => saga(store.dispatch, store.getState));

  return store;
}