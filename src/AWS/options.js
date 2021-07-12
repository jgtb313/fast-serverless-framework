import state from '../state'

const options = () => {
  return state.config.stage === 'local' ? { endpoint: state.config.aws.endpoint } : {}
}

export default options
