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
      id: '',
      region: ''
    },
    stage: ''
  },
  addTopic: function (value) {
    console.log({ topic: value })
    this.topics = uniq([...this.topics, value], 'name')
  },
  addConsumer: function (value) {
    console.log({ consumer: value })
    this.consumers = [...this.consumers, value]
  },
  addSchedule: function (value) {
    console.log({ schedule: value })
    this.schedules = [...this.schedules, value]
  },
  addEndpoint: function (value) {
    console.log({ endpoint: value })
    this.endpoints = [...this.endpoints, value]
  },
  setConfig: function () {
    const value = getConfig()
    this.config = value
  }
}

export default state
