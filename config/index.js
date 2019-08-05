import { css } from '@emotion/core';

export const theme = {
  colors: {
    primary: '#0492fe',
    clearBlue: '#27a2ff',
    clearBlueTwo: '#5cb3f5',
    mediumGreen: '#35ad45',
    clearGreen: '#19ad7a',
    darkishPink: '#e54d93',
    pink: '#e56fbc',
    blueGrey: '#7f8fa4',
    darkGreyBlue: '#354052',
    grey: '#dddddd',
    paleGrey: '#f8f9fb',
    slate: '#475364',
    silver: '#ced0da',
    orange: '#eab550',
    black: '#0a0a0a',
    white: '#ffffff'
  }
};

export const notificationTypes = {
  HELP: 'help',
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info'
};

export const notificationTimings = {
  DURATION: 200,
  INFO_HIDE_DELAY: 2000,
  HELP_HIDE_DELAY: 5000
};

export const globalStyles = css`
  body {
    margin: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 5px;
      background-color: transparent;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: ${theme.colors.clearBlue}
    }
  }
  #__next {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`;