import state from '../state'

const options = () => ({
  ...(state.config.stage === 'local' ? { endpoint: 'http://localhost:4576' } : {})
})

export default options
