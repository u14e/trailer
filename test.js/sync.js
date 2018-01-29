const doSync = (sth, time) => new Promise(resolve => {
  setTimeout(() => {
    console.log(`${sth} 用了 ${time} 毫秒`)
    resolve()
  }, time)
})

const doAsync = (sth, time, cb) => {
  setTimeout(() => {
    console.log(`${sth} 用了 ${time} 毫秒`)
    cb && cb()
  }, time)
}

const doElse = sth => {
  console.log(sth)
}

const male = { doSync, doAsync }
const female = { doSync, doAsync, doElse }

;(async () => {
  console.log('===case 1: 同步阻塞===')
  await male.doSync('male 刷牙', 1000)
  console.log('啥也没干一直等')
  await female.doSync('female 洗澡', 2000)
  female.doElse('female 去忙别的了')
  
  console.log('===case 3: 异步非阻塞===')
  console.log('female来到门口按下通知开关(注册回调函数)')
  male.doAsync('male 刷牙', 1000, () => {
    console.log('卫生间通知female来洗澡')
    female.doAsync('female洗澡', 2000)
  })
  female.doElse('female 去忙别的了')
})()