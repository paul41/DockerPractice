var webpack = require("webpack");
var htmlWebpackPlugin = require("html-webpack-plugin");
var copyWebPackPlugin = require("copy-webpack-plugin");
var path = require("path");

module.exports = {
    mode: 'production',
    entry:[
        "./node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js",
        "./src/index.tsx"
    ]
}