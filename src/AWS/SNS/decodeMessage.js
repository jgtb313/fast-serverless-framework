const decodeMessage = ({ Records }) => {
  const [{ body }] = Records
  const message = JSON.parse(body)
  const decodedMessage = JSON.parse(message.Message)

  return decodedMessage
}

export default decodeMessage
