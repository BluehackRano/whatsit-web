<template>
  <navbar>
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
    <a class="navbar-brand" href="#"></a>
    <ul class="nav navbar-nav d-md-down-none">
      <li class="nav-item">
        <a class="nav-link navbar-toggler sidebar-toggler" href="#" @click="sidebarToggle">&#9776;</a>
      </li>
      <!--<li class="nav-item px-3">-->
        <!--<a class="nav-link" href="#">Dashboard</a>-->
      <!--</li>-->
      <!--<li class="nav-item px-3">-->
        <!--<a class="nav-link" href="#">Users</a>-->
      <!--</li>-->
      <!--<li class="nav-item px-3">-->
        <!--<a class="nav-link" href="#">Settings</a>-->
      <!--</li>-->
    </ul>
    <ul class="nav navbar-nav ml-auto">
      <dropdown size="nav" class="nav-item">
        <span id="profile-area" slot="button">
          <img v-bind:src="profileUrl" class="img-avatar" alt="">
          <span class="d-md-down-none">{{ $store.state.displayName }}</span>
        </span>
        <div slot="dropdown-menu"class="dropdown-menu dropdown-menu-right">
          <div class="dropdown-header text-center"><strong>Settings</strong></div>
          <a @click="logout" class="dropdown-item" href="#"><i class="fa fa-lock"></i> Logout</a>
        </div>
      </dropdown>
      <li>
        <span> &nbsp; </span>
      </li>
      <li v-if="isImageCanvas" class="nav-item d-md-down-none">
        <a class="nav-link navbar-toggler aside-menu-toggler" href="#" @click="asideToggle">&#9776;</a>
      </li>
    </ul>
  </navbar>
</template>
<script>

import navbar from './Navbar'
import { dropdown } from 'vue-strap'
import { Header } from './mixins/Header'

import bus from '../util/bus'

export default {
  name: 'header',
  mixins: [Header],

  data: function () {
    return {
      profileUrl: '/static/img/avatars/default_avatar.png',
      isImageCanvas: false
    }
  },

  components: {
    navbar,
    dropdown
  },

  created () {
    bus.$on('is_image_canvas', this.toggleIsImageCanvas)
  },

  methods: {
    click () {
      // do nothing..
    },
    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    },
    toggleIsImageCanvas (bIsImageCanvas) {
      this.isImageCanvas = bIsImageCanvas
    }
  }
}

</script>

<style lang="css">

.dropdown-toggle::after {
  /*display: none !important;*/
}
</style>
