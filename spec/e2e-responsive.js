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
