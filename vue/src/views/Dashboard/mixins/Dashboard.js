let WhatsIt = require('whatsit-sdk-js')
let aw = new WhatsIt()
let awProject = aw.getProject()

import bus from '../../../util/bus'
import { getLabelColor, clearLabelColor } from '../../../util/labelColors'

var imgList = [
  { _id: 'aaaa', uri: 'http://img.ssfshop.com/details/8SBR/17/07/14/750_GM0017071478415_P_1_20170718181636.jpg' },
  { _id: 'bbbb', uri: 'http://img.ssfshop.com/details/8SBR/17/08/22/750_GM0017082282439_M_5_20170905154856.jpg' },
  { _id: 'cccc', uri: 'http://img.ssfshop.com/details/8SBR/17/02/09/750_GM0017020964499_C_2_20170515115748.jpg' },
  // { _id: 'dddd', uri: '/static/img/bg2.jpg' },
]
var imgIndex=0

export const Dashboard = {

  data: function () {
    return {
      datasetId: '',
      currentDataset: null,
      bgCanvas: null,
      rawImgList: [],
      rawImgIndex: -1,
      imgSrc: null,
      cropImg: '',
      cropImgX: '0',
      cropImgY: '0',
      cropImgWidth: '0',
      cropImgHeight: '0',
      divAddImg: null
    }
  },

  beforeCreate: function () {
    console.log('Dashboard: beforeCreate')
    this.$store.watch(this.$store.getters.cropImgList,
      () => {
        console.log('Dashboard.js : The cropImgList have been changed.')
        this.clearBgCanvas()
        this.drawCropBoxes()
      },
      {
        deep: true // add this if u need to watch object properties change etc.
      }
    )
  },

  created: function () {
    bus.$on('save_and_next_image', this.saveAndNextImage)

    /* Test Code */
    // this.resetImageList()

    /* Original Code */
    // this.$store.watch(this.$store.getters.userId,
    //   () => {
    //     this.resetRawImgListState()
    //     fetchRawImages(this.$store)
    //   },
    //   {
    //     deep: true // add this if u need to watch object properties change etc.
    //   }
    // )
    //
    // this.$store.watch(this.$store.getters.rawImgList,
    //   () => {
    //     this.resetImageList()
    //   }
    // )

    this.datasetId = this.$route.params.datasetId
    if (this.datasetId === '' || this.datasetId === null || this.datasetId === undefined) {
      return
    }
    console.log(`DATASET_ID on DASHBOARD : ${this.datasetId}`)


  },

  mounted: function () {
    this.bgCanvas = document.getElementById('bg_canvas')
    this.divAddImg = document.getElementById('div_add_img')

    // call the getDataset GET api
    this.$store.watch(this.$store.getters.userId,
      () => {
        this.resetRawImgListState()
        // fetchRawImages(this.$store)
        this.requestGetDatasetContents()
      },
      {
        deep: true // add this if u need to watch object properties change etc.
      }
    )

    this.$store.watch(this.$store.getters.datasetContentList,
      () => {
        this.resetImageList()
      }
    )
  },

  methods: {
    resetImageList () {
      /* Test Code */
      if (this.rawImgIndex == 0) {
        return
      }

      this.rawImgList = this.$store.state.datasetContentList // imgList // this.$store.state.datasetContentList
      this.rawImgIndex = 0
      this.imgSrc = this.rawImgList[0].uri
      // console.log('cropper')
      // console.log(this.$refs.cropper)

      this.$refs.cropper.replace(this.imgSrc)

      bus.$emit('reset_labels', this.rawImgList[0].labels)
      // bus.$emit('reset_memo', this.rawImgList[0].labels[0])
    },

    toAddProject () {
      console.log('on click to dashboard button')
      this.$router.push('/projects/add')
    },

    onReadyImgSrc () {
      this.setBgCanvasRect()
    },

    saveAndNextImage (markedImgList) {
      window.alert(this.$store.state.cropImgList)

      this.requestUpdateDataset(this.$refs.cropper.cropper.canvasData)

      /* Test Code */
      // this.resetCanvas()
      // this.resetCropImgListState()
      // clearLabelColor()
      //
      // return

      /* Original Code */
      ++this.rawImgIndex
      if (this.rawImgIndex == this.rawImgList.length) {
        this.resetRawImgListState()
        // fetchRawImages(this.$store)
        this.requestGetDatasetContents()
        return
      }
      this.imgSrc = this.rawImgList[this.rawImgIndex].uri
      // this.imgSrc = this.rawImgList[this.rawImgIndex]
      this.$refs.cropper.replace(this.imgSrc)
      bus.$emit('reset_labels', this.rawImgList[this.rawImgIndex].labels)
      // bus.$emit('reset_memo', this.rawImgList[this.rawImgIndex].labels[0])

      this.resetCanvas()
      this.resetCropImgListState()
      clearLabelColor()
    },

    addImage () {
      console.log(this.$refs.cropper.getCroppedCanvas())
      // this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL('image/jpeg')
      //
      // if (this.cropImg === undefined || this.cropImg === null || this.cropImg === '') {
      //   return
      // }

      if (this.cropImgWidth === 0 || this.cropImgHeight === 0 || this.cropImgWidth === '0' || this.cropImgHeight === '0') {
        return
      }

      let cropBoxData = this.$refs.cropper.getCropBoxData()
      bus.$emit('add_image',
        {
          cropImg: this.cropImg,
          name: 'Labeled Name',
          x: this.cropImgX,
          y: this.cropImgY,
          width: this.cropImgWidth,
          height: this.cropImgHeight,
          cropBoxLeft: cropBoxData.left,
          cropBoxTop: cropBoxData.top,
          cropBoxWidth: cropBoxData.width,
          cropBoxHeight: cropBoxData.height,
          label: '',
          color: getLabelColor()
        })
    },

    resetRawImgListState () {
      while (this.$store.state.rawImgList.length > 0) {
        this.$store.state.rawImgList.pop()
      }

      this.resetCanvas()
      this.resetCropImgListState()
      clearLabelColor()
    },

    resetCanvas () {
      this.hideDivAddImg(true)

      this.cropImg = ''
      this.cropImgX = '0'
      this.cropImgY = '0'
      this.cropImgWidth = '0'
      this.cropImgHeight = '0'
      this.$refs.cropper.clear()
    },

    resetCropImgListState () {
      while (this.$store.state.cropImgList.length > 0) {
        this.$store.state.cropImgList.pop()
      }
    },

    setBgCanvasRect () {
      let containerWidth = Math.round(this.$refs.cropper.getContainerData().width)
      let containerHeight = Math.round(this.$refs.cropper.getContainerData().height)

      this.bgCanvas.style.left = 30
      this.bgCanvas.style.top = 0
      this.bgCanvas.setAttribute('width', containerWidth.toString().concat('px'))
      this.bgCanvas.setAttribute('height', containerHeight.toString().concat('px'))
    },

    drawCropBoxes () {
      let ctx = this.bgCanvas.getContext('2d')
      let cropImgList = this.$store.state.cropImgList
      console.log('drawCropBoxes cropImgList')
      console.log(cropImgList)
      for (let i in cropImgList) {
        ctx.beginPath()
        ctx.lineWidth = '3'
        ctx.strokeStyle = cropImgList[i].color // 'gray'
        ctx.rect(cropImgList[i].cropBoxLeft, cropImgList[i].cropBoxTop, cropImgList[i].cropBoxWidth, cropImgList[i].cropBoxHeight)
        ctx.stroke()
      }

      this.resetCanvas()
    },

    clearBgCanvas () {
      var ctx = this.bgCanvas.getContext('2d')
      ctx.clearRect(0, 0, this.$refs.cropper.getContainerData().width, this.$refs.cropper.getContainerData().height)
    },

    setDivAddImgPosition () {
      let divAddImgX = 30 + this.$refs.cropper.getCropBoxData().left + this.$refs.cropper.getCropBoxData().width - 105
      let divAddImgY = this.$refs.cropper.getCropBoxData().top + this.$refs.cropper.getCropBoxData().height + 10

      this.divAddImg.style.left = divAddImgX.toString().concat('px')
      this.divAddImg.style.top = divAddImgY.toString().concat('px')
    },

    hideDivAddImg (hidden) {
      if (hidden) {
        this.divAddImg.style.display = 'none'
        this.divAddImg.style.visibility = 'hidden'
      } else {
        this.divAddImg.style.display = 'inline'
        this.divAddImg.style.visibility = 'visible'
      }
    },

    requestGetDatasetContents () {

      let options = {
        count: 3
      }

      return this.$store.dispatch('FETCH_DATASET_CONTENTS', {
        datasetId: '59cdc6c9c92eec000f5a32b4', // this.datasetId,
        options: options
      }).then(() => {
        console.log('done FETCH_DATASET_CONTENTS in Dashboard.js')
        console.log(this.$store.state.currentDataset)
        this.currentDataset = this.$store.state.currentDataset
        // this.fetchRawImages()
      })
    },

    fetchRawImages () {
      this.currentDataset.imgUrl.forEach((rawImg) => {
        this.$store.commit('SET_RAW_IMAGE_LIST', { rawImg })
      })
    },

    requestUpdateDataset (canvasData) {

      // generateUpdateRequest
      let req = this.generateUpdateRequest(canvasData)
      console.log('generateUpdateRequest')
      console.log(JSON.stringify(req))

      // requestUpdateDataset API
      return this.$store.dispatch('UPDATE_DATASET', {
        options: req,
        datasetId: '59cdc6c9c92eec000f5a32b4' // this.datasetId //
      }).then(() => {
        console.log('done UPDATE_DATASET in VideoCanvas.vue')
      })
    },

    generateUpdateRequest: function (canvasData) {

      let markedImgList = this.$store.state.cropImgList

      var imageObject
      var imageObjectList = []
      var objectObject
      var objectObjectList
      var objectLabelList
      var labels = []

      imageObject = new Object()
      imageObject.imageId = this.rawImgList[this.rawImgIndex]._id
      imageObject.uri = this.rawImgList[this.rawImgIndex].uri
      // imageObject.name = this.currentDataset.images[frameNumber].name
      imageObject.segmented = 0
      imageObject.w = canvasData.naturalWidth
      imageObject.h = canvasData.naturalHeight

      objectObjectList = []
      objectLabelList = []
      let annotatedObject
      for (let i = 0; i < markedImgList.length; i++) {
        annotatedObject = markedImgList[i]
        console.log(' - ' + annotatedObject.name + ' - ')

        objectObject = new Object()
        objectObject.type = 'polygon'
        objectObject.polygons = [
          [annotatedObject.cropBoxLeft, annotatedObject.cropBoxTop],
          [annotatedObject.cropBoxLeft + annotatedObject.cropBoxWidth, annotatedObject.cropBoxTop],
          [annotatedObject.cropBoxLeft + annotatedObject.cropBoxWidth, annotatedObject.cropBoxTop + annotatedObject.cropBoxHeight],
          [annotatedObject.cropBoxLeft, annotatedObject.cropBoxTop + annotatedObject.cropBoxHeight],
        ]
        objectObject.difficult = 0
        objectObject.occluded = 0
        objectObject.label = annotatedObject.label
        objectObject.pose = 'Unspecified'

        objectObjectList.push(objectObject)
        objectLabelList.push(annotatedObject.label)
      }

      imageObject.objects = objectObjectList
      // imageObject.labels = objectLabelList // tags

      imageObjectList.push(imageObject)

      var dataObject = {
        images: imageObjectList
      }

      var reqDataObjectList = []
      reqDataObjectList.push(dataObject)

      var req = {
        type: 'bigquery',
        data: reqDataObjectList
      }
      return req
    }

  }
}

function fetchRawImages (store) {
  return store.dispatch('FETCH_RAW_IMAGES', {
    // test : users/59a9325aadc71eb86c439ef3/projects/59a94006adc71eb86c43c3fd
    userId: '59a9325aadc71eb86c439ef3',
    projectId: '59a94006adc71eb86c43c3fd'
  }).then(() => {
    console.log('done FETCH_RAW_IMAGES in Dashboard.js')
  })
}

function getProjects (store) {
  console.log('userId : ' + store.state.userId)
  awProject.getProjectsByUser(store.state.userId)
    .then(res => {
      console.log(res.data.data)
    })
}
