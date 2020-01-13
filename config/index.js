import { css } from '@emotion/core';

export const ROUTES = {
  Admin: [
    { name: 'Users', href: '/admin/users' },
    { name: 'Running Bots', href: '/admin/bots/running' },
    { name: 'Available Bots', href: '/admin/bots' },
    { name: 'Bots Settings', href: '/admin/bots/settings' },
    { name: 'Bots Schedule', href: '/admin/schedule' },
    { name: 'Bots Sessions', href: '/admin/sessions' },
    { name: 'Subscription Plans', href: '/admin/subscriptions' },
    { name: 'Credit Usage History', href: '/admin/history' },
    { name: 'Low Credit Notifications', href: '/admin/notifications' },
    { name: 'CMS', href: '/admin/cms' },
  ],
  User: [
    { name: 'Running Bots', href: '/bots/running' },
    { name: 'Available Bots', href: '/bots' },
    { name: 'Bots Schedule', href: '/schedule' },
    { name: 'My Subscription', href: '/subscription' },
    { name: 'Credit Usage History', href: '/history' }
  ]
};

export const theme = {
  colors: {
    blue: '#007bff',
    darkBlue: '#3490dc',
    primary: 'hsl(200, 100%, 40%)',
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
    purple: '#6f42c1',
    table: {
      color: '#212529',
      border: '#dee2e6',
      headerColor: '#868e96',
      headerBackground: '#e8e9ef'
    }
  }
};

export const NOTIFICATION_TYPES = {
  HELP: 'help',
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info'
};

export const NOTIFICATION_TIMINGS = {
  DURATION: 200,
  INFO_HIDE_DELAY: 2000,
  HELP_HIDE_DELAY: 5000
};

export const BILLING_DETAILS = {
  company: '80bots',
  image: 'public/images/logos/stripe.svg',
  currency: 'USD',
  locale: 'en',
  shippingAddress: false,
  billingDetails: false,
  zipCode: false,
  alipay: true,
  bitcoin: true,
  allowRememberMe: true,
};

export const SIDEBAR_ANIMATION_TIME = 250;

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const globalStyles = css`

  @import url('https://fonts.googleapis.com/css?family=Anonymous+Pro:400,400i,700,700i&display=swap');

  body {
    font-family: 'Anonymous Pro', monospace;
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
  .DraftEditor-editorContainer, .DraftEditor-root, .public-DraftEditor-content {
    height: auto;
  }
`;
