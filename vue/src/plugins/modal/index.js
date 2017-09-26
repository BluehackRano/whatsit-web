import Modal from './Modal'

// Plugin으로 내보내기
export default {
  install (Vue) {
    // modal Factory
    let ModalConstructor = Vue.extend(Modal)
    let modalInstanse = null

    // 어디서나 this.$modal 을 사용가능
    Vue.prototype.$modal = function () {
    }

    // modal.open 을 정의
    Vue.prototype.$modal.open = function (title, body, closeButton) {
      if (!modalInstanse) {
        modalInstanse = new ModalConstructor({
          el: document.createElement('div'),
          data () {
            return {
              title: title,
              body: body,
              closeButton: closeButton
            }
          }
        })
        // 생성된 DOM을 추가해준다.
        document.body.appendChild(modalInstanse.$el)
      }

      modalInstanse.title = title
      modalInstanse.body = body
      modalInstanse.closeButton = closeButton
      modalInstanse.isShowModal = true
    }

    // modal.close 를 정의
    Vue.prototype.$modal.close = function () {
      if (!modalInstanse) {
        return
      }
      modalInstanse.isShowModal = false
    }
  }
}
