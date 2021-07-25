/*!

=========================================================
* NextJS Argon Dashboard PRO - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-argon-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import RunningBotsPage from 'pages/admin/bots/running'
import UsersPage from 'pages/admin/users'
import SettingsPage from 'pages/admin/settings'
import SchedulersPage from 'pages/admin/scheduler'

const routes = [
  {
    name: 'Dashboards',
    icon: 'ni ni-shop text-primary',
    path: '/dashboard',
    miniName: 'D',
    layout: '/admin',
  },
  {
    path: '/bots/running',
    name: 'Working Bots',
    icon: 'fa fa-robot text-blue',
    layout: '/admin',
    component: RunningBotsPage,
  },
  {
    path: '/bots',
    name: 'Deploy & Update Bots',
    icon: 'ni ni-archive-2',
    layout: '/admin',
  },
  {
    path: '/bot',
    name: 'Add New Bot',
    icon: 'fa fa-plus',
    layout: '/admin',
  },
  {
    path: '/scheduler',
    name: 'Scheduler',
    icon: 'fa fa-calendar-alt',
    layout: '/admin',
    component: SchedulersPage,
  },
  {
    path: '/scheduler/log',
    name: 'Scheduler Log',
    icon: 'fa fa-history',
    layout: '/admin',
  },
  {
    path: '/bots/settings',
    name: 'AWS AMI Settings',
    icon: 'fa fa-cog',
    layout: '/admin',
    component: SettingsPage,
  },
  {
    path: '/users',
    name: 'Users',
    icon: 'fa fa-users',
    layout: '/admin',
    component: UsersPage,
  },
  {
    collapse: true,
    name: 'Examples',
    icon: 'ni ni-ungroup text-orange',
    state: 'examplesCollapse',
    views: [
      {
        path: '/pricing',
        name: 'Pricing',
        miniName: 'P',
        layout: '/auth',
      },
      {
        path: '/login',
        name: 'Login',
        miniName: 'L',
        layout: '/auth',
      },
      {
        path: '/register',
        name: 'Register',
        miniName: 'R',
        layout: '/auth',
      },
      {
        path: '/lock',
        name: 'Lock',
        miniName: 'L',
        layout: '/auth',
      },
      {
        path: '/timeline',
        name: 'Timeline',
        miniName: 'T',
        layout: '/admin',
      },
      {
        path: '/profile',
        name: 'Profile',
        miniName: 'P',
        layout: '/admin',
      },
      {
        path: '/rtl-support',
        name: 'RTL Support',
        miniName: 'RS',
        layout: '/rtl',
      },
    ],
  },
  {
    collapse: true,
    name: 'Components',
    icon: 'ni ni-ui-04 text-info',
    state: 'componentsCollapse',
    views: [
      {
        path: '/buttons',
        name: 'Buttons',
        miniName: 'B',
        layout: '/admin',
      },
      {
        path: '/cards',
        name: 'Cards',
        miniName: 'C',
        layout: '/admin',
      },
      {
        path: '/grid',
        name: 'Grid',
        miniName: 'G',
        layout: '/admin',
      },
      {
        path: '/notifications',
        name: 'Notifications',
        miniName: 'N',
        layout: '/admin',
      },
      {
        path: '/icons',
        name: 'Icons',
        miniName: 'I',
        layout: '/admin',
      },
      {
        path: '/typography',
        name: 'Typography',
        miniName: 'T',
        layout: '/admin',
      },
      {
        collapse: true,
        name: 'Multi Level',
        miniName: 'M',
        state: 'multiCollapse',
        views: [
          {
            path: '#pablo',
            name: 'Third level menu',
            layout: '/',
          },
          {
            path: '#pablo',
            name: 'Just another link',
            layout: '/',
          },
          {
            path: '#pablo',
            name: 'One last link',
            layout: '/',
          },
        ],
      },
    ],
  },
  {
    collapse: true,
    name: 'Forms',
    icon: 'ni ni-single-copy-04 text-pink',
    state: 'formsCollapse',
    views: [
      {
        path: '/elements',
        name: 'Elements',
        miniName: 'E',
        layout: '/admin',
      },
      {
        path: '/components',
        name: 'Components',
        miniName: 'C',
        layout: '/admin',
      },
      {
        path: '/validation',
        name: 'Validation',
        miniName: 'V',
        layout: '/admin',
      },
    ],
  },
  {
    collapse: true,
    name: 'Tables',
    icon: 'ni ni-align-left-2 text-default',
    state: 'tablesCollapse',
    views: [
      {
        path: '/tables',
        name: 'Tables',
        miniName: 'T',
        layout: '/admin',
      },
      {
        path: '/sortable',
        name: 'Sortable',
        miniName: 'S',
        layout: '/admin',
      },
      {
        path: '/react-bs-tables',
        name: 'React BS Tables',
        miniName: 'RBT',
        layout: '/admin',
      },
    ],
  },
  {
    path: '/widgets',
    name: 'Widgets',
    icon: 'ni ni-archive-2 text-green',
    layout: '/admin',
  },
  {
    path: '/charts',
    name: 'Charts',
    icon: 'ni ni-chart-pie-35 text-info',
    layout: '/admin',
  },
]

export default routes
