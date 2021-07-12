import bootstrap from '../bootstrap'
import state from '../state'
import { getContext, kebabize, asyncPipe } from '../utils'

const register = ({ method, params = '', middlewares = [], isPublic, handler }) => {
  const { module, version, file, path } = getContext()

  const moduleEndpoint = `${module}-${file}`
  const endpoint = kebabize(file)

  state.addEndpoint({
    module,
    version,
    name: moduleEndpoint,
    path,
    options: {
      method,
      path: endpoint,
      params
    }
  })

  return async (event, context) => {
    const id = context.awsRequestId
    try {
      await bootstrap()

      const { queryStringParameters, pathParameters, body, headers } = event

      const request = {
        id,
        headers,
        query: queryStringParameters ?? {},
        params: pathParameters ?? {},
        body: body ? JSON.parse(body) : {}
      }

      const options = {
        isPublic
      }

      const beforeEach = state.config.endpoints?.beforeEach || []
      const afterEach = state.config.endpoints?.afterEach || []

      const execute = asyncPipe(
        ...beforeEach.map(middleware => middleware(options)),
        ...middlewares.map(middleware => middleware(options)),
        handler,
        ...afterEach.map(middleware => middleware(options)),
      )
  
      const result = await execute(request)

      const response = {
        statusCode: 200,
        body: JSON.stringify(result)
      }
      return response
    } catch (error) {
      console.log(error)
      const response = {
        config: state.config,
        statusCode: error.status ?? 500,
        body: JSON.stringify({ message: error.message, stack: error.stack })
      }
      return response
    }
  }
}

export default register
