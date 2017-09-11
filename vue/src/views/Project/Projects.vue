<template>
  <div id="projects-container">
    <div class="animated fadeIn">

      <!--'/static/img/bg3.jpeg',-->
  <!--'/static/img/bg1.jpg',-->
  <!--'/static/img/logo-w.png',-->
  <!--'/static/img/bg2.jpg',-->

      <div class="row">

        <div class="col-sm-6 col-md-4">
          <div class="card create-project-card">
            <button type="button" class="btn btn-secondary" @click="createProjectButtonClicked">+</button>
          </div>
        </div>

        <div class="col-sm-6 col-md-4" v-for="(project, index) in projectList" :key="project.id"
             @click="projectClicked(project.id)">
          <div class="card project-card-item">
            <img src="/static/img/bg3.jpeg">
            <!--<div class="dropdown more-button">-->
              <!--<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><span class="fa fa-ellipsis-v"></span></button>-->
              <!--<ul class="dropdown-menu">-->
                <!--<li><a href="#">HTML</a></li>-->
                <!--<li><a href="#">CSS</a></li>-->
                <!--<li><a href="#">JavaScript</a></li>-->
              <!--</ul>-->
            <!--</div>-->
            <div class="card-footer">
              {{ project.name }}
            </div>
          </div>
        </div><!--/.col-->

      </div><!--/.row-->
    </div>
  </div>
</template>

<script>
  // import {Projects} from './mixins/Projects'
  export default {
    name: 'Projects',
    data: function () {
      return {
        projectList: this.$store.state.projectList
      }
    },
    created: function () {

    },
    methods: {
      createProjectButtonClicked: function () {
        this.$router.push('/project/createProject')
      },
      projectClicked: function (projectId) {
        this.$router.push({ path: '/project/' + projectId + '/datasets' })
      }
    }
  }
</script>

<style scoped>
  #projects-container {
    position: absolute;
    left: 50%;
    width: 1200px;
    margin-left: -600px;
  }

  .create-project-card {
    height: 250px;
  }

  .create-project-card > button{
    width: 100%;
    height: 250px;
  }

  .project-card-item:hover {
    cursor: pointer;
  }

  .project-card-item > img {
    height: 200px;
  }

  div > .card-block {
    height: 200px;
  }

  div > .card-footer {
    height: 50px;
  }

  div > .card-footer > #more-button {
    float: right;
    height: 50px;
    width: 50px;
    margin-top: 0px;
    margin-right: 10px;
    background-color: cornflowerblue;
  }
</style>
