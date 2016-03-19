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
                console.log( "image loaded", this.src);
                cb(src, true, this.height);
            }
            img.onerror = function () {
                console.log("image error", this.src);
                cb(src, false);
            }
            img.src = src;
        }, 100);
    }


    /**
     * @description Sets bg images on a `<span>` element, to replicate `<img>` element, but give control over image sizes at various media queries.
     * @param type (string) optional - either 'viewport' or 'density'. A null value will default 'viewport' (which is currently the only supported type anyway).
     */
    function responsiveImage(type, srcSm, srcMd, sel, heightSm, heightMd, heightLg, clearExisting, customID, grad) {
        
        if ( typeof Modernizr === "undefined" || Modernizr.cssgradients === undefined)
            console.warn("Utils.js", "responsiveImage", "'Modernizr.cssgradients' was not availale, which older browsers, such as ie9 need in order for this function to work properly.");

        if (!Modernizr.cssgradients) grad = null;

        var css, id = customID || "imgresp-styles";

        if( !type || type === "viewport" ) {

            if(!srcSm || !srcMd || !sel) {
                console.warn(NS, "responsiveImage", "You must define srcSm, srcMd & sel");
                return;
            }

	        if (clearExisting) $("#" + id).remove();

            // defaults to srcMd (medium)
            css = sel + ' { background-image:' + (grad ? grad + "," : "") + 'url(' + srcMd + ')' + (grad ? "!important" : "") + ';';
            if (heightMd) css += 'height: ' + heightMd + 'px;';
            css += '}';

        
            // smaller devices get srcSm (small)
            css += '@media only screen and (max-width: 767px) {';
            css += sel + ' {background-image:' + (grad ? grad + "," : "") + 'url(' + srcSm + ')' + (grad ? "!important" : "") + ';';
            if (heightSm) css += 'height: ' + heightSm + 'px;';
            css += '}';
            css += sel + '.no-mb { background-image: ' + (grad || "none") + (grad ? "!important" : "") + '; }';
            css += '}';


            // If a large height is passed, still uses srcMd, but can specify another height
            if (heightLg) {
                css += '@media only screen and (min-width: 992px) {';
                css += 'height: ' + heightLg + 'px;';
                css += '}}';
            }
        }

        // Bases breakpoints on pixel density, rather than viewport width - same as `img srcset 2x`
        /* TODO
        if( type === "density" ) {

            var css = sel + ' {' +
                                'background-image:' + (grad ? grad + "," : "") + 'url(' + srcSm + ')' + (grad ? "!important" : "") + ';' +
                            '}';
        
            css += '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dppx) {' +
                        sel + ' {' +
                            'background-image:' + (grad ? grad + "," : "") + 'url(' + srcMd + ')' + (grad ? "!important" : "") + ';' +
                        '}' +
                    '}';
        }
        */

        /* Can't add media queries inline, so we attach style tag dynamically. */
        addStyle(id, css);
        return id;
    }


    /*
     * For setting element heights at various media queries.
     */
    function responsiveHeight(justClear, customID, sel, heightSm, heightMd, heightLg, clearExisting) {

        var id = customID || "elresp-styles";

        if (justClear || clearExisting) {
            //console.log("removed", id, justClear, clearExisting);
            //debugger
            $("#" + id).remove();
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
     * @description Adds CSS to a style element with the given unique ID. If element already exists it will append it, otherwise it will create a new one after the opening body tag.
     * @param id (string) - ID to use on the style element
     * @param id (string) - Styles to add
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
                if(styleEl)	document.body.removeChild( styleEl );
                else 		console.warn(NS, "setClearImgStyles", "Couldn't find style element with ID " + data.styleIds[i] );
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
        // if in process of loading or pending an event to be triggered, do nothing
        if ($img.hasClass(CLS_IS_IMG_LOADING)) return true;

        if ($img.find(".imgresp-ldr").length === 0)
            $img.prepend('<span class="imgresp-ldr"></span>');

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

        return invalidSrc ? (customStyleID ? customStyleID + "-" + uid : 'imgresp-styles-' + uid) : (customStyleID || null);
    }

    /**
     * @description If a group or customEvent exists, creates a new unique class name for each image (span) and returns it.
     * @param existingCls (string) - The existing class selector to use if no group or custom event exists.
     * @param img (HTML Element) - The image (span) element.
     * @param group (string) - Name of the group.
     * @param customEvent (string) - Name of the customEvent.
     * @return (string) - CSS class to use as a selector on the image.
     */
    function setUniqueImgClass(existingCls, img, group, customEvent) {

        if (customEvent || group) {
            var uniqueCls = "imgresp-" + i + "-" + getUID();
            img.classList.add(uniqueCls);
            return uniqueCls;
        }

        return existingCls;
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

    function setCustomEventHandler(customEvent, cb, $img, srcSm, srcMd, specificSel, hSm, hMd, hLg, uid, styleId) {
        $(document).one(customEvent, function (evt, data) {

            if (data && data.refresh) {
                srcSm = $img.attr("data-img-sm");
                srcMd = $img.attr("data-img-md");
            }
            cb($img, srcSm, srcMd, specificSel, hSm, hMd, hLg, uid, styleId, data ? data.cb : null);
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
         */
        setImages: function ($, $container, customCls, customStyleID, parentCls) {

            setClearImgStyles($);

            var doClearImg = true
              , doClearEl = true
              , UID = getUID()
              , delayedImageEls = []

            var startLoading = function ($img, srcSm, srcMd, specificSel, hSm, hMd, hLg, uid, styleId, cb) {

                // stops late events from interfering
                if (uid !== UID) return;

                var breakPointSize = getResponsiveWidth();

                var thisSrc = breakPointSize === 'sm' ? srcSm : srcMd;

                // marks the image as "loading in progress", so other attempts to load it are blocked
                $img.data(D_CUR_IMG_SRC, thisSrc);
                
                getDynamicHeight(thisSrc, false, function (url, isSuccess, height) {

                    setLoadingStates($img[0], "loaded");

                    if (isSuccess) {
                        var grad = $img.attr("data-grad") || null;
                        responsiveImage(null, srcSm, srcMd, specificSel, (hSm || height), (hMd || height), (hLg || height), doClearImg, styleId, grad);
                    } else {
                        // if image failed to load, still add it's heights to the styles id for this group
                        responsiveHeight(false, styleId || 'imgresp-styles', specificSel, hSm, hMd, hLg, doClearImg);
                        $img.addClass(CLS_NO_IMG);
                    }
                    doClearImg = false; // just clears the first time
                    if (cb) cb(isSuccess);
                });
            }

            if (!customCls) customCls = "imgresp";
            if (!$container) $container = $(document);

            $(function () { // Uses DOM Ready to ensure all html elements in $container exist
                var prp, singleCls, $img;

                $container.find("." + customCls).each(function (i) {
                    
                    prp = getImgProps(this);

                    singleCls = customCls + "-" + i;
                    this.classList.add(singleCls);
                    
                    $img = $("." + singleCls);

                    // if in process of loading or pending an event to be triggered, do nothing
                    var isLoading = addLoader($img);
                    if(isLoading) return;


                    if (prp.srcSm && prp.srcSm !== "" && prp.srcSm === prp.srcMd)
                    	console.warn("Utils.js -> setImages()", "'srcSm' and 'srcMd' must not be the same url! Placeholder image will be used.", prp.srcSm);


                    var invalidSrc = isInvalidSrc(prp)
                      , specificSel = getSpecificSelector(parentCls, singleCls)
                      , styleId = getCustomStyleId(customStyleID, invalidSrc, prp.group, prp.customEvent);

                    // TODO: need to verify this what this is useful for, with regards to group and customEvent
                    specificSel = setUniqueImgClass(specificSel, $img[0], prp.group, prp.customEvent);
                    
                    // TODO: need to verify if this should come after 'setUniqueImgClass' or before, with regards to group and customEvent
                    responsiveHeight(false, styleId, specificSel, prp.hSm, prp.hMd, prp.hLg, doClearEl);

                    /**
                     * If you're using a group, or there no custom event being used, this sets the 'doClearEl' flag to false. 
                     * This means that the first item in the loop will clear existing styles associated with this group 
                     * (or the generic ID within 'responsiveHeight()' method) and the rest will get appended to the same style element.
                     */
                    if (prp.group)                       doClearEl = false;
                    if (!invalidSrc && !prp.customEvent) doClearEl = false;

                    invalidSrc = isInvalidResponsiveSrc($img, prp.srcSm, prp.srcMd);
                    if (invalidSrc) return;
                    
                    setLoadingStates(this, "loading");

                    if (prp.customEvent) {
                        setCustomEventHandler(customEvent, startLoading, $img, prp.srcSm, prp.srcMd, specificSel, prp.hSm, prp.hMd, prp.hLg, UID, styleId);
                    } else {
                        startLoading($img, prp.srcSm, prp.srcMd, specificSel, prp.hSm, prp.hMd, prp.hLg, UID, styleId, null);
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
        }
    }

	// for unit tests
	//if (isJasmine)	module.exports = nimblePic;
	//else			
		SELF = window.nimblePic = nimblePic;
})();

