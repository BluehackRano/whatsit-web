<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <!--<Sidebar/>-->
      <main class="main">
        <breadcrumb class="mb-0" :list="list"/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <div v-if="isImageCanvas">
        <AppAside/>
      </div>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import AppHeader from '../../components/Header.vue'
// import Sidebar from '../../components/Sidebar.vue'
import Breadcrumb from '../../components/Breadcrumb.vue'
import AppAside from '../../components/Aside'
import AppFooter from '../../components/Footer'
import {Full} from './mixins/Full'

import bus from '../../util/bus'

export default {
  name: 'Full',
  mixins: [Full],
  data () {
    return {
      isImageCanvas: false
    }
  },
  components: {
    AppHeader,
    // Sidebar,
    Breadcrumb,
    AppAside,
    AppFooter
  },
  computed: {
    name () {
      return this.$route.name
    },

    list () {
      return this.$route.matched
    }
  },
  created () {
    bus.$on('is_image_canvas', this.toggleIsImageCanvas)
  },
  methods: {
    toggleIsImageCanvas (bIsImageCanvas) {
      this.isImageCanvas = bIsImageCanvas
    }
  }
}
</script>
