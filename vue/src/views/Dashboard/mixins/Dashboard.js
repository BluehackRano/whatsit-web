let WhatsIt = require('whatsit-sdk-js')
let aw = new WhatsIt()
let awProject = aw.getProject()

import bus from '../../../util/bus'

var imgList = [
  '/static/img/bg3.jpeg',
  '/static/img/bg1.jpg',
  '/static/img/logo-w.png',
  '/static/img/bg2.jpg',

]
var imgIndex=0

export const Dashboard = {

  data: function () {
    return {
      bgCanvas: null,
      imgSrc: '/static/img/bg3.jpeg',
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
  },

  mounted: function () {
    this.bgCanvas = document.getElementById('bg_canvas')
    this.divAddImg = document.getElementById('div_add_img')
  },

  methods: {
    toAddProject: function () {
      console.log('on click to dashboard button')
      this.$router.push('/projects/add')
    },

    onReadyImgSrc () {
      this.setBgCanvasRect()
    },

    saveAndNextImage () {
      ++imgIndex
      if (imgIndex == imgList.length) {
        imgIndex = 0
      }
      this.imgSrc = imgList[imgIndex]
      this.$refs.cropper.replace(this.imgSrc)

      this.resetCanvas()
      this.resetCropImgListState()
    },

    addImage () {
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()

      if (this.cropImg === undefined || this.cropImg === null || this.cropImg === '') {
        return
      }

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
        })
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
      window.alert(this.$store.state.cropImgList)
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
      for (let i in cropImgList) {
        ctx.beginPath()
        ctx.lineWidth = '3'
        ctx.strokeStyle = 'gray'
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
    }
  }
}

function getProjects (store) {
  console.log('userId : ' + store.state.userId)
  awProject.getProjectsByUser(store.state.userId)
    .then(res => {
      console.log(res.data.data)
    })
}
