import state from './state'

let app

const bootstrap = async () => {
  if (!app) {
    state.setConfig()
    state.config.boostrap && await state.config.boostrap()
  }
}

export default bootstrap
