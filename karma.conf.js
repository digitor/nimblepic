module.exports = function(config) {

  config.set({
  	browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'src/lib/*.js',
      'src/*.css',
      'src/*.js',
      'spec/test-utils.js',
      'spec/e2e.js'
    ]
  });
};