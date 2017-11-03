var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  apiRoot: '"//devapi.fccn.cc/Api/v1.1"',
  apiMall: '"//marketapidev.fccn.cc/api/market"',
  apiCham: '"//marketapidev.fccn.cc/api/commerceChamber"',
  corpsiteBaseUrl: '"//corpsitedev.fccn.cc"',
  qiniuBucketHost: '"//filesdev.fccn.cc"',
  nimAppkey: '"9c4d8d4b4466d7c2397bf1741e59e013"',
});
