const { SSM } = require('aws-sdk')
const {
  GPT_API_KEY_ENV,
  request,
} = require('./utils')

const GPT_API_PARAM_NAME = process.env[GPT_API_KEY_ENV]
const gptModel = process.env.GPT_MODEL

exports.handler = async (event) => {
  const prompt = event.body.prompt

  console.log('Prompt: ', prompt)

  const ssm = new SSM()
  await ssm.putParameter({
    Name: GPT_API_PARAM_NAME,
    Value: apiKey,
    Type: 'SecureString',
  }).promise()

  const { Parameter: {
    Value: apiKey,
  } } = await ssm.getParameter({
    Name: GPT_API_PARAM_NAME,
    WithDecryption: true,
  }).promise()

  console.log('Got API KEY: ', apiKey.replace(/./g, '*'))

  const { data } = await request(
    'https://api.openai.com/v1/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    data: {
      model: gptModel,
      prompt,
    }
  })

  console.log('Got response', { data })

  return {
    statusCode: 200,
    body: {
      text: data.choices?.[0]?.text,
    }
  }
}
