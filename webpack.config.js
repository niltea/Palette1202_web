const path = require('path');
const webpack = require('webpack');
const DEBUG = !process.argv.includes('--release');
// postcss plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const cssimport = require('postcss-import');
// const cssnested = require('postcss-nested');
// const customProperties = require('postcss-custom-properties');
// const autoprefixer = require('autoprefixer');
// const csswring = require('csswring');

const MODE = 'production';
const plugins = [
];

if(DEBUG){
	console.log('###########################\n## Debug mode is enabled ##\n###########################');
} else {
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({ compress: { screw_ie8: true, warnings: false } }),
		new webpack.optimize.AggressiveMergingPlugin()
		);
}

module.exports = [
	{
		mode: MODE,
		entry: {
			'js/app': './src/js/app.js',
		},
		output: {
			path: path.join(__dirname, './docs/'),
			filename: '[name].js'
		},
		module: {
			rules: [
				{
					test: /\.js$|\.tag$/,
					exclude: /node_modules/,
					use: 'babel-loader'
				}
			]
		},
		resolve: {
			extensions: ['*', '.js']
		},
		plugins: plugins
	},
	{
		mode: MODE,
		entry: {
			'style': './src/sass/style.scss',
		},
		module: {
			rules: [
				{
					test: /\.scss$/,
					exclude: /node_modules/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
						},
						{
							loader: "css-loader",
							options: {
								url: false,
								sourceMap: false,

								// 0 => no loaders (default);
								// 1 => postcss-loader;
								// 2 => postcss-loader, sass-loader
								importLoaders: 2,
							},
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: false,
							},
						},
					],
				}
			]
		},
		output: {
			path: `${__dirname}/docs/css/`,
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: './[name].css'
			})
		],
	}
];
