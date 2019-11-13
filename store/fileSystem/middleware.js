import {
  OPEN_ITEM,
  CLOSE_ITEM,
  FLUSH
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
          console.debug({item, prev: currentState.fileSystem.openedFolder})
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
          dispatch(listenForWhisper(channel, signal, (data) => {
            const state = getState();
            const fileSystem = state.fileSystem || {};
            const { openedFile, openedFolder } = fileSystem;
            if(signal === `/${openedFolder?.path}`) {
              dispatch(addItem(data));
            }
            if(signal === `/${openedFile?.path}`) {
              dispatch(open(data));
            }
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
