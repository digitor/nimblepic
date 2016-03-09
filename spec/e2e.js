
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


describe("getUID", function() {
	var fun = window.nimblePic.testable.getUID
	  , uid1 = fun()
	  , uid2 = fun();

	it("should get a string", function() {
		expect(typeof uid1).toBe("string");
	});

	it("should not contain spaces", function() {
		expect(uid1).not.toContain(" ");
	});

	it("should get a unique value each time", function() {
		expect(uid1).not.toBe(uid2);
	});
});
