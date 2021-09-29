const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		background: './src/background.ts',
		popup: './src/popup.tsx',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['solid', '@babel/preset-typescript'],
					},
				},
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: 'src',
					globOptions: {
						ignore: ['**/*.ts', '**/*.tsx'],
					},
				},
			],
		}),
	],
};
