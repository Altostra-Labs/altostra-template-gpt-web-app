const { request } = require('https')

module.exports = {
  GPT_API_KEY_ENV: 'GPT_API_KEY_PARAM',

  request(url, { data, ...options }) {
    return new Promise((resolve, reject) => {
      const req = request(options, res => {
        const data = []

        res
          .on('error', reject)
          .on('data', chunk => data.push(chunk.toString('utf-8')))
          .on('end', () => {
            const result = {
              response: res,
              data: data.join(''),
            }

            if (
              typeof res.statusCode !== 'number' ||
              res.statusCode >= 400
            ) {
              reject(result)
            }
            else {
              resolve(result)
            }
          })
      })
        .on('error', reject)

      if (data !== undefined) {
        if (typeof data !== 'string') {
          data = JSON.stringify(data)
        }

        req.write(data, 'utf-8')
      }

      req.end()
    })
  }
}