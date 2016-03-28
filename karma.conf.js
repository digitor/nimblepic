module.exports = function(config) {

  var isWin = /^win/.test(process.platform);

  config.set({
  	browsers: ['Chrome', 'Firefox', (isWin ? 'IE' : "Safari")],
    frameworks: ['jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'src/lib/*.js',
      'demos/css/*.css',
      'src/*.js',
      'spec/test-utils.js',
      'spec/e2e.js'
    ]
  });
};