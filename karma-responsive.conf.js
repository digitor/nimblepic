module.exports = function(config) {

  var isWin = /^win/.test(process.platform) // checks if you're on Windows (tested on Windows 10)
    , chScrollBarW = isWin ? 34 : 0 // Chrome on windows needs this to compensate for scroll bars, but Mac doesn't, as sroll bars overlay content and have no width
    , browsers = [
         // Only Chrome can resize browser
        'Firefox'
        ,(isWin ? 'IE' : "Safari")

        // Chrome non-exact values
        ,'CHNarrowMobileNonEx', 'CHMobileNonEx', 'CHTabletNonEx', 'CHDesktopNonEx'
      ]

  // Mac Chrome window can only scale down to 400px width, so can't add this test for mac
  if(isWin) browsers.push('CHNarrowMobileEx')

  // Other exact value chrome tests
  browsers.push('CHMobileEx', 'CHTabletEx', 'CHDesktopEx', 'CHDesktopWideEx')

  config.set({
  	browsers: browsers,
    customLaunchers: {
      
      // Chrome non-exact values
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

      // Chrome exact values
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