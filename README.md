# NimblePic

## Description
NimblePic is a JS library for loading different images for mobile and desktop. 
Useful if you want different sized images or more compressed images for mobile, so save bandwidth.
Images are defined with data attributes directly on the markup.
Also allows you to delay image load until a custom event is triggered.

## Demos
To view working demos, run `gulp webserver-for-dev` and in the browser navigate to "http://localhost:8080/demos/" and open the html files.
You will need to have done an `npm install first` and have NodeJS installed.

## Browser support
- All modern browsers (desktop tested against Safari 9.1, Chrome 49, Firefox 44, IE Edge 25)
- IE9 and higher - older versions of IE don't support media query breakpoints and haven't been tested against
- JS must be enabled, or else only the image description will show. This also requires a CSS class "no-js" to exist on a high-level DOM element. If you're using Modernizr, attach this class to the <html> element, as this will get automatically removed when the library loads. Otherwise you can just remove it yourself with JS somewhere in your app.

## Dependencies
- jQuery 0.2.x (tested against 2.2.1, but will likely work with ealier versions - this dependency may be removed in future)
- Modernizr (just for CSS Gradients - this can be omitted if you don't need gradients)
- ClassList polyfill (for IE9 - this can be omitted if you don't care about IE9 support)
- Auto-prefixer (for vender prefixes on CSS - see the gulpfile.js 'vendor-prefix' task for configuration, as you may want to change this to suit your projects' needs)

## Tests
Tests are separated into unit tests and end to end tests. Unit tests do not require the browser (namely the window object). E2E tests have again been split; the standard e2e tests will only execute on a single desktop sized window; the "responsive" e2e tests will open up in many specifically sized browser windows (only opens in Chrome, as other browsers don't support the flag '--window-size'). The smallest (mobile) size in the responsive e2e tests will only open in Chrome in Windows 8 and higher, as Chrome on Mac OS and Windows 7 don't allow the window to go down to 320px width.

### Hacks
When using the flag '--window-size' in Chrome, the width also includes the outer pixels of the window, which includes scroll bars. Because the window size is a hardcoded value, the extra pixels needed to be hardcoded and this value differs on Windows 7, 8 and 10, so OS detection has been used. This will likely break tests in future versions of Windows, but I'll try and keep the library maintained to compensate for this. Please raise an issue on Github if you find the tests breaking due to warnings along the lines of "There must be a problem with the window sizes set in karma-responsive.conf.js for exact breakpoint values, as none of the expected values matched".

### Gotchas
- If you don't have all browsers installed the tests will hang. You need IE (if Windows), Safari (if Mac), Chrome and Firefox.

### Tested environments
- Windows 7 VM running IE9, Chrome 49, Firefox 44
- Windows 8.1 VM running IE11, Chrome 49, Firefox 44
- Windows 10 running IE Edge, Chrome 49, Firefox 44
- OSX El Capitan Safari 9.1, Chrome 49, Firefox 44