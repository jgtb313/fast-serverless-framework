import AWS from 'aws-sdk'
import state from '../../state'

const send = async ({ topic, message }) => {
  const Message = typeof(message) === 'string'
    ? message
    : JSON.stringify(message)
  const TopicArn =  `arn:aws:sns:${state.config.aws.region}:${state.config.aws.id}:${topic}-${state.config.stage}`

  const params = {
    Message,
    TopicArn
  }

  const data = await new AWS.SNS().publish(params).promise()

  return data?.MessageId
}

export default send
