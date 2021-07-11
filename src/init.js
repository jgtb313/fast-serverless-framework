import fs from 'fs'
import yaml from 'write-yaml'
import state from './state'
import { safeTryCatch, readModules, capitalize, kebabize } from './utils'

const capitalizeKebabCase = (value) => kebabize(value).split('-').map(capitalize).join('')
const serviceName = (name, suffix) => `${capitalizeKebabCase(name)}${suffix}`
const kebabCase = (...values) => values.join('-')
const topicRef = (value) => `!Ref ${serviceName(value, 'Topic')}`

const runEndpoints = (module) => {
  const versions = safeTryCatch(() => fs.readdirSync(`${process.cwd()}/src/modules/${module}/endpoints`), [])
  versions.forEach(version => {
    const endpoints = safeTryCatch(() => fs.readdirSync(`${process.cwd()}/src/modules/${module}/endpoints/${version}`), [])
    endpoints.forEach(endpoint => {
      require(`${process.cwd()}/src/modules/${module}/endpoints/${version}/${endpoint}`)
    })
  })
}
const runConsumers = (module) => {
  const consumers = safeTryCatch(() => fs.readdirSync(`${process.cwd()}/src/modules/${module}/consumers`), [])
  consumers.forEach(consumer => {
    require(`${process.cwd()}/src/modules/${module}/consumers/${consumer}`)
  })
}
const runSchedules = (module) => {
  const schedules = safeTryCatch(() => fs.readdirSync(`${process.cwd()}/src/modules/${module}/schedules`), [])
  schedules.forEach(schedule => {
    require(`${process.cwd()}/src/modules/${module}/schedules/${schedule}`)
  })
}

const buildServiceName = (value, { name }) => serviceName(name, value)
const buildService = (value, service, callback) => value.reduce((result, item) => ({
  ...result,
  [buildServiceName(service, item)]: callback(item)
}), {})

const prepareState = (state) => {
  const modules = readModules()

  modules.forEach(module => {
    runEndpoints(module)
    runConsumers(module)
    runSchedules(module)
  })

  return Promise.resolve(state)
}

const buildModuleTopics = (state) => buildService(state.topics, 'Topic', ({ name }) => ({
  Type: 'AWS::SNS::Topic',
  Properties: {
    TopicName: kebabCase(name, state.config.stage)
  }
}))
const buildModuleConsumers = (state) => buildService(state.consumers, 'Queue', ({ name, options }) => ({
  Type: 'AWS::SQS::Queue',
  Properties: {
    QueueName: kebabCase(name, state.config.stage),
    VisibilityTimeout: options.timeout
  }
}))
const buildModuleSubscriptions = (state) => buildService(state.consumers, 'Subscription', ({ topic, name }) => ({
  Type: 'AWS::SNS::Subscription',
  Properties: {
    TopicArn: topicRef(topic),
    Endpoint: {
      'Fn::GetAtt': [
        serviceName(name, 'Queue'),
        'Arn'
      ]
    },
    Protocol: 'sqs'
  }
}))
const buildModulePolicies = (state) => ({
  SqsQueuePolicy: {
    Type: 'AWS::SQS::QueuePolicy',
    Properties: {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'Allow-SNS-SendMessage',
            Effect: 'Allow',
            Principal: '*',
            Action: [
              'SQS:SendMessage'
            ],
            Resource: '*',
            Condition: {
              StringEquals: {
                'AWS:SourceAccount': '${self:custom.settings.accountId}'
              }
            }
          }
        ]
      },
      Queues: state.consumers.map(consumer => `!Ref ${buildServiceName('Queue', consumer)}`)
    }
  }
})
const buildResourcesModules = (state) => {
  const topics = buildModuleTopics(state)
  const consumers = buildModuleConsumers(state)
  const subscriptions = buildModuleSubscriptions(state)
  const policies = buildModulePolicies(state)

  yaml.sync(`${process.cwd()}/serverless.modules.resources.yml`, {
    ...topics,
    ...consumers,
    ...subscriptions,
    ...policies
  })

  return Promise.resolve(state)
}
const buildEndpointsModules = (state) => {
  const endpoints = buildService(state.endpoints, 'Endpoint', ({ module, version, name, path, options }) => ({
    name: kebabCase('endpoints', kebabize(name), state.config.stage),
    handler: `${path}.handler`,
    timeout: 30,
    events: [
      {
        http: {
          path: `${version}/${module}/${options.path}${options.params}`,
          method: options.method
        }
      }
    ]
  }))

  yaml.sync(`${process.cwd()}/serverless.modules.endpoints.yml`, endpoints)

  return Promise.resolve(state)
}
const buildConsumersModules = (state) => {
  const consumers = buildService(state.consumers, 'Consumer', ({ name, path, options }) => ({
    name: kebabCase('consumers', name, state.config.stage),
    handler: `${path}.handler`,
    timeout: options.timeout,
    reservedConcurrency: options.concurrency,
    events: [
      {
        sqs: {
          arn: {
            'Fn::GetAtt': [
              serviceName(name, 'Queue'),
              'Arn'
            ]
          },
          batchSize: 1,
          enabled: true
        }
      }
    ]
  }))

  yaml.sync(`${process.cwd()}/serverless.modules.consumers.yml`, consumers)

  return Promise.resolve(state)
}
const buildSchedulesModules = (state) => {
  const schedules = buildService(state.schedules, 'Schedule', ({ name, path, options }) => ({
    name: kebabCase('schedules', name, state.config.stage),
    handler: `${path}.handler`,
    timeout: options.timeout,
    events: [
      {
        schedule: {
          rate: options.rate,
          enabled: true
        }
      }
    ]
  }))

  yaml.sync(`${process.cwd()}/serverless.modules.schedules.yml`, schedules)

  return Promise.resolve(state)
}

const init = () => {
  state.setConfig()
  prepareState(state)
    .then(buildResourcesModules)
    .then(buildEndpointsModules)
    .then(buildConsumersModules)
    .then(buildSchedulesModules)
}

export default init
