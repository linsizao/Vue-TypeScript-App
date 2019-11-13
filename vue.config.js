const path = require("path");

const name = "app"; // 页面标题
const port = 9527; // 开发端口

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: "http://192.168.1.1:80",
        changeOrigin: true,
        ws: false, // 关闭websocket代理
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: process.env.VUE_APP_BASE_API
        }
      }
    }
    // after: require('./mock/mock-server.js') // 打开后本地会默认开启mock-server服务
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  },

  chainWebpack: (config) => {
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    // config.module
    //   .rule("eslint")
    //   .use("eslint-loader")
    //   .loader("eslint-loader")
    //   .tap((options) => {
    //     options.fix = true;
    //     return options;
    //   });
  }
};
