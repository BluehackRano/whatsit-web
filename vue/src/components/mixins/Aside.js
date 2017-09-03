
import Vue from 'vue'
var DoneItem = Vue.component('done-item', {
  template: '\
    <div style="width: 100%; height: 100px; border: 1px solid gray;">\
      <img :src="imgScr" style="object-fit:contain; width: 100px; height: 100%; border-right: 1px solid gray;" alt="No croppped image." />\
      <span style="margin-left: 10px; margin-right: 50px;"><b>{{ labelName }}</b></span>\
      <button type="button" class="btn btn-outline-secondary btn-sm" @click="$emit(\'remove\')"><i class="fa fa-remove fa-lg"></i></button>\
    </div>\
  ',
  props: ['imgScr', 'labelName']
})

import bus from '../../util/bus'

export const Aside = {

  data: function () {
    return {
      memo: '',
      cropImgList: []
    }
  },

  components: {
    DoneItem
  },

  beforeCreate: function () {
    this.$store.watch(this.$store.getters.cropImgList,
      () => {
        this.cropImgList = this.$store.state.cropImgList
        console.log('Aside.js : Current cropped image list ...')
        console.log(this.cropImgList)
      },
      {
        deep: true // add this if u need to watch object properties change etc.
      }
    )
  },

  created: function () {
    bus.$on('add_image', this.addImage)
    bus.$on('reset_memo', this.resetMemo)
  },

  methods: {
    nextImage: function () {
      bus.$emit('save_and_next_image', '')
    },

    addImage: function (cropImg) {
      console.log('Name: ' + cropImg.name + ' / X: ' + cropImg.x + ' / Y: ' + cropImg.y + ' / W: ' + cropImg.width + ' / H: ' + cropImg.height)
      addCropImage(this.$store, cropImg)
    },

    removeCropImage: function (index) {
      this.$store.state.cropImgList.slice(index, 1)
    },

    resetMemo: function (memo) {
      this.memo = memo
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
