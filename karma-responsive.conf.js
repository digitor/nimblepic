module.exports = function(config) {

	var chromeScrollBarW = 34; // needs this to compensate for scroll bars
  config.set({
  	browsers: ['narrowMobileNonEx', 'mobileNonEx', 'tabletNonEx', 'desktopNonEx', 
               'narrowMobileEx',    'mobileEx',    'tabletEx',    'desktopEx'],
    customLaunchers: {
      narrowMobileNonEx: {
        base: "Chrome",
        flags: ["--window-size="+(479 + chromeScrollBarW)+",600"],
      },
      mobileNonEx: {
        base: "Chrome",
        flags: ["--window-size="+(767 + chromeScrollBarW)+",800"],
      },
      tabletNonEx: {
        base: "Chrome",
        flags: ["--window-size="+(991 + chromeScrollBarW)+",1000"]
      },
      desktopNonEx: {
        base: "Chrome",
        flags: ["--window-size="+(1199)+",1400"]
      },

      // for 
      narrowMobileEx: {
        base: "Chrome",
        flags: ["--window-size="+(320 + chromeScrollBarW)+",600"],
      },
      mobileEx: {
        base: "Chrome",
        flags: ["--window-size="+(480 + chromeScrollBarW)+",800"],
      },
      tabletEx: {
        base: "Chrome",
        flags: ["--window-size="+(768 + chromeScrollBarW)+",1000"]
      },
      desktopEx: {
        base: "Chrome",
        flags: ["--window-size="+(992)+",1400"]
      },
      desktopWideEx: {
        base: "Chrome",
        flags: ["--window-size="+(1200)+",1400"]
      }
    },
    frameworks: ['jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'src/*.js',
      'spec/e2e-responsive.js'
    ]
  });
};