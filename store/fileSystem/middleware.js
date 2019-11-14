import {
  OPEN_ITEM,
  CLOSE_ITEM,
  FLUSH,
} from './types';
import {
  listenForWhisper,
  stopListeningForWhisper,
} from '../socket/actions';
import {
  addItem,
  open,
} from './actions';

export default function createBotMiddleware() {

  let listeners = [];

  return (storeApi) => {
    const { dispatch, getState } = storeApi;
    return next => action => {
      if(![OPEN_ITEM, CLOSE_ITEM].includes(action.type)) {
        return next(action);
      }
      const currentState = getState();
      const channel = currentState.bot?.botInstance?.storage_channel;
      if(!channel) {
        console.error('Unknown bot storage channel');
        return next(action);
      }
      let item = action?.data?.item;
      if(!item) return next(action);
      const {path = ''} = item;
      const signal = `/${path}`;

      switch (action.type) {
        case OPEN_ITEM: {
          listeners.forEach(listener => {
            if(listener.type === item.type) {
              listener.unsubscribe();
            }
          });
          const listener = {
            channel,
            signal,
            ...item,
            unsubscribe: function () {
              console.debug('SOCKET: STOP LISTEN', this.signal)
              return dispatch(stopListeningForWhisper(this.channel, this.signal));
            },
            subscribe: function () {
              console.debug('SOCKET: LISTEN', this.signal)
              return dispatch(listenForWhisper(this.channel, this.signal, (data) => {
                const state = getState();
                const fileSystem = state.fileSystem || {};
                const { openedFile, openedFolder } = fileSystem;
                if(this.signal === `/${openedFolder?.path}`) {
                  dispatch(addItem(data));
                }
                if(this.signal === `/${openedFile?.path}`) {
                  dispatch(open(data));
                }
              }));
            }
          };
          listener.subscribe();
          listeners.push(listener);
          break;
        }
        case CLOSE_ITEM: {
          const listener = listeners.find(listener => listener.signal === signal && listener.type === item.type && listener.channel === channel);
          if(listener) listener.unsubscribe();
          break;
        }
        case FLUSH: {
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
