export const Sidebar = {
  methods: {
    handleClick (e) {
      console.log(e)
      e.preventDefault()
      e.target.parentElement.classList.toggle('open')
    }
  }
}
