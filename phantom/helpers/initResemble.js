module.exports = function (){
  var casper = phantom.global.casper;
  var libraryRoot = phantom.global.libraryRoot;
  var _mismatchTolerance = phantom.global.tolerance;

  casper.page.injectJs(libraryRoot + '/' + 'resemblejs/resemble.js');

  casper.evaluate(function(mismatchTolerance){
    var result;

    var div = document.createElement('div');

    // this is a bit of hack, need to get images into browser for analysis
    div.style = "display:block;position:absolute;border:0;top:-1px;left:-1px;height:1px;width:1px;overflow:hidden;";
    div.innerHTML = '<form id="image-diff">'+
      '<input type="file" id="image-diff-one" name="one"/>'+
      '<input type="file" id="image-diff-two" name="two"/>'+
    '</form><div id="image-diff"></div>';
    document.body.appendChild(div);

    if(!mismatchTolerance) {
      mismatchTolerance = 0.05
    }

    window._imagediff_ = {
      hasResult: false,
      hasImage: false,
      run: run,
      getResult: function(){
        window._imagediff_.hasResult = false;
        return result;
      }
    };

    function run(){

      resemble(document.getElementById('image-diff-one').files[0]).
        compareTo(document.getElementById('image-diff-two').files[0]).
        ignoreAntialiasing(). // <-- muy importante
        onComplete(function(data){

          var diffImage;

          if(Number(data.misMatchPercentage) > mismatchTolerance){
            result = data;
          } else {
            result = false;
          }
          
          window._imagediff_.hasResult = true;
          window._imagediff_.hasImage = true;
          
        });
    }
  }, 
    _mismatchTolerance
  );
}
