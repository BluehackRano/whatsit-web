// this is aliased in webpack config based on server/client build
import { createAPI } from 'create-api'
import GitHub from 'github-api'
import WhatsIt from 'whatsit-sdk-js'
// import WhatsIt from '/Users/daesubkim/Desktop/WhatsIt/whatsit-sdk-js/dist/WhatsIt'

let auth = require('../util/auth')

const logRequests = !!process.env.DEBUG_API

const api = createAPI({
  version: '/v0',
  config: {
    databaseURL: 'https://hacker-news.firebaseio.com'
  }
})

// warm the front page cache every 15 min
// make sure to do this only once across all requests
if (api.onServer) {
  warmCache()
}

function warmCache () {
  fetchItems((api.cachedIds.top || []).slice(0, 30))
  setTimeout(warmCache, 1000 * 60 * 15)
}

function fetch (child) {
  logRequests && console.log(`fetching ${child}...`)
  const cache = api.cachedItems
  if (cache && cache.has(child)) {
    logRequests && console.log(`cache hit for ${child}.`)
    return Promise.resolve(cache.get(child))
  } else {
    return new Promise((resolve, reject) => {
      api.child(child).once('value', snapshot => {
        const val = snapshot.val()
        // mark the timestamp when this item is cached
        if (val) val.__lastUpdated = Date.now()
        cache && cache.set(child, val)
        logRequests && console.log(`fetched ${child}.`)
        resolve(val)
      }, reject)
    })
  }
}

export function fetchIdsByType (type) {
  return api.cachedIds && api.cachedIds[type]
    ? Promise.resolve(api.cachedIds[type])
    : fetch(`${type}stories`)
}

export function fetchItem (id) {
  return fetch(`item/${id}`)
}

export function fetchItems (ids) {
  return Promise.all(ids.map(id => fetchItem(id)))
}

