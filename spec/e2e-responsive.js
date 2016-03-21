/**
 * Because it is not possible to resize the window using JS, in Chrome (and I think all modern browsers), the karma-responsive.conf.js file specifies
 * certain window sizes. The values that we have set below must be exact matches to those window sizes (minus the scroll bar extra pixels added in the config),
 * as we make assumptions based on them.
 */

var winW = window.nimblePic.testable.winWidth();

// non-exact breakpoint values
var isWideDt = false
  , isDt = winW === 1199
  , isTb = winW === 991
  , isMb = winW === 767
  , isNarrowMb = winW === 479

var isNonExact = isDt || isTb || isMb || isNarrowMb;

var createEl = window.testUtils.createEl
  , createImgEl = window.testUtils.createImgEl
  , getNewDivHeight = window.testUtils.getNewDivHeight
  , getUID = window.nimblePic.testable.getUID
  , getCompProp = window.testUtils.getCompProp
  , cleanupElement = window.testUtils.cleanupElement
  , $doc = $(document)

//console.log("winW", winW);


function printBreakPoint() {
	if(isWideDt) return "isWideDt";
	if(isDt) return "isDt";
	if(isTb) return "Tb";
	if(isMb) return "isMb";
	if(isNarrowMb) return "isNarrowMb";
	//return ["isDt:"+isDt, "isTb:"+isTb, "isMb:"+isMb, "isNarrowMb:"+isNarrowMb, "isWideDt:"+isWideDt].join(" - "); 
}

// testing specific break points with non-exact breakpoint values
if(isNonExact) {

	describe("getResponsiveWidth with non-exact breakpoint values", function() {
		var fun = window.nimblePic.testable.getResponsiveWidth

		it("should match break-point names to Bootstrap grid break points", function() {
				 if(isNarrowMb) expect(fun()).toBe('xs');
			else if(isMb) 		expect(fun()).toBe('sm');
			else if(isTb) 		expect(fun()).toBe('md');
			else if(isDt) 		expect(fun()).toBe('lg');
		});
	});


	describe("responsiveWidth with non-exact breakpoint values", function() {
		var fun = window.nimblePic.testable.responsiveWidth

		it("should match break-point names to Bootstrap grid break points with 'less than' params", function() {
				 if(isNarrowMb) expect(fun('xs')).toBeTruthy();
			else if(isMb) 		expect(fun('sm')).toBeTruthy();
			else if(isTb) 		expect(fun('md')).toBeTruthy();
			else if(isDt) 		expect(fun('lg')).toBeTruthy();
		});

		it("should match break-point names to Bootstrap grid break points with 'more than' params", function() {
				 if(!isNarrowMb && isMb) 			expect(fun('xs', true)).toBeTruthy();
			else if(!isNarrowMb && !isMb && isTb)	expect(fun('sm', true)).toBeTruthy();
			else if(!isNarrowMb && !isMb && !isTb)	expect(fun('md', true)).toBeTruthy();
		});
	});

} else { // testing exact breakpoint values

	var isWideDt = winW === 1200
	  , isDt = winW === 992
	  , isTb = winW === 768
	  , isMb = winW === 480
	  , isNarrowMb = winW === 320;

	if(!isWideDt && !isDt && !isTb && !isMb && !isNarrowMb)
		throw new Error("There must be a problem with the window sizes set in karma-responsive.conf.js for exact breakpoint values, as none of the expected values matched. " + winW);

	describe("responsiveWidth with exact breakpoint values", function() {
		var fun = window.nimblePic.testable.responsiveWidth

		it("should match break-point names to Bootstrap grid break points with 'more than or equal' params", function() {
				 if(isNarrowMb) expect(fun('xs', true, true)).toBeFalsy(); // value is 320, but would need to be more than 480 to be successful
			else if(isMb) 		expect(fun('xs', true, true)).toBeTruthy();
			else if(isTb) 		expect(fun('sm', true, true)).toBeTruthy();
			else if(isDt) 		expect(fun('md', true, true)).toBeTruthy();
			else if(isWideDt) 	expect(fun('lg', true, true)).toBeTruthy();
		});

		it("should NOT match break-point names to Bootstrap grid break points with 'more than' params", function() {
				 if(isMb) 		expect(fun('xs', true)).toBeFalsy();
			else if(isTb) 		expect(fun('sm', true)).toBeFalsy();
			else if(isDt) 		expect(fun('md', true)).toBeFalsy();
			else if(isWideDt) 	expect(fun('lg', true)).toBeFalsy();
		});
	});
}




