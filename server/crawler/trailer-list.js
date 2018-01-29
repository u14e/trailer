const puppeteer = require('puppeteer')

const url = `https://movie.douban.com/tag/#/?sort=R&range=6,10&tags=`

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

;(async () => {
  console.log('Start visit the target page')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'], // 非沙箱模式
    dumpio: false
  })
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle2'  // 网络空闲
  })
  await sleep(3000)

  await page.waitForSelector('.more')

  for (let i = 0; i < 1; i++) {
    await sleep(3000)
    await page.click('.more')
  }

  const result = await page.evaluate(() => {
    var $ = window.$
    var items = $('.list-wp > a.item')
    var links = []

    items.each((index, item) => {
      let $item = $(item)
      let id = $item.find('.cover-wp').data('id')
      let title = $item.find('.title').text()
      let rate = +$item.find('.rate').text()
      let poster_url = $item.find('.pic > img').attr('src')
      poster_url = poster_url.replace('s_ratio', 'l_ratio') // 换成大图

      links.push({ id, title, rate, poster_url })
    })

    return links
  })

  browser.close()

  process.send({ result })
  process.exit(0)
})()