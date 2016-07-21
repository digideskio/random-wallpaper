/* jshint
	node: true,
	devel: true,
	esversion: 6
*/

'use strict';

const {BrowserWindow} = require('electron');
// const Config = require('electron-config');
// const config = new Config();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

require('electron-debug')({showDevTools: true});

const menubar = require('menubar');

const mb = menubar({
	preloadWindow: true,
	width: 300,
	height: 500,
	resizeable: false
});

mb.on('ready', () => {
	const debugWindow = new BrowserWindow({
		width: 300,
		height: 500,
		// type   : 'desktop',
		frame: true,
		resizable: false
	});
	console.log('app is ready');

	debugWindow.openDevTools();
	debugWindow.loadUrl(`file://${__dirname}/index.html`);

	// wallpaper.set('mountains.jpg', function (err) {
	// 	console.log('done');
	// });
});
