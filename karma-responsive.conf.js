module.exports = function(config) {

	var chromeScrollBarW = 34; // needs this to compensate for scroll bars
  config.set({
  	browsers: ['narrowMobileNonEx', 'mobileNonEx', 'tabletNonEx', 'desktopNonEx'
               ,
               'narrowMobileEx',    'mobileEx',    'tabletEx',    'desktopEx', 'desktopWideEx'
               ],
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
        flags: ["--window-size="+(1199 + chromeScrollBarW)+",1400"]
      },

      // for exact matches
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
        flags: ["--window-size="+(992 + chromeScrollBarW)+",1400"]
      },
      desktopWideEx: {
        base: "Chrome",
        flags: ["--window-size="+(1200 + chromeScrollBarW)+",1400"]
      }
    },
    frameworks: ['jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'src/lib/*.js',
      'src/*.js',
      'spec/test-utils.js',
      'spec/e2e-responsive.js'
    ]
  });
};