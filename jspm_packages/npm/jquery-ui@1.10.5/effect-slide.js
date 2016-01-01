/* */ 
var jQuery = require('jquery');
require('./effect');
(function($, undefined) {
  $.effects.effect.slide = function(o, done) {
    var el = $(this),
        props = ["position", "top", "bottom", "left", "right", "width", "height"],
        mode = $.effects.setMode(el, o.mode || "show"),
        show = mode === "show",
        direction = o.direction || "left",
        ref = (direction === "up" || direction === "down") ? "top" : "left",
        positiveMotion = (direction === "up" || direction === "left"),
        distance,
        animation = {};
    $.effects.save(el, props);
    el.show();
    distance = o.distance || el[ref === "top" ? "outerHeight" : "outerWidth"](true);
    $.effects.createWrapper(el).css({overflow: "hidden"});
    if (show) {
      el.css(ref, positiveMotion ? (isNaN(distance) ? "-" + distance : -distance) : distance);
    }
    animation[ref] = (show ? (positiveMotion ? "+=" : "-=") : (positiveMotion ? "-=" : "+=")) + distance;
    el.animate(animation, {
      queue: false,
      duration: o.duration,
      easing: o.easing,
      complete: function() {
        if (mode === "hide") {
          el.hide();
        }
        $.effects.restore(el, props);
        $.effects.removeWrapper(el);
        done();
      }
    });
  };
})(jQuery);
