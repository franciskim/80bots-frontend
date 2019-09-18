import io from 'socket.io-client';
import Echo from 'laravel-echo';
import {
  ADD_LISTENER, REMOVE_LISTENER, REMOVE_ALL_LISTENERS, EMIT_MESSAGE, ADD_EXTERNAL_LISTENER, REMOVE_EXTERNAL_LISTENER,
  REMOVE_ALL_EXTERNAL_LISTENERS, EMIT_EXTERNAL_MESSAGE
} from './types';

export default function createWebSocketMiddleware() {
  return ({ dispatch }) => {
    let socket;
    let externalSocket;
    let rooms = {};

    const init = () => {
      socket = new Echo({
        broadcaster: 'socket.io',
        host: process.env.SOCKET_URL,
        client: io,
        auth: {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      });
    };

    const initExternal = (url, data = {}) => {
      externalSocket = io(url, data);
    };

    return next => action => {
      switch (action.type) {
        case ADD_LISTENER: {
          if(!socket) init();
          if(!rooms[action.data.room]) rooms[action.data.room] = socket.channel(action.data.room);
          return rooms[action.data.room].listen(action.data.eventName, action.data.handler);
        }
        case REMOVE_LISTENER:
          return rooms[action.data.room] && rooms[action.data.room].stopListening(action.data.eventName);
        case REMOVE_ALL_LISTENERS: {
          for(let key in rooms) {
            if (rooms.hasOwnProperty(key)) {
              socket.leave(key);
            }
          }
          rooms = {};
          break;
        }
        case EMIT_MESSAGE:
          return socket.emit(action.data.eventName, action.data.message);

        case ADD_EXTERNAL_LISTENER: {
          if(!externalSocket) initExternal(action.data.url, { query: action.data.payload } );
          externalSocket.on('reconnect', () => externalSocket.emit('join', action.data.room));
          externalSocket.emit('join', action.data.room);
          externalSocket.on(action.data.eventName, action.data.handler);
          break;
        }
        case EMIT_EXTERNAL_MESSAGE: {
          if(!externalSocket) initExternal(action.data.url, { query: action.data.payload });
          return externalSocket.emit(action.data.eventName, action.data.message);
        }

        case REMOVE_EXTERNAL_LISTENER:
          return externalSocket.removeListener(action.data.eventName);
        case REMOVE_ALL_EXTERNAL_LISTENERS: {
          externalSocket.removeAllListeners();
          externalSocket.disconnect();
          externalSocket = null;
          break;
        }

        default: return next(action);
      }
    };
  };
}
