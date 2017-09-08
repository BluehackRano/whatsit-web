let auth = require('../../util/auth')

export const Header = {

  beforeCreate: function () {
    console.log('Header.js: beforeCreate')
    let store = this.$store
    this.$store.watch(this.$store.getters.accessToken,
      () => {
        fetchProfile(store)
      },
      {
        deep: true // add this if u need to watch object properties change etc.
      }
    )
    if (this.$store.state.accessToken != null) {
      fetchProfile(this.$store)
    }
  },

  created: function () {
    console.log('Header.js: created')
  },

  mounted: function () {
    console.log('Header.js: mounted')
    this.$store.watch(this.$store.getters.userId,
      () => {
        this.profileUrl = this.$store.state.profile.me.avatar_url
      },
      {
        deep: true // add this if u need to watch object properties change etc.
      }
    )
    // document.body.classList.toggle('aside-menu-hidden')
  },

  methods: {
    logout () {
      console.log('Logout..')
      auth.clear()
      window.location.href = 'http://login.whatsit.net'
    }
  }
}

function fetchProfile (store) {
  return store.dispatch('FETCH_USER_PROFILE', {
    token: store.state.accessToken
  }).then(() => {
    console.log('done FETCH_USER_PROFILE in Header.vue')
  })
}

