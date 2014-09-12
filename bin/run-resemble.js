#!/usr/bin/env node
var fs = require('fs');
var compareWith = require('../lib/');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var phantomBinaryPath = require('phantomjs').path;
var args;
var opts = {
    cwd: __dirname + '/../phantom/',
    stdio: 'inherit'
}
var debug = false;
var runExec = false;
var screensDir = '';
var options = {
  width: 1024,
  url: 'http://optimizely.com/',
  logLevel: 'error',
  pages: [],
  screenshotRoot: 'screenshots/',
  rootPath: /bin/.test( process.cwd() ) ? process.cwd().replace(/bin/g, '') : process.cwd(),
  tolerance: 0,
  selector: 'body',
  debug: false,
  gm: false
};

if(options.rootPath.substr(-1) !== '/') {
  options.rootPath += '/';
}

options.screenshotBase = options.rootPath + screensDir;

process.argv.forEach(function(arg) {

  if( /height\=/.test(arg) ) {
    options.height = +arg.replace(/height\=/, '');
  } else if( /width\=/.test(arg) ) {
    options.width = +arg.replace(/width\=/, '');
  } else if( /url\=/.test(arg) ) {
    options.url = arg.replace(/url\=/, '');
  } else if ( /logLevel\=/.test(arg) ) {
    options.logLevel = arg.replace(/logLevel\=/, '');
  } else if( /pages\=/.test(arg) ) {
    options.pages = arg.replace(/pages\=/, '').replace(/ /g,'').split(',');
  } else if ( /screensDir\=/.test(arg) ) {
    screensDir = arg.replace(/screensDir\=/, '');
  } else if ( /tolerance\=/.test(arg) ) {
    options.tolerance = arg.replace(/tolerance\=/, '');
  } else if( /selector\=/.test(arg) ) {
    options.selector = arg.replace(/selector\=/, '');
  } else if ( /screenshotRoot\=/.test(arg) ) {
    options.screenshotRoot = arg.replace(/screenshotRoot=/, ''); 
  } else if ( arg === '--gm' ) {
    options.gm = true;
  } else if( arg === '--debug' ) {
    options.debug = true;
  }

});

if(options.rootPath.substr(-1) !== '/') {
  options.rootPath += '/';
}

if(options.screenshotRoot.substr(-1) !== '/') {
  options.screenshotRoot += '/';
}

if(screensDir.substr(-1) !== '/' && !!screensDir) {
  screensDir += '/';
}

if(options.url.substr(-1) !== '/') {
  options.url += '/';
}

options.screenshotPath = options.rootPath + options.screenshotRoot + screensDir;

if( options.debug ) {
  args = ['--remote-debugger-port=5000', '--remote-debugger-autorun=false', __dirname + '/../phantom/runner.js', JSON.stringify(options)];
} else {
  args = [__dirname + '/../phantom/runner.js', JSON.stringify(options)];
}

var cp = spawn(phantomBinaryPath, args, opts);

cp.on('close', function (code) {
  if ( code === 1 && options.gm ) {
    compareWith('gm', options.screenshotPath, options.tolerance);
    console.log('Comparing with GraphicsMagick\n');
  } else {
    console.log('Congrats....successful session.');
  }
});
