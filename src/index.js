const http = require('http')
const { qs } = require('./utils')
const xray = {
  fork: require('@leonardodino/x-ray')(),
  original: require('x-ray')(),
}

const url = 'https://blog.ycombinator.com/page/3/'
const next = '.nav-next a@href'

const crawl = ({ fork }) => {
  const job = xray[fork ? 'fork' : 'original'](url, [next]).paginate(next)
  const wrapper = {
    // eslint-disable-next-line no-sequences
    limit: n => (job.limit(n), wrapper),
    // job.then is not spec-compliant!
    then: (res, err) => {
      let p = job.then(res)
      if (err) p = p.catch(err)
      return p
    },
  }
  return wrapper
}

const render = async ({ fork, limit }) => {
  try {
    const result = await crawl({ fork }).limit(+limit)
    return `<ul>${result.map(link => `<li>${link}</li>`).join('')}</ul>`
  } catch (e) {
    return `<pre>${(e && e.stack) || e}</pre>`
  }
}

const server = http.createServer(async (req, res) => {
  const query = qs(req.url)
  const options = { fork: !!query.fork, limit: +(query.limit || Infinity) }
  const html = await render(options)
  const status = html.startsWith('<pre>') ? 500 : 200
  console.log(`[${status}]:`, options)
  res.writeHeader(status, { 'Content-Type': 'text/html; charset=utf-8' })
  res.write(html)
  res.end()
})

server.listen(8080)
