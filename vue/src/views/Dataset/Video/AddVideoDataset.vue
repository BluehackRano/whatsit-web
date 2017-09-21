<template>

  <div id="all">

    <!-- Video Link -->
    <div class="add-video-dataset-container" v-if="viewType === 'Link'">
      <h1>Add Video Link</h1>

      <h2>Name</h2>
      <input type="text" v-model="videoName" placeholder="Please enter the video name."/>

      <h2>Insert Video Link URL</h2>
      <input type="text" v-model="videoLinkURL" placeholder="Please enter the video link URL."/>

      <div class="bottom-buttons-container">
        <div class="row">
          <div class="col-sm-6 col-md-6">
            <button type="button" class="btn btn-secondary btn-lg btn-block active" @click="backToCreateDatasetButtonClicked">Back</button>
          </div>
          <div class="col-sm-6 col-md-6">
            <button type="button" class="btn btn-secondary btn-lg btn-block active" @click="nextButtonClicked">Next</button>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-12">
            <button type="button" class="btn btn-secondary btn-lg btn-block active" @click="cancelAddVideoDataset">Cancel</button>
          </div>
        </div>
      </div>

    </div>

    <!-- Trim Info -->
    <div class="add-video-dataset-trim-info-container" v-else-if="viewType === 'TrimInfo'">
      <h1>Video Trim Info</h1>

      <div class="row">
        <div class="col-sm-12 col-md-12">
          <button class="" type="button" class="btn btn-secondary btn-lg btn-block" @click="addTrimInfoButtonClicked">+</button>
        </div>
      </div>

      <div class="row start-end-time-text">
        <div class="col-sm-6 col-md-6">
          <h4>Start Time</h4>
        </div>
        <div class="col-sm-6 col-md-6">
          <h4>End Time</h4>
        </div>
      </div>

      <div class="trim-info-list">

        <!--<div class="animated fadeIn">-->
        <transition-group class="animated fadeIn" name="section-item" tag="div">
          <div class="col-sm-12 col-md-12 trim-info-item" v-for="(trimInfo, index) in trimInfoList" :key="index">

            <div class="delete-trim-info-button" @click="deleteTrimInfoButtonClicked(index)">
              <h3>X</h3>
            </div>

            <div class="col-sm-12 col-md-12 section-input">
              <input class="col-sm-12 col-md-12" type="text" v-model="trimInfo.sectionInput" @keyup="sectionValueChanged(index)" />
            </div>

            <div class="start-time">
              <input type="number" min="0" v-model="trimInfo.startHour"/> : <input type="number" min="0" max="59" v-model="trimInfo.startMin"/> : <input type="number" min="0" max="59" v-model="trimInfo.startSec"/>
            </div>
            ~
            <div class="end-time">
              <input type="number" min="0" v-model="trimInfo.endHour"/> : <input type="number" min="0" max="59" v-model="trimInfo.endMin"/> : <input type="number" min="0" max="59" v-model="trimInfo.endSec"/>
            </div>

          </div>
        </transition-group>
      </div>

      <div class="bottom-buttons-container">
        <div class="row">
          <div class="col-sm-12 col-md-12">
            <button type="button" class="btn btn-secondary btn-lg btn-block active trim-info-bottom-complete-button" @click="completeButtonClicked">Complete</button>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-12">
            <button type="button" class="btn btn-secondary btn-lg btn-block active trim-info-bottom-buttons" @click="backToVideoLinkButtonClicked">Back</button>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-12">
            <button type="button" class="btn btn-secondary btn-lg btn-block active trim-info-bottom-buttons" @click="cancelAddVideoDataset">Cancel</button>
          </div>
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
        viewType: 'Link', // 'TrimInfo'
        videoName: '',
        videoLinkURL: '',
        sectionInput: '',
        trimInfoList: [
          /*
          { startHour: 0, startMin: 0, startSec: 0, endHour: 0, endMin: 0, endSec: 0 },
          { startHour: 0, startMin: 0, startSec: 0, endHour: 0, endMin: 0, endSec: 0 },
          { startHour: 0, startMin: 0, startSec: 0, endHour: 0, endMin: 0, endSec: 0 }
          */
        ]
      }
    },
    created: function () {
      this.projectId = this.$route.params.projectId
      this.viewType = 'Link'
    },
    methods: {
      backToCreateDatasetButtonClicked: function () {
        this.$router.replace({ path: '/project/' + this.projectId + '/createDataset' })
      },
      nextButtonClicked: function () {
        if (this.videoName.trim() === '') {
          return
        }
        if (this.videoLinkURL.trim() === '') {
          return
        }

        this.viewType = 'TrimInfo'
      },
      addTrimInfoButtonClicked: function () {
        this.trimInfoList.push({ startHour: 0, startMin: 0, startSec: 0, endHour: 0, endMin: 0, endSec: 0 })
      },
      sectionValueChanged: function (index) {
        let currentTrimInfo = this.trimInfoList[index]

//        let splitSection = currentTrimInfo.sectionInput.split('	')
        let splitSection = currentTrimInfo.sectionInput.split(/[	 ,~]/g)

        let splitStartTime = splitSection[0].split(':')
        let splitEndTime = splitSection[1].split(':')

        currentTrimInfo.startHour = parseInt(splitStartTime[0])
        currentTrimInfo.startMin = parseInt(splitStartTime[1])
        currentTrimInfo.startSec = parseInt(splitStartTime[2])

        currentTrimInfo.endHour = parseInt(splitEndTime[0])
        currentTrimInfo.endMin = parseInt(splitEndTime[1])
        currentTrimInfo.endSec = parseInt(splitEndTime[2])
      },
      deleteTrimInfoButtonClicked: function (index) {
        this.trimInfoList.splice(index, 1)
      },
      completeButtonClicked: function () {
        if (this.videoName.trim() === '') {
          return
        }
        if (this.videoLinkURL.trim() === '') {
          return
        }

        this.addDataset()
      },
      backToVideoLinkButtonClicked: function () {
        this.viewType = 'Link'
      },
      cancelAddVideoDataset: function () {
        this.$router.replace({ path: '/project/' + this.projectId + '/createDataset' })
      },

      addDataset: function () {
        alert('59b686a6adc71eb86c669725')

        var options = {
          projectId: this.projectId, // '59b686a6adc71eb86c669725', // this.projectId, // '59bb6db5adc71eb86c739029',
          name: this.videoName,
          desc: 'This dataset is made by whatsit-web',
          type: 'video',
        }

        options.data = []

        var data = {
          name: 'video_' + this.videoName,
          source: this.videoLinkURL, // 'http://0.s3.envato.com/h264-video-previews/80fad324-9db4-11e3-bf3d-0050569255a8/490527.mp4', // this.videoLinkURL,
          sections: []
        };

        let sections = []
        for (let i = 0; i < this.trimInfoList.length; i++) {
          let section = []
          let trimInfo = this.trimInfoList[i]

          section.push(this.calcTimeToSeconds(trimInfo.startHour, trimInfo.startMin, trimInfo.startSec))
          section.push(this.calcTimeToSeconds(trimInfo.endHour, trimInfo.endMin, trimInfo.endSec))

          sections.push(section)
        }
        data.sections = sections

        options.data.push(data)

        this.requestAddDataset(options)
      },

      requestAddDataset: function (options) {
        // request API
        return this.$store.dispatch('ADD_DATASET', {
          options: options
        }).then(() => {
          console.log('done ADD_DATASET in AddVideoDataset.vue')
          this.$router.replace({ path: '/project/' + this.projectId + '/datasets' })
          bus.$emit('fetch_datasets')
        })
      },

      calcTimeToSeconds: function (h, m, s) {
        return h * 3600 + m * 60 + s
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


  .add-video-dataset-trim-info-container {
    position: absolute;
    left: 50%;
    width: 700px;
    height: 1200px;
    margin-left: -350px;
    /*background-color: white;*/
    /*box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2)*/
  }

  .add-video-dataset-trim-info-container > h1 {
    height: 60px;
    margin-top: 35px;
    margin-bottom: 35px;
    font-size: 30pt;
    text-align: center;
  }

  .start-end-time-text {
    margin-top: 30px;
  }

  .start-end-time-text {
    text-align: center;
  }

  .trim-info-list {
    width: 100%;
    height: 600px;
    overflow-y: auto;
    margin-top: 10px;
    margin-bottom: 50px;
  }

  .trim-info-item {
    height: 120px;
    margin-bottom: 20px;
    line-height: 120px;
    background-color: lightgray;
    border-radius: 15px;
    border: 2px solid gray;
    text-align: center;
  }

  .trim-info-item > .section-input {
    width: 80%;
    height: 30px;
    position: absolute;
    margin-top: 0;
  }

  .trim-info-item > .section-input > input[type=text] {
    width: 400px;
    height: 30px;
    line-height: 30px;
    position: absolute;
    left: 0;
    margin-top: 0;
    margin-left: 0;
  }

  .trim-info-item > .delete-trim-info-button {
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin-top: 10px;
    float: right;
    cursor: pointer;
  }

  .trim-info-item > .start-time {
    height: 40px;
    line-height: 40px;
    margin-left: 30px;
    float: left;
  }

  .trim-info-item > .start-time > input[type=number] {
    width: 50px;
    margin-top: 40px;
    text-align: center;
  }

  .trim-info-item > .end-time {
    height: 40px;
    line-height: 40px;
    margin-right: 30px;
    float: right;
  }

  .trim-info-item > .end-time > input[type=number] {
    width: 50px;
    margin-top: 40px;
    text-align: center;
  }

  /*.trim-info-item > div {*/
    /*text-align: center;*/
  /*}*/

  .bottom-buttons-container {
    position: absolute;
    width: 100%;
    height: 250px;
    bottom: 0;
    margin-bottom: 50px;
  }

  .bottom-buttons-container > div > div > button {
    height: 120px;
    margin-top: 30px;
  }

  .bottom-buttons-container > div > div > .trim-info-bottom-complete-button {
    height: 80px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .bottom-buttons-container > div > div > .trim-info-bottom-buttons {
    height: 80px;
    margin-top: 10px;
  }

  .section-item-enter-active, .section-item-leave-active {
    transition: all 0.5s;
  }
  .section-item-enter, .section-item-leave-to {
    opacity: 0;
    transform: translateX(50px);
  }

</style>
