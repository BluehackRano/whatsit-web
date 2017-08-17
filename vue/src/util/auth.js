export function getToken () {
  return localStorage.getItem('access-token')
}

export function setToken (aToken) {
  return localStorage.setItem('access-token', aToken)
}

export function isAuthenticated () {
  if (this.getToken()) {
    return true
  }
  return false
}

export function getProvider () {
  return localStorage.getItem('provider')
}

export function setToken (provider) {
  return localStorage.setItem('provider', provider)
}

export function clear () {
  localStorage.removeItem('access-token')
  localStorage.removeItem('provider')
  return
}
