var fs = require('fs');
var gm = require('gm');

module.exports = function(screensPath, tolerance) {
  var diffFiles = fs.readFileSync( screensPath + 'diffFiles.json', {encoding: 'utf8'} );
  tolerance = Number(tolerance);
  JSON.parse(diffFiles).data.forEach(function( filesToDiff ) {

    gm.compare(filesToDiff.org, filesToDiff.diff, function (err, isEqual, equality) {
      if (err) {
        console.log('Error in Comparing, overwriting anyway: ' + filesToDiff.org);
        console.log('\n');
      } else if ( equality > tolerance || !isEqual ) {
        console.log('Visual change ' + (equality * 100)+ '%, overwriting: ', filesToDiff.org);
        console.log('\n');
      } else if ( ( equality === 0 || equality <= tolerance ) && isEqual ) {
        console.log('No visual change for: ' + filesToDiff.org);
        console.log('\n');
        fs.unlinkSync(filesToDiff.diff);
        return undefined;
      }

      var copyStream = fs.createReadStream(filesToDiff.diff).pipe(fs.createWriteStream(filesToDiff.org));

      copyStream.on('finish', function(){
        fs.unlinkSync(filesToDiff.diff);
      });

    });
  });

  fs.unlinkSync( screensPath + 'diffFiles.json' );
}
