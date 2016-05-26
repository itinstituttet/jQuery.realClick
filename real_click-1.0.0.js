/*
 *  jQuery RealClick v.1.0.0
 *
 *  Copyright (c) 2016 IT Instituttet
 *  https://github.com/itinstituttet/jQuery.realClick
 *
 *  Licensed under MIT
 *
 */

(function ($) {
    var isTouchSupported = false;   // Does the client have touch input?
    var documentClick = false;      // Did the user really intend a click?
        
    // Only tests for different devices, that supposedly has touch but not a mouse 
    // TODO: Hacky way (not bulletproof)
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        //Touch is support if the ontouchend-event exists
        isTouchSupported = "ontouchend" in document;
    }

    // Presume the user is clicking when a touch starts
    $(document).on('touchstart', function() {
        documentClick = true;
    });

    // Cancel click if the touch is a touchmove
    $(document).on('touchmove', function() {
        documentClick = false;
    });

    // Plugin function
    $.fn.realClick = function(callback) {

        //When the user clicks the object
        this.on('click touchend', function (event) {
            // TODO: is stopPropagation and preventDefault correct to call?
            event.stopPropagation();
            event.preventDefault();

            //If user clicks on a non-touch-device, the click is intended
            if (event.type == "click" && !isTouchSupported) {
                documentClick = true;
            }

            //If the click is real execute callback function
            if (documentClick) {
                documentClick = false;  //reset documentClick

                //Make sure the callback is a function
                if (jQuery.isFunction(callback)) {
                    callback.call(this);    //Bring scope to callback
                }
            }
        });

        return this;    //Support chaining
    }
}(jQuery));
