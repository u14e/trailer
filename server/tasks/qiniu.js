const qiniu = require('qiniu')
const nanoid = require('nanoid')  // 生成随机id
const config = require('../config')

// 首先要构建BucketManager对象
var mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
var qiniu_config = new qiniu.conf.Config()
//config.useHttpsDomain = true
qiniu_config.zone = qiniu.zone.Zone_z0  // 华东地区
var bucketManager = new qiniu.rs.BucketManager(mac, qiniu_config)

// 然后抓取网络资源到空间
// 参见：抓取网络资源到空间 https://developer.qiniu.com/kodo/sdk/1289/nodejs#rs-fetch
const uploadToQiniu = async (resUrl, key) => {
  return new Promise((resolve, reject) => {
    bucketManager.fetch(resUrl, config.qiniu.bucket, key, (err, respBody, respInfo) => {
      if (err) {
        reject(err)
      } else {
        if (respInfo.statusCode == 200) {
          resolve({ key })
        } else {
          reject(respInfo)
        }
      }
    })
  })
}

  ; (async () => {
    let movies = [{
      id: '27090813',
      video: 'http://vt1.doubanio.com/201801291546/6cbfb8e67e54539fde653880bbefb625/view/movie/M/302240705.mp4',
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2508472121.jpg',
      cover: 'https://img3.doubanio.com/img/trailer/medium/2506861035.jpg?'
    }]

    movies.map(async movie => {
      if (movie.video && !movie.key) {
        try {
          let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
          let coverData = await uploadToQiniu(movie.cover, nanoid() + '.jpg')
          let posterData = await uploadToQiniu(movie.poster, nanoid() + '.jpg')

          if (videoData.key) {
            movie.videoKey = config.qiniu.admin + '/' + videoData.key
          }
          if (coverData.key) {
            movie.coverKey = config.qiniu.admin + '/' + coverData.key
          }
          if (posterData.key) {
            movie.posterKey = config.qiniu.admin + '/' + posterData.key
          }

          console.log(movie)
          const data = {
            id: '27090813',
            video: 'http://vt1.doubanio.com/201801291546/6cbfb8e67e54539fde653880bbefb625/view/movie/M/302240705.mp4',
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2508472121.jpg',
            cover: 'https://img3.doubanio.com/img/trailer/medium/2506861035.jpg?',
            videoKey: 'http://p3b4349ux.bkt.clouddn.com/xFssqZ5xGC_BLCF3dH75U.mp4',
            coverKey: 'http://p3b4349ux.bkt.clouddn.com/skVoV63lgjI2Lq3MWrh1_.jpg',
            posterKey: 'http://p3b4349ux.bkt.clouddn.com/MBnPV091AxjdIgoO3ND8X.jpg'
          }
        } catch (error) {
          console.log(error)
        }
      }
    })
  })()