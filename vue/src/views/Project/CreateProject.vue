<template>
  <div id="create-project-container">
    <h1>Create Project</h1>

    <h2>project name</h2>
    <input type="text" v-model="projectName" placeholder="Please enter the project name."/>

    <div id="bottom-buttons-container">
      <button type="button" class="btn btn-secondary btn-lg btn-block active" @click="createProject">Create</button>
      <button type="button" class="btn btn-secondary btn-lg btn-block active" @click="cancelProject">Cancel</button>
    </div>

  </div>
</template>

<script>
  // import {Projects} from './mixins/Projects'
  export default {
    name: 'createProject',
    data: function () {
      return {
        projectName: ''
      }
    },
    methods: {
      createProject: function () {
        if (this.projectName.trim() === '') {
          return
        }

        this.$store.state.projectList.push({
          id: Math.floor((Math.random() * 100) + 1),
          name: this.projectName,
          thumbnail: '/static/img/bg3.jpeg'
        })
        // call addProject API
        this.$router.replace('/project/projects')
      },
      cancelProject: function () {
        this.$router.replace('/project/projects')
      }
    }
  }
</script>

<style scoped>
  #create-project-container {
    position: absolute;
    left: 50%;
    width: 700px;
    height: 1000px;
    margin-left: -350px;
    /*background-color: white;*/
    /*box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2)*/
  }

  #create-project-container > h1 {
    height: 60px;
    margin-top: 35px;
    margin-bottom: 35px;
    font-size: 30pt;
    text-align: center;
  }

  #create-project-container > h2 {
    height: 30px;
    margin-top: 100px;
    margin-bottom: 20px;
    font-size: 20pt;
  }

  #create-project-container > input[type=text] {
    width: 100%;
    height: 60px;
    font-size: 30pt;
    padding-left: 10px;
    border: 0;
    outline: 0;
    background: transparent;
    border-bottom: 1px solid black;
  }

  /* -webkit-input-placeholder webkit */
  #create-project-container > input[type=text]::-webkit-input-placeholder { font-size: 15pt; font-style:italic; }
  /* -webkit-input-placeholder mozilla */
  #create-project-container > input[type=text]::-moz-placeholder { font-size: 15pt; font-style:italic; }


  #bottom-buttons-container {
    position: absolute;
    width: 100%;
    height: 250px;
    bottom: 0;
  }

  #bottom-buttons-container > button {
    height: 120px;
  }

</style>
