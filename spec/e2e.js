
describe("Function getDynamicHeight", function() {

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
		
		fun("/something-that/doesnt/exists.jpg", false, function(url, isSuccess, height) {

			expect(isSuccess).toBeFalsy();
			done();
		})
	});
});
