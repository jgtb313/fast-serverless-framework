import state from './state'

let app

const bootstrap = async () => {
  if (!app) {
    state.setConfig()
    state.config.boostrap && state.config.boostrap()
  }
}

export default bootstrap
