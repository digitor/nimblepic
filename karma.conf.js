module.exports = function(config) {
  config.set({
  	browsers: ['narrowMobile', 'mobile', 'tablet', 'desktop'],
    customLaunchers: {
      narrowMobile: {
        base: "Chrome",
        flags: ["--window-size=320,600"],
      },
      mobile: {
        base: "Chrome",
        flags: ["--window-size=480,800"],
      },
      tablet: {
        base: "Chrome",
        flags: ["--window-size=991,1000"]
      },
      desktop: {
        base: "Chrome",
        flags: ["--window-size=1200,1200"]
      }
    },
    frameworks: ['jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'src/*.js',
      'spec/e2e.js'
    ]
  });
};