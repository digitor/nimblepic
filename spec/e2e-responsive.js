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


describe("responsiveHeight", function() {
	var fun = window.nimblePic.testable.responsiveHeight
	  , getUID = window.nimblePic.testable.getUID
	  , heightSm = 400
	  , heightMd = 768
	  , heightLg = 992;

	var createEl = function(id, type, cls, skipTest) {
		var styleEl = document.createElement(type);
		styleEl.setAttribute("id", id);
		document.body.appendChild(styleEl);

		var el = document.getElementById(id);

		if(cls) el.classList.add(cls);

		// just checking element was created
		if(!skipTest) expect(el.getAttribute("id")).toBe(id);

		return el;
	}

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

		var tempDivId = getUID(".temp-div-")
		  , divEl = createEl(tempDivId, "div", customCls)
		  , divH = divEl.offsetHeight

		if(isMb || isNarrowMb)	expect(divH).toEqual(heightSm);
		else					expect(divH).toEqual(0);
	});



	it("should add a custom 'height' property for all breakpoints on a custom selector", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")

		fun(null, customID, "."+customCls, null, heightMd);

		var tempDivId = getUID(".temp-div-")
		  , divEl = createEl(tempDivId, "div", customCls)
		  , divH = divEl.offsetHeight

		expect(divH).toEqual(heightMd);
	});


	it("should add a custom 'height' property for all breakpoints (but a different value for mobile) on a custom selector", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")

		fun(null, customID, "."+customCls, heightSm, heightMd);

		var tempDivId = getUID(".temp-div-")
		  , divEl = createEl(tempDivId, "div", customCls)
		  , divH = divEl.offsetHeight

		if(isMb || isNarrowMb)	expect(divH).toEqual(heightSm);
		else					expect(divH).toEqual(heightMd);
	});


	it("should add a custom 'height' property for desktop breakpoints (and fail for others) on a custom selector", function() {

		var customID = getUID("some-unique-id-")
		  , customCls = getUID("some-class-")

		fun(null, customID, "."+customCls, null, null, heightLg);

		var tempDivId = getUID(".temp-div-")
		  , divEl = createEl(tempDivId, "div", customCls)
		  , divH = divEl.offsetHeight

		if(isDt || isWideDt)	expect(divH).toEqual(heightLg);
		else					expect(divH).toEqual(0);
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

		
		// should just affect mobile
		var tempDivId1 = getUID(".temp-div-")
		  , divEl1 = createEl(tempDivId1, "div", cls1, true)
		  , divH1 = divEl1.offsetHeight
		
		// should affect all
		var tempDivId2 = getUID(".temp-div-")
		  , divEl2 = createEl(tempDivId2, "div", cls2, true)
		  , divH2 = divEl2.offsetHeight
		
		// just desktops
		var tempDivId3 = getUID(".temp-div-")
		  , divEl3 = createEl(tempDivId3, "div", cls3, true)
		  , divH3 = divEl3.offsetHeight


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