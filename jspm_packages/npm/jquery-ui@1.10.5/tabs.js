/* */ 
var jQuery = require('jquery');
require('./core');
require('./widget');
(function($, undefined) {
  var tabId = 0,
      rhash = /#.*$/;
  function getNextTabId() {
    return ++tabId;
  }
  function isLocal(anchor) {
    anchor = anchor.cloneNode(false);
    return anchor.hash.length > 1 && decodeURIComponent(anchor.href.replace(rhash, "")) === decodeURIComponent(location.href.replace(rhash, ""));
  }
  $.widget("ui.tabs", {
    version: "1.10.4",
    delay: 300,
    options: {
      active: null,
      collapsible: false,
      event: "click",
      heightStyle: "content",
      hide: null,
      show: null,
      activate: null,
      beforeActivate: null,
      beforeLoad: null,
      load: null
    },
    _create: function() {
      var that = this,
          options = this.options;
      this.running = false;
      this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", options.collapsible).delegate(".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function(event) {
        if ($(this).is(".ui-state-disabled")) {
          event.preventDefault();
        }
      }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
        if ($(this).closest("li").is(".ui-state-disabled")) {
          this.blur();
        }
      });
      this._processTabs();
      options.active = this._initialActive();
      if ($.isArray(options.disabled)) {
        options.disabled = $.unique(options.disabled.concat($.map(this.tabs.filter(".ui-state-disabled"), function(li) {
          return that.tabs.index(li);
        }))).sort();
      }
      if (this.options.active !== false && this.anchors.length) {
        this.active = this._findActive(options.active);
      } else {
        this.active = $();
      }
      this._refresh();
      if (this.active.length) {
        this.load(options.active);
      }
    },
    _initialActive: function() {
      var active = this.options.active,
          collapsible = this.options.collapsible,
          locationHash = location.hash.substring(1);
      if (active === null) {
        if (locationHash) {
          this.tabs.each(function(i, tab) {
            if ($(tab).attr("aria-controls") === locationHash) {
              active = i;
              return false;
            }
          });
        }
        if (active === null) {
          active = this.tabs.index(this.tabs.filter(".ui-tabs-active"));
        }
        if (active === null || active === -1) {
          active = this.tabs.length ? 0 : false;
        }
      }
      if (active !== false) {
        active = this.tabs.index(this.tabs.eq(active));
        if (active === -1) {
          active = collapsible ? false : 0;
        }
      }
      if (!collapsible && active === false && this.anchors.length) {
        active = 0;
      }
      return active;
    },
    _getCreateEventData: function() {
      return {
        tab: this.active,
        panel: !this.active.length ? $() : this._getPanelForTab(this.active)
      };
    },
    _tabKeydown: function(event) {
      var focusedTab = $(this.document[0].activeElement).closest("li"),
          selectedIndex = this.tabs.index(focusedTab),
          goingForward = true;
      if (this._handlePageNav(event)) {
        return;
      }
      switch (event.keyCode) {
        case $.ui.keyCode.RIGHT:
        case $.ui.keyCode.DOWN:
          selectedIndex++;
          break;
        case $.ui.keyCode.UP:
        case $.ui.keyCode.LEFT:
          goingForward = false;
          selectedIndex--;
          break;
        case $.ui.keyCode.END:
          selectedIndex = this.anchors.length - 1;
          break;
        case $.ui.keyCode.HOME:
          selectedIndex = 0;
          break;
        case $.ui.keyCode.SPACE:
          event.preventDefault();
          clearTimeout(this.activating);
          this._activate(selectedIndex);
          return;
        case $.ui.keyCode.ENTER:
          event.preventDefault();
          clearTimeout(this.activating);
          this._activate(selectedIndex === this.options.active ? false : selectedIndex);
          return;
        default:
          return;
      }
      event.preventDefault();
      clearTimeout(this.activating);
      selectedIndex = this._focusNextTab(selectedIndex, goingForward);
      if (!event.ctrlKey) {
        focusedTab.attr("aria-selected", "false");
        this.tabs.eq(selectedIndex).attr("aria-selected", "true");
        this.activating = this._delay(function() {
          this.option("active", selectedIndex);
        }, this.delay);
      }
    },
    _panelKeydown: function(event) {
      if (this._handlePageNav(event)) {
        return;
      }
      if (event.ctrlKey && event.keyCode === $.ui.keyCode.UP) {
        event.preventDefault();
        this.active.focus();
      }
    },
    _handlePageNav: function(event) {
      if (event.altKey && event.keyCode === $.ui.keyCode.PAGE_UP) {
        this._activate(this._focusNextTab(this.options.active - 1, false));
        return true;
      }
      if (event.altKey && event.keyCode === $.ui.keyCode.PAGE_DOWN) {
        this._activate(this._focusNextTab(this.options.active + 1, true));
        return true;
      }
    },
    _findNextTab: function(index, goingForward) {
      var lastTabIndex = this.tabs.length - 1;
      function constrain() {
        if (index > lastTabIndex) {
          index = 0;
        }
        if (index < 0) {
          index = lastTabIndex;
        }
        return index;
      }
      while ($.inArray(constrain(), this.options.disabled) !== -1) {
        index = goingForward ? index + 1 : index - 1;
      }
      return index;
    },
    _focusNextTab: function(index, goingForward) {
      index = this._findNextTab(index, goingForward);
      this.tabs.eq(index).focus();
      return index;
    },
    _setOption: function(key, value) {
      if (key === "active") {
        this._activate(value);
        return;
      }
      if (key === "disabled") {
        this._setupDisabled(value);
        return;
      }
      this._super(key, value);
      if (key === "collapsible") {
        this.element.toggleClass("ui-tabs-collapsible", value);
        if (!value && this.options.active === false) {
          this._activate(0);
        }
      }
      if (key === "event") {
        this._setupEvents(value);
      }
      if (key === "heightStyle") {
        this._setupHeightStyle(value);
      }
    },
    _tabId: function(tab) {
      return tab.attr("aria-controls") || "ui-tabs-" + getNextTabId();
    },
    _sanitizeSelector: function(hash) {
      return hash ? hash.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : "";
    },
    refresh: function() {
      var options = this.options,
          lis = this.tablist.children(":has(a[href])");
      options.disabled = $.map(lis.filter(".ui-state-disabled"), function(tab) {
        return lis.index(tab);
      });
      this._processTabs();
      if (options.active === false || !this.anchors.length) {
        options.active = false;
        this.active = $();
      } else if (this.active.length && !$.contains(this.tablist[0], this.active[0])) {
        if (this.tabs.length === options.disabled.length) {
          options.active = false;
          this.active = $();
        } else {
          this._activate(this._findNextTab(Math.max(0, options.active - 1), false));
        }
      } else {
        options.active = this.tabs.index(this.active);
      }
      this._refresh();
    },
    _refresh: function() {
      this._setupDisabled(this.options.disabled);
      this._setupEvents(this.options.event);
      this._setupHeightStyle(this.options.heightStyle);
      this.tabs.not(this.active).attr({
        "aria-selected": "false",
        tabIndex: -1
      });
      this.panels.not(this._getPanelForTab(this.active)).hide().attr({
        "aria-expanded": "false",
        "aria-hidden": "true"
      });
      if (!this.active.length) {
        this.tabs.eq(0).attr("tabIndex", 0);
      } else {
        this.active.addClass("ui-tabs-active ui-state-active").attr({
          "aria-selected": "true",
          tabIndex: 0
        });
        this._getPanelForTab(this.active).show().attr({
          "aria-expanded": "true",
          "aria-hidden": "false"
        });
      }
    },
    _processTabs: function() {
      var that = this;
      this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist");
      this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({
        role: "tab",
        tabIndex: -1
      });
      this.anchors = this.tabs.map(function() {
        return $("a", this)[0];
      }).addClass("ui-tabs-anchor").attr({
        role: "presentation",
        tabIndex: -1
      });
      this.panels = $();
      this.anchors.each(function(i, anchor) {
        var selector,
            panel,
            panelId,
            anchorId = $(anchor).uniqueId().attr("id"),
            tab = $(anchor).closest("li"),
            originalAriaControls = tab.attr("aria-controls");
        if (isLocal(anchor)) {
          selector = anchor.hash;
          panel = that.element.find(that._sanitizeSelector(selector));
        } else {
          panelId = that._tabId(tab);
          selector = "#" + panelId;
          panel = that.element.find(selector);
          if (!panel.length) {
            panel = that._createPanel(panelId);
            panel.insertAfter(that.panels[i - 1] || that.tablist);
          }
          panel.attr("aria-live", "polite");
        }
        if (panel.length) {
          that.panels = that.panels.add(panel);
        }
        if (originalAriaControls) {
          tab.data("ui-tabs-aria-controls", originalAriaControls);
        }
        tab.attr({
          "aria-controls": selector.substring(1),
          "aria-labelledby": anchorId
        });
        panel.attr("aria-labelledby", anchorId);
      });
      this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel");
    },
    _getList: function() {
      return this.tablist || this.element.find("ol,ul").eq(0);
    },
    _createPanel: function(id) {
      return $("<div>").attr("id", id).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", true);
    },
    _setupDisabled: function(disabled) {
      if ($.isArray(disabled)) {
        if (!disabled.length) {
          disabled = false;
        } else if (disabled.length === this.anchors.length) {
          disabled = true;
        }
      }
      for (var i = 0,
          li; (li = this.tabs[i]); i++) {
        if (disabled === true || $.inArray(i, disabled) !== -1) {
          $(li).addClass("ui-state-disabled").attr("aria-disabled", "true");
        } else {
          $(li).removeClass("ui-state-disabled").removeAttr("aria-disabled");
        }
      }
      this.options.disabled = disabled;
    },
    _setupEvents: function(event) {
      var events = {click: function(event) {
          event.preventDefault();
        }};
      if (event) {
        $.each(event.split(" "), function(index, eventName) {
          events[eventName] = "_eventHandler";
        });
      }
      this._off(this.anchors.add(this.tabs).add(this.panels));
      this._on(this.anchors, events);
      this._on(this.tabs, {keydown: "_tabKeydown"});
      this._on(this.panels, {keydown: "_panelKeydown"});
      this._focusable(this.tabs);
      this._hoverable(this.tabs);
    },
    _setupHeightStyle: function(heightStyle) {
      var maxHeight,
          parent = this.element.parent();
      if (heightStyle === "fill") {
        maxHeight = parent.height();
        maxHeight -= this.element.outerHeight() - this.element.height();
        this.element.siblings(":visible").each(function() {
          var elem = $(this),
              position = elem.css("position");
          if (position === "absolute" || position === "fixed") {
            return;
          }
          maxHeight -= elem.outerHeight(true);
        });
        this.element.children().not(this.panels).each(function() {
          maxHeight -= $(this).outerHeight(true);
        });
        this.panels.each(function() {
          $(this).height(Math.max(0, maxHeight - $(this).innerHeight() + $(this).height()));
        }).css("overflow", "auto");
      } else if (heightStyle === "auto") {
        maxHeight = 0;
        this.panels.each(function() {
          maxHeight = Math.max(maxHeight, $(this).height("").height());
        }).height(maxHeight);
      }
    },
    _eventHandler: function(event) {
      var options = this.options,
          active = this.active,
          anchor = $(event.currentTarget),
          tab = anchor.closest("li"),
          clickedIsActive = tab[0] === active[0],
          collapsing = clickedIsActive && options.collapsible,
          toShow = collapsing ? $() : this._getPanelForTab(tab),
          toHide = !active.length ? $() : this._getPanelForTab(active),
          eventData = {
            oldTab: active,
            oldPanel: toHide,
            newTab: collapsing ? $() : tab,
            newPanel: toShow
          };
      event.preventDefault();
      if (tab.hasClass("ui-state-disabled") || tab.hasClass("ui-tabs-loading") || this.running || (clickedIsActive && !options.collapsible) || (this._trigger("beforeActivate", event, eventData) === false)) {
        return;
      }
      options.active = collapsing ? false : this.tabs.index(tab);
      this.active = clickedIsActive ? $() : tab;
      if (this.xhr) {
        this.xhr.abort();
      }
      if (!toHide.length && !toShow.length) {
        $.error("jQuery UI Tabs: Mismatching fragment identifier.");
      }
      if (toShow.length) {
        this.load(this.tabs.index(tab), event);
      }
      this._toggle(event, eventData);
    },
    _toggle: function(event, eventData) {
      var that = this,
          toShow = eventData.newPanel,
          toHide = eventData.oldPanel;
      this.running = true;
      function complete() {
        that.running = false;
        that._trigger("activate", event, eventData);
      }
      function show() {
        eventData.newTab.closest("li").addClass("ui-tabs-active ui-state-active");
        if (toShow.length && that.options.show) {
          that._show(toShow, that.options.show, complete);
        } else {
          toShow.show();
          complete();
        }
      }
      if (toHide.length && this.options.hide) {
        this._hide(toHide, this.options.hide, function() {
          eventData.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");
          show();
        });
      } else {
        eventData.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");
        toHide.hide();
        show();
      }
      toHide.attr({
        "aria-expanded": "false",
        "aria-hidden": "true"
      });
      eventData.oldTab.attr("aria-selected", "false");
      if (toShow.length && toHide.length) {
        eventData.oldTab.attr("tabIndex", -1);
      } else if (toShow.length) {
        this.tabs.filter(function() {
          return $(this).attr("tabIndex") === 0;
        }).attr("tabIndex", -1);
      }
      toShow.attr({
        "aria-expanded": "true",
        "aria-hidden": "false"
      });
      eventData.newTab.attr({
        "aria-selected": "true",
        tabIndex: 0
      });
    },
    _activate: function(index) {
      var anchor,
          active = this._findActive(index);
      if (active[0] === this.active[0]) {
        return;
      }
      if (!active.length) {
        active = this.active;
      }
      anchor = active.find(".ui-tabs-anchor")[0];
      this._eventHandler({
        target: anchor,
        currentTarget: anchor,
        preventDefault: $.noop
      });
    },
    _findActive: function(index) {
      return index === false ? $() : this.tabs.eq(index);
    },
    _getIndex: function(index) {
      if (typeof index === "string") {
        index = this.anchors.index(this.anchors.filter("[href$='" + index + "']"));
      }
      return index;
    },
    _destroy: function() {
      if (this.xhr) {
        this.xhr.abort();
      }
      this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible");
      this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role");
      this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId();
      this.tabs.add(this.panels).each(function() {
        if ($.data(this, "ui-tabs-destroy")) {
          $(this).remove();
        } else {
          $(this).removeClass("ui-state-default ui-state-active ui-state-disabled " + "ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role");
        }
      });
      this.tabs.each(function() {
        var li = $(this),
            prev = li.data("ui-tabs-aria-controls");
        if (prev) {
          li.attr("aria-controls", prev).removeData("ui-tabs-aria-controls");
        } else {
          li.removeAttr("aria-controls");
        }
      });
      this.panels.show();
      if (this.options.heightStyle !== "content") {
        this.panels.css("height", "");
      }
    },
    enable: function(index) {
      var disabled = this.options.disabled;
      if (disabled === false) {
        return;
      }
      if (index === undefined) {
        disabled = false;
      } else {
        index = this._getIndex(index);
        if ($.isArray(disabled)) {
          disabled = $.map(disabled, function(num) {
            return num !== index ? num : null;
          });
        } else {
          disabled = $.map(this.tabs, function(li, num) {
            return num !== index ? num : null;
          });
        }
      }
      this._setupDisabled(disabled);
    },
    disable: function(index) {
      var disabled = this.options.disabled;
      if (disabled === true) {
        return;
      }
      if (index === undefined) {
        disabled = true;
      } else {
        index = this._getIndex(index);
        if ($.inArray(index, disabled) !== -1) {
          return;
        }
        if ($.isArray(disabled)) {
          disabled = $.merge([index], disabled).sort();
        } else {
          disabled = [index];
        }
      }
      this._setupDisabled(disabled);
    },
    load: function(index, event) {
      index = this._getIndex(index);
      var that = this,
          tab = this.tabs.eq(index),
          anchor = tab.find(".ui-tabs-anchor"),
          panel = this._getPanelForTab(tab),
          eventData = {
            tab: tab,
            panel: panel
          };
      if (isLocal(anchor[0])) {
        return;
      }
      this.xhr = $.ajax(this._ajaxSettings(anchor, event, eventData));
      if (this.xhr && this.xhr.statusText !== "canceled") {
        tab.addClass("ui-tabs-loading");
        panel.attr("aria-busy", "true");
        this.xhr.success(function(response) {
          setTimeout(function() {
            panel.html(response);
            that._trigger("load", event, eventData);
          }, 1);
        }).complete(function(jqXHR, status) {
          setTimeout(function() {
            if (status === "abort") {
              that.panels.stop(false, true);
            }
            tab.removeClass("ui-tabs-loading");
            panel.removeAttr("aria-busy");
            if (jqXHR === that.xhr) {
              delete that.xhr;
            }
          }, 1);
        });
      }
    },
    _ajaxSettings: function(anchor, event, eventData) {
      var that = this;
      return {
        url: anchor.attr("href"),
        beforeSend: function(jqXHR, settings) {
          return that._trigger("beforeLoad", event, $.extend({
            jqXHR: jqXHR,
            ajaxSettings: settings
          }, eventData));
        }
      };
    },
    _getPanelForTab: function(tab) {
      var id = $(tab).attr("aria-controls");
      return this.element.find(this._sanitizeSelector("#" + id));
    }
  });
})(jQuery);
