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
  addScriptNotification, updateLastNotification,
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
      console.log('{signal, channel} ', {signal, channel} );
      if(!channel) {
        console.error('Unknown script storage channel');
        return next(action);
      }
      const listener = {
        channel,
        signal,
        ...item,
        unsubscribe: () => {
          console.debug('SOCKET: STOP LISTEN ', signal);
          return dispatch(stopListeningForWhisper(channel, signal));
        },
        subscribe: () => {
          console.debug('SOCKET: LISTEN ', signal);
          return dispatch(listenForWhisper(channel, signal, (data) => {
            console.log({signal, data});
            if(signal === "notification") {
              dispatch(addScriptNotification(data));
              dispatch(updateLastNotification(data.instanceId, data.date + ' : ' + data.notification));
            }
          }));
        }
      };

      switch (action.type) {
        case OPEN_SCRIPT_NOTIFICATION: {
          listener.subscribe();
          const isListener = listeners.some(
            item => item.channel === channel
          );
          if(!isListener) {
            listeners.push(listener);
          }
          break;
        }
        case CLOSE_SCRIPT_NOTIFICATION: {
          const listenerIdx = listeners.findIndex(
            item => item.channel === channel
          );
          if(listenerIdx > -1) {
            listeners = listeners.splice(listenerIdx, 1);
            listener.unsubscribe();
          }
          break;
        }
        case FLUSH_SCRIPT_NOTIFICATION: {
          listeners.forEach(item => {
            item.unsubscribe();
          });
          listeners = [];
        }
      }
      next(action);
    };
  };
}
