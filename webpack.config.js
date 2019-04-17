const webpack = require("webpack");
const path = require("path");

/*
 * We've enabled Postcss, autoprefixer and precss for you. This allows your app
 * to lint  CSS, support variables and mixins, transpile future CSS syntax,
 * inline images, and more!
 *
 * To enable SASS or LESS, add the respective loaders to module.rules
 *
 * https://github.com/postcss/postcss
 *
 * https://github.com/postcss/autoprefixer
 *
 * https://github.com/jonathantneal/precss
 *
 */

const autoprefixer = require("autoprefixer");
const precss = require("precss");

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/**
 * All files inside webpack's output.path directory will be removed once, but the
 * directory itself will not be. If using webpack 4+'s default configuration,
 * everything under <PROJECT_DIR>/dist/ will be removed.
 * Use cleanOnceBeforeBuildPatterns to override this behavior.
 *
 * During rebuilds, all webpack assets that are not used anymore
 * will be removed automatically.
 *
 * https://www.npmjs.com/package/clean-webpack-plugin
 *
 */

const CleanWebpackPlugin = require("clean-webpack-plugin");

const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

/**
 * Visualize size of webpack output files with an interactive zoomable treemap.
 *
 * https://www.npmjs.com/package/webpack-bundle-analyzer
 */
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, "src")],
        loader: "babel-loader",

        options: {
          plugins: ["syntax-dynamic-import"],

          presets: [
            [
              "@babel/preset-env",
              {
                modules: false
              }
            ]
          ]
        },

        test: /\.js$/
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { url: false, sourceMap: true } },
          { loader: "sass-loader", options: { sourceMap: true } }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].[chunkhash].css",
      chunkFilename: "[id].[chunkhash].css"
    }),
    new CleanWebpackPlugin(),
    new FaviconsWebpackPlugin({
      // Your source logo
      logo: "./src/my-logo.png",
      // The prefix for all image files (might be a folder or a name)
      prefix: "icons/",
      // Emit all stats of the generated icons
      emitStats: false,
      // The name of the json containing all favicon information
      statsFilename: "iconstats-[hash].json",
      // Generate a cache file with control hashes and
      // don't rebuild the favicons until those hashes change
      persistentCache: true,
      // Inject the html into the html-webpack-plugin
      inject: true,
      // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
      background: "#fff",
      // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
      title: "Webpack App",

      // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),
    new BundleAnalyzerPlugin()
  ],

  entry: {
    app: "./src/index.js"
    //vendor: "./src/vendor"
  },

  output: {
    chunkFilename: "[name].[chunkhash].js",
    filename: "[name].[chunkhash].js"
  },

  mode: "production",
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin({
        parallel: true,
        extractComments: true
      }),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: "index.html",
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          removeComments: true
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },

      chunks: "async",
      minChunks: 1,
      minSize: 30000,
      name: true
    }
  }
};
