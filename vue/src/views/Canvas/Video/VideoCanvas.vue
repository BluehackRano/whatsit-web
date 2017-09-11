<template>
  <div id="all">
    <p>To resume a previous annotation, select a frames zip archive: <input type="file" id="zipFile" accept=".zip" /></p

    <div id="doodle">
      <canvas id="canvas"></canvas>
    </div>
    <p><input type="button" id="play" value="Play" disabled="true" /><input type="button" id="pause" value="Pause" disabled="true" style="display: none;" /></p>
    <div id="slider"></div>
    <p><label for="speed">Speed multiplier: </label><input type="text" id="speed" value="1.00" size="4" /></p>
    <div id="objects"></div>
  </div>
</template>

<script type="text/javascript" src="dist/jquery-1.12.4.js"></script>
<script type="text/javascript" src="dist/jquery-ui.js"></script>
<script type="text/javascript" src="vatic.js"></script>
<script>
  export default {
    name: 'VideoCanvas',
    data: function () {
      return {
      }
    },
    created: function () {
    },
    methods: {
    }
  }

  window.onload=function(){
    let zipFile = document.querySelector('#zipFile');
    zipFile.addEventListener('change', extractionFileUploaded, false);
  }

//  let zipFile = document.getElementById("zipFile");//
//  zipFile.addEventListener('change', extractionFileUploaded, false);

  function extractionFileUploaded() {
    alert('extractionFileUploaded')
//    if (this.files.length != 1) {
//      return;
//    }
//
//    videoFile.disabled = true;
//    zipFile.disabled = true;
//    xmlFile.disabled = true;
//    downloadFramesButton.disabled = true;
//    generateXmlButton.disabled = true;
//    clearAllAnnotatedObjects();
//    slider.reset();
//    player.initialize();
//
//    let promise;
//    if (this == videoFile) {
//      let dimensionsInitialized = false;
//
//      promise = extractFramesFromVideo(
//        config,
//        this.files[0],
//        (percentage, framesSoFar, lastFrameBlob) => {
//          blobToImage(lastFrameBlob).then((img) => {
//            if (!dimensionsInitialized) {
//              dimensionsInitialized = true;
//              initializeCanvasDimensions(img);
//            }
//            ctx.drawImage(img, 0, 0);
//
//            videoDimensionsElement.innerHTML = 'Video dimensions determined: ' + img.width + 'x' + img.height;
//            extractionProgressElement.innerHTML = (percentage * 100).toFixed(2) + ' % completed. ' + framesSoFar + ' frames extracted.';
//          });
//        });
//    } else {
//      promise = extractFramesFromZip(config, this.files[0]);
//    }
//
//    promise.then((frames) => {
//      extractionProgressElement.innerHTML = 'Extraction completed. ' + frames.totalFrames() + ' frames captured.';
//      if (frames.totalFrames() > 0) {
//        frames.getFrame(0).then((blob) => {
//          blobToImage(blob).then((img) => {
//            initializeCanvasDimensions(img);
//            ctx.drawImage(img, 0, 0);
//            videoDimensionsElement.innerHTML = 'Video dimensions determined: ' + img.width + 'x' + img.height;
//
//            framesManager.set(frames);
//            slider.init(
//              0,
//              framesManager.frames.totalFrames() - 1,
//              (frameNumber) => player.seek(frameNumber)
//            );
//            player.ready();
//
//            xmlFile.disabled = false;
//            playButton.disabled = false;
//            downloadFramesButton.disabled = false;
//            generateXmlButton.disabled = false;
//          });
//        });
//      }
//
//      videoFile.disabled = false;
//      zipFile.disabled = false;
//    });
  }

</script>

<style scoped>
  #all {
    width: 100%;
    height: 500px;
    background-color: #00bf8f;
  }
</style>
