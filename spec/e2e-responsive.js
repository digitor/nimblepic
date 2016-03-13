/**
 * Because it is not possible to resize the window using JS, in Chrome (and I think all modern browsers), the karma-responsive.conf.js file specifies
 * certain window sizes. The values that we have set below must be exact matches to those window sizes (minus the scroll bar extra pixels added in the config),
 * as we make assumptions based on them.
 */

var winW = window.nimblePic.testable.winWidth();

// non-exact breakpoint values
var isDt = winW === 1199
  , isTb = winW === 991
  , isMb = winW === 767
  , isNarrowMb = winW === 479


var createEl = window.testUtils.createEl
  , getNewDivHeight = window.testUtils.getNewDivHeight
  , getUID = window.nimblePic.testable.getUID

console.log("winW", winW);

// testing specific break points with non-exact breakpoint values
if(isDt || isTb || isMb || isNarrowMb) {


	xdescribe("getResponsiveWidth with non-exact breakpoint values", function() {
		var fun = window.nimblePic.testable.getResponsiveWidth

		it("should match break-point names to Bootstrap grid break points", function() {
				 if(isNarrowMb) expect(fun()).toBe('xs');
			else if(isMb) 		expect(fun()).toBe('sm');
			else if(isTb) 		expect(fun()).toBe('md');
			else if(isDt) 		expect(fun()).toBe('lg');
		});
	});


	xdescribe("responsiveWidth with non-exact breakpoint values", function() {
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

	xdescribe("responsiveWidth with exact breakpoint values", function() {
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


xdescribe("responsiveHeight", function() {
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

			fun(true, customID);
		});


		it("should clear a style element by id, by just passing 'justClear' param and 'customID'.", function() {
			var customID = getUID("some-unique-id-")
			  , clearExisting = true;
			  
			createEl(customID, "style");

			fun(null, customID, null, null, null, null, clearExisting);
		});
	}



	it("should add a custom 'height' property for mobile on a custom selector and fail for all others", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")
		  

		fun(null, customID, "."+customCls, heightSm);

		var divH = getNewDivHeight(customCls);

		if(isMb || isNarrowMb)	expect(divH).toEqual(heightSm);
		else					expect(divH).toEqual(0);
	});



	it("should add a custom 'height' property for all breakpoints on a custom selector", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")

		fun(null, customID, "."+customCls, null, heightMd);

		var divH = getNewDivHeight(customCls);

		expect(divH).toEqual(heightMd);
	});


	it("should add a custom 'height' property for all breakpoints (but a different value for mobile) on a custom selector", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")

		fun(null, customID, "."+customCls, heightSm, heightMd);

		var divH = getNewDivHeight(customCls);

		if(isMb || isNarrowMb)	expect(divH).toEqual(heightSm);
		else					expect(divH).toEqual(heightMd);
	});


	it("should add a custom 'height' property for desktop breakpoints (and fail for others) on a custom selector", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")

		fun(null, customID, "."+customCls, null, null, heightLg);

		var divH = getNewDivHeight(customCls);

		if(isDt || isWideDt)	expect(divH).toEqual(heightLg);
		else					expect(divH).toEqual(0);
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


		it("should just succeed for mobile on div1", function() {
			if(isMb || isNarrowMb)	expect(divH1).toEqual(heightSm);
			else					expect(divH1).toEqual(0);
		});


		it("should succeed for all on div2", function() {
			expect(divH2).toEqual(heightMd);
		});


		it("should just succeed for desktop on div3", function() {
			if(isDt || isWideDt)	expect(divH3).toEqual(heightLg);
			else					expect(divH3).toEqual(0);
		});
	});
});

describe("responsiveImage", function() {
	var fun = window.nimblePic.testable.responsiveImage
	  , srcSm = "/demos/img/example-1-35.jpg"
	  , srcMd = "/demos/img/example-1-58.jpg"
	  , defId = "imgresp-styles";

	function bgImgExp(id, src, customID) {
		expect($("#"+id).css("background-image")).toContain(src);

		if(!customID) customID = defId;

		$("#"+customID).remove();
		
		expect($("#"+id).css("background-image")).not.toContain(src);
	}

	if(isMb || isNarrowMb) {
		it("should show mobile image using default style id", function() {
			var id = getUID("example1")
			  , cls = getUID("example1");

			fun(null, srcSm, srcMd, "."+cls);
			createEl(id, "span", cls);

			bgImgExp(id, srcSm);
		});
	} else {
		it("should show tabet/desktop image using default style id", function() {
			var id = getUID("example2")
			  , cls = getUID("example2");

			fun(null, srcSm, srcMd, "."+cls);
			createEl(id, "span", cls);

			bgImgExp(id, srcMd);
		});
	}

	if(isMb || isNarrowMb) {
		it("should show mobile image using custom style id and 'clearExisting' removing it", function() {
			var id = getUID("example3")
			  , cls = getUID("example3")
			  , customStyleID = getUID("example3");

			// runs the main function on a custom ID (for the style element)
			fun(null, srcSm, srcMd, "."+cls, null, null, null, null, customStyleID);
			createEl(id, "span", cls);

			// tests that elements created contains the default bg image for the small size
			expect($("#"+id).css("background-image")).toContain(srcSm);

			// now runs the main function again with the 'clearExisting' param as true, so we can verify the new (fake) src value gets applied
			var clearExisting = true;
			fun(null, "fake-src", srcMd, "."+cls, null, null, null, clearExisting, customStyleID);

			expect($("#"+id).css("background-image")).toContain("fake-src");
		});
	}
});