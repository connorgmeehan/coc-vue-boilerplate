// webpack config
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

// Plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const { VueLoaderPlugin } = require('vue-loader');
const BannerPlugin = webpack.BannerPlugin;
const CopyPlugin = require('copy-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const getBanner = () => {
  const stdout = require('child_process').execSync('git rev-parse HEAD');
  console.log('Head: ', stdout.toString());

  return `
-----
version: ${stdout.toString()}
-----
`;
}


/**
 * [TODO:description]
 *
 * @param {} [env] - [TODO:description]
 * @return {import('webpack').Configuration} [TODO:description]
 */
module.exports = (env = {}) => ({
  context: path.resolve(__dirname, 'src'),
  mode: env.production ? 'production' : 'development',
  resolve: {
    alias: {
      '@': 'src'
    }
  },
  entry: {
    app: `./main.ts`
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash:6].bundle.js",
    publicPath: process.env.BASE_URL,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'vue-loader',
          },
        ]
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          loader: 'ts',  // Or 'ts' if you don't need tsx
          target: 'es2015'
        }
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'resolve-url-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: !env.production }
          },
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue': '@vue/runtime-dom',
    }
  },
  plugins: [
    new Dotenv({
      path: env.production ? '.env.production' : '.env.development',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: env.production ? 'production' : 'development',
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new VueLoaderPlugin(),
    new BannerPlugin({
      banner: getBanner(),
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, 'public') },
      ],
    }),
    new ESBuildMinifyPlugin({
      target: 'es2015',
    }),
    // Only add bundle analyzer if plugin is true
  ].concat(env.bundle === 1 ? [new BundleAnalyzerPlugin()] : []),
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    hot: true,

    https: {
      key: fs.readFileSync(path.resolve(__dirname, './keys/server.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './keys/server.crt')),
    },
    historyApiFallback: true,
    onListening: (devServer) => {
      const port = devServer.server.address().port;
      const qrCodeTerminal = require('qrcode-terminal');
      const os = require('os');
      const { networkInterfaces } = os;
      const nets = networkInterfaces();
      // Get all ipv4 addresses
      let addresses = [];
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          if (net.family === 'IPv4' && !net.internal) {
            addresses.push(net.address);
          }
        }
      }

      const otherAddresses = addresses.filter(address => address.substring(0, 3) !== '192');
      console.log('Also serving on:');
      otherAddresses.forEach((ip) => console.log(ip));
      addresses = addresses.filter(address => {
        const addressStart = address.substring(0, 3);
        return addressStart === '192' // Local network
          // || addressStart === '169' // Phone hotspot
      });

      // print qr code to terminal
      addresses.forEach(address => {
        console.log()
        console.log(`Serving on local network: https://${address}:${port}`);
        qrCodeTerminal.generate(`https://${address}:${port}`, { small: true }, function (qrcode) {
          console.log(qrcode);
        });
        console.log();
      })
    }
  }
});

