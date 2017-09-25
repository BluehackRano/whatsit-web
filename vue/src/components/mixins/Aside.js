
import Vue from 'vue'

import vSelect from 'vue-select'
// Vue.component('v-select', vSelect)

var DoneItem = Vue.component('done-item', {
  template: '\
    <div style="width: 100%; height: 100px; border: 1px solid gray;">\
      <img :src="imgScr" style="object-fit:contain; width: 40%; height: 100%; border-right: 1px solid gray;" alt="No croppped image." />\
      <div style="position: relative; top:-100px; left: 100px; width: 60%; height: 100%;">\
        <span style="position: relative; display: inline-block; top:10px; left:10px; width: 10px;"><b>{{ labelName }}</b></span>\
        <button style="position: relative; top:10px; left: 90px;" type="button" class="btn btn-outline-secondary btn-sm" @click="$emit(\'remove\')"><i class="fa fa-remove fa-lg"></i></button>\
        <!-- <v-select style="position: relative; left:50%; top:10px; margin-left:-60px; width: 120px;" v-model="selected" :options="[\'foo\',\'bar\']"></v-select> -->\
      </div>\
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
      // selected: null
    }
  },

  components: {
    DoneItem,
    vSelect
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
