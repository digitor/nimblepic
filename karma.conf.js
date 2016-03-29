var os = require("os")

module.exports = function(config) {

  var isWin = os.platform() === "win32" // checks if you're on Windows (tested on Windows 10, 8.1 & 7)

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