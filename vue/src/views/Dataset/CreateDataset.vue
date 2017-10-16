<template>
  <div id="create-dataset-container">

    <h1>Add New Dataset</h1>

    <h2>Dataset Type</h2>

    <div>
      <label>
        <input type="radio" value="video-dataset" v-model="datasetType"> Video
      </label><br>
      <label>
        <input type="radio" value="bigquery-dataset" v-model="datasetType"> BigQuery
      </label>
    </div>

    <div id="bottom-buttons-container">
      <button type="button" class="btn btn-secondary btn-lg btn-block active" @click="nextButtonClicked">Next</button>
      <button type="button" class="btn btn-secondary btn-lg btn-block active" @click="cancelDataset">Cancel</button>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'CreateDataset',
    data: function () {
      return {
        projectId: '',
        datasetType: ''
      }
    },
    created: function () {
      this.projectId = this.$route.params.projectId
      console.log('projectId : ' + this.projectId)
    },
    methods: {
      nextButtonClicked: function () {
        if (!this.datasetType || '' === this.datasetType.trim()) {
          this.$modal.open('알림', 'Dataset Type을 선택하세요.', '확인')
          return
        }

        console.log(this.datasetType)

        if (this.datasetType === 'video-dataset') {
          this.$router.replace({ path: '/project/' + this.projectId + '/dataset/video' })
        } else if (this.datasetType === 'bigquery-dataset') {
          this.$router.replace({ path: '/project/' + this.projectId + '/dataset/bigQuery' })
        }
      },
      cancelDataset: function () {
        this.$router.replace({ path: '/project/' + this.projectId + '/datasets' })
      }
    }
  }
</script>

<style scoped>
  #create-dataset-container {
    position: absolute;
    left: 50%;
    width: 700px;
    height: 1000px;
    margin-left: -350px;
    /*background-color: white;*/
    /*box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2)*/
  }

  #create-dataset-container > h1 {
    height: 60px;
    margin-top: 35px;
    margin-bottom: 35px;
    font-size: 30pt;
    text-align: center;
  }

  #create-dataset-container > h2 {
    height: 30px;
    margin-top: 100px;
    margin-bottom: 20px;
    font-size: 20pt;
  }

  #bottom-buttons-container {
    position: absolute;
    width: 100%;
    height: 250px;
    bottom: 0;
  }

  #bottom-buttons-container > button {
    height: 120px;
    margin-top: 30px;
  }

</style>
