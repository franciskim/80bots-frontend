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
import RunningBotsPage from 'pages/bots/running'
import UsersPage from 'pages/users'
import SettingsPage from 'pages/settings'
import SchedulersPage from 'pages/scheduler'
import EditBotPage from 'pages/bot/[id]'
import ViewRunningBotPage from 'pages/bots/running/[id]'
import UpdateBotInstancePage from 'pages/botinstance/[id]'

const routes = [
  {
    path: '/bots/running',
    name: 'Working Bots',
    icon: 'fa fa-robot text-blue',
    // layout: '/admin',
    // miniName: 'R',
    component: RunningBotsPage,
  },
  {
    path: '/botinstance/:id',
    name: 'Update Bot Instance',
    icon: 'fa fa-robot text-blue',
    // layout: '/admin',
    component: UpdateBotInstancePage,
    redirect: true,
  },
  {
    path: '/bots/running/:id',
    name: 'View Running Bot',
    icon: 'fa fa-robot text-blue',
    // layout: '/admin',
    component: ViewRunningBotPage,
    redirect: true,
  },
  {
    path: '/bots',
    name: 'Deploy & Update Bots',
    icon: 'ni ni-archive-2',
    // layout: '/admin',
  },
  {
    path: '/bot',
    name: 'Add New Bot',
    icon: 'fa fa-plus text-green',
    // layout: '/admin',
  },
  {
    path: '/bot/:id',
    name: 'Edit Bot',
    icon: 'fa fa-plus',
    // layout: '/admin',
    component: EditBotPage,
    redirect: true,
  },
  {
    path: '/scheduler',
    name: 'Scheduler',
    icon: 'fa fa-calendar-alt text-purple',
    // layout: '/admin',
    component: SchedulersPage,
  },
  {
    path: '/scheduler/log',
    name: 'Scheduler Log',
    icon: 'fa fa-history',
    // layout: '/admin',
  },
  {
    path: '/settings',
    name: 'AWS AMI Settings',
    icon: 'fa fa-cog text-gray',
    // layout: '/admin',
    component: SettingsPage,
  },
  {
    path: '/users',
    name: 'Users',
    icon: 'fa fa-users text-red',
    // layout: '/admin',
    component: UsersPage,
  },
  {
    path: '/profile',
    name: 'Profile',
    miniName: 'P',
    // layout: '/admin',
    redirect: true,
  },
]

export default routes
