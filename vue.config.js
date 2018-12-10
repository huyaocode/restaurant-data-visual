const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: true,
  chainWebpack: (config)=>{
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('styles',resolve('src/assets/styles'))
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/mock'
        }
      },
      '/ciyun':{
        target: 'http://localhost:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/ciyun': '/worldCloud'
        }
      }
    }
  }
}
