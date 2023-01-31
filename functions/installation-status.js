const { SSM } = require('aws-sdk')
const {
  GPT_API_KEY_ENV,
} = require('./utils')

const GPT_API_PARAM_NAME = process.env[GPT_API_KEY_ENV]

exports.handler = async () => {
  try {
    const ssm = new SSM()
    const { Parameter: param } = await ssm.getParameter({
      Name: GPT_API_PARAM_NAME,
    }).promise()

    const isInstalled = !!param?.Value

    return {
      statusCode: 200,
      body: JSON.stringify({ isInstalled }),
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    }
  }
  catch (err) {
    console.warn('Failed to get SSM parameter', err)

    return {
      statusCode: 200,
      body: JSON.stringify({ isInstalled: false }),
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    }
  }
}
