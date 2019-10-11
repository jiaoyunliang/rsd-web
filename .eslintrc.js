module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  plugins: ["vue", "prettier"],
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        jsxBracketSameLine: true
      }
    ],
    "linebreak-style": ["error", "unix"],
    semi: [0, "always"],
    "no-console": "off",
    "no-unused-vars": [
      0,
      {
        // 允许声明未使用变量
        vars: "local"
        // 参数不检查
        //"args": "none"
      }
    ],
    //关闭禁止混用tab和空格
    "no-mixed-spaces-and-tabs": [0],
    "no-useless-constructor": 0
  }
};
