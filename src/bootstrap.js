import state from './state'

let app

const bootstrap = async () => {
  if (app) {
    return
  }

  state.setConfig()
  
  if (state.config.boostrap) {
    app = await state.config.boostrap()
  }
}

export default bootstrap
