/* ------ Base config ------ */

const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const PATHS = {
	src: path.join(__dirname, '../src'),
	dist: path.join(__dirname, '../build'),
	assets: 'assets/',
}

const PAGES = fs
	.readdirSync(`${PATHS.src}`)
	.filter(fileName => fileName.endsWith('.html'))

const _plugins = () => {
	const config = [
		new MiniCssExtractPlugin({
			filename: `${PATHS.assets}css/[name].[contenthash].css`,
		}),
		new CopyWebpackPlugin([
			{ from: `${PATHS.src}/assets/img`, to: `${PATHS.assets}img` },
			{ from: `${PATHS.src}/assets/fonts`, to: `${PATHS.assets}fonts` },
			{ from: `${PATHS.src}/assets/svg`, to: `${PATHS.assets}svg` },
			{ from: `${PATHS.src}/assets/videos`, to: `${PATHS.assets}videos` },
			// { from: `${PATHS.src}/static`, to: "" }
		]),
		new CleanWebpackPlugin(),
		...PAGES.map(
			page =>
				new HtmlWebpackPlugin({
					template: `${PATHS.src}/${page}`,
					filename: `./${page}`,
					minify: {
						removeComments: true,
						collapseWhitespace: true,
						removeRedundantAttributes: true,
						useShortDoctype: true,
						removeEmptyAttributes: true,
						removeStyleLinkTypeAttributes: true,
						keepClosingSlash: true,
						minifyJS: true,
						minifyCSS: true,
						minifyURLs: true,
					},
				})
		),
	]
	if (isProd) {
		config.push(new BundleAnalyzerPlugin())
	}
	return config
}

const _optimization = () => {
	const config = {
		splitChunks: {
			cacheGroups: {
				vendor: {
					name: 'vendors',
					test: /node_modules/,
					chunks: 'all',
					enforce: true,
				},
			},
		},
	}
	if (isProd == true) {
		config.minimizer = [new OptimizeCssAssetsPlugin(), new TerserPlugin()]
	}
	return config
}

const _babelOptions = preset => {
	const options = {
		presets: ['@babel/preset-env'],
		plugins: ['@babel/plugin-syntax-class-properties'],
	}
	if (preset) {
		options.presets.push(preset)
	}
	return options
}

const _cssLoaders = extra => {
	const loader = [
		{
			loader: 'style-loader', // creates style nodes from JS strings
		},
		{
			loader: MiniCssExtractPlugin.loader,
		},
		{
			loader: 'css-loader', // translates CSS into CommonJS
			options: { url: false, sourceMap: true },
		},
		{
			loader: 'postcss-loader',
			options: {
				config: { path: './postcss.config.js' },
			},
		},
	]
	if (extra) {
		loader.push(extra)
	}
	return loader
}

module.exports = {
	externals: {
		paths: PATHS,
	},
	entry: {
		app: ['@babel/polyfill', `${PATHS.src}/index.js`], // index.ts
	},
	output: {
		filename: `${PATHS.assets}[name].[contenthash].js`,
		path: PATHS.dist,
		publicPath: '/',
	},
	optimization: _optimization(),
	module: {
		rules: [
			// JavaScript
			{
				test: /\.js$/,
				exclude: '/node_modules/',
				loader: {
					loader: 'babel-loader',
					options: _babelOptions(),
				},
			},
			// TypeScript
			{
				test: /\.ts(x)?$/,
				use: [
					{
						loader: 'babel-loader',
						options: _babelOptions('@babel/preset-typescript'),
					},
					{ loader: 'awesome-typescript-loader' },
				],
				exclude: /node_modules/,
			},
			// Fonts
			{
				test: /\.(svg|eot|ttf|woff|woff2)$/,
				loader: 'file-loader',
				options: {
					name: `[name].[ext]`,
				},
			},
			// images / icons
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
				},
			},
			// scss/sass
			{
				test: /\.(scss)$/,
				use: _cssLoaders({
					loader: 'sass-loader',
					options: { sourceMap: true },
				}),
			},
			// stylus
			{
				test: /\.styl$/,
				use: _cssLoaders({ loader: 'stylus-loader' }),
			},
			// css
			{
				test: /\.css$/,
				use: _cssLoaders(),
			},

		],
	},
	resolve: {
		alias: {
			'@': PATHS.src,
		},
		extensions: ['.js', '.ts'],
	},
	plugins: _plugins(),
}
