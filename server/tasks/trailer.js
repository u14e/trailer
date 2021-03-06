const child_process = require('child_process')
const { resolve } = require('path')

// 获取预告片的视频和封面
;(async () => {
  const script = resolve(__dirname, '../crawler/video')
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

  child.on('message', data => {
    console.log(data)
  })
})()