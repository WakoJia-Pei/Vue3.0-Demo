/**
 * @author peiwj pwjiang@163.com
 * @description vue.config.js全局配置
 */
const path = require('path')
const {
  /* baseURL, */
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  title,
  abbreviation,
  devPort,
  providePlugin,
  build7z,
  donation,
} = require('./src/config')
const { webpackBarName, webpackBanner, donationConsole } = require('./console.output')

if (donation) donationConsole()
const { version, author } = require('./package.json')
const Webpack = require('webpack')
const WebpackBar = require('webpackbar')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const dayjs = require('dayjs')
const date = dayjs().format('YYYY_M_D')
const time = dayjs().format('YYYY-M-D HH:mm:ss')
process.env.VUE_APP_TITLE = title || 'vue3-admin-beautiful'
process.env.VUE_APP_AUTHOR = author || 'peiwj'
process.env.VUE_APP_UPDATE_TIME = time
process.env.VUE_APP_VERSION = version

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

// const mockServer = () => {
//   if (process.env.NODE_ENV === 'development') {
//     return require('./mock/mockServer.js')
//   } else {
//     return ''
//   }
// }

module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    hot: true,
    port: devPort,
    open: true,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true,
    },
    // 注释掉的地方是前端配置代理访问后端的示例
    proxy: {
      '/api': {
        target: `http://localhost:3000`,
        ws: false,
        changeOrigin: true,
        // pathRewrite: {
        //   ["^/" + baseURL]: "",
        // },
      },
    },
    // after: mockServer(),
  },
  configureWebpack() {
    return {
      resolve: {
        alias: {
          '@': resolve('src'),
          '*': resolve(''),
        },
      },
      plugins: [
        new Webpack.ProvidePlugin(providePlugin),
        new WebpackBar({
          name: webpackBarName,
        }),
      ],
    }
  },
  chainWebpack(config) {
    config.resolve.symlinks(true)
    config.module.rule('svg').exclude.add(resolve('src/icon/remixIcon')).end()

    config.module
        .rule('remixIcon')
        .test(/\.svg$/)
        .include.add(resolve('src/icon/remixIcon'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({ symbolId: 'remix-icon-[name]' })
        .end()

    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.devtool('source-map')
    })

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.performance.set('hints', false)
      config.devtool('none')
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'vue-admin-beautiful-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial',
          },
        },
      })
      config
          .plugin('banner')
          .use(Webpack.BannerPlugin, [`${webpackBanner}${time}`])
          .end()
      // config.module
      //     .rule('images')
      //     .use('image-webpack-loader')
      //     .loader('image-webpack-loader')
      //     .options({
      //       bypassOnDebug: true,
      //     })
      //     .end()
    })

    if (build7z) {
      config.when(process.env.NODE_ENV === 'production', (config) => {
        config
            .plugin('fileManager')
            .use(FileManagerPlugin, [
              {
                onEnd: {
                  delete: [`./${outputDir}/video`, `./${outputDir}/data`],
                  archive: [
                    {
                      source: `./${outputDir}`,
                      destination: `./${outputDir}/${abbreviation}_${outputDir}_${date}.7z`,
                    },
                  ],
                },
              },
            ])
            .end()
      })
    }
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  pluginOptions: { // 第三方插件配置
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/styles/variables.less')] // less所在文件路径
    }
  }
}
