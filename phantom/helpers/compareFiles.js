var fs = require('fs');
var asyncCompare = require('./asyncCompare');
var messages = require('./messages');

function copyAndReplaceFile(diff, base){
  if( fs.isFile(base) ){
    fs.remove(base);
  }
  fs.copy(diff, base);
  fs.remove(diff);
  console.log('copy and replace');
}

function asyncCompareCallback(isSame, mismatch){
  var casper = phantom.global.casper;
  var file = phantom.global.diffImg;
  var _failures = phantom.global.failures;
  var baseFile = phantom.global.diffImg.replace(/\.diff/, '');
  var test = {
    filename: baseFile
  };

  if(!isSame){

    test.fail = true;

    casper.waitFor(
      function check() {
        return casper.evaluate(function(){
          return window._imagediff_.hasImage;
        });
      },
      function () {
        var failFile, safeFileName, increment;
        // DPF NOTE: if there is a failures directory specified in the init function
        if(_failures !== undefined){
          if ( !fs.isDirectory(_failures) ) {
            fs.makeDirectory(_failures);
          }

          // flattened structure for failed diffs so that it is easier to preview
          failFile = _failures + fs.separator + file.split(/\/|\\/g).pop().replace('.diff.png', '').replace('.png', '');
          // safeFileName = failFile;
          // increment = 0;

          // while ( fs.isFile(safeFileName+'.fail.png') ){
          //   increment++;
          //   safeFileName = failFile+'.'+increment;
          // }

          failFile += '.fail.png';
          casper.captureSelector(failFile, 'img');

          test.failFile = failFile;
          // remove the old failed file if it exists and copy the new failed file to the failures directory
          copyAndReplaceFile(file, failFile);
          console.log('Failure! Saved to', failFile, file);
        }
      
        casper.evaluate(function(){
          window._imagediff_.hasImage = false;
        });

        if(mismatch){
          test.mismatch = mismatch;
          // copy diff file in place of the base comparison file
          copyAndReplaceFile(file, baseFile);
          messages._onFail(test); // casper.test.fail throws and error, this function call is aborted
          return;  // Just to make it clear what is happening
        } else {
         messages._onTimeout(test);
        }

      }, function(){},
      10000
    );
  } else {
    test.success = true;
    messages._onPass(test);
  }
  return test;
}

module.exports = function() {
  var casper = phantom.global.casper;
  var libraryRoot = phantom.global.libraryRoot;
  var html = libraryRoot + '/' + 'resemblejs/resemblejscontainer.html';

  if( !fs.isFile(html) ) {
    fs.write(
      html,
      '<html><body>This blank HTML page is used for processing the images with Resemble.js</body></html>'
      );
  }

  casper.thenOpen( html , function (){

    asyncCompare(
      phantom.global.diffImg.replace(/\.diff/, ''),
      phantom.global.diffImg,
      asyncCompareCallback
    );

  });

}