import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import createWebSocketMiddleware from './socket/middleware';
import createBotMiddleware from './bot/middleware';
import createFileSystemMiddleware from './fileSystem/middleware';
import { requestsPromiseMiddleware } from 'redux-saga-requests';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import saga from './saga';

import auth from './auth/reducer';
import notification from './notification/reducer';
import user from './user/reducer';
import bot from './bot/reducer';
import cms from './cms/reducer';
import schedule from './schedule/reducer';
import instanceSession from './instanceSession/reducer';
import platform from './platform/reducer';
import fileSystem from './fileSystem/reducer';

const loggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();
const socketMiddleware = createWebSocketMiddleware();
const botMiddleware = createBotMiddleware();
const fileSystemMiddleware = createFileSystemMiddleware();

const rootReducer = combineReducers({
  auth, fileSystem, notification, user, bot, cms, schedule, instanceSession, platform
});

export function initializeStore(initialState = undefined) {
  const middlewares = [
    thunkMiddleware,
    requestsPromiseMiddleware({ auto: true }),
    sagaMiddleware,
    socketMiddleware,
    botMiddleware,
    fileSystemMiddleware
  ];

  // Disable Logger at server side.
  if ( process.browser && process.env.NODE_ENV !== 'production' ) {
    middlewares.push(loggerMiddleware);
  }

  const store = createStore(rootReducer, initialState,  composeWithDevTools(applyMiddleware(...middlewares)));

  sagaMiddleware.run(() => saga(store.dispatch, store.getState));

  return store;
}
