import { uniq, getConfig } from './utils'

const state = {
  topics: [],
  consumers: [],
  schedules: [],
  endpoints: [],
  config: {
    project: '',
    bootstrap: undefined,
    endpoints: {
      beforeEach: [],
      afterEach: []
    },
    aws: {
      endpoint: '',
      id: '',
      region: '',
      lambdaRole: ''
    },
    stage: '',
    nodeVersion: ''
  },
  addTopic (value) {
    this.topics = uniq([...this.topics, value], 'name')
  },
  addConsumer (value) {
    this.consumers = [...this.consumers, value]
  },
  addSchedule (value) {
    this.schedules = [...this.schedules, value]
  },
  addEndpoint (value) {
    this.endpoints = [...this.endpoints, value]
  },
  setConfig () {
    const value = getConfig()
    this.config = {
      ...this.config,
      ...value
    }
  }
}

export default state