describe("responsiveHeight", function() {
	var fun = window.nimblePic.testable.responsiveHeight
	  , heightSm = 400
	  , heightMd = 768
	  , heightLg = 992;


	// no need to run these tests on every breakpoint
	if(isDt) {

		it("should clear a style element by id, by just passing 'justClear' param and 'customID'.", function() {
			var customID = getUID("some-unique-id-")
			  , justClear = true;

			createEl(customID, "style");

			expect(document.getElementById(customID)).toBeTruthy();
			fun(true, customID);
			expect(document.getElementById(customID)).toBeFalsy();
		});


		it("should clear a style element by id, by just passing 'clearExisting' param and 'customID'.", function() {
			var customID = getUID("some-unique-id-")
			  , clearExisting = true;
			  
			var styleEl = createEl(customID, "style");

			styleEl.innerHTML = ".test { background:blue; }";

			fun(null, customID, null, null, null, null, clearExisting);

			// tests that element exists, but has been cleared (because no new values were passed with the function call)
			styleEl = document.getElementById(customID);
			expect(styleEl).toBeTruthy();
			expect(styleEl.innerHTML).toBe("");

			cleanupElement(customID);
		});
	}



	it("should add a custom 'height' property for mobile on a custom selector and fail for all others", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")
		  

		fun(null, customID, "."+customCls, heightSm);

		var divH = getNewDivHeight(customCls);

		if(isMb || isNarrowMb)	expect(divH).toEqual(heightSm);
		else					expect(divH).toEqual(0);

		cleanupElement(customID);
	});



	it("should add a custom 'height' property for all breakpoints on a custom selector", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")

		fun(null, customID, "."+customCls, null, heightMd);

		var divH = getNewDivHeight(customCls);

		expect(divH).toEqual(heightMd);

		cleanupElement(customID);
	});


	it("should add a custom 'height' property for all breakpoints (but a different value for mobile) on a custom selector", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")

		fun(null, customID, "."+customCls, heightSm, heightMd);

		var divH = getNewDivHeight(customCls);

		if(isMb || isNarrowMb)	expect(divH).toEqual(heightSm);
		else					expect(divH).toEqual(heightMd);

		cleanupElement(customID);
	});


	it("should add a custom 'height' property for desktop breakpoints (and fail for others) on a custom selector", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")

		fun(null, customID, "."+customCls, null, null, heightLg);

		var divH = getNewDivHeight(customCls);

		if(isDt || isWideDt)	expect(divH).toEqual(heightLg);
		else					expect(divH).toEqual(0);

		cleanupElement(customID);
	});


	// TEST NOT WORKING (NEED TO FIX)
	it("should add a custom 'height' property for only the 2nd selector, because 'clearExisting' is set to true", function() {

		var customID = getUID("some-unique-id-")
		  , cls1 = getUID("some-class-")
		  , cls2 = getUID("some-class-")

		fun(null, customID, "."+cls1, null, null, heightLg);
		fun(null, customID, "."+cls2, null, null, heightLg, true); // passes 'clearExisting' as true

		var divH1 = getNewDivHeight(cls1)
		  , divH2 = getNewDivHeight(cls2);

		if(isDt || isWideDt) {
			expect(divH1).toEqual(0);
			expect(divH2).toEqual(heightLg);
		}

		cleanupElement(customID);
	});


	describe("3 media queries on same element by ID, but with different classes", function() {

		var customID = getUID("some-unique-id-")
		  , cls1 = getUID("example1")
		  , cls2 = getUID("example2")
		  , cls3 = getUID("example3")

		// uses different classes for each call, but ame ID
		fun(null, customID, "."+cls1, heightSm);
		fun(null, customID, "."+cls2, null, heightMd);
		fun(null, customID, "."+cls3, null, null, heightLg);

		var divH1 = getNewDivHeight(cls1, true)
		  , divH2 = getNewDivHeight(cls2, true)
		  , divH3 = getNewDivHeight(cls3, true)

		var count = 0;
		function cleanUp() {
			count++;
			if(count >= 3) cleanupElement(customID);
		}


		it("should just succeed for mobile on div1", function() {
			if(isMb || isNarrowMb)	expect(divH1).toEqual(heightSm);
			else					expect(divH1).toEqual(0);
			cleanUp();
		});


		it("should succeed for all on div2", function() {
			expect(divH2).toEqual(heightMd);
			cleanUp();
		});


		it("should just succeed for desktop on div3", function() {
			if(isDt || isWideDt)	expect(divH3).toEqual(heightLg);
			else					expect(divH3).toEqual(0);
			cleanUp();
		});
	});
});

