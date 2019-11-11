import {
  OPEN_ITEM,
  CLOSE_ITEM
} from './types';
import {
  listenForWhisper,
  stopListeningForWhisper
} from '../socket/actions';
import {
  getItems,
  addItem
} from './actions';

export default function createBotMiddleware() {
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
      const item = action?.data?.item;
      if(!item) return next(action);
      const {path = ''} = item;
      const signal = `/${path}`;

      switch (action.type) {
        case OPEN_ITEM: {
          switch (item.type) {
            case 'folder': {
              console.debug('SOCKET:STOP_LISTENING', `/${currentState.fileSystem.openedFolder?.path || ''}`)
              dispatch(stopListeningForWhisper(channel, `/${currentState.fileSystem.openedFolder?.path || ''}`));
              break;
            }
            case 'file': {
              console.debug('SOCKET:STOP_LISTENING', `/${currentState.fileSystem.openedFile?.path || ''}`);
              dispatch(stopListeningForWhisper(channel, `/${currentState.fileSystem.openedFile?.path || ''}`));
              break;
            }
          }
          console.debug('SOCKET:START LISTENING', signal);
          dispatch(listenForWhisper(channel, signal, (item) => {
            console.debug(signal, item);
            dispatch(addItem(item));
          }));
          break;
        }
        case CLOSE_ITEM: {
          console.debug('SOCKET:STOP LISTENING', signal);
          dispatch(stopListeningForWhisper(channel, signal));
          if(item.entity === 'folder') {
            // REMOVE FOLDER LISTENING
          } else {
            // REMOVE FILE LISTENING
          }
          break;
        }
      }
      next(action);
    };
  };
}
