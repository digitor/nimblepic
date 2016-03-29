# nimblepic

## DO NOT USE YET
This library is still in preparation stages and isn't ready for usage

## Description
NimblePic is a JS library for loading different images for mobile and desktop. 
Useful if you want different sized images or more compressed images for mobile, so save bandwidth.
Images are defined with data attributes directly on the markup.
Also allows you to delay image load until a custom event is triggered.

## Browser support
- All modern browsers
- IE9 and higher - older versions of IE don't support media query breakpoints and haven't been tested against
- JS must be enabled, or else only the image description will show

## Tested environments
- Windows 7 VM running IE9, Chrome 49, Firefox 44
- Windows 8.1 VM running IE11, Chrome 49, Firefox 44
- Windows 10 running IE Edge, Chrome 49, Firefox 44
- OSX El Capitan Safari 9.1, Chrome 49, Firefox 44

## Dependencies
- jQuery 0.2.x
- Modernizr (just CSS Gradients)
- ClassList polyfill (for IE9)
- Auto-prefixer (for vender prefixes on CSS)

## Gotchas
- If you don't have all browsers installed the tests will hang. You need IE (if Windows), Safari (if Mac), Chrome and Firefox.