describe("responsiveImage", function() {
	var fun = window.nimblePic.testable.responsiveImage
	  , srcSm = "/demos/img/example-1-35.jpg"
	  , srcMd = "/demos/img/example-1-58.jpg"
	  , defId = "imgresp-styles";

	function bgImgExp(id, src, customID) {
		
		expect(getCompProp(id, "background-image")).toContain(src);

		if(!customID) customID = defId;

		cleanupElement(customID);
		
		expect(getCompProp(id, "background-image")).not.toContain(src);

		cleanupElement(id);
	}

	if(isMb || isNarrowMb) {
		it("should show mobile image using default style id", function() {
			var id = getUID("example1")
			  , cls = getUID("example1");

			fun(null, srcSm, srcMd, "."+cls);
			createImgEl(id, cls);

			bgImgExp(id, srcSm);
		});
	} else {
		it("should show tabet/desktop image using default style id", function() {
			var id = getUID("example2")
			  , cls = getUID("example2");

			fun(null, srcSm, srcMd, "."+cls);
			var el = createImgEl(id, cls);

			bgImgExp(id, srcMd);
		});
	}

	// could be on any break point, just adding condition so we're running it more than needed
	if(isMb) {
		it("should show image using custom style id and 'clearExisting' removing it", function() {
			var id = getUID("example3")
			  , cls = getUID("example3")
			  , customStyleID = getUID("example3");

			// runs the main function on a custom ID (for the style element)
			fun(null, srcSm, srcMd, "."+cls, null, null, null, null, customStyleID);
			createImgEl(id, cls);

			// tests that elements created contains the default bg image for the small size
			expect(getCompProp(id, "background-image")).toContain(srcSm);

			// now runs the main function again with the 'clearExisting' param as true, so we can verify the new (fake) src value gets applied
			var clearExisting = true;
			fun(null, "fake-src", srcMd, "."+cls, null, null, null, clearExisting, customStyleID);

			expect(getCompProp(id, "background-image")).toContain("fake-src");

			cleanupElement(id);
			cleanupElement(customStyleID);
		});
	} 

	if(isMb || isNarrowMb) {
		it("should show mobile image height applied", function() {
			var id = getUID("example4")
			  , cls = getUID("example4")
			  , heightSm = 200;

			fun(null, srcSm, srcMd, "."+cls, heightSm);
			createImgEl(id, cls);

			expect(document.getElementById(id).offsetHeight).toEqual(heightSm);

			cleanupElement(id);
		});
	} else if(isTb) {
		it("should show tablet image height applied", function() {
			var id = getUID("example5")
			  , cls = getUID("example5")
			  , heightMd = 400;

			fun(null, srcSm, srcMd, "."+cls, null, heightMd);
			createImgEl(id, cls);

			expect(document.getElementById(id).offsetHeight).toEqual(heightMd);

			cleanupElement(id);
		});
	} else if(isDt) {
		it("should show desktop image height applied", function() {
			var id = getUID("example5")
			  , cls = getUID("example5")
			  , heightLg = 600;

			fun(null, srcSm, srcMd, "."+cls, null, heightLg);
			createImgEl(id, cls);

			expect(document.getElementById(id).offsetHeight).toEqual(heightLg);

			cleanupElement(id);
		});
	}

	if(isMb || isNarrowMb) {
		it("should not show the bg image when on mobile and CSS class 'no-mb' is applied", function() {
			var id = getUID("example6")
			  , cls = getUID("example6")

			fun(null, srcSm, srcMd, "."+cls);
			var el = createImgEl(id, cls);

			el.classList.add("no-mb");

			// tests that elements created DOES NOT contain a bg image for the small size
			expect(getCompProp(id, "background-image")).not.toContain(srcSm);

			cleanupElement(el);
		});
	}
});