export function fetchOrgs (token) {
  return new Promise ((resolve, reject) => {
    var github = new GitHub({token: token})
    github.getUser().listOrgs().then(orgs => {
      console.log(orgs)
      if (orgs != null && orgs.data.length > 0) {
        console.log(orgs.data)
        resolve(orgs.data)
      } else {
        reject('null')
      }
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}

import axios from 'axios'
export function fetchProfile (token) {
  let aProvider = auth.getProvider()

  if (aProvider == 'github') {
    return new Promise ((resolve, reject) => {
      var github = new GitHub({token: token})
      github.getUser().getProfile().then(profile => {
        console.log(profile.data)
        resolve(profile.data)
      }).catch(err => {
        auth.clear()
        console.error(err)
        reject(err)
      })
    })
  }
  else if (aProvider == 'google') {
    return new Promise ((resolve, reject) => {
      axios.get('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token)
        .then(function (response) {
          console.log(response.data)
          let profileData = {
            login: response.data.email,
            avatar_url: response.data.picture,
            email: response.data.email
          }
          resolve(profileData)
        })
        .catch(function (err) {
          console.log(err)
          reject(err)
        })
    })
  }
}

// /projects  GET
export function fetchProjects (userId) {
  return new Promise ((resolve, reject) => {
    var whatsit = new WhatsIt({})
    var data = {
      userId: userId
    }
    whatsit.getProject().getProjectsByUser(data).then(res => {
      // console.log(res)
      resolve(res.data.data.projects)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

// /projects	POST
export function addProject (project) {
  return new Promise ((resolve, reject) => {
    var whatsit = new WhatsIt({})
    whatsit.getProject().addProject(project).then(res => {
      console.log(res)
      resolve(res.data)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

// /projects/{projectId}/trainset	GET
export function getProjectTrainset (projectId, options) {
  return new Promise ((resolve, reject) => {
    var whatsit = new WhatsIt({})
    whatsit.getProject().getTrainset(projectId, options).then(res => {
      console.log(res)
      // resolve(res)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

// /datasets  GET
export function fetchDatasets (projectId) {
  return new Promise ((resolve, reject) => {
    var whatsit = new WhatsIt({})
    var queryParam = {
      projectId: projectId
    }
    whatsit.getDataset().getDatasetByProjectId(queryParam).then(res => {
      console.log(res.data.Datasets)
      resolve(res.data.data.Datasets)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

// /datasets	POST
export function addDataset (dataset) {
  return new Promise ((resolve, reject) => {
    var whatsit = new WhatsIt({})
    console.log('addDataset API ')
    console.log(dataset)
    whatsit.getDataset().addDataset(dataset).then(res => {
      if (res != null) {
        console.log(res)
        resolve(res.data)
      }
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}

// /datasets/{datasetId} GET
export function fetchDataset (datasetId, count) {
  return new Promise ((resolve, reject) => {
    var whatsit = new WhatsIt({})
    console.log('getDataset API ')
    console.log(`datasetId : ${datasetId}`)
    if (count) {
      console.log(`count : ${count}`)
    }
    whatsit.getDataset().getDatasetByDatasetId(datasetId).then(res => {
      if (res != null) {
        console.log(res.data.data.data[0])
        resolve(res.data.data.data[0])
      }
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}

// /datasets/{datasetId} PUT
export function updateDataset (options, datasetId) {
  return new Promise ((resolve, reject) => {
    var whatsit = new WhatsIt({})
    console.log('putDataset API ')
    console.log(options)
    console.log(datasetId)

    whatsit.getDataset().updateDatasetContent(options, datasetId).then(res => {
    // whatsit.getDataset().putDataset(options, datasetId).then(res => {
      if (res != null) {
        console.log(res)
        resolve(res.data)
      }
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}

// /datasets/{datasetId}/contents GET
export function fetchDatasetContents (datasetId, options) {
  return new Promise ((resolve, reject) => {
    var whatsit = new WhatsIt({})
    console.log(`getDatasetContents API\n datasetId : ${datasetId}\n options : ${JSON.stringify(options)}`)
    whatsit.getDataset().getDatasetContent(options, datasetId).then(res => {
      if (res != null) {
        console.log(res.data.data)
        resolve(res.data.data)
      }
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}

// /datasets/{datasetId} PUT
// export function updateDataset (options, datasetId) {
//   return new Promise ((resolve, reject) => {
//     var whatsit = new WhatsIt({})
//     console.log('putDataset API ')
//     console.log(options)
//     console.log(datasetId)
//     whatsit.getDataset().putDataset(options, datasetId).then(res => {
//       if (res != null) {
//         console.log(res)
//         resolve(res.data)
//       }
//     }).catch(err => {
//       console.error(err)
//       reject(err)
//     })
//   })
// }

export function fetchRepos(token) {
  return new Promise ((resolve, reject) => {
    var github = new GitHub({token: token})
    github.getUser().listRepos({type: 'owner'}).then(repos => {
      console.log(repos)
      if (repos != null && repos.data.length > 0) {
        resolve(repos.data)
      }
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}

export function fetchInstancesByUser(userId) {
  return new Promise ((resolve, reject) => {
    var whatsit = new WhatsIt({})
    console.log('fetchInstancesByUser: ' + userId)
    whatsit.getInstance().getInstancesByUser(userId).then(res => {
      console.log('.......')
      console.log(res)
      if (res != null) {
        resolve(res.data.data.instances)
      }
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}

export function fetchOrgRepos(organization, token) {
  return new Promise ((resolve, reject) => {
    var github = new GitHub({token: token})
    github.getOrganization(organization).getRepos().then(repos => {
      console.log(repos)
      if (repos != null && repos.data.length > 0) {
        resolve(repos.data)
      }
    }).catch(err => {
        console.error(err)
      reject(err)
    })
  })
}

export function fetchUser (id) {
  return fetch(`user/${id}`)
}

export function watchList (type, cb) {
  let first = true
  const ref = api.child(`${type}stories`)
  const handler = snapshot => {
    if (first) {
      first = false
    } else {
      cb(snapshot.val())
    }
  }
  ref.on('value', handler)
  return () => {
    ref.off('value', handler)
  }
}

export function updateUserProfile(profile) {
  return new Promise ((resolve, reject) => {
    var whatsit = new WhatsIt({})
    var data = {
      login: profile.me.login,
      avatarUrl: profile.me.avatar_url,
      email: profile.me.email,
      oauthProvider: "github"
    }
    whatsit.getUser().updateProfile(data).then(res => {
      console.log(res)
      if (res!= null) {
        resolve(res.data)
      }
    }).catch(err => {
        console.error(err)
      reject(err)
    })
  })
}

export function getRawImages(userId, projectId) {
  return new Promise ((resolve, reject) => {
    var whatsit = new WhatsIt({})
    var data = {
      userId: userId,
      projectId: projectId,
    }
    whatsit.getImageInstance().getImages(data.userId, data.projectId).then(res => {
      console.log(res)
      resolve(res.data)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

// export function addProject(repo, userId) {
//   return new Promise ((resolve, reject) => {
//     var whatsit = new WhatsIt({})
//
//     console.log('project = ' + repo)
//     var data = {
//       name: repo.name,
//       full_name: repo.full_name,
//       owner: userId,
//       html_url: repo.html_url,
//       git_url: repo.git_url,
//       provider: "github"
//     }
//     console.log(data)
//     whatsit.getProject().addProject(data).then(res => {
//       console.log(res)
//     if (res!= null) {
//       resolve(res.data)
//     }
//   }).catch(err => {
//       console.error(err)
//     reject(err)
//   })
// })
// }

export function addInstance(projectId) {
  return new Promise ((resolve, reject) => {
    var whatsit = new WhatsIt({})

    console.log('addInstance: projectId = ' + projectId)
    var data = {
      projectId: projectId
    }
    whatsit.getInstance().addInstance(data).then(res => {
      console.log(res)
      if (res!= null) {
        resolve(res.data)
      }
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}
