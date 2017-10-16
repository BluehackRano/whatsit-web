<template>
  <div id="projects-container">
    <div class="animated fadeIn">
      <div class="row">

        <div class="col-sm-6 col-md-4">
          <div class="card create-project-card">
            <button type="button" class="btn btn-secondary" @click="createProjectButtonClicked">+</button>
          </div>
        </div>

        <div class="col-sm-6 col-md-4" v-for="(project, index) in projectList" :key="project.id"
             @click="projectClicked(project._id)">
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
              <button type="button" class="btn btn-secondary btn-sm" @click="exportButtonClicked($event, project._id)"><i class="fa fa-download" aria-hidden="true"></i></button>
            </div>
          </div>
        </div><!--/.col-->

      </div><!--/.row-->
    </div>
  </div>
</template>

<script>
  import bus from '../../util/bus'

  export default {
    name: 'Projects',
    data: function () {
      return {
        projectList: this.$store.state.projectList
      }
    },
    created: function () {
      this.$store.watch(this.$store.getters.userId,
        () => {
          this.requestFetchProjects()
        },
        {
          deep: true // add this if u need to watch object properties change etc.
        }
      )
      bus.$on('fetch_projects', this.requestFetchProjects)
    },
    methods: {
      createProjectButtonClicked: function () {
        this.$router.push('/project/createProject')
      },
      projectClicked: function (projectId) {
//        this.$modal.open('알림', 'Project ID : ' + projectId, '닫기')
        this.$router.push({ path: '/project/' + projectId + '/datasets' })
      },
      exportButtonClicked: function (event, projectId) {
        console.log(`exportButtonClicked : ${projectId}`)
        event.stopPropagation()

        this.requestGetTrainset(projectId)
      },
      requestFetchProjects: function () {
        this.$store.dispatch('FETCH_PROJECTS', {
          userId: this.$store.state.userId
        }).then(() => {
          console.log('done FETCH_PROJECTS in Projects.vue')
        })
      },
      requestGetTrainset (projectId) {
        let options = {
          format: 'pascalvoc'
        }
        this.$store.dispatch('GET_PROJECT_TRAINSET', {
          projectId: projectId,
          options: options
        }).then(() => {
          console.log('done GET_PROJECT_TRAINSET in Projects.vue')
        })
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

  div > .card-footer > button {
    right: 0;
    /*position: absolute;*/
    float: right;
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
