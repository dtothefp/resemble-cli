var fs = require('fs');

module.exports = function (root, page){
  var diffData = {
    createDiff: false
  };

  if( /\//.test(page) ) {
    var split = page.split('');

    split.forEach(function(char, i) {
      if(char === '/' || char === ' ' || char === '-') {
        if(i === 0 || i === split.length - 1) {
          split[i] = '';
        } else {
          split[i] = '_';
        }
      }
    });

    page = split.join('');
  }

  if(fs.isFile(root + page + '.png')){
    diffData.createDiff = true;
    diffData.imgName = root + page + '.diff.png';
    console.log("Previous File Exists: creating baseline comparison --", diffData.imgName);
    console.log('\n');
  } else {
    diffData.imgName = root + page + '.png';
    console.log("Initial File Doesn't Exist: creating baseline comparison --", diffData.imgName);
    console.log('\n');
  }
  return diffData;
}