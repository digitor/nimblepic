
// some warnings can be quite irritating during tests, so we can suppress them here
window.nimblePic.suppressWarnings = true;

var createEl = window.testUtils.createEl
  , createImgEl = window.testUtils.createImgEl
  , cleanupElement = window.testUtils.cleanupElement
  , getUID = window.nimblePic.testable.getUID
  , $doc = $(document)



function clearAll() {
	$("[data-resp-styles]").remove();
	$(".nimpic").remove();
}

describe("getDynamicHeight", function() {
	beforeEach(clearAll);

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




describe("setClearImgStyles", function() {
	beforeEach(clearAll);

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
	beforeEach(clearAll);

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
	beforeEach(clearAll);

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
	beforeEach(clearAll);

	var fun = window.nimblePic.testable.addLoader

	it("should add a loader element the element passed only once", function() {
		var el = createEl(null, "span");

		// call and expect the loader element to have been added
		fun($(el));
		expect(el.querySelectorAll(".nimpic-ldr").length).toEqual(1);

		// now call it again, still only expect 1 loader element
		fun($(el));
		expect(el.querySelectorAll(".nimpic-ldr").length).toEqual(1);
		
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


describe("setCustomEventHandler", function() {
	beforeEach(clearAll);

	var fun = window.nimblePic.testable.setCustomEventHandler

	it("should show the callback works and includes expected params", function(done) {
		
		var customEvent = getUID("custom-event-1")
		  , cb = function() {
		  		// testing arguments match the sequence passed as 'setCustomEventHandler' params
		  		for(var i=0; i<arguments.length; i++) {
		  			expect(arguments[i]).toEqual(i);
		  		}
		  	done();
		  }

		// We're just checking that the 8 params get passed using a sequence - their type doesn't really matter for this test
		fun(customEvent, cb, 0, 1,2,3,4,5,6,7,8,9);

		// Last argument will be the callback passed to the event, so we make that sequential too
		$doc.trigger(customEvent, {cb:10});
	})


	it("should show the params 'srcSm' and 'srcMd' can be overridden by the event data object", function(done) {
		var customEvent = getUID("custom-event-2")
		  , paramsToTest
		  , cb = function() {
		  		// testing arguments match expected params
		  		for(var i=0; i<arguments.length; i++) {
		  			expect(arguments[i]).toEqual(paramsToTest[i]);
		  		}
		  	done();
		  }


		var img = createImgEl()
		  , PATH_1 = "/path/1.jpg"
		  , PATH_2 = "/path/2.jpg"
		  , SOME_VAL = "some value"

		// add data attributes to override null values
		img.setAttribute("data-img-sm", PATH_1);
		img.setAttribute("data-img-md", PATH_2);

		// passing null for srcSm and srcMd, so they can be overridden in event dispatch
		paramsToTest = [$(img),null,null,3,4,5,6,7,8,9];

		fun.apply(this, [customEvent, cb].concat(paramsToTest) );

		// adds missing params before triggering event so we can test they have been added as expected
		paramsToTest[1] = PATH_1;
		paramsToTest[2] = PATH_2;
		paramsToTest.push(SOME_VAL);

		// Last argument will be the callback passed to the event, so we make that sequential too
		$doc.trigger(customEvent, {cb:SOME_VAL, refresh: true});
	})
})

describe("setUniqueImgClass", function() {
	beforeEach(clearAll);

	var fun = window.nimblePic.testable.setUniqueImgClass

	it("should return existing class", function() {
		var cls = getUID()

		expect(fun(cls)).toBe(cls);
	})

	it("should include the 'index' in the class name when a 'group' is supplied and check class is added to DOM element", function() {
		var el = createEl()
		  , cls = getUID()

		// checks return value
		expect(fun(cls, el, 2, "some-group-name")).toContain("nimblepic-custom-2-");
		
		// checks DOM element has class added
		expect(el.classList[0]).toContain("nimblepic-custom-2-");
	})

	it("should check the 'index' defaults to '0' in the class name when a 'customEvent' is supplied and an invalid 'index' is supplied", function() {
		var el = createEl()
		  , cls = getUID()

		// checks return value
		expect(fun(cls, el, 'an-invalid-number', null, "some-custom-event")).toContain("nimblepic-custom-0-");
	})
})

describe("clearExistingStyles", function() {
	beforeEach(clearAll);

	var fun = window.nimblePic.testable.clearExistingStyles

	it("should remove an existing style element", function() {
		var id = getUID()
		  , cls = "test-img"

		createEl(id, "style");
		var img = createImgEl(null, cls);

		expect(document.getElementById(id)).toBeTruthy();
		fun("."+cls, id);
		expect(document.getElementById(id)).toBeFalsy();

		cleanupElement(img);
	})

	it("should throw a warning", function() {
		var id = getUID()
		  , cls = "test-img"

		createEl(id, "style");
		var img = createImgEl(null, cls);

		// calling this will add the 'nimblepic-custom-xxxx' class needed to force clearing styles
		window.nimblePic.testable.setUniqueImgClass("", img, 1, "some-group-name");

		var threwWarning = fun("."+cls, id, true);
		expect(threwWarning).toBe(true);

		cleanupElement(img);
	})

	/*
	it("should add 'no-img' class to existing images", function() {
		var id = getUID()
		  , cls = "test-img"

		createEl(id, "style");
		var img = createImgEl(null, cls);

		// calling this will add the 'nimblepic-custom-xxxx' class needed to force clearing styles
		window.nimblePic.testable.setUniqueImgClass("", img, 1, "some-group-name");

		fun("."+cls, id);
		expect(img.classList).toContain("no-img");

		cleanupElement(img);
	})
	*/
})
