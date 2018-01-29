// http://api.douban.com/v2/movie/subject/1764796

const request = require('request-promise-native')

async function fetchMovie (item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.id}`
  const res = await request(url)
  return res
}

;(async () => {
  let movies = [
    { id: 26759495,
      title: '命运/新章 最终回响',
      rate: 8.5,
      poster_url: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2327323231.jpg' },
    { id: 27180210,
      title: '圆桌派 第三季',
      rate: 8.9,
      poster_url: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2511866530.jpg' },
  ]

  movies.map(async movie => {
    let movieData = await fetchMovie(movie)

    try {
      movieData = JSON.parse(movieData)
      console.log(movieData)        
    } catch (error) {
      console.log(error)
    }
  })
})()