import { css } from '@emotion/core';

export const theme = {
  colors: {
    blue: '#007bff',
    darkBlue: '#3490dc',
    primary: '#0492fe',
    clearBlue: '#27a2ff',
    clearBlueTwo: '#5cb3f5',
    mediumGreen: '#35ad45',
    clearGreen: '#19ad7a',
    darkishPink: '#e54d93',
    darkishPink2: '#dc1c74',
    pink: '#e56fbc',
    blueGrey: '#7f8fa4',
    darkGreyBlue: '#354052',
    grey: '#dddddd',
    darkGrey: '#6c757d',
    paleGrey: '#f8f9fb',
    slate: '#475364',
    silver: '#ced0da',
    orange: '#eab550',
    black: '#0a0a0a',
    white: '#ffffff',
    whiteGrey: '#eeeeee',
    purple: '#6f42c1'
  }
};

export const NOTIFICATION_TYPES = {
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

export const SIDEBAR_ANIMATION_TIME = 250;

export const globalStyles = css`
  @font-face {
    font-family: Overpass, monospace;
    font-weight: normal;
    src: url("/static/fonts/overpass-mono/overpass-mono-regular.otf");
  }
  
  @font-face {
    font-family: Overpass, monospace;
    font-weight: bold;
    src: url("/static/fonts/overpass-mono/overpass-mono-bold.otf");
  }
  
  @font-face {
    font-family: Overpass, monospace;
    font-weight: 300;
    src: url("/static/fonts/overpass-mono/overpass-mono-light.otf");
  }
  
  @font-face {
    font-family: Overpass, monospace;
    font-weight: 600;
    src: url("/static/fonts/overpass-mono/overpass-mono-semibold.otf");
  }

  body {
    font-family: Overpass, monospace;
    margin: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow-x: hidden;
    line-height: 1.6;
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
  
  .btn-primary {
    background-color: hsl(200, 100%, 40%) !important;
    border-color: hsl(200, 100%, 40%) !important;
    &:hover {
      background-color: hsl(200, 100%, 35%) !important;
      border-color: hsl(200, 100%, 35%) !important;
    }
  }
  
  .btn, .btn:active {
    box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08) !important;
    transition: all .20s ease;
  }
`;