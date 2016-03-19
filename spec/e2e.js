

var createEl = window.testUtils.createEl
  , cleanupElement = window.testUtils.cleanupElement
  , getUID = window.nimblePic.testable.getUID

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

describe("setClearImgStyles", function() {
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

		cleanupElement(el);
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

		cleanupElement(el);
	});
});


describe("getImgProps", function() {
	var fun = window.nimblePic.testable.getImgProps

	it("should return an object with all valid values", function() {
		var el = createEl(null, "div");
		el.setAttribute("data-img-sm", "url-sm");
		el.setAttribute("data-img-md", "url-md");
		el.setAttribute("data-height-sm", "some invalid value");
		el.setAttribute("data-height-md", "10");
		el.setAttribute("data-height-lg", 20);
		el.setAttribute("data-delay-image-load-event", "custom-event-name");
		el.setAttribute("data-img-group", "custom-group-name");

		var result = fun(el);
		expect(result.srcSm).toBe("url-sm");
		expect(result.srcMd).toBe("url-md");
		expect(result.hSm).toBeFalsy();
		expect(result.hMd).toEqual(10);
		expect(result.hLg).toEqual(20);
		expect(result.customEvent).toEqual("custom-event-name");
		expect(result.group).toEqual("custom-group-name");

		cleanupElement(el);
	});
});

describe("addLoader", function() {
	var fun = window.nimblePic.testable.addLoader

	it("should add a loader element the element passed only once", function() {
		var el = createEl(null, "span");

		// call and expect the loader element to have been added
		fun($(el));
		expect(el.querySelectorAll(".imgresp-ldr").length).toEqual(1);

		// now call it again, still only expect 1 loader element
		fun($(el));
		expect(el.querySelectorAll(".imgresp-ldr").length).toEqual(1);
		
		cleanupElement(el);
	});

	it("should return the loading state of the image element passed", function() {
		var el = createEl(null, "span");

		// run function without loading state appplied
		expect(fun($(el))).toBe(false);

		// then apply the loading state and run again
		el.classList.add("is-imgloading");
		expect(fun($(el))).toBe(true);

		cleanupElement(el);
	});
});

describe("getSpecificSelector", function() {
	var fun = window.nimblePic.testable.getSpecificSelector

	it("should return a selector that includes the parent class name", function() {
		expect(fun("example-parent", "example-child")).toBe(".example-parent .example-child");
	});

	it("should return a selector that only has the child in it", function() {
		expect(fun(null, "example-child")).toBe(".example-child");
	});
});

describe("getCustomStyleId", function() {
	var fun = window.nimblePic.testable.getCustomStyleId

	it("should return the 'customStyleID' passed in with 'invalidSrc', 'group' and 'customEvent' omitted", function() {
		expect(fun("example-id")).toBe("example-id");
	})

	it("should return null if all properties are omitted", function() {
		expect(fun()).toBeFalsy();
	})

	it("should should contain default id prefix if 'invalidSrc' is truthy, but 'customStyleID' is falsy", function() {
		expect(fun(null, true)).toContain("imgresp-styles-");
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
	var fun = window.nimblePic.testable.isInvalidSrc

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

describe("setCustomEventHandler", function() {
	var fun = window.nimblePic.testable.setCustomEventHandler

	it("should test the callback works and includes expected params", function(done) {
		//setCustomEventHandler($img, srcSm, srcMd, specificSel, hSm, hMd, hLg, uid, styleId)

		var customEvent = getUID("custom-event-1")
		  , cb = function() {
		  		// testing arguments match the sequence passed as 'setCustomEventHandler' params
		  		for(var i=0; i<arguments.length; i++) {
		  			expect(arguments[i]).toEqual(i);
		  		}
		  	done();
		  }

		// We're just checking that the 8 params get passed using a sequence - their type doesn't really matter for this test
		fun(customEvent, cb, 0, 1,2,3,4,5,6,7,8);

		// Last argument will be the callback passed to the event, so we make that sequential too
		$(document).trigger(customEvent, {cb:9});
	})
})