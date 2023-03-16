const { defineConfig } = require('@vue/cli-service');
const UnoCSS = require('unocss/webpack').default;
const { presetUno, presetAttributify } = require('unocss');
const path = require('path');
module.exports = defineConfig({
  publicPath: '/',
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        appId: "com.electron.yinxiao",
        productName: "音效分类",
        win: {
          icon: "public/icon.ico",
          artifactName: "音效分类-${version}.${ext}",
          executableName: '音效分类',
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          deleteAppDataOnUninstall: true,
          warningsAsErrors: false,
          runAfterFinish: false,
        }
      },
    },
  },
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': `${path.resolve(__dirname, 'src')}`,
      },
    },
    plugins: [
      UnoCSS({
        presets: [presetUno(), presetAttributify()],
        rules: [
          // custom-margin
          [/^ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${d}px` })],
          [/^mr-(\d+)$/, ([, d]) => ({ 'margin-right': `${d}px` })],
          [/^mt-(\d+)$/, ([, d]) => ({ 'margin-top': `${d}px` })],
          [/^mb-(\d+)$/, ([, d]) => ({ 'margin-bottom': `${d}px` })],
          [/^m-(\d+)$/, match => ({ margin: `${match[1]}px` })],
          // custom-padding
          [/^pb-(\d+)$/, ([, d]) => ({ 'padding-bottom': `${d}px` })],
          [/^pt-(\d+)$/, ([, d]) => ({ 'padding-top': `${d}px` })],
          [/^pl-(\d+)$/, ([, d]) => ({ 'padding-left': `${d}px` })],
          [/^pr-(\d+)$/, ([, d]) => ({ 'padding-right': `${d}px` })],
          [/^p-(\d+)$/, match => ({ padding: `${match[1]}px` })],
        ],
        shortcuts: {
          'init-btn': 'border-none cursor-pointer outline-none',
          'space-between': 'flex justify-between items-center',
          'flex-start': 'flex justify-start items-center',
        },
      }),
    ],
  },
});
