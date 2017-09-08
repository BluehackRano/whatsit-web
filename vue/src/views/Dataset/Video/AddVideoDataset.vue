<template>
  <div class="add-video-dataset-container">
    <h1>Add Video Link</h1>

    <h2>Name</h2>
    <input type="text" v-model="videoName" placeholder="Please enter the video name."/>

    <h2>Insert Video Link URL</h2>
    <input type="text" v-model="videoLinkURL" placeholder="Please enter the video link URL."/>

    <div class="bottom-buttons-container">

      <div class="row">
        <div class="col-sm-6 col-md-6">
          <button type="button" class="btn btn-secondary btn-lg btn-block active" @click="">Back</button>
        </div>
        <div class="col-sm-6 col-md-6">
          <button type="button" class="btn btn-secondary btn-lg btn-block active" @click="">Next</button>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-12">
          <button type="button" class="btn btn-secondary btn-lg btn-block active" @click="cancelAddVideoDataset">Cancel</button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    name: 'AddVideoDataset',
    data: function () {
      return {
        projectId: '',
        videoName: '',
        videoLinkURL: ''
      }
    },
    created: function () {
      this.projectId = this.$route.params.projectId
      console.log('projectId : ' + this.projectId)
    },
    methods: {
      cancelAddVideoDataset: function () {
        this.$router.replace('/project/projects')
      }
    }
  }
</script>

<style scoped>
  .add-video-dataset-container {
    position: absolute;
    left: 50%;
    width: 700px;
    height: 1000px;
    margin-left: -350px;
    /*background-color: white;*/
    /*box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2)*/
  }

  .add-video-dataset-container > h1 {
    height: 60px;
    margin-top: 35px;
    margin-bottom: 35px;
    font-size: 30pt;
    text-align: center;
  }

  .add-video-dataset-container > h2 {
    height: 30px;
    margin-top: 100px;
    margin-bottom: 20px;
    font-size: 20pt;
  }

  .add-video-dataset-container > input[type=text] {
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
  .add-video-dataset-container > input[type=text]::-webkit-input-placeholder { font-size: 15pt; font-style:italic; }
  /* -webkit-input-placeholder mozilla */
  .add-video-dataset-container > input[type=text]::-moz-placeholder { font-size: 15pt; font-style:italic; }


  .bottom-buttons-container {
    position: absolute;
    width: 100%;
    height: 250px;
    bottom: 0;
  }

  .bottom-buttons-container > div > div > button {
    height: 120px;
    margin-top: 30px;
  }

</style>
