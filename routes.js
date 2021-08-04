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
const routes = [
  {
    path: '/bots/running',
    name: 'Working Bots',
    icon: 'fa fa-robot text-blue',
    // miniName: 'R',
  },
  {
    path: '/botinstance/:id',
    name: 'Update Bot Instance',
    icon: 'fa fa-robot text-blue',
    redirect: true,
  },
  {
    path: '/bots/running/:id',
    name: 'View Running Bot',
    icon: 'fa fa-robot text-blue',
    redirect: true,
  },
  {
    path: '/bots',
    name: 'Deploy & Update Bots',
    icon: 'ni ni-archive-2',
  },
  {
    path: '/bot',
    name: 'Add New Bot',
    icon: 'fa fa-plus text-green',
  },
  {
    path: '/bot/:id',
    name: 'Edit Bot',
    icon: 'fa fa-plus',
    redirect: true,
  },
  {
    path: '/scheduler',
    name: 'Scheduler',
    icon: 'fa fa-calendar-alt text-purple',
  },
  {
    path: '/scheduler/log',
    name: 'Scheduler Log',
    icon: 'fa fa-history',
  },
  {
    path: '/settings',
    name: 'AWS AMI Settings',
    icon: 'fa fa-cog text-gray',
  },
  {
    path: '/users',
    name: 'Users',
    icon: 'fa fa-users text-red',
  },
  {
    path: '/profile',
    name: 'Profile',
    miniName: 'P',
    redirect: true,
  },
]

export default routes
