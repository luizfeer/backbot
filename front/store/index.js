export const state = () => ({
  id: {},
  message: '',
  result: '',
  qrcode: '',
  sessionActive: '',
  sessions: {}
})

export const mutations = {
  setState (state, data) {
    state.message = data.message
    state.result = data.result
  },
  setQRCode (state, qrcode) {
    state.qrcode = qrcode
  },
  setResult (state, result) {
    state.result = result
  },
  setMessage (state, message) {
    state.message = message
  },
  setSessions (state, data) {
    state.sessions = data
  },
  getStatus (state, data) {
    state.message = data.state
    state.sessionActive = data.name.name
  },

  setSession (state, sessionName) {
    state.sessionActive = sessionName.name
  },

  newMessage (state, msg) {
    state.messages = [...state.messages, msg]
  },
  updateUsers (state, users) {
    state.users = users
  },
  clearData (state) {
    state.user = {}
    state.messages = []
    state.users = []
  }
}
