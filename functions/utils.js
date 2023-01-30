const { request } = require('https')

module.exports = {
  GPT_API_KEY_ENV: 'GPT_API_KEY_PARAM',

  request(url, { body, ...options }) {
    return new Promise((resolve, reject) => {
      const req = request(url, options, res => {
        const responseBody = []

        res
          .on('error', reject)
          .on('data', chunk => responseBody.push(chunk.toString('utf-8')))
          .on('end', () => {
            const result = {
              response: res,
              body: responseBody.join(''),
            }

            if (
              typeof res.statusCode !== 'number' ||
              res.statusCode >= 400
            ) {
              const error = new Error(`${res.statusMessage ?? 'Request failed'}
${result.body}`)

              reject(Object.assign(error, result))
            }
            else {
              resolve(result)
            }
          })
      })
        .on('error', reject)

      if (body !== undefined) {
        if (typeof body !== 'string') {
          body = JSON.stringify(body)
        }

        req.write(body, 'utf-8')
      }

      req.end()
    })
  }
}