module.exports = function(config) {

  // needs this to compensate for scroll bars
  var chScrollBarW = 34
    , isWin = /^win/.test(process.platform);
  config.set({
  	browsers: ['CHNarrowMobileNonEx', 'CHMobileNonEx', 'CHTabletNonEx', 'CHDesktopNonEx'
               ,
               'CHNarrowMobileEx',    'CHMobileEx',    'CHTabletEx',    'CHDesktopEx', 'CHDesktopWideEx'
               
               ,
               'Firefox' // Firefox - can't resize browser

               ,
               isWin ? 'IE' : "Safari" // IE - can't resize browser
               ],
    customLaunchers: {
      
      // Chrome
      CHNarrowMobileNonEx: {
        base: "Chrome",
        flags: ["--window-size="+(479 + chScrollBarW)+",600"],
      },
      CHMobileNonEx: {
        base: "Chrome",
        flags: ["--window-size="+(767 + chScrollBarW)+",800"],
      },
      CHTabletNonEx: {
        base: "Chrome",
        flags: ["--window-size="+(991 + chScrollBarW)+",1000"]
      },
      CHDesktopNonEx: {
        base: "Chrome",
        flags: ["--window-size="+(1199 + chScrollBarW)+",1400"]
      },

      // for exact matches
      CHNarrowMobileEx: {
        base: "Chrome",
        flags: ["--window-size="+(320 + chScrollBarW)+",600"],
      },
      CHMobileEx: {
        base: "Chrome",
        flags: ["--window-size="+(480 + chScrollBarW)+",800"],
      },
      CHTabletEx: {
        base: "Chrome",
        flags: ["--window-size="+(768 + chScrollBarW)+",1000"]
      },
      CHDesktopEx: {
        base: "Chrome",
        flags: ["--window-size="+(992 + chScrollBarW)+",1400"]
      },
      CHDesktopWideEx: {
        base: "Chrome",
        flags: ["--window-size="+(1200 + chScrollBarW)+",1400"]
      }
      
    },
    frameworks: ['jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'src/lib/*.js',
      'demos/css/*.css',
      'src/*.js',
      'spec/test-utils.js',
      'spec/e2e-responsive.js'
    ]
  });
};