const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "../public/app/"),
  chainWebpack: config => {
    config.module
      .rule("eslint")
      .use("eslint-loader")
      .options({ fix: true });
  }
};
