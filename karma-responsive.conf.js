var os = require("os")

module.exports = function(config) {

  var platform = os.platform()
    , isWin = platform === "win32" // checks if you're on Windows (tested on Windows 10, 8.1 & 7)
    , isTravis = platform === "linux" // Tests assume that, if linux is the platform, you are running travis-ci, so only opens in Firefox.
    , isWin7 = isWin && os.release().indexOf("6.1.") === 0
    , isWin81 = isWin && os.release().indexOf("6.3.") === 0
    , browsers = ["Firefox"] // FF runs on Travis without any additional tools needed

  if(!isTravis) {
    // if not running on Travis, add other browsers
    browsers.push(isWin ? 'IE' : "Safari");

    // Chrome non-exact values
    browsers.push('CHNarrowMobileNonEx', 'CHMobileNonEx', 'CHTabletNonEx', 'CHDesktopNonEx');
    
    // Mac Chrome window can only scale down to 400px width, so can't add this test for mac
    // Windows 7 window can only scale down to 338px width, so can't add this test for windows 7
    if(isWin && !isWin7) browsers.push('CHNarrowMobileEx')
    
    // Other exact value chrome tests
    browsers.push('CHMobileEx', 'CHTabletEx', 'CHDesktopEx', 'CHDesktopWideEx')
  }

  // Chrome on windows needs this to compensate for scroll bars, but Mac doesn't, as sroll bars overlay content and have no width
  var chScrollBarW = 0;
  if(isWin)   chScrollBarW = 34; // tested on windows 10
  if(isWin7)  chScrollBarW = 28;
  if(isWin81)  chScrollBarW = 33;

  config.set({
  	browsers: browsers,
    browserNoActivityTimeout: 40000, // Slower machines (or VMs) may need extra time with all these chrome windows open at once. Default is 10 seconds.
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
      'dist/*.css',
      'src/*.js',
      'spec/test-utils.js',
      'spec/e2e-responsive.js'
    ]
  });
};