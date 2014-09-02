var fs = require('fs');

module.exports = function (root, page){
  var diffData = {
    createDiff: false
  };
  if(fs.isFile(root + page + '.png')){
    console.log("Initial File Exists: creating baseline comparison --", page);
    
    diffData.createDiff = true;
    diffData.imgName = root + page + '.diff.png';
  } else {
    console.log("Initial File Doesn't Exist: creating baseline comparison --", page);

    diffData.imgName = root + page + '.png';
  }
  return diffData;
}