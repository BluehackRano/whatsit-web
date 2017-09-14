<template>
  <div id="all">
    <!--<p>To resume a previous annotation, select a frames zip archive: <input type="file" id="zipFile" ref="zipFile" accept=".zip" @change="extractFramesFromZip" /></p>-->

    <button @click="extractFramesFromZipClicked">클릭클릭</button>

    <ol>
      <li>
        <p class="output" id="videoDimensions" ref="videoDimensions"></p>
        <p class="output" id="extractionProgress" ref="extractionProgress"></p>
      </li>
      <li>
        <h3>{{ currentFrame }} / {{ totalFrames }}</h3>
      </li>
      <li>
        <div id="doodle" ref="doodle" @mousemove="doodleMouseMove($event)" @click="doodleClicked($event)">
          <canvas id="canvas" ref="canvas"></canvas>
        </div>
        <h3>{{ currentFrame }} / {{ totalFrames }}</h3>
        <p><input type="button" id="play" ref="playButton" value="Play" disabled="true" @click="playButtonClicked" /><input type="button" id="pause" ref="pauseButton" value="Pause" disabled="true" @click="pauseButtonClicked" /></p>
        <div id="slider" ref="slider"></div>
        <!--<p><label for="speed">Speed multiplier: </label><input type="text" id="speed" value="1.00" size="4" /></p>-->
        <div id="objects"></div>
      </li>
      <li>
        <p><input type="button" id="generateXml" value="Generate" disabled="true" /> the <a href="http://web.mit.edu/vondrick/vatic/" target="new">vatic</a>-compatible XML annotations file.</p>
      </li>
    </ol>
  </div>
</template>

