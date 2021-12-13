module.exports = {
  chainWebpack: config => {
    config.plugins.delete('workbox');
  }
};
