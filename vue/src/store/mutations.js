import Vue from 'vue'

export default {
  SET_ACTIVE_TYPE: (state, { type }) => {
    state.activeType = type
  },

  SET_LIST: (state, { type, ids }) => {
    state.lists[type] = ids
  },

  SET_ITEMS: (state, { items }) => {
    items.forEach(item => {
      if (item) {
        Vue.set(state.items, item.id, item)
      }
    })
  },

  SET_ORGS: (state, { orgs }) => {
    orgs.forEach(org => {
      if (org) {
        // console.log('SET_ORGS:' + org.id)
        Vue.set(state.orgs, org.id, org)
      }
    })
  },

  SET_REPOS: (state, { repos }) => {
    state.repos = {}
    repos.forEach(repo => {
      if (repo) {
        // console.log('SET_REPOS:' + repo.id)
        Vue.set(state.repos, repo.id, repo)
      }
    })
  },

  SET_INSTANCES: (state, { instances }) => {
    state.instances = {}
    instances.forEach(instance => {
      if (instance) {
        // console.log('SET_REPOS:' + repo.id)
        Vue.set(state.instances, instance._id, instance)
      }
    })
  },

  ADD_PROJECT: (state, { project }) => {
    // Vue.set(state.projects, repo.id, repo)
  },

  SET_PROJECTS: (state, { projects }) => {
    state.projectList.splice(0, state.projectList.length)
    projects.forEach(project => {
      if (project) {
        state.projectList.push(project)
        // console.log(project)
        // console.log('SET_REPOS:' + repo.id)
      }
    })
  },

  SET_DATASETS: (state, { datasets }) => {
    state.datasetList.splice(0, state.datasetList.length)
    datasets.forEach(dataset => {
      if (dataset) {
        state.datasetList.push(dataset)
        console.log(dataset)
      }
    })
  },

  SET_DATASET: (state, { currentDataset }) => {
    state.currentDataset = currentDataset
  },

  SET_USER: (state, { id, user }) => {
    Vue.set(state.users, id, user || false) /* false means user not found */
  },

  SET_ACTIVE_PROJECT: (state, { projectId }) => {
    state.activeProjectId = projectId
  },

  SET_ACTIVE_INSTANCE: (state, { instanceId }) => {
    state.activeInstanceId = instanceId
  },

  // ADD_PROJECT: (state, { repo }) => {
  //   Vue.set(state.projects, repo.id, repo)
  // },

  SET_PROFILE: (state, { profile }) => {
    Vue.set(state.profile, 'me', profile)
  },

  SET_USER_ID: (state, { userId }) => {
    state.userId = userId
  },

  SET_DISPLAY_NAME: (state, { displayName }) => {
    state.displayName = displayName
  },

  SET_ACCESS_TOKEN: (state, { token }) => {
    state.accessToken = token
  },

  SET_RAW_IMAGE_LIST: (state, { rawImg }) => {
    state.rawImgList.push(rawImg)
  },

  SET_CROP_IMAGE_LIST: (state, { cropImg }) => {
    state.cropImgList.push(
      {
        name: cropImg.name,
        cropImg: cropImg.cropImg,
        x: cropImg.x,
        y: cropImg.y,
        width: cropImg.width,
        height: cropImg.height,
        cropBoxLeft: cropImg.cropBoxLeft,
        cropBoxTop: cropImg.cropBoxTop,
        cropBoxWidth: cropImg.cropBoxWidth,
        cropBoxHeight: cropImg.cropBoxHeight
      })
  }
}
