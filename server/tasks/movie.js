const child_process = require('child_process')
const { resolve } = require('path')

// 获取电影列表
;(async () => {
  const script = resolve(__dirname, '../crawler/trailer-list')
  const child = child_process.fork(script, [])
  let invoked = false

  child.on('error', err => {
    if (invoked) return
    invoked = true
    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return

    invoked = true
    let err = code === 0 ? null : new Error(`exit code ${code}`)

    console.log(err)
  })

  child.on('message', ({ result }) => {
    console.log(result)
  })
})()