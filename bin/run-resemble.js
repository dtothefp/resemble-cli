#!/usr/bin/env node

var spawn = require('child_process').spawn;
var phantomBinaryPath = require('phantomjs').path;
var args;
var opts = {
    cwd: '../phantom/',
    stdio: 'inherit'
}
var debug = false;
var screensDir = 'screenshots';
var options = {
  width: 1024,
  url: 'http://optimizely.com/',
  logLevel: 'error',
  pages: [],
  rootPath: /bin/.test( process.cwd() ) ? process.cwd().replace(/bin/g, '') : process.cwd()
};

process.argv.forEach(function(arg) {

  if( /height\=/.test(arg) ) {
    options.height = +arg.replace(/height\=/, '');
  } else if( /width\=/.test(arg) ) {
    options.width = +arg.replace(/width\=/, '');
  } else if( /url\=/.test(arg) ) {
    options.url = arg.replace(/url\=/, '');
  } else if( arg === '--debug' ) {
    debug = true;
  } else if ( /logLevel\=/.test(arg) ) {
    options.logLevel = arg.replace(/logLevel\=/, '');
  } else if( /pages\=/.test(arg) ) {
    options.pages = arg.replace(/pages\=/, '').split(',');
  } else if ( /screensDir\=/.test(arg) ) {
    screensDir = arg.replace(/screensDir\=/, '').split(',');
  }

});

if(options.rootPath.substr(-1) !== '/') {
  options.rootPath += '/';
}

if(screensDir.substr(-1) !== '/') {
  screensDir += '/';
}

if(options.url.substr(-1) !== '/') {
  options.url += '/';
}

options.screenshotPath = options.rootPath + screensDir;


if( debug ) {
  args = ['--remote-debugger-port=9000', '--remote-debugger-autorun=false', __dirname + '/../phantom/runner.js', JSON.stringify(options)];
} else {
  args = [__dirname + '/../phantom/runner.js', JSON.stringify(options)];
}

var cp = spawn(phantomBinaryPath, args, opts);

cp.on('close', function (code) {
  console.log('child process exited with code ' + code);
});