const puppeteer = require('puppeteer')

const detail_url = 'https://movie.douban.com/subject/'
const id = '27090813'
const video_url = 'https://movie.douban.com/trailer/226770/'

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

;(async () => {
  console.log('Start visit the target page')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'], // 非沙箱模式
    dumpio: false
  })
  const page = await browser.newPage()
  await page.goto(`${detail_url}${id}`, {
    waitUntil: 'networkidle2'  // 网络空闲
  })
  await sleep(1000)

  // 获取电影详情页的预告片地址和封面(可能没有)
  const result = await page.evaluate(() => {
    const $ = window.$
    const trailer_container = $('.related-pic-video')

    if (trailer_container && trailer_container.length > 0) {
      const link = trailer_container.attr('href')
      const cover = trailer_container.find('img').attr('src')
      return { link, cover }
    }

    return {}
  })

  // 去到预告片视频页面获取视频资源
  let video
  
  if (result.link) {
    await page.goto(result.link, {
      waitUntil: 'networkidle2'  // 网络空闲
    })
    await sleep(1000)

    video = await page.evaluate(() => {
      const $ = window.$
      const video_ele = $('source')

      if (video_ele && video_ele.length > 0) {
        return video_ele.attr('src')
      }

      return ''
    })
  }

  const data = {
    video,
    id,
    cover: result.cover
  }

  browser.close()

  process.send(data)
  process.exit(0)
})()