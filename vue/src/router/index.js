import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'

// Containers
import Full from 'views/Full/Full'

// Views
import Login from 'views/Login'
import Dashboard from 'views/Dashboard/Dashboard'
import Projects from 'views/Project/Projects'
import CreateProject from 'views/Project/CreateProject'
import Datasets from 'views/Dataset/Datasets'
import InstanceDetail from 'views/DashboardVues//InstanceDetail'
import AddProject from 'views/ProjectsVues/AddProject'
import AddProjectCard from 'views/Dashboard/AddProjectCard'

Vue.use(Router)
Vue.use(Resource)

Vue.http.options.root = 'http://app.whatsit.net'
//
// export default new Router({
//   mode: 'hash',
//   linkActiveClass: 'open active',
//   scrollBehavior: () => ({ y: 0 }),
//   routes: [
//     {
//       path: '/',
//       redirect: '/dashboard',
//       name: 'Home',
//       component: Full,
//       children: [
//         {
//           path: 'dashboard',
//           name: 'Dashboard',
//           component: Dashboard
//         },
//         {
//           path: 'projects',
//           name: 'Projects',
//           component: Projects
//         }
//
//       ]
//     },
//     {
//       path: '/login',
//       name: 'Login',
//       component: Login
//     },
//     {
//       path: '*',
//       redirect: '/'
//     }
//   ]
// })

export function createRouter () {
  return new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    // routes: [
    // // { path: '/top/:page(\\d+)?', component: createListView('top') },
    // // { path: '/new/:page(\\d+)?', component: createListView('new') },
    // // { path: '/show/:page(\\d+)?', component: createListView('show') },
    // // { path: '/ask/:page(\\d+)?', component: createListView('ask') },
    // // { path: '/job/:page(\\d+)?', component: createListView('job') },
    // {path: '/dashboard', component: Dashboard},
    // {path: '/projects', component: Projects},
    // {path: '/login', component: Login},
    // {path: '/', redirect: '/dashboard', component: Full}
    // ]
    routes: [
      {
        path: '/',
        name: 'Full',
        component: Full,
        redirect: '/project/projects',
        // redirect: '/dashboard',
        children: [
          {
            path: 'project',
            name: 'Project',
            redirect: '/project/projects',
            component: {
              render (c) { return c('router-view') }
            },
            children: [
              {
                path: 'projects',
                name: 'Projects',
                component: Projects
              },
              {
                path: 'createProject',
                name: 'CreateProject',
                component: CreateProject
              },
              {
                path: ':projectId',
                redirect: ':projectId/datasets',
                component: {
                  render (c) { return c('router-view') }
                },
                children: [
                  {
                    path: 'datasets',
                    name: 'Datasets',
                    component: Datasets
                  }
                ]
              }
            ]
          },
          {
            path: 'dashboard',
            name: 'Dashboard',
            component: Dashboard
          }
        ]
      }
    ]
  })
}
