/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = {
	mode: 'production',
	entry: {
		background: './src/background.ts',
		popup: './src/popup.ts',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
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
		new CopyPlugin({
			patterns: [
				{
					from: 'src',
					globOptions: {
						ignore: ['**/*.ts'],
					},
				},
			],
		}),
	],
};
