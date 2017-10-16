<template>
  <aside class="aside-menu">

    <!--<ul class="nav nav-tabs" role="tablist">-->
      <!--<li class="nav-item">-->
        <!--<a class="nav-link active" data-toggle="tab" href="#timeline" role="tab"><i class="icon-list"></i></a>-->
      <!--</li>-->
      <!--<li class="nav-item">-->
        <!--<a class="nav-link" data-toggle="tab" href="#messages" role="tab"><i class="icon-speech"></i></a>-->
      <!--</li>-->
      <!--<li class="nav-item">-->
        <!--<a class="nav-link" data-toggle="tab" href="#settings" role="tab"><i class="icon-settings"></i></a>-->
      <!--</li>-->
    <!--</ul>-->

    <!-- Tab panes -->
    <div class="tab-content">

      <hr class="transparent mx-3 my-0">
      <button type="button" class="btn btn-danger btn-lg btn-block" @click="nextImage()"><b>저장하고 다음 사진으로</b></button>
      <hr class="transparent mx-3 my-0">

      <div class="tab-pane active" id="timeline" role="tabpanel">

        <div class="callout m-0 py-1 text-muted text-center bg-faded text-uppercase">
          <small><b>메모</b>
          </small>
        </div>

        <hr class="transparent m-0 py-0">
        <textarea style="width: 100%;" rows="4" placeholder="추천단어 없음" disabled>{{ memo }}</textarea>
        <div class="callout m-0">

        </div>

        <hr class="transparent m-0 py-0">

        <div>
          <!--<v-select :options="['foo','bar','baz']" :on-change="objectNameSelected"></v-select>-->
        </div>

        <hr class="transparent mx-3 my-0">
        <div class="callout m-0 py-1 text-muted text-center bg-faded text-uppercase">
          <small><b>작업목록</b>
          </small>
        </div>

        <div
          class="crop-done-item"
          is="done-item"
          v-for="(croppedImg, index) in cropImgList"
          :key="index"
          :indexNum="index"
          :imgScr="croppedImg.cropImg"
          :selectLabelList="labelList"
          :labelColor="croppedImg.color"
          v-on:remove="removeCropImage(index)"
        >
        </div>

        <hr class="mx-0 my-0">
      </div>
    </div>
  </aside>
</template>

<script>
import bus from '../util/bus'
import { returnLabelColor } from '../util/labelColors'

import Vue from 'vue'
import vSelect from 'vue-select'
//Vue.component('v-select', vSelect)
var DoneItem = Vue.component('done-item', {
  template: '\
    <div>\
      <!--<img style="object-fit: contain; width: 40%; height: 100%; border-right: 1px solid gray;" class="crop-done-item-img" :src="imgScr" alt="No cropped image." crossorigin="anonymous"/>-->\
      <div style="position: relative; top:0; left: 0; width: 100%;  /*top:-100px; left: 100px; width: 60%;*/ height: 100%;">\
        <span style="position: relative; display: inline-block; top:10px; left:10px; width: 10px;"><b>{{ indexNum+1 }}</b></span>\
        <span style="position: relative; top:10px; left:15px; width: 10px;" :style="{ backgroundColor: labelColor }"><b> &nbsp;&nbsp;&nbsp; </b></span>\
        <button style="position: relative; top:10px; left: 70px;" type="button" class="btn btn-outline-secondary btn-sm" @click="$emit(\'remove\')"><i class="fa fa-remove fa-lg"></i></button>\
        <!-- <v-select style="position: relative; width: 98%; margin-top: 5px;" :on-change="objectNameSelected" :options="[\'foo\',\'bar\']"></v-select> -->\
        <select v-model="$store.state.cropImgList[indexNum].label" @change="labelSelectOnChange($event.target.value)" style="margin-top:20px; margin-left:2px; width: 98%">\
          <option disabled value="" selected>Please select one</option>\
          <option v-for="label in selectLabelList" :value="label">{{ label }}</option>\
        </select>\
      </div>\
    </div>\
  ',
  props: ['indexNum', 'imgScr', 'selectLabelList', 'labelColor'],
  methods: {
    labelSelectOnChange (val) {
      console.log(this.indexNum + ' : ' + val)
      this.$store.state.cropImgList[this.indexNum].label = val
    }
  }
})

export default {
  name: 'aside',
//  mixins: [Aside],
  data: function () {
    return {
      memo: '',
      cropImgList: [],
      labelList: []
    }
  },

  components: {
    DoneItem
  },

  beforeCreate: function () {
    this.$store.watch(this.$store.getters.cropImgList,
      () => {
        this.cropImgList = this.$store.state.cropImgList
        console.log('Aside.vue : Current cropped image list ...')
        console.log(this.cropImgList)
      },
      {
        deep: true // add this if u need to watch object properties change etc.
      }
    )
  },
  created () {
    document.body.classList.remove('aside-menu-hidden')

    bus.$on('add_image', this.addImage)
    bus.$on('reset_labels', this.resetLabelList)
//    this.labelList = this.$store.state.projectLabelList
  },

  methods: {
    nextImage: function () {
      bus.$emit('save_and_next_image', this.cropImgList)
    },

    addImage: function (cropImg) {
      console.log('Name: ' + cropImg.name + ' / X: ' + cropImg.x + ' / Y: ' + cropImg.y + ' / W: ' + cropImg.width + ' / H: ' + cropImg.height + ' / Label: ' + cropImg.label + ' / Color : ' + cropImg.color)
      addCropImage(this.$store, cropImg)
    },

    removeCropImage: function (index) {
      returnLabelColor(this.cropImgList[index].color)
      this.cropImgList.splice(index, 1)
      this.$store.state.cropImgList.slice(index, 1)
    },

    resetLabelList (labelList) {
//      this.labelList = this.$store.state.projectLabelList
      this.labelList.splice(0, this.labelList.length)

      this.labelList = labelList[0].split(',')
      this.resetMemo()
    },

    resetMemo: function () {
      this.memo = ''
      for (let i = 0; i < this.labelList.length; i++) {
        this.memo += `${this.labelList[i]}, `
      }
    },

    objectNameSelected (val) {
      console.log(val)
    },

    labelSelectOnChange (val) {
      console.log(val)
    }
  }
}

function addCropImage (store, cropImg) {
  return store.dispatch('ADD_CROP_IMAGE', {
    cropImg: cropImg
  }).then(() => {
    console.log('done ADD_CROP_IMAGE in Aside.js')
  })
}
</script>

<style scoped>
  .crop-done-item {
    width: 100%;
    height: 100px;
    border: 1px solid gray;
  }
  .crop-done-item-img {
    object-fit: contain;
    width: 40%;
    height: 100%;
    border-right: 1px solid gray;
  }

  @media (min-width: 992px) {
    .aside-menu {

    }
  }
  @media (max-width: 991px) {
    .aside-menu {
      margin-right: 0px;
    }
  }
</style>