describe("isInvalidResponsiveSrc", function() {
	var fun = window.nimblePic.testable.isInvalidResponsiveSrc

	if(isMb || isNarrowMb) {
		it("should return FALSE when mobile source is VALID", function() {
			
			var $el = $(createImgEl()); // must be a jQuery element
			expect(fun($el, "/path-to/img/mobile.jpg")).toBe(false);

			cleanupElement($el[0]);
		})

		it("should return TRUE when mobile source is INVALID", function() {
			
			var $el = $(createImgEl()); // must be a jQuery element
			
			// shouldn't be a boolean, should be a string
			expect(fun($el, true, "/a-valid/desktop/img.jpg")).toBe(true);

			cleanupElement($el[0]);
		})
		
		it("should return TRUE when loaded/loading data is added to jQuery element and source MATCHES", function() {
			
			var $el = $(createImgEl()) // must be a jQuery element
			  , imgPath = "/path-to/img/mobile.jpg"

			$el.data("current-image-src", imgPath)
			
			expect(fun($el, imgPath)).toBe(true);

			cleanupElement($el[0]);
		})

		it("should return FALSE when loaded/loading data is added to jQuery element and source DOESN'T MATCH", function() {
			
			var $el = $(createImgEl()) // must be a jQuery element
			  , imgPath = "/path-to/img/mobile.jpg"

			$el.data("current-image-src", "a-different/img.jpg")
			
			expect(fun($el, "/path-to/img/mobile.jpg")).toBe(false);

			cleanupElement($el[0]);
		})		
	} else if(isDt) {
		it("should return FALSE when desktop source is VALID", function() {
			
			var $el = $(createImgEl()); // must be a jQuery element
			
			// first param is invalid because it's not a string
			expect(fun($el, 1, "/path-to/img/desktop.jpg")).toBe(false);

			cleanupElement($el[0]);
		})

		it("should return TRUE when desktop source is INVALID", function() {
			
			var $el = $(createImgEl()); // must be a jQuery element
			
			// shouldn't be a boolean, should be a string
			expect(fun($el, "/a-valid/mobile/img.jpg", true)).toBe(true);

			cleanupElement($el[0]);
		})
	}
})


describe("setImages", function() {
	var fun = window.nimblePic.setImages
	  , srcSm = "/demos/img/example-1-35.jpg"
	  , srcMd = "/demos/img/example-1-58.jpg"

	function bgImgCheck(img, done) {
		if(isDt || isWideDt || isTb)	expect(getCompProp(img, "background-image")).toContain(srcMd);
		else 							expect(getCompProp(img, "background-image")).toContain(srcSm);

		cleanupElement(img);
		if(done) done();
	}

	function setImgAttr(img) {
		img.setAttribute("data-img-sm", srcSm);
		img.setAttribute("data-img-md", srcMd);
	}

	it("should load image by default CSS class name - " + printBreakPoint(), function(done) {
		
		var img = createImgEl();
		setImgAttr(img);

		fun($, null, null, getUID(), null, function(isSuccess, url, height) {
			// image loaded callback
			bgImgCheck(img, done);
		});
	})

	it("should load image by custom CSS class name - " + printBreakPoint(), function(done) {

		var cls = getUID()
		  , img = createImgEl(null, cls); // creates image with custom class
		setImgAttr(img);

		// passes the custom class
		fun($, null, cls, getUID(), null, function(isSuccess, url, height) {
			// image loaded callback
			bgImgCheck(img, done);
		});
	})

	it("should load image by custom CSS class name on a custom container - " + printBreakPoint(), function(done) {

		var cont = createEl() // creates an empty container element
		  , cls = getUID()
		  , img = createImgEl(null, cls, cont); // attaches the image to the container

		setImgAttr(img);

		// passes the container and custom class
		fun($, $(cont), cls, getUID(), null, function(isSuccess, url, height) {
			// image loaded callback
			bgImgCheck(img, done);
		});
	})

	it("should load image by custom CSS class name on a parent selector - " + printBreakPoint(), function(done) {

		var parentCls = getUID()
		  , cont = createEl(null, null, parentCls) // creates an empty container element
		  , cls = getUID()
		  , img = createImgEl(null, cls, cont); // attaches the image to the container

		setImgAttr(img);

		// passes the container and custom class
		fun($, null, cls, getUID(), parentCls, function(isSuccess, url, height) {
			// image loaded callback
			bgImgCheck(img, done);
		});
	})


	it("should load image by delayed event, including custom event callback - " + printBreakPoint(), function(done) {
		
		var img = createImgEl();
		setImgAttr(img);

		var uniqueEventName = getUID("unique-event-name");
		img.setAttribute("data-delay-image-load-event", uniqueEventName);

		fun($, null, null, getUID(), null);

		var imgLoadedCB = function() {
			bgImgCheck(img, done);
		}

		setTimeout(function() {
			$doc.trigger(uniqueEventName, {cb:imgLoadedCB});
		}, 500);
	})

})
