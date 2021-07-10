import AWS from '../AWS'
import bootstrap from '../bootstrap'
import state from '../state'
import { getContext, kebabize } from '../utils'

const register = ({ topic, concurrency = 1, timeout = 900, fifo = false, handler }) => {
  const { module, file, path } = getContext()

  const consumer = kebabize(file)

  const moduleTopic = `${module}-${topic}`
  const moduleConsumer = `${module}-${consumer}`

  state.addTopic({
    name: moduleTopic
  })

  state.addConsumer({
    topic: moduleTopic,
    name: moduleConsumer,
    path,
    options: {
      concurrency,
      timeout,
      fifo
    }
  })

  return async (event, context) => {
    const id = context.awsRequestId
    const message = AWS.SNS.decodeMessage(event)
    await bootstrap()
    await handler(message, { id })
  }
}

export default register
