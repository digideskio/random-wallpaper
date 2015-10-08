'use strict';

var wallpaper = require('wallpaper'),
	request = require('request'),
	cheerio = require('cheerio'),
	url = require('url'),
	fs = require('fs'),
	jQuery = require('jquery'),
	Handlebars = require('handlebars');


console.log('executing main.js...');

var querystring = {
	q: "nature",
	categories: "100",
	purity: "100",
	resolutions: "2560x1600",
	sorting: "random",
	order: "desc"
}

var options = {
	uri: "http://alpha.wallhaven.cc/search?",
	qs: querystring
};


var _wallpapers = [];

request( options, function reqCallback(error, response, body){

	if (error && response.statusCode !== 200){
		console.log('Request error.');
		console.error(error);
	}

	if (body){
		var $ = cheerio.load(body),
		$body = $('body'),
		$results = $body.find('figure.thumb');

		$results.each( function(i, item){
			var $item = $(item),
			$img = $item.find('img'),
			$a 	 = $item.find('a.preview'),
			id 	 = $item.data("wallpaper-id");

			_wallpapers.push({
				id,
				link: $a.attr('href'),
				image: "http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-" + id + ".jpg",
				thumbnail: $img.data('src'),
				urlObj: url.parse($a.attr('href'), true)
			});
		});
	};


	// request 1st image
	// set as wallpaper
	var wp = _wallpapers[0],
		name = 'downloaded/' + wp.id + '.jpg',
		writeStream = fs.createWriteStream(name);

	writeStream.on('close', function(){
		wallpaper.set(name, function (err) {
			console.log('done');
		});
	});


	console.log(name);
	console.log(wp.image);
	// console.log(writeStream);

	var stream = request(wp.image)
		.on('error', function(err) {
			console.log(err)
		})
		.on('response', function(response) {
			// console.log(response.statusCode)
			// console.log(response.headers['content-type'])
		})
	stream.pipe(writeStream);


	var $ = jQuery;
	$(document).ready(function(){
		var _header  	  = $("#header-template").html();
		var _result_item  = $("#result-item-template").html();

		var header 		  = Handlebars.compile(_header);
		var result_items  = Handlebars.compile(_result_item);

		var results_data = { results: _wallpapers };

		$("header").html( header(window.screen) );
		$("#results").html( result_items(results_data) );
	});
});
