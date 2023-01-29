const { SSM } = require('aws-sdk')
const {
  GPT_API_KEY_ENV,
} = require('./utils')

const GPT_API_PARAM_NAME = process.env[GPT_API_KEY_ENV]

exports.handler = async (event) => {
  const apiKey = event.body.apiKey

  console.log('Got API key: ', apiKey.replace(/./g, '*'))

  const ssm = new SSM()
  await ssm.putParameter({
    Name: GPT_API_PARAM_NAME,
    Value: apiKey,
    Type: 'SecureString',
  }).promise()

  return {
    statusCode: 204,
  }
}
