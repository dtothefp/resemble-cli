module.exports = function (casper, libraryRoot, _mismatchTolerance, _resembleOutputSettings){

  casper.page.injectJs(libraryRoot + '/' + 'resemblejs/resemble.js');

  console.log('libraryRoot: ', libraryRoot + '/' + 'resemblejs/resemble.js');

  // casper.evaluate(function(mismatchTolerance, resembleOutputSettings){
    
  //   var result;

  //   var div = document.createElement('div');

  //   // this is a bit of hack, need to get images into browser for analysis
  //   div.style = "display:block;position:absolute;border:0;top:-1px;left:-1px;height:1px;width:1px;overflow:hidden;";
  //   div.innerHTML = '<form id="image-diff">'+
  //     '<input type="file" id="image-diff-one" name="one"/>'+
  //     '<input type="file" id="image-diff-two" name="two"/>'+
  //   '</form><div id="image-diff"></div>';
  //   document.body.appendChild(div);

  //   if(resembleOutputSettings){
  //     resemble.outputSettings(resembleOutputSettings);
  //   }

  //   window._imagediff_ = {
  //     hasResult: false,
  //     hasImage: false,
  //     run: run,
  //     getResult: function(){
  //       this.hasResult = false;
  //       return result;
  //     }
  //   };

  //   function run(label){

  //     function render(data){
  //       var img = new Image();

  //       img.onload = function(){
  //         window._imagediff_.hasImage = true;
  //       };
  //       document.getElementById('image-diff').appendChild(img);
  //       img.src = data.getImageDataUrl(label);
  //     }

  //     resemble(document.getElementById('image-diff-one').files[0]).
  //       compareTo(document.getElementById('image-diff-two').files[0]).
  //       ignoreAntialiasing(). // <-- muy importante
  //       onComplete(function(data){
  //         var diffImage;

  //         if(Number(data.misMatchPercentage) > mismatchTolerance){
  //           result = data.misMatchPercentage;
  //         } else {
  //           result = false;
  //         }

  //         window._imagediff_.hasResult = true;

  //         if(Number(data.misMatchPercentage) > mismatchTolerance){
  //           render(data);
  //         }
          
  //       });
  //   }
  // }, 
  //   _mismatchTolerance,
  //   _resembleOutputSettings
  // );
}