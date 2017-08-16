let auth = require('../../../util/auth')

export const Full = {
  beforeCreate: function () {
    console.log('Full: beforeCreate')
    var aToken = this.$route.query.accessToken
    if (aToken !== undefined && aToken !== null) {
      auth.setToken(aToken)
    }

    if (!auth.isAuthenticated()) {
      console.log('Error : no access-token')
      auth.clear()
      window.location.href = 'http://login.whatsit.net'
    } else {
      console.log('Authorized User')
      // drawComponents()
      restoreFromLocalStorage(this.$store)
      var hash = this.$route.hash
      hash = hash.replace('#', '')
      this.$router.push(hash)
    }
  }
}

function restoreFromLocalStorage (store) {
  restoreAccessToken(store)
}

function restoreAccessToken (store) {
  return store.dispatch('UPDATE_ACCESS_TOKEN', {
    token: auth.getToken()
  }).then(() => {
    console.log('done UPDATE_ACCESS_TOKEN in Full.vue')
  }).catch(() => {
    console.log('Dashboard: UPDATE_ACCESS_TOKEN error')
    auth.clear()
    window.location.href = 'http://login.whatsit.net'
  })
}
