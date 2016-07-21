/* jshint
	node: true,
	devel: true,
	esversion: 6
*/

/* globals
	document: false,
	window: false
*/

'use strict';

const url = require('url');
const fs = require('fs');
const wallpaper = require('wallpaper');
const request = require('request');
const cheerio = require('cheerio');
const jQuery = require('jquery');
const Handlebars = require('handlebars');

console.log('executing main.js...');

const querystring = {
	q: 'nature',
	categories: '100',
	purity: '100',
	resolutions: '2560x1600',
	sorting: 'random',
	order: 'desc'
};

const options = {
	uri: 'http://alpha.wallhaven.cc/search?',
	qs: querystring
};

const _wallpapers = [];

request(options, (error, response, body) => {
	if (error && response.statusCode !== 200) {
		console.log('Request error.');
		console.error(error);
	}

	let $;

	if (body) {
		$ = cheerio.load(body);
		const $body = $('body');
		const $results = $body.find('figure.thumb');

		$results.each((i, item) => {
			const $item = $(item);
			const $img = $item.find('img');
			const $a = $item.find('a.preview');
			const id = $item.data('wallpaper-id');

			_wallpapers.push({
				id,
				link: $a.attr('href'),
				image: 'http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-' + id + '.jpg',
				thumbnail: $img.data('src'),
				urlObj: url.parse($a.attr('href'), true)
			});
		});
	}

	// request 1st image
	// set as wallpaper
	const wp = _wallpapers[0];
	const name = 'downloaded/' + wp.id + '.jpg';
	const writeStream = fs.createWriteStream(name);

	writeStream.on('close', () => {
		wallpaper.set(name, () => {
			console.log('done');
		});
	});

	console.log(name);
	console.log(wp.image);
	// console.log(writeStream);

	const stream = request(wp.image)
		.on('error', err => {
			console.log(err);
		})
		.on('response', response => {
			console.log(response.statusCode);
			// console.log(response.headers['content-type'])
		});
	stream.pipe(writeStream);

	$ = jQuery;
	$(document).ready(() => {
		const _header = $('#header-template').html();
		const _resultItem = $('#result-item-template').html();

		const header 		  = Handlebars.compile(_header);
		const resultItems = Handlebars.compile(_resultItem);

		const resultsData = {results: _wallpapers};

		$('header').html(header(window.screen));
		$('#results').html(resultItems(resultsData));
	});
});
