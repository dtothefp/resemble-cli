module.exports = function(type, screensDir) {
  if(type === 'gm') {
    require('./gmCompare')(screensDir);
  }
}