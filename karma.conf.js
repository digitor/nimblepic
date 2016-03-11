module.exports = function(config) {

  config.set({
  	browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'src/lib/*.js',
      'src/*.js',
      'spec/test-utils.js',
      'spec/e2e.js'
    ]
  });
};