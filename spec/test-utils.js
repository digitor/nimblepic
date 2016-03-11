"use strict";

// These utility functions are just intended to help with e2e and unit tests

(function () {
	var SELF, testUtils, NS = "nimblePic";

    var getUID = window.nimblePic.testable.getUID;

    testUtils = {
        createEl: function(id, type, cls, skipTest) {
            var styleEl = document.createElement(type);
            styleEl.setAttribute("id", id);
            document.body.appendChild(styleEl);

            var el = document.getElementById(id);

            if(cls) el.classList.add(cls);

            // just checking element was created
            if(!skipTest) expect(el.getAttribute("id")).toBe(id);

            return el;
        }

        ,getNewDivHeight: function(customCls, skipTest) {
            var tempDivId = getUID(".temp-div-")
              , divEl = SELF.createEl(tempDivId, "div", customCls, skipTest);
            
            return divEl.offsetHeight;
        }
    }
	
	SELF = window.testUtils = testUtils;
})();

