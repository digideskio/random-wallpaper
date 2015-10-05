'use strict';

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

var BrowserWindow = require('browser-window');
var menubar = require('menubar');

var mb = menubar({
	preloadWindow: true,
	width: 300,
	height: 500,
	resizeable: false
});

mb.on('ready', function ready () {
	var debugWindow = new BrowserWindow({
		width: 300,
		height: 500,
		// type   : 'desktop',
		frame  : true,
		resizable: false
	});
	console.log('app is ready')

	debugWindow.openDevTools()
	debugWindow.loadUrl('file://' + __dirname + '/index.html')

	// wallpaper.set('mountains.jpg', function (err) {
	// 	console.log('done');
	// });
})
