<template>
  <div id="all">
    <p>To resume a previous annotation, select a frames zip archive: <input type="file" id="zipFile" ref="zipFile" accept=".zip" @change="extractFramesFromZip" /></p>

    <button @click="extractFramesFromZip"></button>
    <div id="doodle">
      <canvas id="canvas"></canvas>
    </div>
    <p><input type="button" id="play" value="Play" disabled="true" /><input type="button" id="pause" value="Pause" disabled="true" style="display: none;" /></p>
    <div id="slider"></div>
    <p><label for="speed">Speed multiplier: </label><input type="text" id="speed" value="1.00" size="4" /></p>
    <div id="objects"></div>
  </div>
</template>

<script>
  import axios from 'axios'
  // import { FramesManager } from './vatic'
  let vatic = require('./vatic')

  export default {
    name: 'VideoCanvas',
    data: function () {
      return {
        framesManager: null,
        annotatedObjectsTracker: null
      }
    },
    created: function () {
      console.log('VideoCanvas created')
      this.framesManager = vatic.FramesManager
      console.log(this.framesManager.frames)
    },
    methods: {
      extractFramesFromZip: function () {

        let config = {
          // Should be higher than real FPS to not skip real frames
          // Hardcoded due to JS limitations
          fps: 30,

          // Low rate decreases the chance of losing frames with poor browser performances
          playbackRate: 0.4,

          // Format of the extracted frames
          imageMimeType: 'image/jpeg',
          imageExtension: '.jpg',

          // Name of the extracted frames zip archive
          framesZipFilename: 'extracted-frames.zip'
        }

        let file = this.$refs.zipFile.files[0]
        console.log(file)

        let promise = this.extractFramesFromZip(config, file)
        console.log(promise)

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
