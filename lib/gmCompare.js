var fs = require('fs');
var gm = require('gm');

module.exports = function(screensDir) {
  var diffFiles = fs.readFileSync( process.cwd() + '/phantom/config/diffFiles.json', {encoding: 'utf8'} );
  JSON.parse(diffFiles).data.forEach(function( filesToDiff ) {

    gm.compare(filesToDiff.org, filesToDiff.diff, function (err, isEqual, equality) {
      if (err) {
        console.log('Error in Comparing, overwriting anyway: ' + filesToDiff.org);
        console.log('\n');
      } else if ( equality > 0 || !isEqual ) {
        console.log('Visual change ' + (equality * 100)+ '%, overwriting: ', filesToDiff.org);
        console.log('\n');
      } else if ( equality === 0 && isEqual ) {  
        console.log('No visual change for: ' + filesToDiff.org);
        console.log('\n');
        return undefined;
      }

      var copyStream = fs.createReadStream(filesToDiff.diff).pipe(fs.createWriteStream(filesToDiff.org));

      copyStream.on('finish', function(){
        fs.unlinkSync(filesToDiff.diff);
      });

    });
  });

  fs.unlinkSync( process.cwd() + '/phantom/config/diffFiles.json' );
}