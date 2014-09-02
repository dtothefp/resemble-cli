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

  casper.evaluate(function(){
    window._imagediff_.run();
  });

  casper.waitFor(
    function check() {
      return this.evaluate(function(){
        return window._imagediff_.hasResult;
      });
    },
    function () {

      var resembleData = casper.evaluate(function(){
        return window._imagediff_.getResult();
      });

      if(Number(resembleData.misMatchPercentage)){
        func(false, resembleData);
      } else {
        func(true);
      }

    }, function(){
      func(false);
    },
    10000
  );
}