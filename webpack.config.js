const webpack = require("webpack");
const path = require("path");
const glob = require("glob");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const environment = process.env.NODE_ENV || "development";
const isDevelopment = environment === "development";

const generateHTMLPlugins = () =>
  glob.sync("./src/**/*.html").map(
    dir =>
      new HTMLWebpackPlugin({
        filename: path.basename(dir), // Output
        template: dir // Input
      })
  );

module.exports = {
  mode: environment,

  entry: ["./src/js/app.js", "./src/style/main.scss"],

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.bundle.js"
  },

  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({})
      // it minifies css and optimize it with cssnano:
      // https://cssnano.co/guides/optimisations
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader"
      },
      {
        test: /\.html$/,
        loader: "raw-loader"
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(pdf|gif|png|jpe?g|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "static/"
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "./src/static",
        to: "./static"
      }
    ]),

    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("styles.css"),
    ...generateHTMLPlugins()
  ],
  stats: {
    colors: true
  },
  devServer: {
    contentBase: "src",
    watchContentBase: true,
    hot: true,
    open: true,
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost"
  }
};
