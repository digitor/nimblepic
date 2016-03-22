"use strict";

// for unit tests
//var isJasmine = typeof jasmine !== "undefined";

(function () {
	var SELF
      , nimblePic
      , NS = "nimblePic"
      , CLS_NO_IMG = "no-img"
      , D_CUR_IMG_SRC = "current-image-src"
      , CLS_IS_IMG_LOADING = "is-imgloading"
      , CLS_IS_IMG_LOADED = "is-imgloaded";

	function getDynamicHeight(src, srcIsSelector, cb) {
        setTimeout(function () {

            if (srcIsSelector) src = $(src).css("background-image").replace("url(", "").replace(")", "").replace('"', '"').replace("'", "'");
            var img = new Image();
            img.onload = function () {
                //console.log( "image loaded", this.src);
                cb(src, true, this.height);
            }
            img.onerror = function () {
                if(!SELF.suppressWarnings) console.warn("image error", this.src);
                cb(src, false);
            }
            img.src = src;
        }, 100);
    }


    /**
     * @description Sets bg images on a `<span>` element, to replicate `<img>` element, but give control over image sizes at various media queries.
     * @param type (string) optional - either 'viewport' or 'density'. A null value will default 'viewport' (which is currently the only supported type anyway).
     */
    function responsiveImage(type, srcSm, srcMd, sel, heightSm, heightMd, heightLg, clearExisting, customID, grad, throwWarning, addNoImgClass) {
        
        if ( typeof Modernizr === "undefined" || Modernizr.cssgradients === undefined) {
            if(!SELF.suppressWarnings)
                console.warn("Utils.js", "responsiveImage", "'Modernizr.cssgradients' was not availale, which older browsers, such as ie9 need in order for this function to work properly.");
        }

        if (!Modernizr.cssgradients) grad = null;

        var css, id = customID || "nimblepic-styles";

        if( !type || type === "viewport" ) {

            if(!srcSm || !srcMd || !sel) {
                if(!SELF.suppressWarnings)
                    console.warn(NS, "responsiveImage", "You must define srcSm, srcMd & sel");
                return;
            }

	        if (clearExisting) clearExistingStyles(sel, id, throwWarning, addNoImgClass);

            // Style 1: No break point for tablet/desktop (default)
            css = sel + ' { background-image:' + (grad ? grad + "," : "") + 'url(' + srcMd + ')' + (grad ? "!important" : "") + ';';
            if (heightMd) css += 'height: ' + heightMd + 'px;';
            css += '}';

            
            // Style 2: Mobile devices get a break-point (srcSm)
            css += '@media only screen and (max-width: 767px) {';
            css += sel + ' {background-image:' + (grad ? grad + "," : "") + 'url(' + srcSm + ')' + (grad ? "!important" : "") + ';';
            if (heightSm) css += 'height: ' + heightSm + 'px;';
            css += '}';

            // this should be dynamic so gradient can be added with same logic as rest of images
            css += sel + '.no-mb { background-image: ' + (grad || "none") + (grad ? "!important" : "") + '; }';

            css += '}';


            // Style 2: If a large height is passed, still uses srcMd, but can specify another height
            if (heightLg) {
                css += '@media only screen and (min-width: 992px) {';
                css += sel + ' {';

                // if there's a gradient we need to redeclare background-image with the gradient, otherwise it will inherit it from Style 1.
                if(grad) css += 'background-image:' + grad + ',url(' + srcMd + ')' + (grad ? "!important" : "") + ';';
                
                css += 'height: ' + heightLg + 'px;';
                css += '}}';
            }
        }

        // TODO: Bases breakpoints on pixel density, rather than viewport width - same as `img srcset 2x`
        /*
        if( type === "density" ) {}
        */

        // Can't add media queries inline, so we attach style tags with JS
        addStyle(id, css);
        return id;
    }


    /*
     * For setting element heights at various media queries.
     */
    function responsiveHeight(justClear, customID, sel, heightSm, heightMd, heightLg, clearExisting, throwWarning, addNoImgClass) {

        var id = customID || "nimblepic-styles";

        if (justClear || clearExisting) {
            //console.log("removed", id, justClear, clearExisting);
            //debugger
            clearExistingStyles(sel, id, throwWarning, addNoImgClass);
            if(justClear) return;
        }

        var css = "";

        // defaults to srcMd (medium)
        if (heightMd) {
            css = sel + '{';
            css += 'height: ' + heightMd + 'px;';
            css += '}';
        }

        if (heightSm) {
            // smaller devices get srcSm (small)
            css += '@media only screen and (max-width: 767px) {';
            css += sel + '{';
            css += 'height: ' + heightSm + 'px;';
            css += '}}';
        }


        // If a large height is passed, still uses srcMd, but can specify another height
        if (heightLg) {
            css += '@media only screen and (min-width: 992px) {';
            css += sel + '{';
            css += 'height: ' + heightLg + 'px;';
            css += '}}';
        }

        /* Can't add media queries inline, so we attach style tag dynamically. */
        addStyle(id, css);
        return id;
    }


    /**
     * @description Adds "no-img" class to existing images queried using the suppied selector and removes the style element with the supplied ID.
     * @param sel (string) - Selector of the image elements that will be affected (checks their existence).
     * @param id (string) - ID of the style element to remove.
     * @param throwWarning (boolean) - Whether to throw a warning if images are found that would be affected.
     * @param addNoImgClass (boolean) - Whether to check for existing images with same selector and apply a "no-img" class to them.
     * @return (boolean) - If the warning was thrown (useful for tests).
     */
    function clearExistingStyles(sel, id, throwWarning, addNoImgClass) {
        var styleEl = document.getElementById(id)
          , elList = document.querySelectorAll(sel);
        
        var foundExisting = true;
        if(addNoImgClass) {
            foundExisting = false;
            var img, cls;
            for(var i = 0; i<elList.length; i++) {
                img = elList[0];

                for(var j=0; j<img.classList.length; j++) {
                    cls = img.classList[j];
                    if(cls.indexOf("-sibling") === cls.length - 8) {
                        //img.classList.remove(cls);
                        img.classList.add(CLS_NO_IMG);
                        //console.log("img.classList", img.classList);
                        foundExisting = true;
                        break;
                    }
                }
            }
        }

        throwWarning = !!(throwWarning && styleEl && foundExisting);

        if(throwWarning && !SELF.suppressWarnings)
            console.warn(NS, "clearExistingStyles()", "WARNING: You have cleared existing images with selector '"+sel+"' and style element of ID '" + id + "'.");

        if(styleEl) document.body.removeChild(styleEl);

        return throwWarning;
    }


    /**
     * @description Adds CSS to a style element with the given unique ID. If element already exists it will append it, otherwise it will create a new one after the opening body tag.
     * @param id (string) - ID to use on the style element
     * @param css (string) - Styles to add
     */
    function addStyle(id, css) {

        if ($("#" + id).length === 0) {
            var styleTag = '<style type="text/css" id="' + id + '" data-resp-styles >' + css + '</style>'
              , $existing = $("[data-resp-styles]");
            if ($existing.length) {
                $existing.last().after(styleTag);
            } else {
                $("body").prepend(styleTag);
            }
        } else {
            $("#" + id).append(css);
        }
    }


    /**
     * @description Utility for checking JS breakpoints, so they behave the same as CSS media query breakpoints.
     * @param breakName (string) - Possible values are "xs", "sm", "md", "lg".
     * @param isMoreThan (boolean) - whether or not to use ">" logic.
     * @param andIsEqual (boolean) - whether or not to use ">=" or "<=" logic (combines with isMoreThan).
     * @return (boolean) - whether window width fell below or above the specified break point.
     */
    function responsiveWidth(breakName, isMoreThan, andIsEqual) {
        var w = winWidth();

        var logic = function (val) {
            if (isMoreThan) {
                if (andIsEqual) return w >= val;
                return w > val;
            }
            
            if (andIsEqual) return w <= val;
            return w < val;
        }

        switch (breakName) {
            case "xs": return logic(480);
            case "sm": return logic(768);
            case "md": return logic(992);
            case "lg": return logic(1200);
        }
    }


    function getResponsiveWidth() {
        var w = winWidth();
        if (w < 480) return 'xs';
        if (w < 768) return 'sm';
        if (w < 992) return 'md';
        return 'lg';
    }


    /**
     * @description Get the width of the window including the scroll bars. If not supported (ie8 and below) will return width but scroll bars will affect the result.
     * @return (number/int) The width of the window including the scroll bars.
     */
    function winWidth() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    function getUID(pref) {
        var uid = (pref || "") + Math.random().toString().replace(".", "");

        // ensure starts with a letter, as CSS class names should not start with a number
        var firstChar = uid.substr(0,1);
        if( parseInt(firstChar).toString() !== "NaN" ) uid = "a-"+uid;

        return uid;
    }

    function setClearImgStyles($) {

        $(window).off("clear-img-styles").on("clear-img-styles", function (evt, data) {

            if (!data || !data.styleIds) return;

            for(var i = 0; i < data.styleIds.length; i++) {
                var styleEl = document.getElementById(data.styleIds[i]);
                if(styleEl)	                    document.body.removeChild( styleEl );
                else if(!SELF.suppressWarnings) console.warn(NS, "setClearImgStyles", "Couldn't find style element with ID " + data.styleIds[i] );
            }
        });
    }


    /**
     * @description Gets properties from the data attributes of the image (span) element.
     * @param img (HTML Element) - The image (span) element.
     */
    function getImgProps(img) {
        var srcSm = img.getAttribute("data-img-sm") || null
          , srcMd = img.getAttribute("data-img-md") || null;

        //console.log("getImgProps", img)

        // optional
        var hSm         = img.getAttribute("data-height-sm")
          , hMd         = img.getAttribute("data-height-md")
          , hLg         = img.getAttribute("data-height-lg")
          , customEvent = img.getAttribute("data-delay-image-load-event")
          , group       = img.getAttribute("data-img-group");

        if(hSm && parseInt(hSm).toString() !== "NaN") hSm = parseInt(hSm);
        else                                          hSm = null;

        if(hMd && parseInt(hMd).toString() !== "NaN") hMd = parseInt(hMd);
        else                                          hMd = null;

        if(hLg && parseInt(hLg).toString() !== "NaN") hLg = parseInt(hLg);
        else                                          hLg = null;

        return {
            srcSm: srcSm,
            srcMd: srcMd,
            hSm: hSm,
            hMd: hMd,
            hLg: hLg,
            customEvent: customEvent || null,
            group: group || null
        }
    }


    /**
     * @description Adds a loader element, if one doesn't already exist.
     * @param $img (jQuery element) - The parent element to add to.
     * @return (boolean) - Returns loading state, so 'true' if load is in progress.
     */
    function addLoader($img) {

        var img = $img[0];

        // if in process of loading or pending an event to be triggered, do nothing
        if (img.classList.contains(CLS_IS_IMG_LOADING)) return true;

        var ldrEl;
        if (!img.querySelector(".imgresp-ldr")) {
            ldrEl = document.createElement("span");
            ldrEl.classList.add("imgresp-ldr");
            img.appendChild(ldrEl);
            //$img.prepend('<span class="imgresp-ldr"></span>');
        }

        ldrEl = img.querySelector(".imgresp-ldr")
        
        var computedStyle = window.getComputedStyle(ldrEl);
        
        if(computedStyle.getPropertyValue("background-image").indexOf(".gif") !== -1)
            img.classList.add("is-gifldr");

        return false;
    }

    /**
     * @description Uses query selector to target a more specific class by using a parent class as well.
     * @param parentCls (string) - The class of a parent element. Doesn't have to be immediate parent.
     * @param cls (string) - The class of the target image (span) element.
     */
    function getSpecificSelector(parentCls, cls) {
        return (parentCls ? "." + parentCls + " " : "") + "." + cls;
    }

    /**
     * @description Uses the customStyleID passed in, unless it detects an invalid src ("invalidSrc"). Then it generates a new unique ID.
     * @param customStyleID (string) optional - The custom ID to use if src is valid. 
     * @param invalidSrc (boolean) - If true, means the src was not valid.
     * @param group (string) - Name of the group.
     * @param customEvent (string) - Name of the customEvent.
     * @return (string/null) - If src is valid and 'customStyleID' is falsy, will return null. Otherwise will return a unique id. If 'group' or 
     *    'customEvent' supplied, it will return those, with preference to the latter.
     */
    function getCustomStyleId(customStyleID, invalidSrc, group, customEvent) {
        var uid = getUID();

        // If loading from a custom event, must have it's own styleId (which is named same as the custom event), or else heights will get lost
        if (customEvent) return customEvent;
        if (group)       return group;

        return invalidSrc ? (customStyleID ? customStyleID + "-" + uid : 'nimblepic-styles-' + uid) : (customStyleID || null);
    }

    /**
     * @description If a group or customEvent exists, creates a new unique class name for each image (span) and returns it.
     * @param existingSel (string) - The existing class-based selector to use if no group or custom event exists.
     * @param img (HTML Element) - The image (span) element.
     * @param index (number) optional - Index within the group. Will default to zero if not supplied.
     * @param group (string) optional - Name of the group.
     * @param customEvent (string) optional - Name of the customEvent.
     * @return (string) - CSS class to use as a selector on the image.
     */
    function setUniqueImgClass(existingSel, img, index, group, customEvent) {

        if (customEvent || group) {
            if(typeof index !== "number") {
                if(!SELF.suppressWarnings)
                    console.warn(NS, "setUniqueImgClass", "Argument 'index' was not a valid number. Defaulting to '0'.");
                index = 0;
            }
            var uniqueCls = getUID("nimblepic-custom-" + index + "-");
            img.classList.add(uniqueCls);
            return "." + uniqueCls;
        }

        return existingSel;
    }


    /**
     * @description Checks if supplied image sources are valid.
     * @param srcSm (string/object) - Source path for the mobile image. Also accepts an object with properties 'srcSm' and 'srcMd'.
     * @param srcMd (string) optional - Source path for the tablet/desktop image. If srcSm is an object, this can be omitted.
     * @return (boolean) - If neither small nor medium src is valid, returns true, otherwise false
     */
    function isInvalidSrc(srcSm, srcMd) {
        // also accepts a proptery object as first arg
        if(typeof srcSm === "object") {
            //console.log("isInvalidSrc", srcSm)
            srcSm = srcSm.srcSm;
            srcMd = srcSm.srcMd;
        }
        
        // enforces strings
        if(typeof srcSm !== "string") srcSm = false;
        if(typeof srcMd !== "string") srcMd = false;

        return !srcSm && !srcMd;
    }

    /**
     * @description Checks if image is already loading or if the src is not valid at current breakpoint.
     * @param $img (jQuery Element) - The image (span) element.
     * @param srcSm (string) - Source path for the mobile image.
     * @param srcMd (string) - Source path for the tablet/desktop image.
     * @return (boolean) - If source is INVALID for current breakpoint, or if currently loading, returns true. Otherwise returns false. 
     */
    function isInvalidResponsiveSrc($img, srcSm, srcMd) {
        var breakPointSize = getResponsiveWidth()
          , invalidSrc = isInvalidSrc(srcSm, srcMd);

        if (invalidSrc) return true;

        var approvedSrc = (breakPointSize === 'sm' || breakPointSize === 'xs') ? srcSm : srcMd;

        //console.log("approvedSrc", approvedSrc)

        if (!approvedSrc || typeof approvedSrc !== "string") {
            $img[0].classList.add(CLS_NO_IMG);
            $img.data(D_CUR_IMG_SRC, null);
            return true; // if no image, stop here
        }

        // check if loaded already (or currently loading)
        var curImg = $img.data(D_CUR_IMG_SRC);
        if (curImg) {
            // do nothing if approved image is already loaded
            if (curImg === approvedSrc) return true;
        }

        return false;
    }

    function setCustomEventHandler(customEvent, cb, $img, srcSm, srcMd, specificSel, hSm, hMd, hLg, uid, styleId, group) {
        $(document).one(customEvent, function (evt, data) {

            if (data && data.refresh) {
                srcSm = $img.attr("data-img-sm");
                srcMd = $img.attr("data-img-md");
            }
            cb($img, srcSm, srcMd, specificSel, hSm, hMd, hLg, uid, styleId, group, data ? data.cb : null);
        });
    }

    /**
     * @description Resets the loading states, assuming a fresh image load was successful.
     * @param img (HTML Element) - The image (span) element.
     * @param state (string) optional - Either "loading" or "loaded". Omit this if you just want to clear all states.
     */
    function setLoadingStates(img, state) {
        img.classList.remove(CLS_NO_IMG);
        img.classList.remove(CLS_IS_IMG_LOADED);
        img.classList.remove(CLS_IS_IMG_LOADING);

        if(state === "loading")
            img.classList.add(CLS_IS_IMG_LOADING);
        else if(state === "loaded")
            img.classList.add(CLS_IS_IMG_LOADED);
    }


    nimblePic = {

        suppressWarnings: false

        /**
         * @description Searches DOM to find the '$container' and child elements of 'customCls' (these can be omitted to use defaults), 
         *   then starts loading images and setting heights based on data attributes for different responsive breakpoints.
         *
         * @param $ (jQuery global object) - Just a reference to the jQuery global object.
         *
         * $container (jQuery element/null) optional - If supplied, only children images (spans) of this element will be affected. Omit this to default to $(document).
         *
         * customCls (string/null) optional - If supplied, only image (span) elements will be affected. Omit this to use the default 'imgresp' class. Only use the default
         *   if you're calling this function once. Future calls should use custom classes, to avoid classes referencing the wrong images.
         *
         * customStyleID (string) optional - If suppied, will use this id on the dynamic <style> elements created. Keep in mind that calls to the function will remove styles
         *   previously attached to this ID. So if you're calling this function more than once on a page, you should pass this property with a new unique ID each time.
         *
         * parentCls (string) optional - Use this if you 'customCls' is not specific enough. Should be a class name of any parent element within the '$container'.
         *
         * loadedCB (function) optional - A callback when image has loaded. Useful when running tests.
         */
        , setImages: function ($, $container, customCls, customStyleID, parentCls, loadedCB) {

            setClearImgStyles($);

            var doClearImg = true
              , doClearEl = true
              , UID = getUID()
              , delayedImageEls = []

            var startLoading = function ($img, srcSm, srcMd, specificSel, hSm, hMd, hLg, uid, styleId, group, cb) {

                // stops late events from interfering
                if (uid !== UID) return;

                var breakPointSize = getResponsiveWidth()
                  , isMb = breakPointSize === 'sm' || breakPointSize === 'xs';

                var thisSrc = isMb ? srcSm : srcMd;

                // marks the image as "loading in progress", so other attempts to load it are blocked
                $img.data(D_CUR_IMG_SRC, thisSrc);

                getDynamicHeight(thisSrc, false, function (url, isSuccess, nativeHeight) {

                    var hSmall = hSm || nativeHeight
                      , hMedium = hMd || nativeHeight
                      , hLarge = hLg // large is optional, so should not fall back to native height
                      , throwWarning = false // don't throw warning because 'responsiveHeight' has already set the style id
                      , clearStyles = group ? false : true // we must clear out the styles set earlier by 'responsiveHeight'.
                      , addNoImgClass = false; // this already happens in 'responsiveHeight' so don't want to do it again

                    setLoadingStates($img[0], "loaded");

                    if (isSuccess) {
                        var grad = $img.attr("data-grad") || null;
                        responsiveImage(null, srcSm, srcMd, specificSel, hSmall, hMedium, hLarge, clearStyles, styleId, grad, throwWarning, addNoImgClass);
                        $img.removeClass(CLS_NO_IMG);
                    } else {
                        // if image failed to load, still add it's heights to the styles id for this group
                        responsiveHeight(false, styleId, specificSel, hSm, hMd, hLg, clearStyles, throwWarning, addNoImgClass);
                        $img.addClass(CLS_NO_IMG);
                    }

                    // actual height with media queries applied
                    var computedHeight = isMb ? hSmall : hMedium;
                    if(breakPointSize === 'lg' && hLarge) computedHeight = hLarge;

                    if (cb) cb(isSuccess, url, $img[0], computedHeight, nativeHeight);
                    if( loadedCB ) loadedCB(isSuccess, url, $img[0], computedHeight, nativeHeight);
                });
            }

            if (!customCls) customCls = "imgresp";
            if (!$container) $container = $(document);

            $(function () { // Uses DOM Ready to ensure all html elements in $container exist
                var prp, singleCls, $img;

                //console.log("image count", $container.find("." + customCls).length);
                $container.find("." + customCls).each(function (i) {
                    
                    prp = getImgProps(this);

                    if(!prp.srcSm || !prp.srcMd) {
                        if(!SELF.suppressWarnings)
                            console.warn(NS, "setImages()", "Data attributes 'data-img-sm' and 'data-img-md' were not set. These are mandatory. Adding 'no-img' class to element ", this)
                        this.classList.add(CLS_NO_IMG);
                        addLoader($(this));
                        return
                    }

                    singleCls = customCls + "-" + i + "-sibling";
                    this.classList.add(singleCls);
                    
                    $img = $container.find("." + singleCls)

                    // if in process of loading or pending an event to be triggered, do nothing
                    var isLoading = addLoader($img);
                    if(isLoading) return;


                    if (prp.srcSm && prp.srcSm !== "" && prp.srcSm === prp.srcMd) {
                        if(!SELF.suppressWarnings)
                            console.warn(NS, "setImages()", "'srcSm' and 'srcMd' must not be the same url! Placeholder image will be used.", prp.srcSm);
                    }


                    var invalidSrc = isInvalidSrc(prp)
                      , specificSel = getSpecificSelector(parentCls, singleCls)
                      , styleId = getCustomStyleId(customStyleID, invalidSrc, prp.group, prp.customEvent);

                    // TODO: need to verify this what this is useful for, with regards to group and customEvent
                    specificSel = setUniqueImgClass(specificSel, $img[0], i, prp.group, prp.customEvent);
                    
                    // TODO: need to verify if this should come after 'setUniqueImgClass' or before, with regards to group and customEvent
                    responsiveHeight(false, styleId, specificSel, prp.hSm, prp.hMd, prp.hLg, doClearEl, true, true);

                    // This means that the first item in the loop will clear existing styles associated with this styleId
                    doClearImg = false;

                    invalidSrc = isInvalidResponsiveSrc($img, prp.srcSm, prp.srcMd);
                    if (invalidSrc) return;
                    
                    setLoadingStates(this, "loading");
                   

                    if (prp.customEvent) {
                        //console.log(NS, "specificSel", specificSel)
                        setCustomEventHandler(prp.customEvent, startLoading, $img, prp.srcSm, prp.srcMd, specificSel, prp.hSm, prp.hMd, prp.hLg, UID, styleId, prp.group);
                    } else {
                        //console.log("prp", prp)
                        startLoading($img, prp.srcSm, prp.srcMd, specificSel, prp.hSm, prp.hMd, prp.hLg, UID, styleId, prp.group, null);
                    }
                
                });
            });
        }

        , testable: {
        	getDynamicHeight: getDynamicHeight
        	, getResponsiveWidth: getResponsiveWidth
        	, winWidth: winWidth
        	, getUID: getUID
            , addStyle: addStyle
            , responsiveWidth: responsiveWidth
            , responsiveHeight: responsiveHeight
            , responsiveImage: responsiveImage
            , setClearImgStyles: setClearImgStyles
            , getImgProps: getImgProps
            , addLoader: addLoader
            , getSpecificSelector: getSpecificSelector
            , getCustomStyleId: getCustomStyleId
            , isInvalidSrc: isInvalidSrc
            , isInvalidResponsiveSrc: isInvalidResponsiveSrc
            , setCustomEventHandler: setCustomEventHandler
            , setUniqueImgClass: setUniqueImgClass
            , clearExistingStyles: clearExistingStyles
        }
    }

	// for unit tests
	//if (isJasmine)	module.exports = nimblePic;
	//else			
		SELF = window.nimblePic = nimblePic;
})();

