<template>
  <div class="wrapper">

    <canvas id="bg_canvas" style="position: absolute; z-index: 2;"></canvas>

    <div style="max-width: 80%; display: inline-block; z-index: 1; overflow-x: auto;">
      <VueCropper
        ref="cropper"
        :guides="true"
        :autoCrop="false"
        :background="true"
        :zoomable="false"
        :movable="false"
        :toggleDragModeOnDblclick="false"
        :checkCrossOrigin="false"
        :minContainerWidth="500"
        :minContainerHeight="500"
        :minCanvasWidth="500"
        :minCanvasHeight="500"
        :view-mode="2"
        :drag-mode="crop"
        :src="imgSrc"
        :ready="onReadyImgSrc"
        :cropstart="cropStart"
        :cropmove="cropImage"
        :cropend="cropEnd"
        alt="이미지 불러오는중..."
      >
      </VueCropper>
    </div>

    <div id="div_add_img" style="display: none; visibility: hidden; position: absolute; z-index: 3;">
      <button type="button" class="btn btn-outline-secondary btn-md active" @click="resetCanvas"><i class="fa fa-close fa-lg"></i></button>
      <button type="button" class="btn btn-youtube btn-md text" @click="addImage"><i class="fa fa-check fa-lg"></i></button>
    </div>

    <br/>

    <!--<img-->
      <!--:src="cropImg"-->
      <!--style="object-fit:contain; width: 500px; height: 300px; border: 1px solid gray;"-->
      <!--alt="Please crop the above image."-->
    <!--/>-->
    <p> X : {{ cropImgX }} / Y : {{ cropImgY }} / Width : {{ cropImgWidth }} / Height : {{ cropImgHeight }} </p>

</div>
</template>

<script>

import VueCropper from 'vue-cropperjs';
import {Dashboard} from './mixins/Dashboard'

import bus from '../../util/bus'

export default {
  name: 'dashboard',
  mixins: [Dashboard],

  data () {
    return {
      projectId: ''
    }
  },

  components: {
    VueCropper
  },

  created () {
    bus.$emit('is_image_canvas', true)

    this.projectId = this.$route.params.projectId
    if (this.projectId === '' || this.projectId === null || this.projectId === undefined) {
      return
    }
  },

  beforeMount () {
    // call the getLabels GET api
//    this.requestFetchProjectLabels()
  },

  beforeDestry () {
    bus.$emit('is_image_canvas', false)
  },

  methods: {
    // image upload
    setImage (e) {
      const file = e.target.files[0];

      if (!file.type.includes('image/')) {
        alert('Please select an image file')
        return;
      }

      if (typeof FileReader === 'function') {
        const reader = new FileReader()

        reader.onload = (event) => {
          this.imgSrc = event.target.result
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result)
          console.log('Target Image...')
          console.log(event.target.result)
        }

        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported');
      }
    },

    cropStart () {
      this.hideDivAddImg(true)
    },

    cropImage () {
      this.hideDivAddImg(true)

      // get image data for post processing, e.g. upload or setting image src
      // this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
      this.cropImgX = Math.round(this.$refs.cropper.getData().x)
      this.cropImgY = Math.round(this.$refs.cropper.getData().y)
      this.cropImgWidth = Math.round(this.$refs.cropper.getData().width)
      this.cropImgHeight = Math.round(this.$refs.cropper.getData().height)
    },

    cropEnd () {
      // console.log(this.$refs.cropper)
      if (this.cropImgWidth === 0 || this.cropImgHeight === 0 || this.cropImgWidth === '0' || this.cropImgHeight === '0') {
        return
      }

      this.setDivAddImgPosition()
      this.hideDivAddImg(false)
    },

    requestFetchProjectLabels () {
      this.$store.dispatch('FETCH_PROJECT_LABELS', {
        projectId: this.projectId
      }).then(() => {
        console.log('done FETCH_PROJECT_LABELS in Datasets.vue')
        console.log(this.$store.state.projectLabelList)

        bus.$emit('reset_labels')
      })
    },
  }
}
</script>

<style scoped>

  img {
    max-width: 100%; /* This rule is very important, please do not ignore this! */
  }

  .wrapper {
    width: 1200px !important; /* Width size guides needed ! */
  }

  #bg_canvas {
    pointer-events: none;
  }
</style>
