var fs = require('fs');
var helpers = require('./helpers');

if(phantom.args.length > 1) {
  var options = {};
  phantom.args.forEach(function(arg) {

    if( /height\=/.test(arg) ) {
      options.height = +arg.replace(/height\=/, '');
    } else if( /width\=/.test(arg) ) {
      options.width = +arg.replace(/width\=/, '');
    } else if( /url\=/.test(arg) ) {
      options.url = arg.replace(/url\=/, '');
    } else if ( /logLevel\=/.test(arg) ) {
      options.logLevel = arg.replace(/logLevel\=/, '');
    } else if( /pages\=/.test(arg) ) {
      options.pages = arg.replace(/pages\=/, '').split(',');
    } else if ( /screenshotPath\=/.test(arg) ) {
      options.screenshotPath = arg.replace(/screenshotPath\=/, '');
    } else if ( /rootPath\=/.test(arg) ) {
      options.rootPath = arg.replace(/rootPath\=/, '');
    }

  });
} else {
  var options = JSON.parse(phantom.args[0]);
}

options.pages.unshift('');

phantom.casperPath = fs.workingDirectory + '/../node_modules/casperjs';

phantom.casperTest = true;

phantom.injectJs(fs.workingDirectory + '/../node_modules/casperjs/bin/bootstrap.js');

var casper = require('casper').create({
  logLevel: options.logLevel,
  verbose: true
});

phantom.global = {
  casper: casper,
  libraryRoot: options.rootPath + 'node_modules'
};

// casper.on('remote.message', function(msg) {
//     this.echo('remote message caught: ' + msg);
// });

casper.start(options.url);

casper.each(options.pages, function(casper, page) {
  this.thenOpen(options.url + page, function() {
    this.echo('Current location is ' + options.url + page, 'INFO');
    this.wait(500);
  });
  this.then(function() {
    var documentHeight = this.evaluate(function() {
      var body = document.body, html = document.documentElement;

      return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
    });

    if(page === '') {
      page = 'home';
    } else if( /\//.test(page) ) {
      page = page.replace(/\//g, '_');
    }

    var diffData = helpers.fileNameGetter(options.screenshotPath, page);

    this.capture(diffData.imgName, {
      top: 0,
      left: 0,
      width: options.width,
      height: options.height ? options.height : documentHeight
    });

    if( diffData.createDiff ) {
      phantom.global.diffImg = diffData.imgName;
      helpers.compareFiles();
    }

  }); 
});

casper.run(function() {
  phantom.exit();
});