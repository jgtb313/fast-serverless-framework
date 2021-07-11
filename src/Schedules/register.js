import bootstrap from '../bootstrap'
import state from '../state'
import { getContext, kebabize } from '../utils'

const register = ({ rate, timeout = 900, handler }) => {
  const { module, file, path } = getContext()

  const schedule = kebabize(file)

  const moduleSchedule = `${module}-${schedule}`

  state.addSchedule({
    name: moduleSchedule,
    path,
    options: {
      rate,
      timeout
    }
  })

  return async (event, context) => {
    const id = context.awsRequestId
    await bootstrap()
    await handler(event, { id })
  }
}

export default register
