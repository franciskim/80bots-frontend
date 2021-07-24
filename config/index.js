
export const ROUTES = [
    {name: "Working Bots", href: "/bots/running"},
    {name: "Deploy & Update Bots", href: "/bots"},
    {name: "Add New Bot", href: "/bot"},
    {name: "Scheduler", href: "/scheduler"},
    {name: "Scheduler Log", href: "/scheduler/log"},
    {name: "AWS AMI Settings", href: "/bots/settings"},
    {name: "Users", href: "/users"}
];

export const WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Everyday",
];

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

// export const globalStyles = css`
//   @import url("https://fonts.googleapis.com/css?family=Anonymous+Pro:400,400i,700,700i&display=swap");
//   @import url("https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/3.1.3/react-datepicker.min.css");

//   body {
//     font-family: "Anonymous Pro", monospace;
//     background: #333;
//     margin: 0;
//     display: flex;
//     flex-direction: column;
//     min-height: 100vh;
//     overflow-x: hidden;
//     line-height: 1.6;

//     &::-webkit-scrollbar {
//       width: 5px;
//       height: 5px;
//       border-radius: 10px;
//       background: transparent;
//     }

//     &::-webkit-scrollbar-track {
//       background-color: transparent;
//     }

//     &::-webkit-scrollbar-thumb {
//       border-radius: 5px;
//       background: ${theme.colors.primary};
//     }

//     &::-webkit-scrollbar-thumb:horizontal {
//       border-radius: 5px;
//       background-color: ${theme.colors.primary};
//     }
//   }

//   #__next {
//     display: flex;
//     flex-direction: column;
//     flex: 1;
//   }

//   btn, .btn-primary {
//     background-color: #7dffff;
//     border-color: #7dffff;
//     color: #333;

//     &:hover {
//       background-color: #7dffff;
//       border-color: #7dffff;
//       color: #000;
//     }
//   }

//   .btn:active, .btn-primary:not(:disabled):not(.disabled).active,
//   .btn-primary:not(:disabled):not(.disabled):active,
//   .show > .btn-primary.dropdown-toggle,
//   .btn-primary:not(:disabled):not(.disabled).active:focus,
//   .btn-primary:not(:disabled):not(.disabled):active:focus,
//   .show > .btn-primary.dropdown-toggle:focus,
//   .btn-primary.focus,
//   .btn-primary:focus {
//     background-color: #ff7d7d;
//     border-color: #ff7d7d;
//     color: #333;
//     box-shadow: transparent;
//     transition: all 0.2s ease;
//   }

//   .DraftEditor-editorContainer,
//   .DraftEditor-root,
//   .public-DraftEditor-content {
//     height: auto;
//   }

//   a {
//     color: #7dffff;
//   }

//   a:hover {
//     #ff7d7d;
//     text-decoration: underline;
//   }

//   tr.running div[class*='singleValue'] {
//     color: #ff7d7d;
//   }

//   tr.not-running, tr.not-running div[class*='singleValue'] {
//     color: #bbb;
//   }

//   tr.terminated, tr.terminated div[class*='singleValue'] {
//     color: #777;
//   }

//   body .nav-tabs .nav-link.active {
//     background-color: #333;
//     color: #7dffff;
//   }

//   body .nav-tabs .nav-link:hover {
//     color: #7dffff;
//   }

// `;