<script>
  let vatic = require('./vatic')
  import { FramesManager, AnnotatedObjectsTracker, AnnotatedObject, AnnotatedFrame, BoundingBox } from './vatic'
  import { JSZIP } from './jszip'

  export default {
    name: 'VideoCanvas',
    data: function () {
      return {
        vaticConfig: {
          // Should be higher than real FPS to not skip real frames
          // Hardcoded due to JS limitations
          fps: 5,

          // Low rate decreases the chance of losing frames with poor browser performances
          playbackRate: 0.4,

          // Format of the extracted frames
          imageMimeType: 'image/jpeg',
          imageExtension: '.jpg',

          // Name of the extracted frames zip archive
          framesZipFilename: 'extracted-frames.zip'
        },
        speed: 3.0,
        currentFrame: 0,
        totalFrames: 0,
        framesManager: null,
        annotatedObjectsTracker: null,
        tmpAnnotatedObject: null,
        slider: null,
        player: null,
        doodle: null,
        canvas: null,
        ctx: null,
        mouse: null,
        playButton: null,
        pauseButton: null,
        sliderElement: null,
        videoDimensionsElement: null,
        extractionProgressElement: null
      }
    },
    created: function () {

    },
    mounted: function () {
      this.doodle = this.$refs.doodle
      this.canvas = this.$refs.canvas
      this.ctx = this.canvas.getContext('2d')
      this.playButton = this.$refs.playButton
      this.pauseButton = this.$refs.pauseButton
      this.sliderElement = this.$refs.slider
      this.videoDimensionsElement = this.$refs.videoDimensions
      this.extractionProgressElement = this.$refs.extractionProgress

      let self = this

//      this.slider = {
//        init: function(min, max, onChange) {
//          self.sliderElement.slider('option', 'min', min);
//          self.sliderElement.slider('option', 'max', max);
//          self.sliderElement.on('slidestop', (e, ui) => {
//            onChange(ui.value);
//          });
//          self.sliderElement.slider('enable');
//        },
//        setPosition: function(frameNumber) {
//          self.sliderElement.slider('option', 'value', frameNumber);
//        },
//        reset: function() {
//          self.sliderElement.slider({disabled: true});
//        }
//      }
//      this.slider.reset()

      this.player = {
        currentFrame: 0,
        isPlaying: false,
        isReady: false,
        timeout: null,

        initialize: function() {
          this.currentFrame = 0;
          this.isPlaying = false;
          this.isReady = false;

          self.playButton.disabled = true;
          self.playButton.style.display = 'block';
          self.pauseButton.disabled = true;
          self.pauseButton.style.display = 'none';
        },

        ready: function() {
          this.isReady = true;

          self.playButton.disabled = false;
        },

        seek: function(frameNumber) {
          if (!this.isReady) {
            return;
          }

          this.pause();

          if (frameNumber >= 0 && frameNumber < self.framesManager.frames.totalFrames()) {
            this.drawFrame(frameNumber);
            this.currentFrame = frameNumber;
            self.currentFrame = this.currentFrame
          }
        },

        play: function() {
          if (!this.isReady) {
            return;
          }

          this.isPlaying = true;

          self.playButton.disabled = true;
          self.playButton.style.display = 'none';
          self.pauseButton.disabled = false;
          self.pauseButton.style.display = 'block';

          this.nextFrame();
        },

        pause: function() {
          if (!this.isReady) {
            return;
          }

          this.isPlaying = false;
          if (this.timeout != null) {
            clearTimeout(this.timeout);
            this.timeout = null;
          }

          self.pauseButton.disabled = true;
          self.pauseButton.style.display = 'none';
          self.playButton.disabled = false;
          self.playButton.style.display = 'block';
        },

        toogle: function() {
          if (!this.isPlaying) {
            this.play();
          } else {
            this.pause();
          }
        },

        nextFrame: function() {
          if (!this.isPlaying) {
            return;
          }

          if (this.currentFrame >= self.framesManager.frames.totalFrames()) {
            this.done();
            return;
          }

          this.drawFrame(this.currentFrame).then(() => {
            this.currentFrame++;
            self.currentFrame = this.currentFrame
            this.timeout = setTimeout(() => this.nextFrame(), 1000 / (self.vaticConfig.fps * parseFloat(self.speed /* speedInput.value */ )));
          });
        },

        drawFrame: function(frameNumber) {
          return new Promise((resolve, _) => {
            self.annotatedObjectsTracker.getFrameWithObjects(frameNumber).then((frameWithObjects) => {
              self.ctx.drawImage(frameWithObjects.img, 0, 0);

              for (let i = 0; i < frameWithObjects.objects.length; i++) {
                let object = frameWithObjects.objects[i];
                let annotatedObject = object.annotatedObject;
                let annotatedFrame = object.annotatedFrame;
                if (annotatedFrame.isVisible()) {
                  annotatedObject.dom.style.display = 'block';
                  annotatedObject.dom.style.width = annotatedFrame.bbox.width + 'px';
                  annotatedObject.dom.style.height = annotatedFrame.bbox.height + 'px';
                  annotatedObject.dom.style.left = annotatedFrame.bbox.x + 'px';
                  annotatedObject.dom.style.top = annotatedFrame.bbox.y + 'px';
                  annotatedObject.visible.prop('checked', true);
                } else {
                  annotatedObject.dom.style.display = 'none';
                  annotatedObject.visible.prop('checked', false);
                }
              }

              let shouldHideOthers = frameWithObjects.objects.some(o => o.annotatedObject.hideOthers);
              if (shouldHideOthers) {
                for (let i = 0; i < frameWithObjects.objects.length; i++) {
                  let object = frameWithObjects.objects[i];
                  let annotatedObject = object.annotatedObject;
                  if (!annotatedObject.hideOthers) {
                    annotatedObject.dom.style.display = 'none';
                  }
                }
              }

//              self.slider.setPosition(this.currentFrame);

              resolve();
            });
          });
        },

        done: function() {
          this.currentFrame = 0;
          this.isPlaying = false;

          self.playButton.disabled = false;
          self.playButton.style.display = 'block';
          self.pauseButton.disabled = true;
          self.pauseButton.style.display = 'none';
        }
      }

      this.mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
      }

      this.framesManager = new FramesManager()
      this.annotatedObjectsTracker = new AnnotatedObjectsTracker(this.framesManager)

      // Keyboard shortcut
      window.onkeydown = function(e) {
        let preventDefault = true;

        if (e.keyCode === 32) { // space
          self.player.toogle();
        } else if (e.keyCode === 78) { // n
          self.doodle.style.cursor = 'crosshair';
        } else if (e.keyCode === 27) { // escape
          if (self.tmpAnnotatedObject != null) {
            self.doodle.removeChild(self.tmpAnnotatedObject.dom);
            self.tmpAnnotatedObject = null;
          }

          self.doodle.style.cursor = 'default';
        } else if (e.keyCode == 37) { // left
          self.player.seek(self.player.currentFrame - 1);
        } else if (e.keyCode == 39) { // right
          self.player.seek(self.player.currentFrame + 1);
        } else {
          preventDefault = false;
        }

        if (preventDefault) {
          e.preventDefault();
        }
      }

    },
    methods: {
      extractFramesFromZipClicked: function () {
        console.log('extractFramesFromZip')

        this.clearAllAnnotatedObjects()
//        this.slider.reset()
        this.player.initialize

        let promise
        let self = this

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200){
            // console.log(this.response, typeof this.response);
            promise = self.extractFramesFromZip(self.vaticConfig, this.response)

            promise.then((frames) => {
              // console.log(frames)
              if (frames.totalFrames() > 0) {
                self.extractionProgressElement.innerHTML = 'Extraction completed. ' + frames.totalFrames() + ' frames captured.'
                self.currentFrame = 0
                self.totalFrames = frames.totalFrames()
                frames.getFrame(0).then((blob) => {
                  vatic.blobToImage(blob).then((img) => {
                    self.initializeCanvasDimensions(img);
                    self.ctx.drawImage(img, 0, 0);
                    self.videoDimensionsElement.innerHTML = 'Video dimensions determined: ' + img.width + 'x' + img.height;

                    self.framesManager.set(frames)
//                    self.slider.init(
//                      0,
//                      self.framesManager.frames.totalFrames() - 1,
//                      (frameNumber) => self.player.seek(frameNumber)
//                    )
                    self.player.ready()

                    self.playButton.disabled = false
                  })
                })
              }

            })
          }
        }
        xhr.open('GET', '/static/extracted-frames.zip');
        xhr.responseType = 'blob';
        xhr.send();

      },
      extractFramesFromZip: function (config, file) {
        console.log('extractFramesFromZip')
        return new Promise((resolve, _) => {
          JSZip
            .loadAsync(file)
            .then((zip) => {
              let totalFrames = 0;
              for (let i = 0; ; i++) {
                let file = zip.file(i + config.imageExtension);
                if (file == null) {
                  totalFrames = i;
                  break;
                }
              }

              resolve({
                totalFrames: () => {
                  return totalFrames;
                },
                getFrame: (frameNumber) => {
                  return new Promise((resolve, _) => {
                    let file = zip.file(frameNumber + config.imageExtension);
                    file
                      .async('arraybuffer')
                      .then((content) => {
                        let blob = new Blob([content], {type: config.imageMimeType});
                        resolve(blob);
                      });
                  });
                }
              });
            });
        });
      },

      interactify: function (dom, onChange) {
        let bbox = $(dom);
        bbox.addClass('bbox');

        let createHandleDiv = (className) => {
          let handle = document.createElement('div');
          handle.className = className;
          bbox.append(handle);
          return handle;
        };

        bbox.resizable({
          containment: 'parent',
          handles: {
            n: createHandleDiv('ui-resizable-handle ui-resizable-n'),
            s: createHandleDiv('ui-resizable-handle ui-resizable-s'),
            e: createHandleDiv('ui-resizable-handle ui-resizable-e'),
            w: createHandleDiv('ui-resizable-handle ui-resizable-w')
          },
          stop: (e, ui) => {
            let position = bbox.position();
            onChange(Math.round(position.left), Math.round(position.top), Math.round(bbox.width()), Math.round(bbox.height()));
          }
        });

        bbox.draggable({
          containment: 'parent',
          handle: createHandleDiv('handle center-drag'),
          stop: (e, ui) => {
            let position = bbox.position();
            onChange(Math.round(position.left), Math.round(position.top), Math.round(bbox.width()), Math.round(bbox.height()));
          }
        });
      },

      newBboxElement: function () {
        let dom = document.createElement('div');
        dom.className = 'bbox';
        this.doodle.appendChild(dom);
        return dom;
      },

      addAnnotatedObjectControls: function (annotatedObject) {
        let name = $('<input type="text" value="Name?" />');
        if (annotatedObject.name) {
          name.val(annotatedObject.name);
        }
        name.on('change keyup paste mouseup', function() {
          annotatedObject.name = this.value;
        });

        let id = $('<input type="text" value="ID?" />');
        if (annotatedObject.id) {
          id.val(annotatedObject.id);
        }
        id.on('change keyup paste mouseup', function() {
          annotatedObject.id = this.value;
        });

        let visibleLabel = $('<label>');
        let visible = $('<input type="checkbox" checked="checked" />');
        annotatedObject.visible = visible;

        let self = this

        visible.change(function() {
          let bbox;
          if (this.checked) {
            annotatedObject.dom.style.display = 'block';
            let jquery = $(annotatedObject.dom);
            let position = jquery.position();
            bbox = new BoundingBox(Math.round(position.left), Math.round(position.top), Math.round(jquery.width()), Math.round(jquery.height()));
          } else {
            annotatedObject.dom.style.display = 'none';
            bbox = null;
          }
          annotatedObject.add(new AnnotatedFrame(self.player.currentFrame, bbox, true));
        });
        visibleLabel.append(visible);
        visibleLabel.append('Is visible?');

        let hideLabel = $('<label>');
        let hide = $('<input type="checkbox" />');
        hide.change(function() {
          annotatedObject.hideOthers = this.checked;
        });
        hideLabel.append(hide);
        hideLabel.append('Hide others?');

        let del = $('<input type="button" value="Delete" />');
        del.click(function() {
          for (let i = 0; self.annotatedObjectsTracker.annotatedObjects.length; i++) {
            if (annotatedObject === self.annotatedObjectsTracker.annotatedObjects[i]) {
              self.clearAnnotatedObject(i);
              break;
            }
          }
        });

        let div = $('<div></div>');
        div.css({
          'border': '1px solid black',
          'display': 'inline-block',
          'margin': '5px',
          'padding': '10px'});
        div.append(name);
        div.append($('<br />'));
        div.append(id);
        div.append($('<br />'));
        div.append(visibleLabel);
        div.append($('<br />'));
        div.append(hideLabel);
        div.append($('<br />'));
        div.append(del);

        annotatedObject.controls = div;

        $('#objects').append(div);
      },

      initializeCanvasDimensions: function (img) {
        this.doodle.style.width = img.width + 'px';
        this.doodle.style.height = img.height + 'px';
        this.canvas.width = img.width;
        this.canvas.height = img.height;
//        this.sliderElement.style.width = img.width + 'px';
      },

      clearAllAnnotatedObjects: function () {
        for (let i = 0; i < this.annotatedObjectsTracker.annotatedObjects.length; i++) {
          this.clearAnnotatedObject(i);
        }
      },

      clearAnnotatedObject: function (i) {
        let annotatedObject = this.annotatedObjectsTracker.annotatedObjects[i];
        annotatedObject.controls.remove();
        $(annotatedObject.dom).remove(); // ??
        this.annotatedObjectsTracker.annotatedObjects.splice(i, 1);
      },

      playButtonClicked: function () {
        this.player.play()
      },

      pauseButtonClicked: function () {
        this.player.pause()
      },

      doodleMouseMove: function (e) {
        let ev = e || window.event;
        if (ev.pageX) {
          this.mouse.x = ev.pageX;
          this.mouse.y = ev.pageY;
        } else if (ev.clientX) {
          this.mouse.x = ev.clientX;
          this.mouse.y = ev.clientY;
        }
        this.mouse.x -= this.doodle.offsetLeft;
        this.mouse.y -= this.doodle.offsetTop;

        if (this.tmpAnnotatedObject !== null) {
          this.tmpAnnotatedObject.width = Math.abs(this.mouse.x - this.mouse.startX);
          this.tmpAnnotatedObject.height = Math.abs(this.mouse.y - this.mouse.startY);
          this.tmpAnnotatedObject.x = (this.mouse.x - this.mouse.startX < 0) ? this.mouse.x : this.mouse.startX;
          this.tmpAnnotatedObject.y = (this.mouse.y - this.mouse.startY < 0) ? this.mouse.y : this.mouse.startY;

          this.tmpAnnotatedObject.dom.style.width = this.tmpAnnotatedObject.width + 'px';
          this.tmpAnnotatedObject.dom.style.height = this.tmpAnnotatedObject.height + 'px';
          this.tmpAnnotatedObject.dom.style.left = this.tmpAnnotatedObject.x + 'px';
          this.tmpAnnotatedObject.dom.style.top = this.tmpAnnotatedObject.y + 'px';
        }
      },

      doodleClicked: function (e) {
        if (this.doodle.style.cursor != 'crosshair') {
          return;
        }

        if (this.tmpAnnotatedObject != null) {
          let annotatedObject = new AnnotatedObject();
          annotatedObject.dom = this.tmpAnnotatedObject.dom;
          let bbox = new BoundingBox(this.tmpAnnotatedObject.x, this.tmpAnnotatedObject.y, this.tmpAnnotatedObject.width, this.tmpAnnotatedObject.height);
          annotatedObject.add(new AnnotatedFrame(this.player.currentFrame, bbox, true));
          this.annotatedObjectsTracker.annotatedObjects.push(annotatedObject);
          this.tmpAnnotatedObject = null;

          this.interactify(
            annotatedObject.dom,
            (x, y, width, height) => {
              let bbox = new BoundingBox(x, y, width, height);
              annotatedObject.add(new AnnotatedFrame(this.player.currentFrame, bbox, true));
            }
          );

          this.addAnnotatedObjectControls(annotatedObject);

          this.doodle.style.cursor = 'default';
        } else {
          this.mouse.startX = this.mouse.x;
          this.mouse.startY = this.mouse.y;

          let dom = this.newBboxElement();
          dom.style.left = this.mouse.x + 'px';
          dom.style.top = this.mouse.y + 'px';
          this.tmpAnnotatedObject = { dom: dom };
        }
      }
    }
  }

  window.onload = function () {

  }
