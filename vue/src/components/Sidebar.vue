<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <ul class="nav">
        <!--<form>-->
          <!--<div class="form-group p-2  mb-0">-->
            <!--<input type="text" class="form-control" aria-describedby="search" placeholder="Search..."/>-->
          <!--</div>-->
        <!--</form>-->
        <li class="nav-title">
          Dashboard
        </li>
        <li class="nav-item">
          <router-link :to="'/dashboard'" class="nav-link"><i class="icon-speedometer"></i> Dashboard </router-link>
        </li>

      </ul>
    </nav>
  </div>
</template>

<script>
import {Sidebar} from './mixins/Sidebar'

export default {
  name: 'sidebar',
  mixins: [Sidebar]
}
</script>

<style>
  /*.nav-link {*/
    /*cursor:pointer;*/
  /*}*/
</style>
