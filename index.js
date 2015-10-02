'use strict';

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

var wallpaper = require('wallpaper');
var menubar = require('menubar')

var mb = menubar({
	width: 600,
	height: 400,
	preloadWindow: true,
})

mb.on('ready', function ready () {
  console.log('app is ready')

  wallpaper.set('mountains.jpg', function (err) {
	console.log('done');
  });

})
