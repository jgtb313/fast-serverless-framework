import { getConfig, uniq } from './utils'

const state = {
  topics: [],
  consumers: [],
  schedules: [],
  endpoints: [],
  config: {
    bootstrap: undefined,
    endpoints: {
      beforeEach: [],
      afterEach: []
    },
    aws: {
      endpoint: '',
      id: '',
      region: ''
    },
    stage: ''
  },
  addTopic: function (value) {
    this.topics = uniq([...this.topics, value], 'name')
  },
  addConsumer: function (value) {
    this.consumers = [...this.consumers, value]
  },
  addSchedule: function (value) {
    this.schedules = [...this.schedules, value]
  },
  addEndpoint: function (value) {
    this.endpoints = [...this.endpoints, value]
  },
  setConfig: function () {
    const value = getConfig()
    this.config = value
  }
}

export default state
