function asyncCompare(one, two, func){

  if(!casper.evaluate(function(){ return window._imagediff_;})){
    initClient();
  }

  casper.fill('form#image-diff', {
    'one': one,
    'two': two
  });

  casper.evaluate(function(filename){
    window._imagediff_.run( filename );
  }, {
    label: _addLabelToFailedImage ? one : false
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