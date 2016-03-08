describe("The utility function", function() {

	var mbImgSrc = "/demos/img/example-1-35.jpg"

	it("'getDynamicHeight' should get the height of the image loaded", function(done) {
		
		nimblePic.getDynamicHeight(mbImgSrc, false, function(url, isSuccess, height) {

			expect(height).toEqual(300);
			done();
		})
	});

	it("'getDynamicHeight' should return the source of the specified image", function(done) {
		
		nimblePic.getDynamicHeight(mbImgSrc, false, function(url, isSuccess, height) {

			expect(mbImgSrc).toBe(mbImgSrc);
			done();
		})
	});

	it("'getDynamicHeight' should say if the image was loaded and able to get height successfully, when src exists", function(done) {
		
		nimblePic.getDynamicHeight(mbImgSrc, false, function(url, isSuccess, height) {

			expect(isSuccess).toBeTruthy();
			done();
		})
	});

	it("'getDynamicHeight' should say if the image was loaded and able to get height successfully, when src DOESN'T exist", function(done) {
		
		nimblePic.getDynamicHeight("/something-that/doesnt/exists.jpg", false, function(url, isSuccess, height) {

			expect(isSuccess).toBeFalsy();
			done();
		})
	});
});
