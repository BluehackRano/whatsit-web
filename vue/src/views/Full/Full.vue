<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar/>
      <main class="main">
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <AppAside/>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import AppHeader from '../../components/Header.vue'
import Sidebar from '../../components/Sidebar.vue'
import AppAside from '../../components/Aside'
import AppFooter from '../../components/Footer'
import {Full} from './mixins/Full'

export default {
  name: 'Full',
  mixins: [Full],
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter// ,
  },
  computed: {
    name () {
      return this.$route.name
    },

    list () {
      return this.$route.matched
    }
  }
}
</script>
