var fs = require('fs');
var helpers = require('./helpers');
var options = JSON.parse(phantom.args[0]);

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

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

casper.test.begin('Comparing Screenshots for: ' + options.url, options.pages.length, function(test) {
  casper.start(options.url);

  phantom.global.test = test;

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

      test.pass('Screenshots compared successfully');

    });
  });

  casper.run(function() {
    test.done();
    phantom.exit();
  });
});