module.exports = function(type, screensDir, tolerance) {
  if(type === 'gm') {
    require('./gmCompare')(screensDir, tolerance);
  }
}
