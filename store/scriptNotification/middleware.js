import {
  FLUSH_SCRIPT_NOTIFICATION,
  OPEN_SCRIPT_NOTIFICATION,
  CLOSE_SCRIPT_NOTIFICATION,
} from "./types";
import {
  listenForWhisper,
  stopListeningForWhisper,
} from "../socket/actions";
import {
  addScriptNotification
} from "../bot/actions";

export default function scriptNotificationMiddleware() {

  let listeners = [];

  return (storeApi) => {
    const { dispatch } = storeApi;
    return next => action => {
      if(![OPEN_SCRIPT_NOTIFICATION, CLOSE_SCRIPT_NOTIFICATION].includes(action.type)) {
        return next(action);
      }

      const item = action?.data?.item;
      if(!item) return next(action);

      const {signal, channel} = item;

      if(!channel) {
        console.error('Unknown script storage channel');
        return next(action);
      }
      console.log('listeners-------------------------------------------------------------->', listeners);
      switch (action.type) {
        case OPEN_SCRIPT_NOTIFICATION: {
          listeners.forEach(listener => {
            if(listener.signal === item.signal) {
              listener.unsubscribe();
            }
          });
          const listener = {
            channel,
            signal,
            ...item,
            unsubscribe: function () {
              console.debug('SOCKET: STOP LISTEN', this.signal);
              return dispatch(stopListeningForWhisper(this.channel, this.signal));
            },
            subscribe: function () {
              console.debug('SOCKET: LISTEN', this.signal);
              return dispatch(listenForWhisper(this.channel, this.signal, (data) => {
                console.log('fs middleware: {signal, data} -------------------------->', {signal, data});
                if(this.signal === "notification") {
                  dispatch(addScriptNotification(data));
                }
              }));
            }
          };
          listener.subscribe();
          listeners.pop();
          listeners.push(listener);
          break;
        }
        case CLOSE_SCRIPT_NOTIFICATION: {
          const listener = listeners.find(listener => listener.signal === signal && listener.type === item.type && listener.channel === channel);
          if(listener) listener.unsubscribe();
          break;
        }
        case FLUSH_SCRIPT_NOTIFICATION: {
          listeners.forEach(listener => {
            listener.unsubscribe();
          });
          listeners = [];
        }
      }
      next(action);
    };
  };
}
