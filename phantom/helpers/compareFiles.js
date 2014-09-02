var fs = require('fs');

module.exports = function(libraryRoot, diffFile) {

  console.log('compare files: ', diffFile);
  if( !fs.isFile(libraryRoot + '/' + 'resemblejs/resemblejscontainer.html') ) {
    fs.write(
      libraryRoot + '/' + 'resemblejs/resemblejscontainer.html',
      '<html><body>This blank HTML page is used for processing the images with Resemble.js</body></html>'
      );
  }


// function copyAndReplaceFile(src, dest){
//   if(fs.isFile(dest)){
//     fs.remove(dest);
//   }
//   fs.copy(src, dest);
// }

// function compareFiles(baseFile, file) {
//   var html = _libraryRoot+fs.separator+"ResembleJs"+fs.separator+"resemblejscontainer.html";
//   var test = {
//     filename: baseFile
//   };

//   if(!fs.isFile(baseFile)) {
//     test.error = true;
//   } else {

//     if( !fs.isFile(html) ){
//       console.log('[PhantomCSS] Can\'t find Resemble container. Perhaps the library root is mis configured. ('+html+')');
//       test.error = true;
//       return;
//     }

//     casper.thenOpen ( html , function (){

//       asyncCompare(baseFile, file, function(isSame, mismatch){

//         if(!isSame){

//           test.fail = true;

//           casper.waitFor(
//             function check() {
//               return casper.evaluate(function(){
//                 return window._imagediff_.hasImage;
//               });
//             },
//             function () {
//               var failFile, safeFileName, increment;
//               // DPF NOTE: if there is a failures directory specified in the init function
//               if(_failures !== undefined){
//                 if ( !fs.isDirectory(_failures) ) {
//                   fs.makeDirectory(_failures);
//                 }

//                 // flattened structure for failed diffs so that it is easier to preview
//                 failFile = _failures + fs.separator + file.split(/\/|\\/g).pop().replace('.diff.png', '').replace('.png', '');
//                 // safeFileName = failFile;
//                 // increment = 0;

//                 // while ( fs.isFile(safeFileName+'.fail.png') ){
//                 //   increment++;
//                 //   safeFileName = failFile+'.'+increment;
//                 // }

//                 failFile += '.fail.png';
//                 casper.captureSelector(failFile, 'img');

//                 test.failFile = failFile;
//                 // remove the old failed file if it exists and copy the new failed file to the failures directory
//                 copyAndReplaceFile(file, failFile);
//                 console.log('Failure! Saved to', failFile, file);
//               }

//               if (file.indexOf('.diff.png') !== -1) {
//                 casper.captureSelector(file.replace('.diff.png', '.fail.png'), 'img');
//               } else {
//                 casper.captureSelector(file.replace('.png', '.fail.png'), 'img');
//               }
            
//               casper.evaluate(function(){
//                 window._imagediff_.hasImage = false;
//               });

//               if(mismatch){
//                 test.mismatch = mismatch;
//                 // copy diff file in place of the base comparison file
//                 copyAndReplaceFile(file, baseFile);
//                 _onFail(test); // casper.test.fail throws and error, this function call is aborted
//                 return;  // Just to make it clear what is happening
//               } else {
//                 _onTimeout(test);
//               }

//             }, function(){},
//             10000
//           );
//         } else {
//           test.success = true;
//           _onPass(test);
//         }

//       });
//     });
//   }
//   return test;
// }

}