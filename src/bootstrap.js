import state from './state'

let app

const bootstrap = async () => {
  if (app) {
    return
  }

  state.setConfig()
  
  if (state.config.bootstrap) {
    app = await state.config.bootstrap()
  }
}

export default bootstrap
