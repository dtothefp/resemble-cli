function compareAll(exclude, list){
  var tests = [];

  _test_exclude = typeof exclude === 'string' ? new RegExp(exclude) : exclude;
  
  if (list){
    _diffsToProcess = list;
  } else {
    _realPath = undefined;
    //DFP changed from _results to _src => this populates _diffsToProcessArray with diff images with .diff extension
    getDiffs(_src);
  }

  _diffsToProcess.forEach(function(file){
    var baseFile = file.replace('.diff', '');
    tests.push(compareFiles(baseFile, file));
  });
  waitForTests(tests);
}

function getDiffs (path){

  var filePath;

  if(({'..':1,'.':1})[path]){ return true; }

  if(_realPath){
    _realPath += fs.separator + path;
  } else {
    _realPath = path;
  }

  filePath = _realPath;

  if(fs.isDirectory(_realPath) ){
    fs.list(_realPath).forEach(getDiffs);
  } else {
    if( /\.diff\./.test(path.toLowerCase()) ){
      if(_test_match){
        if( _test_match.test(_realPath.toLowerCase()) ){
          if( !(_test_exclude && _test_exclude.test(_realPath.toLowerCase())) ){
            console.log('[PhantomCSS] Analysing', _realPath);
            _diffsToProcess.push(filePath);
          }
        }
      } else {
        if( !(_test_exclude && _test_exclude.test(_realPath.toLowerCase())) ){
          _diffsToProcess.push(filePath);
        }
      }
    }
  }

  _realPath = _realPath.replace(fs.separator + path, '');
}

function waitForTests(tests){
  casper.then(function(){
    casper.waitFor(function(){
      return tests.length === tests.reduce(function(count, test){
        if (test.success || test.fail || test.error) {
          return count + 1;
        } else {
          return count;
        }
      }, 0);
    }, function(){
      var fails = 0, errors = 0;
      tests.forEach(function(test){
        if (test.fail){
          fails++;
        } else if (test.error){
          errors++;
        }
      });
      _onComplete(tests, fails, errors);
    }, function(){

    },
    10000);
  });
}