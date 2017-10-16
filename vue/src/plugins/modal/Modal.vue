<template>
  <transition name="modal">
    <div class="rano-modal-mask" v-if="isShowModal">
      <div class="rano-modal-wrapper">
        <div class="rano-modal-container">
          <div class="rano-modal-header">
            {{ title}}
          </div>

          <div class="rano-modal-body">
            {{ body }}
          </div>

          <div class="rano-modal-footer">
            <button class="rano-modal-button" @click="close">
              {{ closeButton }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'Modal',
    data () {
      return {
        isShowModal: false,
        title: 'Title',
        body: 'Body',
        closeButton: 'Close'
      }
    },
    methods: {
      open (title, body, closeButton) {
        this.isShowModal = true
        this.title = title
        this.body = body
        this.closeButton = closeButton
      },
      close () {
        this.isShowModal = false
      }
    }
  }
</script>

<style scoped>
  .rano-modal-mask {
    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity .3s;
  }

  .rano-modal-wrapper {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }

  .rano-modal-container {
    width: 300px;
    margin: 0 auto;
    padding-top: 50px;
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .rano-modal-header {
    font-weight: bold;
    font-size: 13pt;
  }

  .rano-modal-body {
    margin: 16px 0 50px 0;
    font-size: 12pt;
  }

  .rano-modal-button {
    width: 100%;
    height: 50px;
    text-align: center;
    background-color: #333;
    border: none;
    color: white;
    font-size: 12pt;
  }

  .modal-enter, .modal-leave-active {
    opacity: 0;
  }
</style>
