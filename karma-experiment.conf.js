module.exports = function(config) {

  config.set({
  	browsers: ['Firefox'],
    frameworks: ['jasmine'],
    files: [
      'src/*.js',
      'spec/unit.js'
    ]
  });
};