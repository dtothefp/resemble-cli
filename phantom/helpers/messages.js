exports._onPass = function (test){
  console.log('No changes found for screenshot ' + test.filename);
  console.log('\n');
}
exports._onFail = function (test){
  console.log('Visual change found for screenshot ' + test.filename + ' (' + test.mismatch + '% mismatch)');
  console.log('\n');
}
exports._onTimeout = function (test){
  console.log('Could not complete image comparison for ' + test.filename + ' your image was replaced regardless');
  console.log('\n');
}
exports._onNewImage = function (test){
  console.log('New screenshot at '+ test.filename);
  console.log('\n');
}
exports._onComplete = function (tests, noOfFails, noOfErrors){

  if( tests.length === 0){
    console.log("\nMust be your first time?");
    console.log("Some screenshots have been generated in the directory " + _results);
    console.log("This is your 'baseline', check the images manually. If they're wrong, delete the images.");
    console.log("The next time you run these tests, new screenshots will be taken.  These screenshots will be compared to the original.");
    console.log('If they are different, PhantomCSS will report a failure.');
  } else {
        
    if(noOfFails === 0){
      console.log("\nPhantomCSS found " + tests.length + " tests, None of them failed. Which is good right?");
      console.log("\nIf you want to make them fail, go change some CSS - weirdo.");
    } else {
      console.log("\nPhantomCSS found " + tests.length + " tests, " + noOfFails + ' of them failed.');
      if(_failures){
        console.log('\nPhantomCSS has created some images that try to show the difference (in the directory '+_failures+'). Fuchsia colored pixels indicate a difference betwen the new and old screenshots.');
      }
    }

    if(noOfErrors !== 0){
      console.log("There were " + noOfErrors + "errors.  Is it possible that a baseline image was deleted but not the diff?");
    }

        if (_cleanupComparisonImages) {
           fs.removeTree(_results);
        }

    exitStatus = noOfErrors+noOfFails;
  }
}