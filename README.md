# NimblePic

## IMPORTANT
Library still in development - please do not use it yet

## Description
NimblePic is a JS library for loading different images for mobile and desktop. 
Useful if you want different sized images (or more compressed images) for mobile, to save bandwidth.
Images are defined with data attributes directly on the markup.
Also allows you to delay image load until a custom event is triggered.

## Demos
To view working demos, run `gulp webserver-for-dev` and in the browser navigate to "http://localhost:8080/demos/" and open the html files.
You will need to have done an `npm install` first and have NodeJS installed.

## Usage

### Setup
- Place nimblepic.js (from "src" directory) at the bottom of the body element.
- Place nimblepic.css (get 'auto-prefixed' version from the "demos" directory) inside the head.


### Simplest usage
Place span elements throughout your webpage using the class name "nimpic" and data attributes for mobile and tablet/desktop sizes, with optional heights, like so:
```html
<span class="nimpic"
        data-img-sm="img/example-1-35.jpg"
        data-img-md="img/example-1-58.jpg"
        data-height-sm="350"
        data-height-md="400"
        >
      Alternative text
  </span>
```
"Alternative text" should be replaced with text you would normally use on the 'alt' attribute of an <img> element.
Then, with JS, call `nimblePic.setImages()` at the bottom of the page or when DOM has fully loaded (if using jQuery you can use `$(document).ready`). This ensures that all the images instances are picked up.

#### Mandatory attributes
- The "data-img-sm" attribute should be an image path to your mobile optimised image.
- The "data-img-md" attribute should be an image path to your tablet/desktop optimised image.

#### Optional height attributes
- The "data-height-sm" attribute should be the height that you want your image to be on mobile (window width below 768px).
- The "data-height-md" attribute should be the height that you want your image to be on tablet/desktop (window width 768px and above).
- You may also use the "data-img-lg" attribute if you require a different height for desktop (window width 992px and above).

#### Optional delayed load attribute
If you wish load your images on a JS condition, you can add the attribute "data-delay-image-load-event". The value of this attribute should be the name of an event, which you should trigger (using jQuery `$(document).trigger`) when you're ready for your images to load. You can use different events for every image, or the same event for all. The event will only be listened to once.

#### Optional gradient attribute
If you wish to use CSS gradients to overlay your images, you can use the attribute `data-grad` with a value that would normally be in your CSS. You cannot use inline CSS for this because the 'background-image' CSS property would override the nimblepic styles needed to show the image. Using the attribute, these styles will be added using CSS multiple background image properties. If you wish to use this feature you should use Modernizr with 'cssgradients', so that older browsers that don't support multiple background CSS don't break.


### Complex usage

#### Change the default class name
If you wish to use a different class name than the default "nimpic" on your image elements, call this function first `nimblePic.setDefaultImageClass("my-custom-class-name")`.
It will return false if the class name was invalid and true if it was successfully applied.
If you wish to reset to the default again, call `nimblePic.setDefaultImageClass(null, true)`.

#### Params for "setImages"
- 1st "$": If you need to pass in a specific instance of jQuery, that should be the first parameter `nimblePic.setImages($)`. Leave off or pass null to just use global jQuery instance.
- 2nd "$container": The default container element is the `document` element. You can change this, using a custom jQuery element as the 2nd param, like so `nimblePic.setImages($, $("#my-container"))`
- 3rd "customCls": The default class name for images is "nimpic". You change this for each call to `setImages`, which is recommended if multiple calls are made. Only use the default if you're calling this function once. This will avoid overriding previously loaded images. This differs slightly from the method "setDefaultImageClass" in that the default class name will not change for future calls to "setImages", if just using this parameter.
- 4th "customStyleID": If suppied, will use this id on the dynamic &lt;style&gt; elements created. Keep in mind that calls to the function will remove styles previously attached to this ID. So if you're calling this function more than once on a page, you should pass this property with a new unique ID each time.
- 5th "parentCls": Use this if your "customCls" is not specific enough. Should be a class name of any parent element within the '$container'.
- 6th "loadedCB": A callback when image has loaded. Useful when running tests.

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

#### Continuous Integration
Travis CI will run the command `gulp` on each commit made to "master". Currently the responsive tests just run on Firefox on a single desktop window size, which is not optimal. In future Sauce Labs may be integrated to cover more browsers. Travis is detected by assuming that if you're running the Linux OS, you're running Travis.

#### Hacks
When using the flag '--window-size' in Chrome, the width also includes the outer pixels of the window, which includes scroll bars. Because the window size is a hardcoded value, the extra pixels needed to be hardcoded and this value differs on Windows 7, 8 and 10, so OS detection has been used. This will likely break tests in future versions of Windows, but I'll try and keep the library maintained to compensate for this. Please raise an issue on Github if you find the tests breaking due to warnings along the lines of "There must be a problem with the window sizes set in karma-responsive.conf.js for exact breakpoint values, as none of the expected values matched".

#### Gotchas
- If you don't have all browsers installed the tests will hang. You need IE (if Windows), Safari (if Mac), Chrome and Firefox.

#### Linux assumption
Tests assume that, if linux is the platform, you are running travis-ci, so only opens in Firefox.

#### Tested environments
- Windows 7 VM running IE9, Chrome 49, Firefox 44
- Windows 8.1 VM running IE11, Chrome 49, Firefox 44
- Windows 10 running IE Edge, Chrome 49, Firefox 44
- OSX El Capitan Safari 9.1, Chrome 49, Firefox 44