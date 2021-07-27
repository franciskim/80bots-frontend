import createSagaMiddleware from 'redux-saga'
import thunkMiddleware from 'redux-thunk'
import createWebSocketMiddleware from './socket/middleware'
import createBotMiddleware from './bot/middleware'
import createFileSystemMiddleware from './fileSystem/middleware'
import scriptNotificationMiddleware from './scriptNotification/middleware'
import { requestsPromiseMiddleware } from 'redux-saga-requests'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'

import saga from './saga'

import auth from './auth/reducer'
import user from './user/reducer'
import bot from './bot/reducer'
import botInstance from './botinstance/reducer'
import schedule from './schedule/reducer'
import instanceSession from './instanceSession/reducer'
import fileSystem from './fileSystem/reducer'
import scriptNotification from './scriptNotification/reducer'
import { reducer as toastrReducer } from 'react-redux-toastr'
// import { persistStore } from 'redux-persist'

const loggerMiddleware = createLogger()
const sagaMiddleware = createSagaMiddleware()
const socketMiddleware = createWebSocketMiddleware()
const botMiddleware = createBotMiddleware()
const fileSystemMiddleware = createFileSystemMiddleware()
const scriptMiddleware = scriptNotificationMiddleware()

const rootReducer = combineReducers({
  auth,
  fileSystem,
  user,
  bot,
  botInstance,
  schedule,
  instanceSession,
  scriptNotification,
  toastr: toastrReducer,
})

export function initializeStore(initialState = undefined) {
  const middlewares = [
    thunkMiddleware,
    requestsPromiseMiddleware({ auto: true }),
    sagaMiddleware,
    socketMiddleware,
    botMiddleware,
    fileSystemMiddleware,
    scriptMiddleware,
  ]

  //If it's on client side, create a store which will persist
  // const { persistStore, persistReducer } = require('redux-persist')
  // const storage = require('redux-persist/lib/storage').default
  // const persistConfig = {
  //   key: '80bots',
  //   whitelist: ['auth'], // only counter will be persisted, add other reducers if needed
  //   storage, // if needed, use a safer storage
  // }

  // const persistedReducer = persistReducer(persistConfig, rootReducer) // Create a new reducer with our existing reducer

  // Disable Logger at server side.
  if (process.browser && process.env.NODE_ENV !== 'production') {
    middlewares.push(loggerMiddleware)
  }

  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares))
  )
  // store.__PERSISTOR = persistStore(store)

  sagaMiddleware.run(() => saga(store.dispatch, store.getState))

  return store
}
