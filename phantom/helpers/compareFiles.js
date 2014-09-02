var fs = require('fs');
var asyncCompare = require('./asyncCompare');
var messages = require('./messages');

function copyAndReplaceFile(diff, base){
  if( fs.isFile(base) ){
    fs.remove(base);
  }
  fs.copy(diff, base);
}

function asyncCompareCallback(isSame, resembleData){
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
        casper.evaluate(function(){
          window._imagediff_.hasImage = false;
        });

        if(resembleData && resembleData.misMatchPercentage){
          test.mismatch = resembleData.misMatchPercentage;
          messages._onFail(test); // casper.test.fail throws and error, this function call is aborted
        } else {
         messages._onTimeout(test);
        }

        // copy diff file in place of the base comparison file, overwrite no matter what
        copyAndReplaceFile(file, baseFile);

        //cleanup
        fs.remove(file);

      }, function(){},
      10000
    );
  } else {
    fs.remove(file);
    test.success = true;
    messages._onPass(test);
  }
  return resembleData;
}

module.exports = function() {
  var casper = phantom.global.casper;
  var html = fs.workingDirectory + '/config/resemble.html';

  if( !fs.isFile(html) ) {
    console.log('Comparison HTML file does not exist ' + html);
  }

  casper.thenOpen( html , function (){

    asyncCompare(
      phantom.global.diffImg.replace(/\.diff/, ''),
      phantom.global.diffImg,
      asyncCompareCallback
    );

  });

}