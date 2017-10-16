<template>
  <div id="all">

    <h1>Data sets</h1>

    <div class="row">
      <div class="col-sm-12 col-md-12">
        <button class="create-dataset-button" type="button" class="btn btn-secondary btn-lg btn-block" @click="createDatasetButtonClicked">+</button>
      </div>
    </div>

    <div class="dataset-list">
      <div class="animated fadeIn">
        <div class="col-sm-12 col-md-12 dataset-item" v-for="dataset in datasetList" @click="datasetClicked(dataset._id, dataset.type)" :key="dataset._id">
          <div class="dataset-name">
            {{ dataset.name }}
          </div>
          <div class="delete-dataset-button" @click="deleteDatasetButtonClicked(dataset._id, $event)">
            Delete
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import bus from '../../util/bus'

  export default {
    name: 'Datasets',
    data: function () {
      return {
        projectId: '',
        datasetList: this.$store.state.datasetList
//          [
//          {id: 1, name: 'video-01'},
//          {id: 2, name: 'video-02'},
//          {id: 3, name: 'video-03'},
//          {id: 4, name: 'video-04'}
//        ]
      }
    },
    created: function () {
      this.projectId = this.$route.params.projectId
      if (this.projectId === '' || this.projectId === null || this.projectId === undefined) {
        return
      }

      let userId = this.$store.state.userId
      if (userId === '' || userId === null || userId === undefined) {
        this.$store.watch(this.$store.getters.userId,
          () => {
            this.requestFetchDatasets()
          },
          {
            deep: true // add this if u need to watch object properties change etc.
          }
        )
      } else {
        this.requestFetchDatasets()
      }

      this.requestFetchDatasets()
      bus.$on('fetch_datasets', this.requestFetchDatasets)
    },
    methods: {
      createDatasetButtonClicked: function () {
        this.$router.push('/project/' + this.projectId + '/createDataset')
      },
      datasetClicked: function (datasetId, type) {
        console.log(`Dataset ID : ${datasetId} / Type : ${type}`)

        if (type === 'video') {
          window.open('/canvas/video/' + datasetId)
        } else if (type === 'bigquery') {
          window.open(`/canvas/bigquery/${this.projectId}/${datasetId}`)
        } else {
          this.$modal.open('알림', '잘못된 형식의 Dataset 입니다.\n(Dataset Type 없음)', '확인')
        }
      },
      deleteDatasetButtonClicked: function (datasetId, event) {
        event.stopPropagation()
        console.log('Delete dataset ' + datasetId)
      },
      requestFetchDatasets: function () {
        console.log('requestFetchDatasets')
        this.$store.dispatch('FETCH_DATASETS', {
          projectId: this.projectId
        }).then(() => {
          console.log('done FETCH_DATASETS in Datasets.vue')
          this.requestFetchProjectLabels()
        })
      },
      requestFetchProjectLabels () {
        this.$store.dispatch('FETCH_PROJECT_LABELS', {
          projectId: this.projectId
        }).then(() => {
          console.log('done FETCH_PROJECT_LABELS in Datasets.vue')
          console.log(this.$store.state.projectLabelList)
        })
      },
    }
  }
</script>

<style scoped>
  #all {
    position: absolute;
    left: 50%;
    width: 1200px;
    margin-left: -600px;
  }

  #all > h1 {
    text-align: center;
    margin-top: 50px;
    margin-bottom: 20px;
  }

  .create-dataset-button {
    margin-top: 30px;
  }

  .dataset-list {
    width: 100%;
    height: 950px;
    overflow-y: auto;
    margin-top: 30px;
    margin-bottom: 50px;
  }

  .dataset-item {
    height: 150px;
    margin-bottom: 30px;
    line-height: 150px;
    background-color: lightgray;
    border-radius: 15px;
    border: 2px solid gray;
    cursor: pointer;
  }

  .dataset-name {
    float: left;
    margin-left: 20px;
    font-size: 30pt;
  }

  .delete-dataset-button {
    float: right;
    width: 120px;
    height: 50px;
    margin-top: 50px;
    margin-right: 20px;
    text-align: center;
    line-height: 50px;
    font-size: 20pt;
    color: gray;
    z-index: 100;
  }


</style>
