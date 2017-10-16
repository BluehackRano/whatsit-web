import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      accessToken: null,
      userId: null,
      displayName: null,
      projectList: [ /* { id: name: thumbnail: } */ ],
      projectLabelList: [ /* ['shirts'], */ ],
      datasetList: [ /* { projectId: id:  } */ ],
      datasetContentList: [ /* { _id: objects: labels: } */ ],
      currentDatasetImageList: null,
      rawImgList: [],
      cropImgList: [],
      activeType: null,
      activeProjectId: null,
      activeInstanceId: null,
      itemsPerPage: 20,
      items: {/* [id: number]: Item */},
      orgs: {},
      profile: {},
      projects: {},
      repos: {/* [id: string]: Repo */},
      instances: {/* [id: string]: Repo */},
      users: {/* [id: string]: User */},
      lists: {
        top: [/* number */],
        new: [],
        show: [],
        ask: [],
        job: []
      }
    },
    actions,
    mutations,
    getters
  })
}
