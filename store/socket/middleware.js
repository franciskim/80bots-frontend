import io from 'socket.io-client';
import Echo from 'laravel-echo';

import { ADD_LISTENER, REMOVE_LISTENER, REMOVE_ALL_LISTENERS, EMIT_MESSAGE } from './types';

export default function createWebSocketMiddleware() {
  return ({ dispatch }) => {
    let socket;
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
            // eslint-disable-next-line no-prototype-builtins
            if (rooms.hasOwnProperty(key)) {
              socket.leave(key);
            }
          }
          rooms = {};
          break;
        }
        case EMIT_MESSAGE:
          return socket.emit(action.data.eventName, action.data.message);
        default: return next(action);
      }
    };
  };
}