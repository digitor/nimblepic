

var createEl = window.testUtils.createEl
  , getUID = window.nimblePic.testable.getUID

xdescribe("getDynamicHeight", function() {

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


xdescribe("getUID", function() {
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

xdescribe("setClearImgStyles", function() {
	var fun = window.nimblePic.testable.setClearImgStyles;

	it("should create an element, then remove it when event is triggered", function() {
		var customID = getUID("some-unique-id-")

		fun($);
		createEl(customID, "style");
		expect(document.getElementById(customID)).toBeTruthy();
		$(window).trigger("clear-img-styles", { styleIds: [customID] });
		expect(document.getElementById(customID)).toBeFalsy();
	});
});


describe("addStyle", function() {
	var fun = window.nimblePic.testable.addStyle

	it("should add CSS to a style element with the given unique ID", function() {
		var cls = "example-1"

		fun(getUID(), "."+cls+" { width:10px; height: 10px; }");
		var el = createEl(null, "div", cls);

		expect(el.offsetWidth).toEqual(10);
		expect(el.offsetHeight).toEqual(10);

		// just cleaning up after self so other tests are not affected
		document.body.removeChild(el);
	});


	it("should add CSS to a style element with the same unique ID", function() {
		var id = getUID("style-id-")
		  , cls = "example-2"

		// adds styles with a different id, which will remain
		fun(getUID(), "."+cls+" { width:30px; height: 30px; }");

		// adds styles with an id that will be removed
		fun(id, "."+cls+" { width:20px; }");
		fun(id, "."+cls+" { height: 20px; }");
		
		var el = createEl(null, "div", cls);

		// first test the 2 styles exist on a div
		expect(el.offsetWidth).toEqual(20);
		expect(el.offsetHeight).toEqual(20);

		// then remove the style element by ID
		var styleEl = document.getElementById(id);
		document.body.removeChild(styleEl);

		// and expect the div element to have the first set of styles attached
		expect(el.offsetWidth).toEqual(30);
		expect(el.offsetHeight).toEqual(30);
	});
})
