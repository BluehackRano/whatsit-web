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

        <hr class="transparent mx-3 my-0">
        <div class="callout m-0 py-1 text-muted text-center bg-faded text-uppercase">
          <small><b>작업목록</b>
          </small>
        </div>

        <div
          is="done-item"
          v-for="(croppedImg, index) in cropImgList"
          v-bind:key="index"
          v-bind:labelName="index+1"
          v-bind:imgScr="croppedImg.cropImg"
          v-on:remove="cropImgList.splice(index, 1)"
          v-on:remove="removeCropImage(index)"
        >
        </div>

        <hr class="mx-0 my-0">
      </div>
    </div>
  </aside>
</template>

<script>
import {Aside} from './mixins/Aside'

export default {
  name: 'aside',
  mixins: [Aside],
  created () {
    document.body.classList.remove('aside-menu-hidden')
  }
}
</script>

<style scoped>
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
