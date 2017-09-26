<template>
  <transition name="modal">
    <div class="modal-mask" v-if="isShowModal">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            {{ title}}
          </div>

          <div class="modal-body">
            {{ body }}
          </div>

          <div class="modal-footer">
            <button class="modal-button" @click="close">
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
  .modal-mask {
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

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }

  .modal-container {
    width: 300px;
    margin: 0 auto;
    padding-top: 50px;
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    font-weight: bold;
    font-size: 13pt;
  }

  .modal-body {
    margin: 16px 0 50px 0;
    font-size: 12pt;
  }

  .modal-button {
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
