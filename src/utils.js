const { table } = require('table')

const qs = url => {
  if (!url.includes('?')) return {}
  const query = url.replace(/^.*\?([^?]+)$/, '$1')
  const parts = query.split('&')
  return parts.reduce((data, string) => {
    const [key, value = true] = string.split('=')
    data[key] = value
    return data
  }, {})
}

const print = object => `<pre>${table(Object.entries(object))}</pre>`

module.exports = { qs, print }
