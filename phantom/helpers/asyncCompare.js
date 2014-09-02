var initResemble = require('./initResemble');

module.exports = function asyncCompare(baseImg, diffImg, func){
  var casper = phantom.global.casper;

  if(
    !casper.evaluate(function(){ 
      return window._imagediff_;
    })
  ) {
    initResemble();
  }

  casper.fill('form#image-diff', {
    'one': baseImg,
    'two': diffImg
  });

  casper.evaluate(function(filename){
    window._imagediff_.run( filename );
  }, {
    label: 'failed_' + baseImg
  });

  casper.waitFor(
    function check() {
      return this.evaluate(function(){
        return window._imagediff_.hasResult;
      });
    },
    function () {

      var mismatch = casper.evaluate(function(){
        return window._imagediff_.getResult();
      });

      if(Number(mismatch)){
        func(false, mismatch);
      } else {
        func(true);
      }

    }, function(){
      func(false);
    },
    10000
  );
}