"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_SERVER: '"http://127.0.0.1:8080"',
  FILE_SERVER: '"http://127.0.0.1:86"'
});
