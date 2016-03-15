"use strict";

// for unit tests
//var isJasmine = typeof jasmine !== "undefined";

(function () {
	var SELF, nimblePic, NS = "nimblePic";

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

    nimblePic = {


        /*
         * Utils generally have no dependencies, so here we just pass in an instance of jQuery
         * CSS should also be applied to these images, such as `min-height`, `background-repeat: no-repeat;`, but that's up to the individual case.
         */
        setResponsiveAllImages: function ($, $container, customCls, customStyleID, parentCls) {
            // On DOM Ready

            setClearImgStyles($);

            var doClearImg = true
              , doClearEl = true
              , UID = SELF.getUID()
              , delayedImageEls = []
              , CLS_IS_IMG_LOADING = "is-imgloading"
              , CLS_IS_IMG_LOADED = "is-imgloaded"
              , CLS_NO_IMG = "no-img"
              , D_CUR_IMG = "current-image"

            var startLoading = function (type, $img, srcSm, srcMd, sel, hSm, hMd, hLg, breakPointSize, uid, cb, styleId) {

                // stops late events from interfering
                if (uid !== UID) return;

                var thisSrc = breakPointSize === 'sm' ? srcSm : srcMd
                  , selector = (parentCls ? "." + parentCls + " " : "") + "." + sel;
                
                styleId = styleId || customStyleID;

                // need to determine the src beforehand if we want to preload (based on the window width)
                $img.data(D_CUR_IMG, thisSrc);

                
                SELF.getDynamicHeight(thisSrc, false, function (url, isSuccess, height) {

                    // DOM takes a little while to update for some reason, event though image CSS has been added. Timeout stops loader fading out fraction too early
                    //setTimeout(function () {
                        //$img.prepareTransition().removeClass(CLS_IS_IMG_LOADING);
                        $img.removeClass(CLS_IS_IMG_LOADING);
                        $img.addClass(CLS_IS_IMG_LOADED);
                   // }, 100);

                    if (isSuccess) {

                        // Clear predefined heights, but only if image was loaded successfully. Wait awhile so that all images should have loaded by then
                        //setTimeout(function () {
                        //    SELF.responsiveHeight(true, styleId);
                        //}, 10000);

                        var heightSm = hSm || height
                          , heightMd = hMd || height
                          , heightLg = hLg || height;
                        
                        var grad = $img.attr("data-grad") || null;
                        SELF.responsiveImage(type, srcSm, srcMd, selector, heightSm, heightMd, heightLg, doClearImg, styleId, grad);
                    } else {
                        // if image failed to load, still add it's heights to the styles id for this group
                        SELF.responsiveHeight(false, styleId || 'imgresp-styles', selector, hSm, hMd, hLg, doClearImg);
                        $img.addClass(CLS_NO_IMG);
                    }
                    doClearImg = false; // just clears the first time
                    if (cb) cb(isSuccess);
                });
            }

            if (!customCls) customCls = "imgresp";
            if (!$container) $container = $(document);

            $(function () {
                var type = "viewport", $th, srcSm, srcMd, sel, hSm, hMd, hLg, $img;//, isDynamicHeight;
                var breakPointSize = SELF.getResponsiveWidth();
                
                var $list = $container.find("." + customCls)
                  , total = $list.length;
                $list.each(function (i) {
                    $th = $(this);

                    // mandatory
                    srcSm = $th.attr("data-img-sm");
                    srcMd = $th.attr("data-img-md");

                    if (srcSm && srcSm !== "" && srcSm === srcMd)
                    	console.warn("Utils.js -> setResponsiveAllImages()", "'srcSm' and 'srcMd' must not be the same url!", srcSm);
                    

                    // optional
                    hSm = $th.attr("data-height-sm") || null;
                    hMd = $th.attr("data-height-md") || null;
                    hLg = $th.attr("data-height-lg") || null;

                    sel = customCls + "-" + i;
                    $th.addClass(sel);

                    
                    $img = $("." + sel);

                    // if in process of loading or pending an event to be triggered, do nothing
                    if ($img.hasClass(CLS_IS_IMG_LOADING)) return;

                    if ($img.find(".imgresp-ldr").length === 0)
                        $img.prepend('<span class="imgresp-ldr"></span>');

                    var noSrc = !srcSm && !srcMd
                      , customEvent = $img.attr("data-delay-image-load-event")
                      , group = $img.attr("data-img-group");

                    // if no image set, still set the heights
                    var selector = (parentCls ? "." + parentCls + " " : "") + "." + sel
                      , styleId = noSrc ? (customStyleID ? customStyleID + "-" + SELF.getUID() : 'imgresp-styles-' + SELF.getUID()) : customStyleID;

                    // If loading from a custom event, must have it's own styleId (which is named same as the custom event), or else heights will get lost when 
                    if (group) styleId = group;
                    if (customEvent) styleId = customEvent;

                    if (customEvent || group) {
                        var thisUID = SELF.getUID();
                        var uniqueCls = "imgresp-" + i + "-" + thisUID;
                        $img.addClass(uniqueCls);
                        sel = uniqueCls;
                        //styleId = "imgresp-custom-event-" + thisUID;
                    }

                    SELF.responsiveHeight(false, styleId, selector, hSm, hMd, hLg, doClearEl);

                    if (group)                  doClearEl = false;
                    if (!noSrc && !customEvent) doClearEl = false;

                    if (noSrc) return;

                    var approvedSrc = breakPointSize === 'sm' ? srcSm : srcMd;

                    /*if (customEvent) {
                        (function ($img) {
                            // Custom events are really just meant to be used for items that are added dynamically, so can be ignored on resize
                            setTimeout(function () {
                                $img.attr("data-delay-image-load-event", null);
                            }, 0);
                        })($img);
                    }*/

                    if (!approvedSrc) {
                        $img.addClass(CLS_NO_IMG);
                        $img.data(D_CUR_IMG, null);
                        return; // if no image, stop here
                    }


                    var curImg = $img.data(D_CUR_IMG);
                    if (curImg) {
                        // do nothing if approved image is already loaded
                        if (curImg === approvedSrc) return;
                    }

                    
                    $img.removeClass(CLS_NO_IMG);
                    $img.removeClass(CLS_IS_IMG_LOADED);
                    $img.addClass(CLS_IS_IMG_LOADING);

                    if (customEvent) {
                        // Needs closure so props stay in sync
                        (function ($img, srcSm, srcMd, sel, hSm, hMd, hLg, styleId) {
                            
                            $(window).one(customEvent, function (evt, data) {

                                if (data && data.refresh) {
                                    srcSm = $img.attr("data-img-sm");
                                    srcMd = $img.attr("data-img-md");
                                }
                                //console.log("customEvent", customEvent, type, $img, srcSm, srcMd, sel, hSm, hMd, hLg, breakPointSize, UID);
                                startLoading(type, $img, srcSm, srcMd, sel, hSm, hMd, hLg, breakPointSize, UID, data ? data.cb : null, styleId);
                            });
                        })($img, srcSm, srcMd, sel, hSm, hMd, hLg, styleId);
                    } else {
                        startLoading(type, $img, srcSm, srcMd, sel, hSm, hMd, hLg, breakPointSize, UID, null, styleId);
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
        }
    }

	// for unit tests
	//if (isJasmine)	module.exports = nimblePic;
	//else			
		SELF = window.nimblePic = nimblePic;
})();