</script>

<style scoped>
  #all {
    width: 100%;
    height: 500px;
    background-color: #00bf8f;
  }

  .output { font-family: monospace; font-weight: bold; }

  #doodle {
    position: relative;
    width: 0px;
    height: 0px;
    z-index: 2;
  }

  #canvas {
    z-index: 1;
  }

  .bbox {
    border: 1px solid #FF0000;
    position: absolute;
    z-index: 3;
  }

  .handle, .ui-resizable-handle {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    border: 1px solid rgba(255, 0, 0, .5);
    background-color: rgba(255, 255, 0, .05);
    position: absolute;
  }

  .center-drag {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: move;
  }

  .ui-resizable-n {
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: n-resize;
  }

  .ui-resizable-s {
    left: 50%;
    bottom: 0%;
    transform: translate(-50%, 50%);
    cursor: s-resize;
  }

  .ui-resizable-w {
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: w-resize;
  }

  .ui-resizable-e {
    right: 0%;
    top: 50%;
    transform: translate(50%, -50%);
    cursor: e-resize;
  }

  .ui-slider {
    position: relative;
    text-align: left;
    height: .8em;
  }

  .ui-slider-handle {
    position: absolute;
    z-index: 2;
    width: 1.2em;
    height: 1.2em;
    cursor: default;
    -ms-touch-action: none;
    touch-action: none;
    top: -.3em;
    margin-left: -.6em;
  }

  .ui-widget.ui-widget-content {
    border: 1px solid #d3d3d3;
  }

  .ui-state-default {
    border: 1px solid #d3d3d3;
    background-color: #e6e6e6;
  }

  .ui-state-hover, .ui-state-focus {
    border: 1px solid #999999;
    background-color: #dadada;
  }

  .ui-state-active {
    border: 1px solid #aaaaaa;
    background-color: #ffffff;
  }

  .ui-state-disabled {
    opacity: .35;
  }

  .ui-corner-all {
    border-radius: 4px;
  }
</style>
