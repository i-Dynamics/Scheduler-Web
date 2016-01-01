/* */ 
var jQuery = require('jquery');
require('./effect');
(function($, undefined) {
  $.effects.effect.clip = function(o, done) {
    var el = $(this),
        props = ["position", "top", "bottom", "left", "right", "height", "width"],
        mode = $.effects.setMode(el, o.mode || "hide"),
        show = mode === "show",
        direction = o.direction || "vertical",
        vert = direction === "vertical",
        size = vert ? "height" : "width",
        position = vert ? "top" : "left",
        animation = {},
        wrapper,
        animate,
        distance;
    $.effects.save(el, props);
    el.show();
    wrapper = $.effects.createWrapper(el).css({overflow: "hidden"});
    animate = (el[0].tagName === "IMG") ? wrapper : el;
    distance = animate[size]();
    if (show) {
      animate.css(size, 0);
      animate.css(position, distance / 2);
    }
    animation[size] = show ? distance : 0;
    animation[position] = show ? 0 : distance / 2;
    animate.animate(animation, {
      queue: false,
      duration: o.duration,
      easing: o.easing,
      complete: function() {
        if (!show) {
          el.hide();
        }
        $.effects.restore(el, props);
        $.effects.removeWrapper(el);
        done();
      }
    });
  };
})(jQuery);
