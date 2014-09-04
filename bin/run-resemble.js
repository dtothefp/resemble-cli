#!/usr/bin/env node
var fs = require('fs');
var compareWithGm = require('../lib/');
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
var screensDir = 'screenshots/';
var options = {
  width: 1024,
  url: 'http://optimizely.com/',
  logLevel: 'error',
  pages: [],
  rootPath: /bin/.test( process.cwd() ) ? process.cwd().replace(/bin/g, '') : process.cwd(),
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
  } else if( arg === '--debug' ) {
    options.debug = true;
  } else if ( /logLevel\=/.test(arg) ) {
    options.logLevel = arg.replace(/logLevel\=/, '');
  } else if( /pages\=/.test(arg) ) {
    options.pages = arg.replace(/pages\=/, '').replace(/ /g,'').split(',');
  } else if ( /screensDir\=/.test(arg) ) {
    screensDir += arg.replace(/screensDir\=/, '').split(',');
  } else if ( arg === '--exec' ) {
    runExec = true;
  } else if ( arg === '--gm' ) {
    options.gm = true;
  }

});

if(screensDir.substr(-1) !== '/') {
  screensDir += '/';
}

if(options.url.substr(-1) !== '/') {
  options.url += '/';
}

options.screenshotPath = options.rootPath + screensDir;

if( options.debug ) {
  args = ['--remote-debugger-port=5000', '--remote-debugger-autorun=false', __dirname + '/../phantom/runner.js', JSON.stringify(options)];
} else {
  args = [__dirname + '/../phantom/runner.js', JSON.stringify(options)];
}

if ( runExec ) {
  var optionsString = '';

  for(var key in options) {
    var val = options[key];

    if( Array.isArray(val) ) {
      val = val.join(',');
    }

    optionsString += key + '=' + val + ' ';
  }

  args.splice(args.length - 1, 1);

  var ecpArgs = process.argv.slice(2, process.argv.length);

  var ecp = exec(phantomBinaryPath + ' ' + args.join(' ') + ' ' + optionsString, {cwd: '../phantom/'}, function (error, stdout, stderr){
    console.log(error, stdout, stderr);
  });
} else {
  var cp = spawn(phantomBinaryPath, args, opts);

  cp.on('close', function (code) {
    if ( code === 1 && options.gm ) {
      compareWithGm('gm', options.screenshotBase);
      console.log('Comparing with GraphicsMagick\n');
    } else {
      console.log('Congrats....successful session.');
    }
  });
}
