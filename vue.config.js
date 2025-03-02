module.exports = {
  publicPath: './', // 使用相对路径
  outputDir: 'dist', // 构建输出目录
  assetsDir: 'static', // 静态资源目录
  indexPath: 'index.html', // 生成的 index.html 文件
  productionSourceMap: false, // 关闭 source map，加快打包速度
  chainWebpack: config => {
      config.optimization.minimizer('terser').tap(args => {
          args[0].terserOptions.compress.drop_console = true;
          args[0].terserOptions.compress.drop_debugger = true;
          return args;
      });
  }
};
