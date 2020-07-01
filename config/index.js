import { css } from "@emotion/core";

export const ROUTES = [
    { name: "Users", href: "/users" },
    { name: "Workforce", href: "/bots/running" },
    { name: "Deploy Bots", href: "/bots" },
    { name: "Add Bot", href: "/bots/add" },
    { name: "Schedule Bots", href: "/schedule" },
    { name: "Sessions", href: "/sessions" },
    { name: "AWS AMI Settings", href: "/bots/settings" },
];

export const theme = {
  colors: {
    cyan: "#7dffff",
    pink: "#ff7d7d",
    blue: "#007bff",
    darkBlue: "#3490dc",
    primary: "#7dffff",
    clearBlue: "#27a2ff",
    clearBlueTwo: "#5cb3f5",
    mediumGreen: "#35ad45",
    clearGreen: "#19ad7a",
    darkishPink: "#e54d93",
    darkishPink2: "#dc1c74",
    blueGrey: "#7f8fa4",
    darkGreyBlue: "#354052",
    grey: "#dddddd",
    darkGrey: "#6c757d",
    paleGrey: "#f8f9fb",
    darkerGrey: "#333333",
    slate: "#475364",
    silver: "#ced0da",
    orange: "#eab550",
    black: "#0a0a0a",
    white: "#ffffff",
    whiteGrey: "#eeeeee",
    purple: "#6f42c1",
    table: {
      color: "#fff",
      border: "none",
      headerColor: "#7dffff",
      headerBackground: "#333"
    }
  }
};

export const NOTIFICATION_TYPES = {
  HELP: "help",
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info"
};

export const NOTIFICATION_TIMINGS = {
  DURATION: 200,
  INFO_HIDE_DELAY: 2000,
  HELP_HIDE_DELAY: 5000
};

export const SIDEBAR_ANIMATION_TIME = 250;

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const globalStyles = css`
  @import url("https://fonts.googleapis.com/css?family=Anonymous+Pro:400,400i,700,700i&display=swap");

  body {
    font-family: "Anonymous Pro", monospace;
    background: #333;
    margin: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow-x: hidden;
    line-height: 1.6;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      border-radius: 10px;
      background: transparent;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: ${theme.colors.primary};
    }
    &::-webkit-scrollbar-thumb:horizontal {
      border-radius: 5px;
      background-color: ${theme.colors.primary};
    }
  }
  #__next {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  btn, .btn-primary {
    background-color: #7dffff;
    border-color: #7dffff;
    color: #333;
    &:hover {
      background-color: #7dffff;
      border-color: #7dffff;
      color: #000;
    }
  }
  
  .btn:active, .btn-primary:not(:disabled):not(.disabled).active,
  .btn-primary:not(:disabled):not(.disabled):active,
  .show > .btn-primary.dropdown-toggle,
  .btn-primary:not(:disabled):not(.disabled).active:focus,
  .btn-primary:not(:disabled):not(.disabled):active:focus,
  .show > .btn-primary.dropdown-toggle:focus,
  .btn-primary.focus,
  .btn-primary:focus {
    background-color: #ff7d7d;
    border-color: #ff7d7d;
    color: #333;
    box-shadow: transparent;
    transition: all 0.2s ease;
  }
  .DraftEditor-editorContainer,
  .DraftEditor-root,
  .public-DraftEditor-content {
    height: auto;
  }
  
  a {
    color: #7dffff;
  }
  
  a:hover {
    #ff7d7d;
    text-decoration: underline;
  }

  tr.running div[class*='singleValue'] {
    color: #ff7d7d;
  }
    
  tr.not-running, tr.not-running div[class*='singleValue'] {
    color: #bbb;
  }
  
  tr.terminated, tr.terminated div[class*='singleValue'] {
    color: #777;
  } 

`;
