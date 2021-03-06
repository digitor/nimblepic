"use strict";

// These utility functions are just intended to help with e2e and unit tests

(function () {
	var SELF, testUtils, NS = "nimblePic";

    var getUID = window.nimblePic.testable.getUID;

    testUtils = {
        createEl: function(id, type, cls, skipTest, container) {

            if(!id) id = getUID();
            if(!type) type = "div";

            var el = document.createElement(type);
            el.setAttribute("id", id);

            if(!container) container = document.body;

            container.appendChild(el);

            el = document.getElementById(id);

            if(cls) el.classList.add(cls);

            // just checking element was created
            if(!skipTest) expect(el.getAttribute("id")).toBe(id);

            return el;
        }

        ,createImgEl: function(id, cls, container) {
            var el = SELF.createEl(id, "span", cls, null, container);
            el.classList.add("nimpic");
            return el;
        }

        ,createStyleEl: function(id) {
            var el = createEl(id, "style");
            el.setAttribute("data-resp-styles", "");
            return el;
        }

        ,getNewDivHeight: function(customCls, skipTest) {
            var tempDivId = getUID(".temp-div-")
              , divEl = SELF.createEl(tempDivId, "div", customCls, skipTest);
            
            return divEl.offsetHeight;
        }

        // el can be an ID as well as an actual DOM element
        , cleanupElement: function(el) {
            if(typeof el === "string") el = document.getElementById(el);
            el.parentElement.removeChild(el);
        }

        // el can be an ID as well as an actual DOM element
        , getCompProp: function(el, prop) {
            if(typeof el === "string") el = document.getElementById(el);
            var comp = window.getComputedStyle(el);
            return comp.getPropertyValue(prop);
        }
    }
	
	SELF = window.testUtils = testUtils;
})();

