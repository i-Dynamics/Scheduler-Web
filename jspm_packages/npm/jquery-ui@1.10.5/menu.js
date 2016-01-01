/* */ 
var jQuery = require('jquery');
require('./core');
require('./widget');
require('./position');
(function($, undefined) {
  $.widget("ui.menu", {
    version: "1.10.4",
    defaultElement: "<ul>",
    delay: 300,
    options: {
      icons: {submenu: "ui-icon-carat-1-e"},
      menus: "ul",
      position: {
        my: "left top",
        at: "right top"
      },
      role: "menu",
      blur: null,
      focus: null,
      select: null
    },
    _create: function() {
      this.activeMenu = this.element;
      this.mouseHandled = false;
      this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({
        role: this.options.role,
        tabIndex: 0
      }).bind("click" + this.eventNamespace, $.proxy(function(event) {
        if (this.options.disabled) {
          event.preventDefault();
        }
      }, this));
      if (this.options.disabled) {
        this.element.addClass("ui-state-disabled").attr("aria-disabled", "true");
      }
      this._on({
        "mousedown .ui-menu-item > a": function(event) {
          event.preventDefault();
        },
        "click .ui-state-disabled > a": function(event) {
          event.preventDefault();
        },
        "click .ui-menu-item:has(a)": function(event) {
          var target = $(event.target).closest(".ui-menu-item");
          if (!this.mouseHandled && target.not(".ui-state-disabled").length) {
            this.select(event);
            if (!event.isPropagationStopped()) {
              this.mouseHandled = true;
            }
            if (target.has(".ui-menu").length) {
              this.expand(event);
            } else if (!this.element.is(":focus") && $(this.document[0].activeElement).closest(".ui-menu").length) {
              this.element.trigger("focus", [true]);
              if (this.active && this.active.parents(".ui-menu").length === 1) {
                clearTimeout(this.timer);
              }
            }
          }
        },
        "mouseenter .ui-menu-item": function(event) {
          var target = $(event.currentTarget);
          target.siblings().children(".ui-state-active").removeClass("ui-state-active");
          this.focus(event, target);
        },
        mouseleave: "collapseAll",
        "mouseleave .ui-menu": "collapseAll",
        focus: function(event, keepActiveItem) {
          var item = this.active || this.element.children(".ui-menu-item").eq(0);
          if (!keepActiveItem) {
            this.focus(event, item);
          }
        },
        blur: function(event) {
          this._delay(function() {
            if (!$.contains(this.element[0], this.document[0].activeElement)) {
              this.collapseAll(event);
            }
          });
        },
        keydown: "_keydown"
      });
      this.refresh();
      this._on(this.document, {click: function(event) {
          if (!$(event.target).closest(".ui-menu").length) {
            this.collapseAll(event);
          }
          this.mouseHandled = false;
        }});
    },
    _destroy: function() {
      this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show();
      this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function() {
        var elem = $(this);
        if (elem.data("ui-menu-submenu-carat")) {
          elem.remove();
        }
      });
      this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content");
    },
    _keydown: function(event) {
      var match,
          prev,
          character,
          skip,
          regex,
          preventDefault = true;
      function escape(value) {
        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
      }
      switch (event.keyCode) {
        case $.ui.keyCode.PAGE_UP:
          this.previousPage(event);
          break;
        case $.ui.keyCode.PAGE_DOWN:
          this.nextPage(event);
          break;
        case $.ui.keyCode.HOME:
          this._move("first", "first", event);
          break;
        case $.ui.keyCode.END:
          this._move("last", "last", event);
          break;
        case $.ui.keyCode.UP:
          this.previous(event);
          break;
        case $.ui.keyCode.DOWN:
          this.next(event);
          break;
        case $.ui.keyCode.LEFT:
          this.collapse(event);
          break;
        case $.ui.keyCode.RIGHT:
          if (this.active && !this.active.is(".ui-state-disabled")) {
            this.expand(event);
          }
          break;
        case $.ui.keyCode.ENTER:
        case $.ui.keyCode.SPACE:
          this._activate(event);
          break;
        case $.ui.keyCode.ESCAPE:
          this.collapse(event);
          break;
        default:
          preventDefault = false;
          prev = this.previousFilter || "";
          character = String.fromCharCode(event.keyCode);
          skip = false;
          clearTimeout(this.filterTimer);
          if (character === prev) {
            skip = true;
          } else {
            character = prev + character;
          }
          regex = new RegExp("^" + escape(character), "i");
          match = this.activeMenu.children(".ui-menu-item").filter(function() {
            return regex.test($(this).children("a").text());
          });
          match = skip && match.index(this.active.next()) !== -1 ? this.active.nextAll(".ui-menu-item") : match;
          if (!match.length) {
            character = String.fromCharCode(event.keyCode);
            regex = new RegExp("^" + escape(character), "i");
            match = this.activeMenu.children(".ui-menu-item").filter(function() {
              return regex.test($(this).children("a").text());
            });
          }
          if (match.length) {
            this.focus(event, match);
            if (match.length > 1) {
              this.previousFilter = character;
              this.filterTimer = this._delay(function() {
                delete this.previousFilter;
              }, 1000);
            } else {
              delete this.previousFilter;
            }
          } else {
            delete this.previousFilter;
          }
      }
      if (preventDefault) {
        event.preventDefault();
      }
    },
    _activate: function(event) {
      if (!this.active.is(".ui-state-disabled")) {
        if (this.active.children("a[aria-haspopup='true']").length) {
          this.expand(event);
        } else {
          this.select(event);
        }
      }
    },
    refresh: function() {
      var menus,
          icon = this.options.icons.submenu,
          submenus = this.element.find(this.options.menus);
      this.element.toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length);
      submenus.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({
        role: this.options.role,
        "aria-hidden": "true",
        "aria-expanded": "false"
      }).each(function() {
        var menu = $(this),
            item = menu.prev("a"),
            submenuCarat = $("<span>").addClass("ui-menu-icon ui-icon " + icon).data("ui-menu-submenu-carat", true);
        item.attr("aria-haspopup", "true").prepend(submenuCarat);
        menu.attr("aria-labelledby", item.attr("id"));
      });
      menus = submenus.add(this.element);
      menus.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "presentation").children("a").uniqueId().addClass("ui-corner-all").attr({
        tabIndex: -1,
        role: this._itemRole()
      });
      menus.children(":not(.ui-menu-item)").each(function() {
        var item = $(this);
        if (!/[^\-\u2014\u2013\s]/.test(item.text())) {
          item.addClass("ui-widget-content ui-menu-divider");
        }
      });
      menus.children(".ui-state-disabled").attr("aria-disabled", "true");
      if (this.active && !$.contains(this.element[0], this.active[0])) {
        this.blur();
      }
    },
    _itemRole: function() {
      return {
        menu: "menuitem",
        listbox: "option"
      }[this.options.role];
    },
    _setOption: function(key, value) {
      if (key === "icons") {
        this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(value.submenu);
      }
      this._super(key, value);
    },
    focus: function(event, item) {
      var nested,
          focused;
      this.blur(event, event && event.type === "focus");
      this._scrollIntoView(item);
      this.active = item.first();
      focused = this.active.children("a").addClass("ui-state-focus");
      if (this.options.role) {
        this.element.attr("aria-activedescendant", focused.attr("id"));
      }
      this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active");
      if (event && event.type === "keydown") {
        this._close();
      } else {
        this.timer = this._delay(function() {
          this._close();
        }, this.delay);
      }
      nested = item.children(".ui-menu");
      if (nested.length && event && (/^mouse/.test(event.type))) {
        this._startOpening(nested);
      }
      this.activeMenu = item.parent();
      this._trigger("focus", event, {item: item});
    },
    _scrollIntoView: function(item) {
      var borderTop,
          paddingTop,
          offset,
          scroll,
          elementHeight,
          itemHeight;
      if (this._hasScroll()) {
        borderTop = parseFloat($.css(this.activeMenu[0], "borderTopWidth")) || 0;
        paddingTop = parseFloat($.css(this.activeMenu[0], "paddingTop")) || 0;
        offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
        scroll = this.activeMenu.scrollTop();
        elementHeight = this.activeMenu.height();
        itemHeight = item.height();
        if (offset < 0) {
          this.activeMenu.scrollTop(scroll + offset);
        } else if (offset + itemHeight > elementHeight) {
          this.activeMenu.scrollTop(scroll + offset - elementHeight + itemHeight);
        }
      }
    },
    blur: function(event, fromFocus) {
      if (!fromFocus) {
        clearTimeout(this.timer);
      }
      if (!this.active) {
        return;
      }
      this.active.children("a").removeClass("ui-state-focus");
      this.active = null;
      this._trigger("blur", event, {item: this.active});
    },
    _startOpening: function(submenu) {
      clearTimeout(this.timer);
      if (submenu.attr("aria-hidden") !== "true") {
        return;
      }
      this.timer = this._delay(function() {
        this._close();
        this._open(submenu);
      }, this.delay);
    },
    _open: function(submenu) {
      var position = $.extend({of: this.active}, this.options.position);
      clearTimeout(this.timer);
      this.element.find(".ui-menu").not(submenu.parents(".ui-menu")).hide().attr("aria-hidden", "true");
      submenu.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(position);
    },
    collapseAll: function(event, all) {
      clearTimeout(this.timer);
      this.timer = this._delay(function() {
        var currentMenu = all ? this.element : $(event && event.target).closest(this.element.find(".ui-menu"));
        if (!currentMenu.length) {
          currentMenu = this.element;
        }
        this._close(currentMenu);
        this.blur(event);
        this.activeMenu = currentMenu;
      }, this.delay);
    },
    _close: function(startMenu) {
      if (!startMenu) {
        startMenu = this.active ? this.active.parent() : this.element;
      }
      startMenu.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find("a.ui-state-active").removeClass("ui-state-active");
    },
    collapse: function(event) {
      var newItem = this.active && this.active.parent().closest(".ui-menu-item", this.element);
      if (newItem && newItem.length) {
        this._close();
        this.focus(event, newItem);
      }
    },
    expand: function(event) {
      var newItem = this.active && this.active.children(".ui-menu ").children(".ui-menu-item").first();
      if (newItem && newItem.length) {
        this._open(newItem.parent());
        this._delay(function() {
          this.focus(event, newItem);
        });
      }
    },
    next: function(event) {
      this._move("next", "first", event);
    },
    previous: function(event) {
      this._move("prev", "last", event);
    },
    isFirstItem: function() {
      return this.active && !this.active.prevAll(".ui-menu-item").length;
    },
    isLastItem: function() {
      return this.active && !this.active.nextAll(".ui-menu-item").length;
    },
    _move: function(direction, filter, event) {
      var next;
      if (this.active) {
        if (direction === "first" || direction === "last") {
          next = this.active[direction === "first" ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1);
        } else {
          next = this.active[direction + "All"](".ui-menu-item").eq(0);
        }
      }
      if (!next || !next.length || !this.active) {
        next = this.activeMenu.children(".ui-menu-item")[filter]();
      }
      this.focus(event, next);
    },
    nextPage: function(event) {
      var item,
          base,
          height;
      if (!this.active) {
        this.next(event);
        return;
      }
      if (this.isLastItem()) {
        return;
      }
      if (this._hasScroll()) {
        base = this.active.offset().top;
        height = this.element.height();
        this.active.nextAll(".ui-menu-item").each(function() {
          item = $(this);
          return item.offset().top - base - height < 0;
        });
        this.focus(event, item);
      } else {
        this.focus(event, this.activeMenu.children(".ui-menu-item")[!this.active ? "first" : "last"]());
      }
    },
    previousPage: function(event) {
      var item,
          base,
          height;
      if (!this.active) {
        this.next(event);
        return;
      }
      if (this.isFirstItem()) {
        return;
      }
      if (this._hasScroll()) {
        base = this.active.offset().top;
        height = this.element.height();
        this.active.prevAll(".ui-menu-item").each(function() {
          item = $(this);
          return item.offset().top - base + height > 0;
        });
        this.focus(event, item);
      } else {
        this.focus(event, this.activeMenu.children(".ui-menu-item").first());
      }
    },
    _hasScroll: function() {
      return this.element.outerHeight() < this.element.prop("scrollHeight");
    },
    select: function(event) {
      this.active = this.active || $(event.target).closest(".ui-menu-item");
      var ui = {item: this.active};
      if (!this.active.has(".ui-menu").length) {
        this.collapseAll(event, true);
      }
      this._trigger("select", event, ui);
    }
  });
}(jQuery));
