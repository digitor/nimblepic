var nimblePic = require("./../src/nimblepic")

describe("getUID", function() {
	
	var fun = nimblePic.testable.getUID
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


describe("getSpecificSelector", function() {

	var fun = nimblePic.testable.getSpecificSelector

	it("should return a selector that includes the parent class name", function() {
		expect(fun("example-parent", "example-child")).toBe(".example-parent .example-child");
	});

	it("should return a selector that only has the child in it", function() {
		expect(fun(null, "example-child")).toBe(".example-child");
	});
});


describe("getCustomStyleId", function() {
	
	var fun = nimblePic.testable.getCustomStyleId

	it("should return the 'customStyleID' passed in with 'invalidSrc', 'group' and 'customEvent' omitted", function() {
		expect(fun("example-id")).toBe("example-id");
	})

	it("should return null if all properties are omitted", function() {
		expect(fun()).toBeFalsy();
	})

	it("should should contain default id prefix if 'invalidSrc' is truthy, but 'customStyleID' is falsy", function() {
		expect(fun(null, true)).toContain(nimblePic.vars.DEF_SRC_STYLE_ID+"-");
	})

	it("should should contain custom id prefix (from 'customStyleID') if 'invalidSrc' is truthy", function() {
		expect(fun('example-id', true)).toContain("example-id-");
	})

	it("should should return supplied 'group', despite 'customStyleID' and 'invalidSrc' being truthy.", function() {
		expect(fun('example-id', true, 'example-group')).toBe("example-group");
	})

	it("should should return supplied 'customEvent', despite 'customStyleID', 'invalidSrc' and 'group' being truthy.", function() {
		expect(fun('example-id', true, 'example-group', 'example-custom-event')).toBe("example-custom-event");
	})
});


describe("isInvalidSrc", function() {
	
	var fun = nimblePic.testable.isInvalidSrc

	it("should return FALSE when both mobile and tablet/desktop sources are VALID", function() {
		expect(fun("/path-to/img/mobile.jpg", "/path-to/img/desktop.jpg")).toBe(false);
	})

	it("should return FALSE when mobile source is INVALID and tablet/desktop sources are VALID", function() {
		expect(fun(1, "/path-to/img/desktop.jpg")).toBe(false);
	})

	it("should return TRUE when both mobile and tablet/desktop sources are INVALID", function() {
		// they are not strings, so should be marked as invalid
		expect(fun(1, true)).toBe(true);
	})
})



describe("setDefaultImageClass", function() {
	var fun = nimblePic.setDefaultImageClass

	beforeEach(function() {
		fun(null, true); // resets to default value so multiple tests can run reliably
	});

	it("should return truthy for a valid class name", function() {
		expect(fun("valid-class-name")).toBeTruthy();
		expect(fun(".class-with-dot")).toBeTruthy(); // the dot will get stripped out
	});

	it("should return false for a class name starting with a number", function() {
		expect(fun("1-class-name-with-number")).toBe(false);
		expect(fun(".1-class-with-dot")).toBe(false); // the dot will get stripped out
	});

	it("should return false for a class name of type not 'number'", function() {
		expect(fun(true)).toBe(false);
		expect(fun(0)).toBe(false); // the dot will get stripped out
	});

	it("should return a valid class name with invalid characters removed", function() {
		expect(fun("class-&with-name-dodgy-()-characters-9")).toBe("class-with-name-dodgy--characters-9");
	});
})