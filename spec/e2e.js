
describe("getDynamicHeight", function() {

	var fun = window.nimblePic.testable.getDynamicHeight;
	var mbImgSrc = "/demos/img/example-1-35.jpg"

	it("should get the height of the image loaded", function(done) {
		
		fun(mbImgSrc, false, function(url, isSuccess, height) {

			expect(height).toEqual(300);
			done();
		})
	});

	it("should return the source of the specified image", function(done) {
		
		fun(mbImgSrc, false, function(url, isSuccess, height) {

			expect(mbImgSrc).toBe(mbImgSrc);
			done();
		})
	});

	it("should say if the image was loaded and able to get height successfully, when src exists", function(done) {
		
		fun(mbImgSrc, false, function(url, isSuccess, height) {

			expect(isSuccess).toBeTruthy();
			done();
		})
	});

	it("should say if the image was loaded and able to get height successfully, when src DOESN'T exist", function(done) {
		
		fun("/something-that/doesnt/exist.jpg", false, function(url, isSuccess, height) {

			expect(isSuccess).toBeFalsy();
			done();
		})
	});
});



describe("getResponsiveWidth", function() {
	var fun = window.nimblePic.testable.getResponsiveWidth
	  , isNarrowMb = window.outerWidth === 320
	  , isMb = window.outerWidth === 480
	  , isTb = window.outerWidth === 991
	  , isDt = window.outerWidth === 1200

	it("should get extra small (narrow mobile) width break-point name", function() {
			 if(isNarrowMb) expect(fun()).toBe('xs');
		else if(isMb) 		expect(fun()).toBe('sm');
		else if(isTb) 		expect(fun()).toBe('md');
		else if(isDt) 		expect(fun()).toBe('lg');
	});
});