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

module.exports = { qs }
