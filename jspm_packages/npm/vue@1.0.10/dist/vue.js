/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Vue = factory();
  }(this, function() {
    'use strict';
    function set(obj, key, val) {
      if (hasOwn(obj, key)) {
        obj[key] = val;
        return;
      }
      if (obj._isVue) {
        set(obj._data, key, val);
        return;
      }
      var ob = obj.__ob__;
      if (!ob) {
        obj[key] = val;
        return;
      }
      ob.convert(key, val);
      ob.dep.notify();
      if (ob.vms) {
        var i = ob.vms.length;
        while (i--) {
          var vm = ob.vms[i];
          vm._proxy(key);
          vm._digest();
        }
      }
    }
    function del(obj, key) {
      if (!hasOwn(obj, key)) {
        return;
      }
      delete obj[key];
      var ob = obj.__ob__;
      if (!ob) {
        return;
      }
      ob.dep.notify();
      if (ob.vms) {
        var i = ob.vms.length;
        while (i--) {
          var vm = ob.vms[i];
          vm._unproxy(key);
          vm._digest();
        }
      }
    }
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function hasOwn(obj, key) {
      return hasOwnProperty.call(obj, key);
    }
    var literalValueRE = /^\s?(true|false|[\d\.]+|'[^']*'|"[^"]*")\s?$/;
    function isLiteral(exp) {
      return literalValueRE.test(exp);
    }
    function isReserved(str) {
      var c = (str + '').charCodeAt(0);
      return c === 0x24 || c === 0x5F;
    }
    function _toString(value) {
      return value == null ? '' : value.toString();
    }
    function toNumber(value) {
      if (typeof value !== 'string') {
        return value;
      } else {
        var parsed = Number(value);
        return isNaN(parsed) ? value : parsed;
      }
    }
    function toBoolean(value) {
      return value === 'true' ? true : value === 'false' ? false : value;
    }
    function stripQuotes(str) {
      var a = str.charCodeAt(0);
      var b = str.charCodeAt(str.length - 1);
      return a === b && (a === 0x22 || a === 0x27) ? str.slice(1, -1) : str;
    }
    var camelizeRE = /-(\w)/g;
    function camelize(str) {
      return str.replace(camelizeRE, toUpper);
    }
    function toUpper(_, c) {
      return c ? c.toUpperCase() : '';
    }
    var hyphenateRE = /([a-z\d])([A-Z])/g;
    function hyphenate(str) {
      return str.replace(hyphenateRE, '$1-$2').toLowerCase();
    }
    var classifyRE = /(?:^|[-_\/])(\w)/g;
    function classify(str) {
      return str.replace(classifyRE, toUpper);
    }
    function bind$1(fn, ctx) {
      return function(a) {
        var l = arguments.length;
        return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
      };
    }
    function toArray(list, start) {
      start = start || 0;
      var i = list.length - start;
      var ret = new Array(i);
      while (i--) {
        ret[i] = list[i + start];
      }
      return ret;
    }
    function extend(to, from) {
      var keys = Object.keys(from);
      var i = keys.length;
      while (i--) {
        to[keys[i]] = from[keys[i]];
      }
      return to;
    }
    function isObject(obj) {
      return obj !== null && typeof obj === 'object';
    }
    var toString = Object.prototype.toString;
    var OBJECT_STRING = '[object Object]';
    function isPlainObject(obj) {
      return toString.call(obj) === OBJECT_STRING;
    }
    var isArray = Array.isArray;
    function def(obj, key, val, enumerable) {
      Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
      });
    }
    function _debounce(func, wait) {
      var timeout,
          args,
          context,
          timestamp,
          result;
      var later = function later() {
        var last = Date.now() - timestamp;
        if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          result = func.apply(context, args);
          if (!timeout)
            context = args = null;
        }
      };
      return function() {
        context = this;
        args = arguments;
        timestamp = Date.now();
        if (!timeout) {
          timeout = setTimeout(later, wait);
        }
        return result;
      };
    }
    function indexOf(arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj)
          return i;
      }
      return -1;
    }
    function cancellable(fn) {
      var cb = function cb() {
        if (!cb.cancelled) {
          return fn.apply(this, arguments);
        }
      };
      cb.cancel = function() {
        cb.cancelled = true;
      };
      return cb;
    }
    function looseEqual(a, b) {
      return a == b || (isObject(a) && isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false);
    }
    var hasProto = ('__proto__' in {});
    var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';
    var isIE9 = inBrowser && navigator.userAgent.toLowerCase().indexOf('msie 9.0') > 0;
    var isAndroid = inBrowser && navigator.userAgent.toLowerCase().indexOf('android') > 0;
    var transitionProp = undefined;
    var transitionEndEvent = undefined;
    var animationProp = undefined;
    var animationEndEvent = undefined;
    if (inBrowser && !isIE9) {
      var isWebkitTrans = window.ontransitionend === undefined && window.onwebkittransitionend !== undefined;
      var isWebkitAnim = window.onanimationend === undefined && window.onwebkitanimationend !== undefined;
      transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition';
      transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend';
      animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation';
      animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend';
    }
    var nextTick = (function() {
      var callbacks = [];
      var pending = false;
      var timerFunc;
      function nextTickHandler() {
        pending = false;
        var copies = callbacks.slice(0);
        callbacks = [];
        for (var i = 0; i < copies.length; i++) {
          copies[i]();
        }
      }
      if (typeof MutationObserver !== 'undefined') {
        var counter = 1;
        var observer = new MutationObserver(nextTickHandler);
        var textNode = document.createTextNode(counter);
        observer.observe(textNode, {characterData: true});
        timerFunc = function() {
          counter = (counter + 1) % 2;
          textNode.data = counter;
        };
      } else {
        timerFunc = setTimeout;
      }
      return function(cb, ctx) {
        var func = ctx ? function() {
          cb.call(ctx);
        } : cb;
        callbacks.push(func);
        if (pending)
          return;
        pending = true;
        timerFunc(nextTickHandler, 0);
      };
    })();
    function Cache(limit) {
      this.size = 0;
      this.limit = limit;
      this.head = this.tail = undefined;
      this._keymap = Object.create(null);
    }
    var p = Cache.prototype;
    p.put = function(key, value) {
      var entry = {
        key: key,
        value: value
      };
      this._keymap[key] = entry;
      if (this.tail) {
        this.tail.newer = entry;
        entry.older = this.tail;
      } else {
        this.head = entry;
      }
      this.tail = entry;
      if (this.size === this.limit) {
        return this.shift();
      } else {
        this.size++;
      }
    };
    p.shift = function() {
      var entry = this.head;
      if (entry) {
        this.head = this.head.newer;
        this.head.older = undefined;
        entry.newer = entry.older = undefined;
        this._keymap[entry.key] = undefined;
      }
      return entry;
    };
    p.get = function(key, returnEntry) {
      var entry = this._keymap[key];
      if (entry === undefined)
        return;
      if (entry === this.tail) {
        return returnEntry ? entry : entry.value;
      }
      if (entry.newer) {
        if (entry === this.head) {
          this.head = entry.newer;
        }
        entry.newer.older = entry.older;
      }
      if (entry.older) {
        entry.older.newer = entry.newer;
      }
      entry.newer = undefined;
      entry.older = this.tail;
      if (this.tail) {
        this.tail.newer = entry;
      }
      this.tail = entry;
      return returnEntry ? entry : entry.value;
    };
    var cache$1 = new Cache(1000);
    var filterTokenRE = /[^\s'"]+|'[^']*'|"[^"]*"/g;
    var reservedArgRE = /^in$|^-?\d+/;
    var str;
    var dir;
    var c;
    var i;
    var l;
    var lastFilterIndex;
    var inSingle;
    var inDouble;
    var curly;
    var square;
    var paren;
    function pushFilter() {
      var exp = str.slice(lastFilterIndex, i).trim();
      var filter;
      if (exp) {
        filter = {};
        var tokens = exp.match(filterTokenRE);
        filter.name = tokens[0];
        if (tokens.length > 1) {
          filter.args = tokens.slice(1).map(processFilterArg);
        }
      }
      if (filter) {
        (dir.filters = dir.filters || []).push(filter);
      }
      lastFilterIndex = i + 1;
    }
    function processFilterArg(arg) {
      if (reservedArgRE.test(arg)) {
        return {
          value: toNumber(arg),
          dynamic: false
        };
      } else {
        var stripped = stripQuotes(arg);
        var dynamic = stripped === arg;
        return {
          value: dynamic ? arg : stripped,
          dynamic: dynamic
        };
      }
    }
    function parseDirective(s) {
      var hit = cache$1.get(s);
      if (hit) {
        return hit;
      }
      str = s;
      inSingle = inDouble = false;
      curly = square = paren = 0;
      lastFilterIndex = 0;
      dir = {};
      for (i = 0, l = str.length; i < l; i++) {
        c = str.charCodeAt(i);
        if (inSingle) {
          if (c === 0x27)
            inSingle = !inSingle;
        } else if (inDouble) {
          if (c === 0x22)
            inDouble = !inDouble;
        } else if (c === 0x7C && str.charCodeAt(i + 1) !== 0x7C && str.charCodeAt(i - 1) !== 0x7C) {
          if (dir.expression == null) {
            lastFilterIndex = i + 1;
            dir.expression = str.slice(0, i).trim();
          } else {
            pushFilter();
          }
        } else {
          switch (c) {
            case 0x22:
              inDouble = true;
              break;
            case 0x27:
              inSingle = true;
              break;
            case 0x28:
              paren++;
              break;
            case 0x29:
              paren--;
              break;
            case 0x5B:
              square++;
              break;
            case 0x5D:
              square--;
              break;
            case 0x7B:
              curly++;
              break;
            case 0x7D:
              curly--;
              break;
          }
        }
      }
      if (dir.expression == null) {
        dir.expression = str.slice(0, i).trim();
      } else if (lastFilterIndex !== 0) {
        pushFilter();
      }
      cache$1.put(s, dir);
      return dir;
    }
    var directive = Object.freeze({parseDirective: parseDirective});
    var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
    var cache = undefined;
    var tagRE = undefined;
    var htmlRE = undefined;
    function escapeRegex(str) {
      return str.replace(regexEscapeRE, '\\$&');
    }
    function compileRegex() {
      var open = escapeRegex(config.delimiters[0]);
      var close = escapeRegex(config.delimiters[1]);
      var unsafeOpen = escapeRegex(config.unsafeDelimiters[0]);
      var unsafeClose = escapeRegex(config.unsafeDelimiters[1]);
      tagRE = new RegExp(unsafeOpen + '(.+?)' + unsafeClose + '|' + open + '(.+?)' + close, 'g');
      htmlRE = new RegExp('^' + unsafeOpen + '.*' + unsafeClose + '$');
      cache = new Cache(1000);
    }
    function parseText(text) {
      if (!cache) {
        compileRegex();
      }
      var hit = cache.get(text);
      if (hit) {
        return hit;
      }
      text = text.replace(/\n/g, '');
      if (!tagRE.test(text)) {
        return null;
      }
      var tokens = [];
      var lastIndex = tagRE.lastIndex = 0;
      var match,
          index,
          html,
          value,
          first,
          oneTime;
      while (match = tagRE.exec(text)) {
        index = match.index;
        if (index > lastIndex) {
          tokens.push({value: text.slice(lastIndex, index)});
        }
        html = htmlRE.test(match[0]);
        value = html ? match[1] : match[2];
        first = value.charCodeAt(0);
        oneTime = first === 42;
        value = oneTime ? value.slice(1) : value;
        tokens.push({
          tag: true,
          value: value.trim(),
          html: html,
          oneTime: oneTime
        });
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        tokens.push({value: text.slice(lastIndex)});
      }
      cache.put(text, tokens);
      return tokens;
    }
    function tokensToExp(tokens) {
      if (tokens.length > 1) {
        return tokens.map(function(token) {
          return formatToken(token);
        }).join('+');
      } else {
        return formatToken(tokens[0], true);
      }
    }
    function formatToken(token, single) {
      return token.tag ? inlineFilters(token.value, single) : '"' + token.value + '"';
    }
    var filterRE$1 = /[^|]\|[^|]/;
    function inlineFilters(exp, single) {
      if (!filterRE$1.test(exp)) {
        return single ? exp : '(' + exp + ')';
      } else {
        var dir = parseDirective(exp);
        if (!dir.filters) {
          return '(' + exp + ')';
        } else {
          return 'this._applyFilters(' + dir.expression + ',null,' + JSON.stringify(dir.filters) + ',false)';
        }
      }
    }
    var text$1 = Object.freeze({
      compileRegex: compileRegex,
      parseText: parseText,
      tokensToExp: tokensToExp
    });
    var delimiters = ['{{', '}}'];
    var unsafeDelimiters = ['{{{', '}}}'];
    var config = Object.defineProperties({
      debug: false,
      silent: false,
      async: true,
      warnExpressionErrors: true,
      convertAllProperties: false,
      _delimitersChanged: true,
      _assetTypes: ['component', 'directive', 'elementDirective', 'filter', 'transition', 'partial'],
      _propBindingModes: {
        ONE_WAY: 0,
        TWO_WAY: 1,
        ONE_TIME: 2
      },
      _maxUpdateCount: 100
    }, {
      delimiters: {
        get: function get() {
          return delimiters;
        },
        set: function set(val) {
          delimiters = val;
          compileRegex();
        },
        configurable: true,
        enumerable: true
      },
      unsafeDelimiters: {
        get: function get() {
          return unsafeDelimiters;
        },
        set: function set(val) {
          unsafeDelimiters = val;
          compileRegex();
        },
        configurable: true,
        enumerable: true
      }
    });
    var warn = undefined;
    if ('development' !== 'production') {
      (function() {
        var hasConsole = typeof console !== 'undefined';
        warn = function(msg, e) {
          if (hasConsole && (!config.silent || config.debug)) {
            console.warn('[Vue warn]: ' + msg);
            if (config.debug) {
              if (e) {
                throw e;
              } else {
                console.warn(new Error('Warning Stack Trace').stack);
              }
            }
          }
        };
      })();
    }
    function appendWithTransition(el, target, vm, cb) {
      applyTransition(el, 1, function() {
        target.appendChild(el);
      }, vm, cb);
    }
    function beforeWithTransition(el, target, vm, cb) {
      applyTransition(el, 1, function() {
        before(el, target);
      }, vm, cb);
    }
    function removeWithTransition(el, vm, cb) {
      applyTransition(el, -1, function() {
        remove(el);
      }, vm, cb);
    }
    function applyTransition(el, direction, op, vm, cb) {
      var transition = el.__v_trans;
      if (!transition || !transition.hooks && !transitionEndEvent || !vm._isCompiled || vm.$parent && !vm.$parent._isCompiled) {
        op();
        if (cb)
          cb();
        return;
      }
      var action = direction > 0 ? 'enter' : 'leave';
      transition[action](op, cb);
    }
    function query(el) {
      if (typeof el === 'string') {
        var selector = el;
        el = document.querySelector(el);
        if (!el) {
          'development' !== 'production' && warn('Cannot find element: ' + selector);
        }
      }
      return el;
    }
    function inDoc(node) {
      var doc = document.documentElement;
      var parent = node && node.parentNode;
      return doc === node || doc === parent || !!(parent && parent.nodeType === 1 && doc.contains(parent));
    }
    function getAttr(node, _attr) {
      var val = node.getAttribute(_attr);
      if (val !== null) {
        node.removeAttribute(_attr);
      }
      return val;
    }
    function getBindAttr(node, name) {
      var val = getAttr(node, ':' + name);
      if (val === null) {
        val = getAttr(node, 'v-bind:' + name);
      }
      return val;
    }
    function before(el, target) {
      target.parentNode.insertBefore(el, target);
    }
    function after(el, target) {
      if (target.nextSibling) {
        before(el, target.nextSibling);
      } else {
        target.parentNode.appendChild(el);
      }
    }
    function remove(el) {
      el.parentNode.removeChild(el);
    }
    function prepend(el, target) {
      if (target.firstChild) {
        before(el, target.firstChild);
      } else {
        target.appendChild(el);
      }
    }
    function replace(target, el) {
      var parent = target.parentNode;
      if (parent) {
        parent.replaceChild(el, target);
      }
    }
    function on$1(el, event, cb) {
      el.addEventListener(event, cb);
    }
    function off(el, event, cb) {
      el.removeEventListener(event, cb);
    }
    function addClass(el, cls) {
      if (el.classList) {
        el.classList.add(cls);
      } else {
        var cur = ' ' + (el.getAttribute('class') || '') + ' ';
        if (cur.indexOf(' ' + cls + ' ') < 0) {
          el.setAttribute('class', (cur + cls).trim());
        }
      }
    }
    function removeClass(el, cls) {
      if (el.classList) {
        el.classList.remove(cls);
      } else {
        var cur = ' ' + (el.getAttribute('class') || '') + ' ';
        var tar = ' ' + cls + ' ';
        while (cur.indexOf(tar) >= 0) {
          cur = cur.replace(tar, ' ');
        }
        el.setAttribute('class', cur.trim());
      }
      if (!el.className) {
        el.removeAttribute('class');
      }
    }
    function extractContent(el, asFragment) {
      var child;
      var rawContent;
      if (isTemplate(el) && el.content instanceof DocumentFragment) {
        el = el.content;
      }
      if (el.hasChildNodes()) {
        trimNode(el);
        rawContent = asFragment ? document.createDocumentFragment() : document.createElement('div');
        while (child = el.firstChild) {
          rawContent.appendChild(child);
        }
      }
      return rawContent;
    }
    function trimNode(node) {
      trim(node, node.firstChild);
      trim(node, node.lastChild);
    }
    function trim(parent, node) {
      if (node && node.nodeType === 3 && !node.data.trim()) {
        parent.removeChild(node);
      }
    }
    function isTemplate(el) {
      return el.tagName && el.tagName.toLowerCase() === 'template';
    }
    function createAnchor(content, persist) {
      var anchor = config.debug ? document.createComment(content) : document.createTextNode(persist ? ' ' : '');
      anchor.__vue_anchor = true;
      return anchor;
    }
    var refRE = /^v-ref:/;
    function findRef(node) {
      if (node.hasAttributes()) {
        var attrs = node.attributes;
        for (var i = 0,
            l = attrs.length; i < l; i++) {
          var name = attrs[i].name;
          if (refRE.test(name)) {
            return camelize(name.replace(refRE, ''));
          }
        }
      }
    }
    function mapNodeRange(node, end, op) {
      var next;
      while (node !== end) {
        next = node.nextSibling;
        op(node);
        node = next;
      }
      op(end);
    }
    function removeNodeRange(start, end, vm, frag, cb) {
      var done = false;
      var removed = 0;
      var nodes = [];
      mapNodeRange(start, end, function(node) {
        if (node === end)
          done = true;
        nodes.push(node);
        removeWithTransition(node, vm, onRemoved);
      });
      function onRemoved() {
        removed++;
        if (done && removed >= nodes.length) {
          for (var i = 0; i < nodes.length; i++) {
            frag.appendChild(nodes[i]);
          }
          cb && cb();
        }
      }
    }
    var commonTagRE = /^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/;
    function checkComponentAttr(el, options) {
      var tag = el.tagName.toLowerCase();
      var hasAttrs = el.hasAttributes();
      if (!commonTagRE.test(tag) && tag !== 'component') {
        if (resolveAsset(options, 'components', tag)) {
          return {id: tag};
        } else {
          var is = hasAttrs && getIsBinding(el);
          if (is) {
            return is;
          } else if ('development' !== 'production') {
            if (tag.indexOf('-') > -1 || /HTMLUnknownElement/.test(el.toString()) && !/^(data|time|rtc|rb)$/.test(tag)) {
              warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly?');
            }
          }
        }
      } else if (hasAttrs) {
        return getIsBinding(el);
      }
    }
    function getIsBinding(el) {
      var exp = getAttr(el, 'is');
      if (exp != null) {
        return {id: exp};
      } else {
        exp = getBindAttr(el, 'is');
        if (exp != null) {
          return {
            id: exp,
            dynamic: true
          };
        }
      }
    }
    function initProp(vm, prop, value) {
      var key = prop.path;
      vm[key] = vm._data[key] = assertProp(prop, value) ? value : undefined;
    }
    function assertProp(prop, value) {
      if (prop.raw === null && !prop.required) {
        return true;
      }
      var options = prop.options;
      var type = options.type;
      var valid = true;
      var expectedType;
      if (type) {
        if (type === String) {
          expectedType = 'string';
          valid = typeof value === expectedType;
        } else if (type === Number) {
          expectedType = 'number';
          valid = typeof value === 'number';
        } else if (type === Boolean) {
          expectedType = 'boolean';
          valid = typeof value === 'boolean';
        } else if (type === Function) {
          expectedType = 'function';
          valid = typeof value === 'function';
        } else if (type === Object) {
          expectedType = 'object';
          valid = isPlainObject(value);
        } else if (type === Array) {
          expectedType = 'array';
          valid = isArray(value);
        } else {
          valid = value instanceof type;
        }
      }
      if (!valid) {
        'development' !== 'production' && warn('Invalid prop: type check failed for ' + prop.path + '="' + prop.raw + '".' + ' Expected ' + formatType(expectedType) + ', got ' + formatValue(value) + '.');
        return false;
      }
      var validator = options.validator;
      if (validator) {
        if (!validator.call(null, value)) {
          'development' !== 'production' && warn('Invalid prop: custom validator check failed for ' + prop.path + '="' + prop.raw + '"');
          return false;
        }
      }
      return true;
    }
    function formatType(val) {
      return val ? val.charAt(0).toUpperCase() + val.slice(1) : 'custom type';
    }
    function formatValue(val) {
      return Object.prototype.toString.call(val).slice(8, -1);
    }
    var strats = config.optionMergeStrategies = Object.create(null);
    function mergeData(to, from) {
      var key,
          toVal,
          fromVal;
      for (key in from) {
        toVal = to[key];
        fromVal = from[key];
        if (!hasOwn(to, key)) {
          set(to, key, fromVal);
        } else if (isObject(toVal) && isObject(fromVal)) {
          mergeData(toVal, fromVal);
        }
      }
      return to;
    }
    strats.data = function(parentVal, childVal, vm) {
      if (!vm) {
        if (!childVal) {
          return parentVal;
        }
        if (typeof childVal !== 'function') {
          'development' !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.');
          return parentVal;
        }
        if (!parentVal) {
          return childVal;
        }
        return function mergedDataFn() {
          return mergeData(childVal.call(this), parentVal.call(this));
        };
      } else if (parentVal || childVal) {
        return function mergedInstanceDataFn() {
          var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
          var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
          if (instanceData) {
            return mergeData(instanceData, defaultData);
          } else {
            return defaultData;
          }
        };
      }
    };
    strats.el = function(parentVal, childVal, vm) {
      if (!vm && childVal && typeof childVal !== 'function') {
        'development' !== 'production' && warn('The "el" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.');
        return;
      }
      var ret = childVal || parentVal;
      return vm && typeof ret === 'function' ? ret.call(vm) : ret;
    };
    strats.init = strats.created = strats.ready = strats.attached = strats.detached = strats.beforeCompile = strats.compiled = strats.beforeDestroy = strats.destroyed = function(parentVal, childVal) {
      return childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
    };
    strats.paramAttributes = function() {
      'development' !== 'production' && warn('"paramAttributes" option has been deprecated in 0.12. ' + 'Use "props" instead.');
    };
    function mergeAssets(parentVal, childVal) {
      var res = Object.create(parentVal);
      return childVal ? extend(res, guardArrayAssets(childVal)) : res;
    }
    config._assetTypes.forEach(function(type) {
      strats[type + 's'] = mergeAssets;
    });
    strats.watch = strats.events = function(parentVal, childVal) {
      if (!childVal)
        return parentVal;
      if (!parentVal)
        return childVal;
      var ret = {};
      extend(ret, parentVal);
      for (var key in childVal) {
        var parent = ret[key];
        var child = childVal[key];
        if (parent && !isArray(parent)) {
          parent = [parent];
        }
        ret[key] = parent ? parent.concat(child) : [child];
      }
      return ret;
    };
    strats.props = strats.methods = strats.computed = function(parentVal, childVal) {
      if (!childVal)
        return parentVal;
      if (!parentVal)
        return childVal;
      var ret = Object.create(null);
      extend(ret, parentVal);
      extend(ret, childVal);
      return ret;
    };
    var defaultStrat = function defaultStrat(parentVal, childVal) {
      return childVal === undefined ? parentVal : childVal;
    };
    function guardComponents(options) {
      if (options.components) {
        var components = options.components = guardArrayAssets(options.components);
        var def;
        var ids = Object.keys(components);
        for (var i = 0,
            l = ids.length; i < l; i++) {
          var key = ids[i];
          if (commonTagRE.test(key)) {
            'development' !== 'production' && warn('Do not use built-in HTML elements as component ' + 'id: ' + key);
            continue;
          }
          def = components[key];
          if (isPlainObject(def)) {
            components[key] = Vue.extend(def);
          }
        }
      }
    }
    function guardProps(options) {
      var props = options.props;
      var i,
          val;
      if (isArray(props)) {
        options.props = {};
        i = props.length;
        while (i--) {
          val = props[i];
          if (typeof val === 'string') {
            options.props[val] = null;
          } else if (val.name) {
            options.props[val.name] = val;
          }
        }
      } else if (isPlainObject(props)) {
        var keys = Object.keys(props);
        i = keys.length;
        while (i--) {
          val = props[keys[i]];
          if (typeof val === 'function') {
            props[keys[i]] = {type: val};
          }
        }
      }
    }
    function guardArrayAssets(assets) {
      if (isArray(assets)) {
        var res = {};
        var i = assets.length;
        var asset;
        while (i--) {
          asset = assets[i];
          var id = typeof asset === 'function' ? asset.options && asset.options.name || asset.id : asset.name || asset.id;
          if (!id) {
            'development' !== 'production' && warn('Array-syntax assets must provide a "name" or "id" field.');
          } else {
            res[id] = asset;
          }
        }
        return res;
      }
      return assets;
    }
    function mergeOptions(parent, child, vm) {
      guardComponents(child);
      guardProps(child);
      var options = {};
      var key;
      if (child.mixins) {
        for (var i = 0,
            l = child.mixins.length; i < l; i++) {
          parent = mergeOptions(parent, child.mixins[i], vm);
        }
      }
      for (key in parent) {
        mergeField(key);
      }
      for (key in child) {
        if (!hasOwn(parent, key)) {
          mergeField(key);
        }
      }
      function mergeField(key) {
        var strat = strats[key] || defaultStrat;
        options[key] = strat(parent[key], child[key], vm, key);
      }
      return options;
    }
    function resolveAsset(options, type, id) {
      var assets = options[type];
      var camelizedId;
      return assets[id] || assets[camelizedId = camelize(id)] || assets[camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)];
    }
    function assertAsset(val, type, id) {
      if (!val) {
        'development' !== 'production' && warn('Failed to resolve ' + type + ': ' + id);
      }
    }
    var arrayProto = Array.prototype;
    var arrayMethods = Object.create(arrayProto);
    ;
    ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function(method) {
      var original = arrayProto[method];
      def(arrayMethods, method, function mutator() {
        var i = arguments.length;
        var args = new Array(i);
        while (i--) {
          args[i] = arguments[i];
        }
        var result = original.apply(this, args);
        var ob = this.__ob__;
        var inserted;
        switch (method) {
          case 'push':
            inserted = args;
            break;
          case 'unshift':
            inserted = args;
            break;
          case 'splice':
            inserted = args.slice(2);
            break;
        }
        if (inserted)
          ob.observeArray(inserted);
        ob.dep.notify();
        return result;
      });
    });
    def(arrayProto, '$set', function $set(index, val) {
      if (index >= this.length) {
        this.length = index + 1;
      }
      return this.splice(index, 1, val)[0];
    });
    def(arrayProto, '$remove', function $remove(item) {
      if (!this.length)
        return;
      var index = indexOf(this, item);
      if (index > -1) {
        return this.splice(index, 1);
      }
    });
    var uid$3 = 0;
    function Dep() {
      this.id = uid$3++;
      this.subs = [];
    }
    Dep.target = null;
    Dep.prototype.addSub = function(sub) {
      this.subs.push(sub);
    };
    Dep.prototype.removeSub = function(sub) {
      this.subs.$remove(sub);
    };
    Dep.prototype.depend = function() {
      Dep.target.addDep(this);
    };
    Dep.prototype.notify = function() {
      var subs = toArray(this.subs);
      for (var i = 0,
          l = subs.length; i < l; i++) {
        subs[i].update();
      }
    };
    var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
    function Observer(value) {
      this.value = value;
      this.dep = new Dep();
      def(value, '__ob__', this);
      if (isArray(value)) {
        var augment = hasProto ? protoAugment : copyAugment;
        augment(value, arrayMethods, arrayKeys);
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }
    Observer.prototype.walk = function(obj) {
      var keys = Object.keys(obj);
      var i = keys.length;
      while (i--) {
        this.convert(keys[i], obj[keys[i]]);
      }
    };
    Observer.prototype.observeArray = function(items) {
      var i = items.length;
      while (i--) {
        observe(items[i]);
      }
    };
    Observer.prototype.convert = function(key, val) {
      defineReactive(this.value, key, val);
    };
    Observer.prototype.addVm = function(vm) {
      (this.vms || (this.vms = [])).push(vm);
    };
    Observer.prototype.removeVm = function(vm) {
      this.vms.$remove(vm);
    };
    function protoAugment(target, src) {
      target.__proto__ = src;
    }
    function copyAugment(target, src, keys) {
      var i = keys.length;
      var key;
      while (i--) {
        key = keys[i];
        def(target, key, src[key]);
      }
    }
    function observe(value, vm) {
      if (!value || typeof value !== 'object') {
        return;
      }
      var ob;
      if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
      } else if ((isArray(value) || isPlainObject(value)) && !Object.isFrozen(value) && !value._isVue) {
        ob = new Observer(value);
      }
      if (ob && vm) {
        ob.addVm(vm);
      }
      return ob;
    }
    function defineReactive(obj, key, val) {
      var dep = new Dep();
      var getter,
          setter;
      if (config.convertAllProperties) {
        var property = Object.getOwnPropertyDescriptor(obj, key);
        if (property && property.configurable === false) {
          return;
        }
        getter = property && property.get;
        setter = property && property.set;
      }
      var childOb = observe(val);
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
          var value = getter ? getter.call(obj) : val;
          if (Dep.target) {
            dep.depend();
            if (childOb) {
              childOb.dep.depend();
            }
            if (isArray(value)) {
              for (var e,
                  i = 0,
                  l = value.length; i < l; i++) {
                e = value[i];
                e && e.__ob__ && e.__ob__.dep.depend();
              }
            }
          }
          return value;
        },
        set: function reactiveSetter(newVal) {
          var value = getter ? getter.call(obj) : val;
          if (newVal === value) {
            return;
          }
          if (setter) {
            setter.call(obj, newVal);
          } else {
            val = newVal;
          }
          childOb = observe(newVal);
          dep.notify();
        }
      });
    }
    var util = Object.freeze({
      defineReactive: defineReactive,
      set: set,
      del: del,
      hasOwn: hasOwn,
      isLiteral: isLiteral,
      isReserved: isReserved,
      _toString: _toString,
      toNumber: toNumber,
      toBoolean: toBoolean,
      stripQuotes: stripQuotes,
      camelize: camelize,
      hyphenate: hyphenate,
      classify: classify,
      bind: bind$1,
      toArray: toArray,
      extend: extend,
      isObject: isObject,
      isPlainObject: isPlainObject,
      def: def,
      debounce: _debounce,
      indexOf: indexOf,
      cancellable: cancellable,
      looseEqual: looseEqual,
      isArray: isArray,
      hasProto: hasProto,
      inBrowser: inBrowser,
      isIE9: isIE9,
      isAndroid: isAndroid,
      get transitionProp() {
        return transitionProp;
      },
      get transitionEndEvent() {
        return transitionEndEvent;
      },
      get animationProp() {
        return animationProp;
      },
      get animationEndEvent() {
        return animationEndEvent;
      },
      nextTick: nextTick,
      query: query,
      inDoc: inDoc,
      getAttr: getAttr,
      getBindAttr: getBindAttr,
      before: before,
      after: after,
      remove: remove,
      prepend: prepend,
      replace: replace,
      on: on$1,
      off: off,
      addClass: addClass,
      removeClass: removeClass,
      extractContent: extractContent,
      trimNode: trimNode,
      isTemplate: isTemplate,
      createAnchor: createAnchor,
      findRef: findRef,
      mapNodeRange: mapNodeRange,
      removeNodeRange: removeNodeRange,
      mergeOptions: mergeOptions,
      resolveAsset: resolveAsset,
      assertAsset: assertAsset,
      checkComponentAttr: checkComponentAttr,
      initProp: initProp,
      assertProp: assertProp,
      commonTagRE: commonTagRE,
      get warn() {
        return warn;
      }
    });
    var uid = 0;
    function initMixin(Vue) {
      Vue.prototype._init = function(options) {
        options = options || {};
        this.$el = null;
        this.$parent = options.parent;
        this.$root = this.$parent ? this.$parent.$root : this;
        this.$children = [];
        this.$refs = {};
        this.$els = {};
        this._watchers = [];
        this._directives = [];
        this._uid = uid++;
        this._isVue = true;
        this._events = {};
        this._eventsCount = {};
        this._isFragment = false;
        this._fragment = this._fragmentStart = this._fragmentEnd = null;
        this._isCompiled = this._isDestroyed = this._isReady = this._isAttached = this._isBeingDestroyed = false;
        this._unlinkFn = null;
        this._context = options._context || this.$parent;
        this._scope = options._scope;
        this._frag = options._frag;
        if (this._frag) {
          this._frag.children.push(this);
        }
        if (this.$parent) {
          this.$parent.$children.push(this);
        }
        options = this.$options = mergeOptions(this.constructor.options, options, this);
        this._updateRef();
        this._data = {};
        this._callHook('init');
        this._initState();
        this._initEvents();
        this._callHook('created');
        if (options.el) {
          this.$mount(options.el);
        }
      };
    }
    var pathCache = new Cache(1000);
    var APPEND = 0;
    var PUSH = 1;
    var INC_SUB_PATH_DEPTH = 2;
    var PUSH_SUB_PATH = 3;
    var BEFORE_PATH = 0;
    var IN_PATH = 1;
    var BEFORE_IDENT = 2;
    var IN_IDENT = 3;
    var IN_SUB_PATH = 4;
    var IN_SINGLE_QUOTE = 5;
    var IN_DOUBLE_QUOTE = 6;
    var AFTER_PATH = 7;
    var ERROR = 8;
    var pathStateMachine = [];
    pathStateMachine[BEFORE_PATH] = {
      'ws': [BEFORE_PATH],
      'ident': [IN_IDENT, APPEND],
      '[': [IN_SUB_PATH],
      'eof': [AFTER_PATH]
    };
    pathStateMachine[IN_PATH] = {
      'ws': [IN_PATH],
      '.': [BEFORE_IDENT],
      '[': [IN_SUB_PATH],
      'eof': [AFTER_PATH]
    };
    pathStateMachine[BEFORE_IDENT] = {
      'ws': [BEFORE_IDENT],
      'ident': [IN_IDENT, APPEND]
    };
    pathStateMachine[IN_IDENT] = {
      'ident': [IN_IDENT, APPEND],
      '0': [IN_IDENT, APPEND],
      'number': [IN_IDENT, APPEND],
      'ws': [IN_PATH, PUSH],
      '.': [BEFORE_IDENT, PUSH],
      '[': [IN_SUB_PATH, PUSH],
      'eof': [AFTER_PATH, PUSH]
    };
    pathStateMachine[IN_SUB_PATH] = {
      "'": [IN_SINGLE_QUOTE, APPEND],
      '"': [IN_DOUBLE_QUOTE, APPEND],
      '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
      ']': [IN_PATH, PUSH_SUB_PATH],
      'eof': ERROR,
      'else': [IN_SUB_PATH, APPEND]
    };
    pathStateMachine[IN_SINGLE_QUOTE] = {
      "'": [IN_SUB_PATH, APPEND],
      'eof': ERROR,
      'else': [IN_SINGLE_QUOTE, APPEND]
    };
    pathStateMachine[IN_DOUBLE_QUOTE] = {
      '"': [IN_SUB_PATH, APPEND],
      'eof': ERROR,
      'else': [IN_DOUBLE_QUOTE, APPEND]
    };
    function getPathCharType(ch) {
      if (ch === undefined) {
        return 'eof';
      }
      var code = ch.charCodeAt(0);
      switch (code) {
        case 0x5B:
        case 0x5D:
        case 0x2E:
        case 0x22:
        case 0x27:
        case 0x30:
          return ch;
        case 0x5F:
        case 0x24:
          return 'ident';
        case 0x20:
        case 0x09:
        case 0x0A:
        case 0x0D:
        case 0xA0:
        case 0xFEFF:
        case 0x2028:
        case 0x2029:
          return 'ws';
      }
      if (code >= 0x61 && code <= 0x7A || code >= 0x41 && code <= 0x5A) {
        return 'ident';
      }
      if (code >= 0x31 && code <= 0x39) {
        return 'number';
      }
      return 'else';
    }
    function formatSubPath(path) {
      var trimmed = path.trim();
      if (path.charAt(0) === '0' && isNaN(path)) {
        return false;
      }
      return isLiteral(trimmed) ? stripQuotes(trimmed) : '*' + trimmed;
    }
    function parse(path) {
      var keys = [];
      var index = -1;
      var mode = BEFORE_PATH;
      var subPathDepth = 0;
      var c,
          newChar,
          key,
          type,
          transition,
          action,
          typeMap;
      var actions = [];
      actions[PUSH] = function() {
        if (key !== undefined) {
          keys.push(key);
          key = undefined;
        }
      };
      actions[APPEND] = function() {
        if (key === undefined) {
          key = newChar;
        } else {
          key += newChar;
        }
      };
      actions[INC_SUB_PATH_DEPTH] = function() {
        actions[APPEND]();
        subPathDepth++;
      };
      actions[PUSH_SUB_PATH] = function() {
        if (subPathDepth > 0) {
          subPathDepth--;
          mode = IN_SUB_PATH;
          actions[APPEND]();
        } else {
          subPathDepth = 0;
          key = formatSubPath(key);
          if (key === false) {
            return false;
          } else {
            actions[PUSH]();
          }
        }
      };
      function maybeUnescapeQuote() {
        var nextChar = path[index + 1];
        if (mode === IN_SINGLE_QUOTE && nextChar === "'" || mode === IN_DOUBLE_QUOTE && nextChar === '"') {
          index++;
          newChar = '\\' + nextChar;
          actions[APPEND]();
          return true;
        }
      }
      while (mode != null) {
        index++;
        c = path[index];
        if (c === '\\' && maybeUnescapeQuote()) {
          continue;
        }
        type = getPathCharType(c);
        typeMap = pathStateMachine[mode];
        transition = typeMap[type] || typeMap['else'] || ERROR;
        if (transition === ERROR) {
          return;
        }
        mode = transition[0];
        action = actions[transition[1]];
        if (action) {
          newChar = transition[2];
          newChar = newChar === undefined ? c : newChar;
          if (action() === false) {
            return;
          }
        }
        if (mode === AFTER_PATH) {
          keys.raw = path;
          return keys;
        }
      }
    }
    function parsePath(path) {
      var hit = pathCache.get(path);
      if (!hit) {
        hit = parse(path);
        if (hit) {
          pathCache.put(path, hit);
        }
      }
      return hit;
    }
    function getPath(obj, path) {
      return parseExpression(path).get(obj);
    }
    var warnNonExistent;
    if ('development' !== 'production') {
      warnNonExistent = function(path) {
        warn('You are setting a non-existent path "' + path.raw + '" ' + 'on a vm instance. Consider pre-initializing the property ' + 'with the "data" option for more reliable reactivity ' + 'and better performance.');
      };
    }
    function setPath(obj, path, val) {
      var original = obj;
      if (typeof path === 'string') {
        path = parse(path);
      }
      if (!path || !isObject(obj)) {
        return false;
      }
      var last,
          key;
      for (var i = 0,
          l = path.length; i < l; i++) {
        last = obj;
        key = path[i];
        if (key.charAt(0) === '*') {
          key = parseExpression(key.slice(1)).get.call(original, original);
        }
        if (i < l - 1) {
          obj = obj[key];
          if (!isObject(obj)) {
            obj = {};
            if ('development' !== 'production' && last._isVue) {
              warnNonExistent(path);
            }
            set(last, key, obj);
          }
        } else {
          if (isArray(obj)) {
            obj.$set(key, val);
          } else if (key in obj) {
            obj[key] = val;
          } else {
            if ('development' !== 'production' && obj._isVue) {
              warnNonExistent(path);
            }
            set(obj, key, val);
          }
        }
      }
      return true;
    }
    var path = Object.freeze({
      parsePath: parsePath,
      getPath: getPath,
      setPath: setPath
    });
    var expressionCache = new Cache(1000);
    var allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
    var allowedKeywordsRE = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');
    var improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' + 'delete,do,else,export,extends,finally,for,function,if,' + 'import,in,instanceof,let,return,super,switch,throw,try,' + 'var,while,with,yield,enum,await,implements,package,' + 'proctected,static,interface,private,public';
    var improperKeywordsRE = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');
    var wsRE = /\s/g;
    var newlineRE = /\n/g;
    var saveRE = /[\{,]\s*[\w\$_]+\s*:|('[^']*'|"[^"]*")|new |typeof |void /g;
    var restoreRE = /"(\d+)"/g;
    var pathTestRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
    var pathReplaceRE = /[^\w$\.]([A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\])*)/g;
    var booleanLiteralRE = /^(true|false)$/;
    var saved = [];
    function save(str, isString) {
      var i = saved.length;
      saved[i] = isString ? str.replace(newlineRE, '\\n') : str;
      return '"' + i + '"';
    }
    function rewrite(raw) {
      var c = raw.charAt(0);
      var path = raw.slice(1);
      if (allowedKeywordsRE.test(path)) {
        return raw;
      } else {
        path = path.indexOf('"') > -1 ? path.replace(restoreRE, restore) : path;
        return c + 'scope.' + path;
      }
    }
    function restore(str, i) {
      return saved[i];
    }
    function compileGetter(exp) {
      if (improperKeywordsRE.test(exp)) {
        'development' !== 'production' && warn('Avoid using reserved keywords in expression: ' + exp);
      }
      saved.length = 0;
      var body = exp.replace(saveRE, save).replace(wsRE, '');
      body = (' ' + body).replace(pathReplaceRE, rewrite).replace(restoreRE, restore);
      return makeGetterFn(body);
    }
    function makeGetterFn(body) {
      try {
        return new Function('scope', 'return ' + body + ';');
      } catch (e) {
        'development' !== 'production' && warn('Invalid expression. ' + 'Generated function body: ' + body);
      }
    }
    function compileSetter(exp) {
      var path = parsePath(exp);
      if (path) {
        return function(scope, val) {
          setPath(scope, path, val);
        };
      } else {
        'development' !== 'production' && warn('Invalid setter expression: ' + exp);
      }
    }
    function parseExpression(exp, needSet) {
      exp = exp.trim();
      var hit = expressionCache.get(exp);
      if (hit) {
        if (needSet && !hit.set) {
          hit.set = compileSetter(hit.exp);
        }
        return hit;
      }
      var res = {exp: exp};
      res.get = isSimplePath(exp) && exp.indexOf('[') < 0 ? makeGetterFn('scope.' + exp) : compileGetter(exp);
      if (needSet) {
        res.set = compileSetter(exp);
      }
      expressionCache.put(exp, res);
      return res;
    }
    function isSimplePath(exp) {
      return pathTestRE.test(exp) && !booleanLiteralRE.test(exp) && exp.slice(0, 5) !== 'Math.';
    }
    var expression = Object.freeze({
      parseExpression: parseExpression,
      isSimplePath: isSimplePath
    });
    var queue = [];
    var userQueue = [];
    var has = {};
    var circular = {};
    var waiting = false;
    var internalQueueDepleted = false;
    function resetBatcherState() {
      queue = [];
      userQueue = [];
      has = {};
      circular = {};
      waiting = internalQueueDepleted = false;
    }
    function flushBatcherQueue() {
      runBatcherQueue(queue);
      internalQueueDepleted = true;
      runBatcherQueue(userQueue);
      if ('development' !== 'production') {
        if (inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
          window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('flush');
        }
      }
      resetBatcherState();
    }
    function runBatcherQueue(queue) {
      for (var i = 0; i < queue.length; i++) {
        var watcher = queue[i];
        var id = watcher.id;
        has[id] = null;
        watcher.run();
        if ('development' !== 'production' && has[id] != null) {
          circular[id] = (circular[id] || 0) + 1;
          if (circular[id] > config._maxUpdateCount) {
            queue.splice(has[id], 1);
            warn('You may have an infinite update loop for watcher ' + 'with expression: ' + watcher.expression);
          }
        }
      }
    }
    function pushWatcher(watcher) {
      var id = watcher.id;
      if (has[id] == null) {
        if (internalQueueDepleted && !watcher.user) {
          watcher.run();
          return;
        }
        var q = watcher.user ? userQueue : queue;
        has[id] = q.length;
        q.push(watcher);
        if (!waiting) {
          waiting = true;
          nextTick(flushBatcherQueue);
        }
      }
    }
    var uid$2 = 0;
    function Watcher(vm, expOrFn, cb, options) {
      if (options) {
        extend(this, options);
      }
      var isFn = typeof expOrFn === 'function';
      this.vm = vm;
      vm._watchers.push(this);
      this.expression = isFn ? expOrFn.toString() : expOrFn;
      this.cb = cb;
      this.id = ++uid$2;
      this.active = true;
      this.dirty = this.lazy;
      this.deps = Object.create(null);
      this.newDeps = null;
      this.prevError = null;
      if (isFn) {
        this.getter = expOrFn;
        this.setter = undefined;
      } else {
        var res = parseExpression(expOrFn, this.twoWay);
        this.getter = res.get;
        this.setter = res.set;
      }
      this.value = this.lazy ? undefined : this.get();
      this.queued = this.shallow = false;
    }
    Watcher.prototype.addDep = function(dep) {
      var id = dep.id;
      if (!this.newDeps[id]) {
        this.newDeps[id] = dep;
        if (!this.deps[id]) {
          this.deps[id] = dep;
          dep.addSub(this);
        }
      }
    };
    Watcher.prototype.get = function() {
      this.beforeGet();
      var scope = this.scope || this.vm;
      var value;
      try {
        value = this.getter.call(scope, scope);
      } catch (e) {
        if ('development' !== 'production' && config.warnExpressionErrors) {
          warn('Error when evaluating expression "' + this.expression + '". ' + (config.debug ? '' : 'Turn on debug mode to see stack trace.'), e);
        }
      }
      if (this.deep) {
        traverse(value);
      }
      if (this.preProcess) {
        value = this.preProcess(value);
      }
      if (this.filters) {
        value = scope._applyFilters(value, null, this.filters, false);
      }
      if (this.postProcess) {
        value = this.postProcess(value);
      }
      this.afterGet();
      return value;
    };
    Watcher.prototype.set = function(value) {
      var scope = this.scope || this.vm;
      if (this.filters) {
        value = scope._applyFilters(value, this.value, this.filters, true);
      }
      try {
        this.setter.call(scope, scope, value);
      } catch (e) {
        if ('development' !== 'production' && config.warnExpressionErrors) {
          warn('Error when evaluating setter "' + this.expression + '"', e);
        }
      }
      var forContext = scope.$forContext;
      if (forContext && forContext.alias === this.expression) {
        if (forContext.filters) {
          'development' !== 'production' && warn('It seems you are using two-way binding on ' + 'a v-for alias (' + this.expression + '), and the ' + 'v-for has filters. This will not work properly. ' + 'Either remove the filters or use an array of ' + 'objects and bind to object properties instead.');
          return;
        }
        forContext._withLock(function() {
          if (scope.$key) {
            forContext.rawValue[scope.$key] = value;
          } else {
            forContext.rawValue.$set(scope.$index, value);
          }
        });
      }
    };
    Watcher.prototype.beforeGet = function() {
      Dep.target = this;
      this.newDeps = Object.create(null);
    };
    Watcher.prototype.afterGet = function() {
      Dep.target = null;
      var ids = Object.keys(this.deps);
      var i = ids.length;
      while (i--) {
        var id = ids[i];
        if (!this.newDeps[id]) {
          this.deps[id].removeSub(this);
        }
      }
      this.deps = this.newDeps;
    };
    Watcher.prototype.update = function(shallow) {
      if (this.lazy) {
        this.dirty = true;
      } else if (this.sync || !config.async) {
        this.run();
      } else {
        this.shallow = this.queued ? shallow ? this.shallow : false : !!shallow;
        this.queued = true;
        if ('development' !== 'production' && config.debug) {
          this.prevError = new Error('[vue] async stack trace');
        }
        pushWatcher(this);
      }
    };
    Watcher.prototype.run = function() {
      if (this.active) {
        var value = this.get();
        if (value !== this.value || (isArray(value) || this.deep) && !this.shallow) {
          var oldValue = this.value;
          this.value = value;
          var prevError = this.prevError;
          if ('development' !== 'production' && config.debug && prevError) {
            this.prevError = null;
            try {
              this.cb.call(this.vm, value, oldValue);
            } catch (e) {
              nextTick(function() {
                throw prevError;
              }, 0);
              throw e;
            }
          } else {
            this.cb.call(this.vm, value, oldValue);
          }
        }
        this.queued = this.shallow = false;
      }
    };
    Watcher.prototype.evaluate = function() {
      var current = Dep.target;
      this.value = this.get();
      this.dirty = false;
      Dep.target = current;
    };
    Watcher.prototype.depend = function() {
      var depIds = Object.keys(this.deps);
      var i = depIds.length;
      while (i--) {
        this.deps[depIds[i]].depend();
      }
    };
    Watcher.prototype.teardown = function() {
      if (this.active) {
        if (!this.vm._isBeingDestroyed) {
          this.vm._watchers.$remove(this);
        }
        var depIds = Object.keys(this.deps);
        var i = depIds.length;
        while (i--) {
          this.deps[depIds[i]].removeSub(this);
        }
        this.active = false;
        this.vm = this.cb = this.value = null;
      }
    };
    function traverse(val) {
      var i,
          keys;
      if (isArray(val)) {
        i = val.length;
        while (i--)
          traverse(val[i]);
      } else if (isObject(val)) {
        keys = Object.keys(val);
        i = keys.length;
        while (i--)
          traverse(val[keys[i]]);
      }
    }
    var cloak = {bind: function bind() {
        var el = this.el;
        this.vm.$once('hook:compiled', function() {
          el.removeAttribute('v-cloak');
        });
      }};
    var ref = {bind: function bind() {
        'development' !== 'production' && warn('v-ref:' + this.arg + ' must be used on a child ' + 'component. Found on <' + this.el.tagName.toLowerCase() + '>.');
      }};
    var el = {
      priority: 1500,
      bind: function bind() {
        if (!this.arg) {
          return;
        }
        var id = this.id = camelize(this.arg);
        var refs = (this._scope || this.vm).$els;
        if (hasOwn(refs, id)) {
          refs[id] = this.el;
        } else {
          defineReactive(refs, id, this.el);
        }
      },
      unbind: function unbind() {
        var refs = (this._scope || this.vm).$els;
        if (refs[this.id] === this.el) {
          refs[this.id] = null;
        }
      }
    };
    var prefixes = ['-webkit-', '-moz-', '-ms-'];
    var camelPrefixes = ['Webkit', 'Moz', 'ms'];
    var importantRE = /!important;?$/;
    var propCache = Object.create(null);
    var testEl = null;
    var style = {
      deep: true,
      update: function update(value) {
        if (typeof value === 'string') {
          this.el.style.cssText = value;
        } else if (isArray(value)) {
          this.handleObject(value.reduce(extend, {}));
        } else {
          this.handleObject(value || {});
        }
      },
      handleObject: function handleObject(value) {
        var cache = this.cache || (this.cache = {});
        var name,
            val;
        for (name in cache) {
          if (!(name in value)) {
            this.handleSingle(name, null);
            delete cache[name];
          }
        }
        for (name in value) {
          val = value[name];
          if (val !== cache[name]) {
            cache[name] = val;
            this.handleSingle(name, val);
          }
        }
      },
      handleSingle: function handleSingle(prop, value) {
        prop = normalize(prop);
        if (!prop)
          return;
        if (value != null)
          value += '';
        if (value) {
          var isImportant = importantRE.test(value) ? 'important' : '';
          if (isImportant) {
            value = value.replace(importantRE, '').trim();
          }
          this.el.style.setProperty(prop, value, isImportant);
        } else {
          this.el.style.removeProperty(prop);
        }
      }
    };
    function normalize(prop) {
      if (propCache[prop]) {
        return propCache[prop];
      }
      var res = prefix(prop);
      propCache[prop] = propCache[res] = res;
      return res;
    }
    function prefix(prop) {
      prop = hyphenate(prop);
      var camel = camelize(prop);
      var upper = camel.charAt(0).toUpperCase() + camel.slice(1);
      if (!testEl) {
        testEl = document.createElement('div');
      }
      if (camel in testEl.style) {
        return prop;
      }
      var i = prefixes.length;
      var prefixed;
      while (i--) {
        prefixed = camelPrefixes[i] + upper;
        if (prefixed in testEl.style) {
          return prefixes[i] + prop;
        }
      }
    }
    var xlinkNS = 'http://www.w3.org/1999/xlink';
    var xlinkRE = /^xlink:/;
    var inputProps = {
      value: 1,
      checked: 1,
      selected: 1
    };
    var modelProps = {
      value: '_value',
      'true-value': '_trueValue',
      'false-value': '_falseValue'
    };
    var disallowedInterpAttrRE = /^v-|^:|^@|^(is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/;
    var bind = {
      priority: 850,
      bind: function bind() {
        var attr = this.arg;
        var tag = this.el.tagName;
        if (!attr) {
          this.deep = true;
        }
        if (this.descriptor.interp) {
          if (disallowedInterpAttrRE.test(attr) || attr === 'name' && (tag === 'PARTIAL' || tag === 'SLOT')) {
            'development' !== 'production' && warn(attr + '="' + this.descriptor.raw + '": ' + 'attribute interpolation is not allowed in Vue.js ' + 'directives and special attributes.');
            this.el.removeAttribute(attr);
            this.invalid = true;
          }
          if ('development' !== 'production') {
            var raw = attr + '="' + this.descriptor.raw + '": ';
            if (attr === 'src') {
              warn(raw + 'interpolation in "src" attribute will cause ' + 'a 404 request. Use v-bind:src instead.');
            }
            if (attr === 'style') {
              warn(raw + 'interpolation in "style" attribute will cause ' + 'the attribute to be discarded in Internet Explorer. ' + 'Use v-bind:style instead.');
            }
          }
        }
      },
      update: function update(value) {
        if (this.invalid) {
          return;
        }
        var attr = this.arg;
        if (this.arg) {
          this.handleSingle(attr, value);
        } else {
          this.handleObject(value || {});
        }
      },
      handleObject: style.handleObject,
      handleSingle: function handleSingle(attr, value) {
        if (inputProps[attr] && attr in this.el) {
          this.el[attr] = attr === 'value' ? value || '' : value;
        }
        var modelProp = modelProps[attr];
        if (modelProp) {
          this.el[modelProp] = value;
          var model = this.el.__v_model;
          if (model) {
            model.listener();
          }
        }
        if (attr === 'value' && this.el.tagName === 'TEXTAREA') {
          this.el.removeAttribute(attr);
          return;
        }
        if (value != null && value !== false) {
          if (xlinkRE.test(attr)) {
            this.el.setAttributeNS(xlinkNS, attr, value);
          } else {
            this.el.setAttribute(attr, value);
          }
        } else {
          this.el.removeAttribute(attr);
        }
      }
    };
    var keyCodes = {
      esc: 27,
      tab: 9,
      enter: 13,
      space: 32,
      'delete': 46,
      up: 38,
      left: 37,
      right: 39,
      down: 40
    };
    function keyFilter(handler, keys) {
      var codes = keys.map(function(key) {
        var charCode = key.charCodeAt(0);
        if (charCode > 47 && charCode < 58) {
          return parseInt(key, 10);
        }
        if (key.length === 1) {
          charCode = key.toUpperCase().charCodeAt(0);
          if (charCode > 64 && charCode < 91) {
            return charCode;
          }
        }
        return keyCodes[key];
      });
      return function keyHandler(e) {
        if (codes.indexOf(e.keyCode) > -1) {
          return handler.call(this, e);
        }
      };
    }
    function stopFilter(handler) {
      return function stopHandler(e) {
        e.stopPropagation();
        return handler.call(this, e);
      };
    }
    function preventFilter(handler) {
      return function preventHandler(e) {
        e.preventDefault();
        return handler.call(this, e);
      };
    }
    var on = {
      acceptStatement: true,
      priority: 700,
      bind: function bind() {
        if (this.el.tagName === 'IFRAME' && this.arg !== 'load') {
          var self = this;
          this.iframeBind = function() {
            on$1(self.el.contentWindow, self.arg, self.handler);
          };
          this.on('load', this.iframeBind);
        }
      },
      update: function update(handler) {
        if (!this.descriptor.raw) {
          handler = function() {};
        }
        if (typeof handler !== 'function') {
          'development' !== 'production' && warn('v-on:' + this.arg + '="' + this.expression + '" expects a function value, ' + 'got ' + handler);
          return;
        }
        if (this.modifiers.stop) {
          handler = stopFilter(handler);
        }
        if (this.modifiers.prevent) {
          handler = preventFilter(handler);
        }
        var keys = Object.keys(this.modifiers).filter(function(key) {
          return key !== 'stop' && key !== 'prevent';
        });
        if (keys.length) {
          handler = keyFilter(handler, keys);
        }
        this.reset();
        this.handler = handler;
        if (this.iframeBind) {
          this.iframeBind();
        } else {
          on$1(this.el, this.arg, this.handler);
        }
      },
      reset: function reset() {
        var el = this.iframeBind ? this.el.contentWindow : this.el;
        if (this.handler) {
          off(el, this.arg, this.handler);
        }
      },
      unbind: function unbind() {
        this.reset();
      }
    };
    var checkbox = {
      bind: function bind() {
        var self = this;
        var el = this.el;
        this.getValue = function() {
          return el.hasOwnProperty('_value') ? el._value : self.params.number ? toNumber(el.value) : el.value;
        };
        function getBooleanValue() {
          var val = el.checked;
          if (val && el.hasOwnProperty('_trueValue')) {
            return el._trueValue;
          }
          if (!val && el.hasOwnProperty('_falseValue')) {
            return el._falseValue;
          }
          return val;
        }
        this.listener = function() {
          var model = self._watcher.value;
          if (isArray(model)) {
            var val = self.getValue();
            if (el.checked) {
              if (indexOf(model, val) < 0) {
                model.push(val);
              }
            } else {
              model.$remove(val);
            }
          } else {
            self.set(getBooleanValue());
          }
        };
        this.on('change', this.listener);
        if (el.checked) {
          this.afterBind = this.listener;
        }
      },
      update: function update(value) {
        var el = this.el;
        if (isArray(value)) {
          el.checked = indexOf(value, this.getValue()) > -1;
        } else {
          if (el.hasOwnProperty('_trueValue')) {
            el.checked = looseEqual(value, el._trueValue);
          } else {
            el.checked = !!value;
          }
        }
      }
    };
    var select = {
      bind: function bind() {
        var self = this;
        var el = this.el;
        this.forceUpdate = function() {
          if (self._watcher) {
            self.update(self._watcher.get());
          }
        };
        var multiple = this.multiple = el.hasAttribute('multiple');
        this.listener = function() {
          var value = getValue(el, multiple);
          value = self.params.number ? isArray(value) ? value.map(toNumber) : toNumber(value) : value;
          self.set(value);
        };
        this.on('change', this.listener);
        var initValue = getValue(el, multiple, true);
        if (multiple && initValue.length || !multiple && initValue !== null) {
          this.afterBind = this.listener;
        }
        this.vm.$on('hook:attached', this.forceUpdate);
      },
      update: function update(value) {
        var el = this.el;
        el.selectedIndex = -1;
        var multi = this.multiple && isArray(value);
        var options = el.options;
        var i = options.length;
        var op,
            val;
        while (i--) {
          op = options[i];
          val = op.hasOwnProperty('_value') ? op._value : op.value;
          op.selected = multi ? indexOf$1(value, val) > -1 : looseEqual(value, val);
        }
      },
      unbind: function unbind() {
        this.vm.$off('hook:attached', this.forceUpdate);
      }
    };
    function getValue(el, multi, init) {
      var res = multi ? [] : null;
      var op,
          val,
          selected;
      for (var i = 0,
          l = el.options.length; i < l; i++) {
        op = el.options[i];
        selected = init ? op.hasAttribute('selected') : op.selected;
        if (selected) {
          val = op.hasOwnProperty('_value') ? op._value : op.value;
          if (multi) {
            res.push(val);
          } else {
            return val;
          }
        }
      }
      return res;
    }
    function indexOf$1(arr, val) {
      var i = arr.length;
      while (i--) {
        if (looseEqual(arr[i], val)) {
          return i;
        }
      }
      return -1;
    }
    var radio = {
      bind: function bind() {
        var self = this;
        var el = this.el;
        this.getValue = function() {
          if (el.hasOwnProperty('_value')) {
            return el._value;
          }
          var val = el.value;
          if (self.params.number) {
            val = toNumber(val);
          }
          return val;
        };
        this.listener = function() {
          self.set(self.getValue());
        };
        this.on('change', this.listener);
        if (el.checked) {
          this.afterBind = this.listener;
        }
      },
      update: function update(value) {
        this.el.checked = looseEqual(value, this.getValue());
      }
    };
    var text$2 = {
      bind: function bind() {
        var self = this;
        var el = this.el;
        var isRange = el.type === 'range';
        var lazy = this.params.lazy;
        var number = this.params.number;
        var debounce = this.params.debounce;
        var composing = false;
        if (!isAndroid && !isRange) {
          this.on('compositionstart', function() {
            composing = true;
          });
          this.on('compositionend', function() {
            composing = false;
            if (!lazy) {
              self.listener();
            }
          });
        }
        this.focused = false;
        if (!isRange) {
          this.on('focus', function() {
            self.focused = true;
          });
          this.on('blur', function() {
            self.focused = false;
            self.listener();
          });
        }
        this.listener = function() {
          if (composing)
            return;
          var val = number || isRange ? toNumber(el.value) : el.value;
          self.set(val);
          nextTick(function() {
            if (self._bound && !self.focused) {
              self.update(self._watcher.value);
            }
          });
        };
        if (debounce) {
          this.listener = _debounce(this.listener, debounce);
        }
        this.hasjQuery = typeof jQuery === 'function';
        if (this.hasjQuery) {
          jQuery(el).on('change', this.listener);
          if (!lazy) {
            jQuery(el).on('input', this.listener);
          }
        } else {
          this.on('change', this.listener);
          if (!lazy) {
            this.on('input', this.listener);
          }
        }
        if (!lazy && isIE9) {
          this.on('cut', function() {
            nextTick(self.listener);
          });
          this.on('keyup', function(e) {
            if (e.keyCode === 46 || e.keyCode === 8) {
              self.listener();
            }
          });
        }
        if (el.hasAttribute('value') || el.tagName === 'TEXTAREA' && el.value.trim()) {
          this.afterBind = this.listener;
        }
      },
      update: function update(value) {
        this.el.value = _toString(value);
      },
      unbind: function unbind() {
        var el = this.el;
        if (this.hasjQuery) {
          jQuery(el).off('change', this.listener);
          jQuery(el).off('input', this.listener);
        }
      }
    };
    var handlers = {
      text: text$2,
      radio: radio,
      select: select,
      checkbox: checkbox
    };
    var model = {
      priority: 800,
      twoWay: true,
      handlers: handlers,
      params: ['lazy', 'number', 'debounce'],
      bind: function bind() {
        this.checkFilters();
        if (this.hasRead && !this.hasWrite) {
          'development' !== 'production' && warn('It seems you are using a read-only filter with ' + 'v-model. You might want to use a two-way filter ' + 'to ensure correct behavior.');
        }
        var el = this.el;
        var tag = el.tagName;
        var handler;
        if (tag === 'INPUT') {
          handler = handlers[el.type] || handlers.text;
        } else if (tag === 'SELECT') {
          handler = handlers.select;
        } else if (tag === 'TEXTAREA') {
          handler = handlers.text;
        } else {
          'development' !== 'production' && warn('v-model does not support element type: ' + tag);
          return;
        }
        el.__v_model = this;
        handler.bind.call(this);
        this.update = handler.update;
        this._unbind = handler.unbind;
      },
      checkFilters: function checkFilters() {
        var filters = this.filters;
        if (!filters)
          return;
        var i = filters.length;
        while (i--) {
          var filter = resolveAsset(this.vm.$options, 'filters', filters[i].name);
          if (typeof filter === 'function' || filter.read) {
            this.hasRead = true;
          }
          if (filter.write) {
            this.hasWrite = true;
          }
        }
      },
      unbind: function unbind() {
        this.el.__v_model = null;
        this._unbind && this._unbind();
      }
    };
    var show = {
      bind: function bind() {
        var next = this.el.nextElementSibling;
        if (next && getAttr(next, 'v-else') !== null) {
          this.elseEl = next;
        }
      },
      update: function update(value) {
        this.apply(this.el, value);
        if (this.elseEl) {
          this.apply(this.elseEl, !value);
        }
      },
      apply: function apply(el, value) {
        applyTransition(el, value ? 1 : -1, function() {
          el.style.display = value ? '' : 'none';
        }, this.vm);
      }
    };
    var templateCache = new Cache(1000);
    var idSelectorCache = new Cache(1000);
    var map = {
      efault: [0, '', ''],
      legend: [1, '<fieldset>', '</fieldset>'],
      tr: [2, '<table><tbody>', '</tbody></table>'],
      col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>']
    };
    map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];
    map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];
    map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];
    map.g = map.defs = map.symbol = map.use = map.image = map.text = map.circle = map.ellipse = map.line = map.path = map.polygon = map.polyline = map.rect = [1, '<svg ' + 'xmlns="http://www.w3.org/2000/svg" ' + 'xmlns:xlink="http://www.w3.org/1999/xlink" ' + 'xmlns:ev="http://www.w3.org/2001/xml-events"' + 'version="1.1">', '</svg>'];
    function isRealTemplate(node) {
      return isTemplate(node) && node.content instanceof DocumentFragment;
    }
    var tagRE$1 = /<([\w:]+)/;
    var entityRE = /&\w+;|&#\d+;|&#x[\dA-F]+;/;
    function stringToFragment(templateString, raw) {
      var hit = templateCache.get(templateString);
      if (hit) {
        return hit;
      }
      var frag = document.createDocumentFragment();
      var tagMatch = templateString.match(tagRE$1);
      var entityMatch = entityRE.test(templateString);
      if (!tagMatch && !entityMatch) {
        frag.appendChild(document.createTextNode(templateString));
      } else {
        var tag = tagMatch && tagMatch[1];
        var wrap = map[tag] || map.efault;
        var depth = wrap[0];
        var prefix = wrap[1];
        var suffix = wrap[2];
        var node = document.createElement('div');
        if (!raw) {
          templateString = templateString.trim();
        }
        node.innerHTML = prefix + templateString + suffix;
        while (depth--) {
          node = node.lastChild;
        }
        var child;
        while (child = node.firstChild) {
          frag.appendChild(child);
        }
      }
      templateCache.put(templateString, frag);
      return frag;
    }
    function nodeToFragment(node) {
      if (isRealTemplate(node)) {
        trimNode(node.content);
        return node.content;
      }
      if (node.tagName === 'SCRIPT') {
        return stringToFragment(node.textContent);
      }
      var clonedNode = cloneNode(node);
      var frag = document.createDocumentFragment();
      var child;
      while (child = clonedNode.firstChild) {
        frag.appendChild(child);
      }
      trimNode(frag);
      return frag;
    }
    var hasBrokenTemplate = (function() {
      if (inBrowser) {
        var a = document.createElement('div');
        a.innerHTML = '<template>1</template>';
        return !a.cloneNode(true).firstChild.innerHTML;
      } else {
        return false;
      }
    })();
    var hasTextareaCloneBug = (function() {
      if (inBrowser) {
        var t = document.createElement('textarea');
        t.placeholder = 't';
        return t.cloneNode(true).value === 't';
      } else {
        return false;
      }
    })();
    function cloneNode(node) {
      if (!node.querySelectorAll) {
        return node.cloneNode();
      }
      var res = node.cloneNode(true);
      var i,
          original,
          cloned;
      if (hasBrokenTemplate) {
        var tempClone = res;
        if (isRealTemplate(node)) {
          node = node.content;
          tempClone = res.content;
        }
        original = node.querySelectorAll('template');
        if (original.length) {
          cloned = tempClone.querySelectorAll('template');
          i = cloned.length;
          while (i--) {
            cloned[i].parentNode.replaceChild(cloneNode(original[i]), cloned[i]);
          }
        }
      }
      if (hasTextareaCloneBug) {
        if (node.tagName === 'TEXTAREA') {
          res.value = node.value;
        } else {
          original = node.querySelectorAll('textarea');
          if (original.length) {
            cloned = res.querySelectorAll('textarea');
            i = cloned.length;
            while (i--) {
              cloned[i].value = original[i].value;
            }
          }
        }
      }
      return res;
    }
    function parseTemplate(template, shouldClone, raw) {
      var node,
          frag;
      if (template instanceof DocumentFragment) {
        trimNode(template);
        return shouldClone ? cloneNode(template) : template;
      }
      if (typeof template === 'string') {
        if (!raw && template.charAt(0) === '#') {
          frag = idSelectorCache.get(template);
          if (!frag) {
            node = document.getElementById(template.slice(1));
            if (node) {
              frag = nodeToFragment(node);
              idSelectorCache.put(template, frag);
            }
          }
        } else {
          frag = stringToFragment(template, raw);
        }
      } else if (template.nodeType) {
        frag = nodeToFragment(template);
      }
      return frag && shouldClone ? cloneNode(frag) : frag;
    }
    var template = Object.freeze({
      cloneNode: cloneNode,
      parseTemplate: parseTemplate
    });
    function Fragment(linker, vm, frag, host, scope, parentFrag) {
      this.children = [];
      this.childFrags = [];
      this.vm = vm;
      this.scope = scope;
      this.inserted = false;
      this.parentFrag = parentFrag;
      if (parentFrag) {
        parentFrag.childFrags.push(this);
      }
      this.unlink = linker(vm, frag, host, scope, this);
      var single = this.single = frag.childNodes.length === 1 && !frag.childNodes[0].__vue_anchor;
      if (single) {
        this.node = frag.childNodes[0];
        this.before = singleBefore;
        this.remove = singleRemove;
      } else {
        this.node = createAnchor('fragment-start');
        this.end = createAnchor('fragment-end');
        this.frag = frag;
        prepend(this.node, frag);
        frag.appendChild(this.end);
        this.before = multiBefore;
        this.remove = multiRemove;
      }
      this.node.__vfrag__ = this;
    }
    Fragment.prototype.callHook = function(hook) {
      var i,
          l;
      for (i = 0, l = this.children.length; i < l; i++) {
        hook(this.children[i]);
      }
      for (i = 0, l = this.childFrags.length; i < l; i++) {
        this.childFrags[i].callHook(hook);
      }
    };
    Fragment.prototype.destroy = function() {
      if (this.parentFrag) {
        this.parentFrag.childFrags.$remove(this);
      }
      this.unlink();
    };
    function singleBefore(target, withTransition) {
      this.inserted = true;
      var method = withTransition !== false ? beforeWithTransition : before;
      method(this.node, target, this.vm);
      if (inDoc(this.node)) {
        this.callHook(attach);
      }
    }
    function singleRemove() {
      this.inserted = false;
      var shouldCallRemove = inDoc(this.node);
      var self = this;
      self.callHook(destroyChild);
      removeWithTransition(this.node, this.vm, function() {
        if (shouldCallRemove) {
          self.callHook(detach);
        }
        self.destroy();
      });
    }
    function multiBefore(target, withTransition) {
      this.inserted = true;
      var vm = this.vm;
      var method = withTransition !== false ? beforeWithTransition : before;
      mapNodeRange(this.node, this.end, function(node) {
        method(node, target, vm);
      });
      if (inDoc(this.node)) {
        this.callHook(attach);
      }
    }
    function multiRemove() {
      this.inserted = false;
      var self = this;
      var shouldCallRemove = inDoc(this.node);
      self.callHook(destroyChild);
      removeNodeRange(this.node, this.end, this.vm, this.frag, function() {
        if (shouldCallRemove) {
          self.callHook(detach);
        }
        self.destroy();
      });
    }
    function attach(child) {
      if (!child._isAttached) {
        child._callHook('attached');
      }
    }
    function destroyChild(child) {
      child.$destroy(false, true);
    }
    function detach(child) {
      if (child._isAttached) {
        child._callHook('detached');
      }
    }
    var linkerCache = new Cache(5000);
    function FragmentFactory(vm, el) {
      this.vm = vm;
      var template;
      var isString = typeof el === 'string';
      if (isString || isTemplate(el)) {
        template = parseTemplate(el, true);
      } else {
        template = document.createDocumentFragment();
        template.appendChild(el);
      }
      this.template = template;
      var linker;
      var cid = vm.constructor.cid;
      if (cid > 0) {
        var cacheId = cid + (isString ? el : el.outerHTML);
        linker = linkerCache.get(cacheId);
        if (!linker) {
          linker = compile(template, vm.$options, true);
          linkerCache.put(cacheId, linker);
        }
      } else {
        linker = compile(template, vm.$options, true);
      }
      this.linker = linker;
    }
    FragmentFactory.prototype.create = function(host, scope, parentFrag) {
      var frag = cloneNode(this.template);
      return new Fragment(this.linker, this.vm, frag, host, scope, parentFrag);
    };
    var vIf = {
      priority: 2000,
      bind: function bind() {
        var el = this.el;
        if (!el.__vue__) {
          var next = el.nextElementSibling;
          if (next && getAttr(next, 'v-else') !== null) {
            remove(next);
            this.elseFactory = new FragmentFactory(this.vm, next);
          }
          this.anchor = createAnchor('v-if');
          replace(el, this.anchor);
          this.factory = new FragmentFactory(this.vm, el);
        } else {
          'development' !== 'production' && warn('v-if="' + this.expression + '" cannot be ' + 'used on an instance root element.');
          this.invalid = true;
        }
      },
      update: function update(value) {
        if (this.invalid)
          return;
        if (value) {
          if (!this.frag) {
            this.insert();
          }
        } else {
          this.remove();
        }
      },
      insert: function insert() {
        if (this.elseFrag) {
          this.elseFrag.remove();
          this.elseFrag = null;
        }
        this.frag = this.factory.create(this._host, this._scope, this._frag);
        this.frag.before(this.anchor);
      },
      remove: function remove() {
        if (this.frag) {
          this.frag.remove();
          this.frag = null;
        }
        if (this.elseFactory && !this.elseFrag) {
          this.elseFrag = this.elseFactory.create(this._host, this._scope, this._frag);
          this.elseFrag.before(this.anchor);
        }
      },
      unbind: function unbind() {
        if (this.frag) {
          this.frag.destroy();
        }
      }
    };
    var uid$1 = 0;
    var vFor = {
      priority: 2000,
      params: ['track-by', 'stagger', 'enter-stagger', 'leave-stagger'],
      bind: function bind() {
        var inMatch = this.expression.match(/(.*) in (.*)/);
        if (inMatch) {
          var itMatch = inMatch[1].match(/\((.*),(.*)\)/);
          if (itMatch) {
            this.iterator = itMatch[1].trim();
            this.alias = itMatch[2].trim();
          } else {
            this.alias = inMatch[1].trim();
          }
          this.expression = inMatch[2];
        }
        if (!this.alias) {
          'development' !== 'production' && warn('Alias is required in v-for.');
          return;
        }
        this.id = '__v-for__' + ++uid$1;
        var tag = this.el.tagName;
        this.isOption = (tag === 'OPTION' || tag === 'OPTGROUP') && this.el.parentNode.tagName === 'SELECT';
        this.start = createAnchor('v-for-start');
        this.end = createAnchor('v-for-end');
        replace(this.el, this.end);
        before(this.start, this.end);
        this.cache = Object.create(null);
        this.factory = new FragmentFactory(this.vm, this.el);
      },
      update: function update(data) {
        this.diff(data);
        this.updateRef();
        this.updateModel();
      },
      diff: function diff(data) {
        var item = data[0];
        var convertedFromObject = this.fromObject = isObject(item) && hasOwn(item, '$key') && hasOwn(item, '$value');
        var trackByKey = this.params.trackBy;
        var oldFrags = this.frags;
        var frags = this.frags = new Array(data.length);
        var alias = this.alias;
        var iterator = this.iterator;
        var start = this.start;
        var end = this.end;
        var inDocument = inDoc(start);
        var init = !oldFrags;
        var i,
            l,
            frag,
            key,
            value,
            primitive;
        for (i = 0, l = data.length; i < l; i++) {
          item = data[i];
          key = convertedFromObject ? item.$key : null;
          value = convertedFromObject ? item.$value : item;
          primitive = !isObject(value);
          frag = !init && this.getCachedFrag(value, i, key);
          if (frag) {
            frag.reused = true;
            frag.scope.$index = i;
            if (key) {
              frag.scope.$key = key;
            }
            if (iterator) {
              frag.scope[iterator] = key !== null ? key : i;
            }
            if (trackByKey || convertedFromObject || primitive) {
              frag.scope[alias] = value;
            }
          } else {
            frag = this.create(value, alias, i, key);
            frag.fresh = !init;
          }
          frags[i] = frag;
          if (init) {
            frag.before(end);
          }
        }
        if (init) {
          return;
        }
        var removalIndex = 0;
        var totalRemoved = oldFrags.length - frags.length;
        for (i = 0, l = oldFrags.length; i < l; i++) {
          frag = oldFrags[i];
          if (!frag.reused) {
            this.deleteCachedFrag(frag);
            this.remove(frag, removalIndex++, totalRemoved, inDocument);
          }
        }
        var targetPrev,
            prevEl,
            currentPrev;
        var insertionIndex = 0;
        for (i = 0, l = frags.length; i < l; i++) {
          frag = frags[i];
          targetPrev = frags[i - 1];
          prevEl = targetPrev ? targetPrev.staggerCb ? targetPrev.staggerAnchor : targetPrev.end || targetPrev.node : start;
          if (frag.reused && !frag.staggerCb) {
            currentPrev = findPrevFrag(frag, start, this.id);
            if (currentPrev !== targetPrev && (!currentPrev || findPrevFrag(currentPrev, start, this.id) !== targetPrev)) {
              this.move(frag, prevEl);
            }
          } else {
            this.insert(frag, insertionIndex++, prevEl, inDocument);
          }
          frag.reused = frag.fresh = false;
        }
      },
      create: function create(value, alias, index, key) {
        var host = this._host;
        var parentScope = this._scope || this.vm;
        var scope = Object.create(parentScope);
        scope.$refs = Object.create(parentScope.$refs);
        scope.$els = Object.create(parentScope.$els);
        scope.$parent = parentScope;
        scope.$forContext = this;
        defineReactive(scope, alias, value);
        defineReactive(scope, '$index', index);
        if (key) {
          defineReactive(scope, '$key', key);
        } else if (scope.$key) {
          def(scope, '$key', null);
        }
        if (this.iterator) {
          defineReactive(scope, this.iterator, key !== null ? key : index);
        }
        var frag = this.factory.create(host, scope, this._frag);
        frag.forId = this.id;
        this.cacheFrag(value, frag, index, key);
        return frag;
      },
      updateRef: function updateRef() {
        var ref = this.descriptor.ref;
        if (!ref)
          return;
        var hash = (this._scope || this.vm).$refs;
        var refs;
        if (!this.fromObject) {
          refs = this.frags.map(findVmFromFrag);
        } else {
          refs = {};
          this.frags.forEach(function(frag) {
            refs[frag.scope.$key] = findVmFromFrag(frag);
          });
        }
        hash[ref] = refs;
      },
      updateModel: function updateModel() {
        if (this.isOption) {
          var parent = this.start.parentNode;
          var model = parent && parent.__v_model;
          if (model) {
            model.forceUpdate();
          }
        }
      },
      insert: function insert(frag, index, prevEl, inDocument) {
        if (frag.staggerCb) {
          frag.staggerCb.cancel();
          frag.staggerCb = null;
        }
        var staggerAmount = this.getStagger(frag, index, null, 'enter');
        if (inDocument && staggerAmount) {
          var anchor = frag.staggerAnchor;
          if (!anchor) {
            anchor = frag.staggerAnchor = createAnchor('stagger-anchor');
            anchor.__vfrag__ = frag;
          }
          after(anchor, prevEl);
          var op = frag.staggerCb = cancellable(function() {
            frag.staggerCb = null;
            frag.before(anchor);
            remove(anchor);
          });
          setTimeout(op, staggerAmount);
        } else {
          frag.before(prevEl.nextSibling);
        }
      },
      remove: function remove(frag, index, total, inDocument) {
        if (frag.staggerCb) {
          frag.staggerCb.cancel();
          frag.staggerCb = null;
          return;
        }
        var staggerAmount = this.getStagger(frag, index, total, 'leave');
        if (inDocument && staggerAmount) {
          var op = frag.staggerCb = cancellable(function() {
            frag.staggerCb = null;
            frag.remove();
          });
          setTimeout(op, staggerAmount);
        } else {
          frag.remove();
        }
      },
      move: function move(frag, prevEl) {
        frag.before(prevEl.nextSibling, false);
      },
      cacheFrag: function cacheFrag(value, frag, index, key) {
        var trackByKey = this.params.trackBy;
        var cache = this.cache;
        var primitive = !isObject(value);
        var id;
        if (key || trackByKey || primitive) {
          id = trackByKey ? trackByKey === '$index' ? index : value[trackByKey] : key || value;
          if (!cache[id]) {
            cache[id] = frag;
          } else if (trackByKey !== '$index') {
            'development' !== 'production' && this.warnDuplicate(value);
          }
        } else {
          id = this.id;
          if (hasOwn(value, id)) {
            if (value[id] === null) {
              value[id] = frag;
            } else {
              'development' !== 'production' && this.warnDuplicate(value);
            }
          } else {
            def(value, id, frag);
          }
        }
        frag.raw = value;
      },
      getCachedFrag: function getCachedFrag(value, index, key) {
        var trackByKey = this.params.trackBy;
        var primitive = !isObject(value);
        var frag;
        if (key || trackByKey || primitive) {
          var id = trackByKey ? trackByKey === '$index' ? index : value[trackByKey] : key || value;
          frag = this.cache[id];
        } else {
          frag = value[this.id];
        }
        if (frag && (frag.reused || frag.fresh)) {
          'development' !== 'production' && this.warnDuplicate(value);
        }
        return frag;
      },
      deleteCachedFrag: function deleteCachedFrag(frag) {
        var value = frag.raw;
        var trackByKey = this.params.trackBy;
        var scope = frag.scope;
        var index = scope.$index;
        var key = hasOwn(scope, '$key') && scope.$key;
        var primitive = !isObject(value);
        if (trackByKey || key || primitive) {
          var id = trackByKey ? trackByKey === '$index' ? index : value[trackByKey] : key || value;
          this.cache[id] = null;
        } else {
          value[this.id] = null;
          frag.raw = null;
        }
      },
      getStagger: function getStagger(frag, index, total, type) {
        type = type + 'Stagger';
        var trans = frag.node.__v_trans;
        var hooks = trans && trans.hooks;
        var hook = hooks && (hooks[type] || hooks.stagger);
        return hook ? hook.call(frag, index, total) : index * parseInt(this.params[type] || this.params.stagger, 10);
      },
      _preProcess: function _preProcess(value) {
        this.rawValue = value;
        return value;
      },
      _postProcess: function _postProcess(value) {
        if (isArray(value)) {
          return value;
        } else if (isPlainObject(value)) {
          var keys = Object.keys(value);
          var i = keys.length;
          var res = new Array(i);
          var key;
          while (i--) {
            key = keys[i];
            res[i] = {
              $key: key,
              $value: value[key]
            };
          }
          return res;
        } else {
          if (typeof value === 'number') {
            value = range(value);
          }
          return value || [];
        }
      },
      unbind: function unbind() {
        if (this.descriptor.ref) {
          (this._scope || this.vm).$refs[this.descriptor.ref] = null;
        }
        if (this.frags) {
          var i = this.frags.length;
          var frag;
          while (i--) {
            frag = this.frags[i];
            this.deleteCachedFrag(frag);
            frag.destroy();
          }
        }
      }
    };
    function findPrevFrag(frag, anchor, id) {
      var el = frag.node.previousSibling;
      if (!el)
        return;
      frag = el.__vfrag__;
      while ((!frag || frag.forId !== id || !frag.inserted) && el !== anchor) {
        el = el.previousSibling;
        if (!el)
          return;
        frag = el.__vfrag__;
      }
      return frag;
    }
    function findVmFromFrag(frag) {
      var node = frag.node;
      if (frag.end) {
        while (!node.__vue__ && node !== frag.end && node.nextSibling) {
          node = node.nextSibling;
        }
      }
      return node.__vue__;
    }
    function range(n) {
      var i = -1;
      var ret = new Array(n);
      while (++i < n) {
        ret[i] = i;
      }
      return ret;
    }
    if ('development' !== 'production') {
      vFor.warnDuplicate = function(value) {
        warn('Duplicate value found in v-for="' + this.descriptor.raw + '": ' + JSON.stringify(value) + '. Use track-by="$index" if ' + 'you are expecting duplicate values.');
      };
    }
    var html = {
      bind: function bind() {
        if (this.el.nodeType === 8) {
          this.nodes = [];
          this.anchor = createAnchor('v-html');
          replace(this.el, this.anchor);
        }
      },
      update: function update(value) {
        value = _toString(value);
        if (this.nodes) {
          this.swap(value);
        } else {
          this.el.innerHTML = value;
        }
      },
      swap: function swap(value) {
        var i = this.nodes.length;
        while (i--) {
          remove(this.nodes[i]);
        }
        var frag = parseTemplate(value, true, true);
        this.nodes = toArray(frag.childNodes);
        before(frag, this.anchor);
      }
    };
    var text = {
      bind: function bind() {
        this.attr = this.el.nodeType === 3 ? 'data' : 'textContent';
      },
      update: function update(value) {
        this.el[this.attr] = _toString(value);
      }
    };
    var publicDirectives = {
      text: text,
      html: html,
      'for': vFor,
      'if': vIf,
      show: show,
      model: model,
      on: on,
      bind: bind,
      el: el,
      ref: ref,
      cloak: cloak
    };
    var queue$1 = [];
    var queued = false;
    function pushJob(job) {
      queue$1.push(job);
      if (!queued) {
        queued = true;
        nextTick(flush);
      }
    }
    function flush() {
      var f = document.documentElement.offsetHeight;
      for (var i = 0; i < queue$1.length; i++) {
        queue$1[i]();
      }
      queue$1 = [];
      queued = false;
      return f;
    }
    var TYPE_TRANSITION = 1;
    var TYPE_ANIMATION = 2;
    var transDurationProp = transitionProp + 'Duration';
    var animDurationProp = animationProp + 'Duration';
    function Transition(el, id, hooks, vm) {
      this.id = id;
      this.el = el;
      this.enterClass = id + '-enter';
      this.leaveClass = id + '-leave';
      this.hooks = hooks;
      this.vm = vm;
      this.pendingCssEvent = this.pendingCssCb = this.cancel = this.pendingJsCb = this.op = this.cb = null;
      this.justEntered = false;
      this.entered = this.left = false;
      this.typeCache = {};
      var self = this;
      ['enterNextTick', 'enterDone', 'leaveNextTick', 'leaveDone'].forEach(function(m) {
        self[m] = bind$1(self[m], self);
      });
    }
    var p$1 = Transition.prototype;
    p$1.enter = function(op, cb) {
      this.cancelPending();
      this.callHook('beforeEnter');
      this.cb = cb;
      addClass(this.el, this.enterClass);
      op();
      this.entered = false;
      this.callHookWithCb('enter');
      if (this.entered) {
        return;
      }
      this.cancel = this.hooks && this.hooks.enterCancelled;
      pushJob(this.enterNextTick);
    };
    p$1.enterNextTick = function() {
      this.justEntered = true;
      var self = this;
      setTimeout(function() {
        self.justEntered = false;
      }, 17);
      var enterDone = this.enterDone;
      var type = this.getCssTransitionType(this.enterClass);
      if (!this.pendingJsCb) {
        if (type === TYPE_TRANSITION) {
          removeClass(this.el, this.enterClass);
          this.setupCssCb(transitionEndEvent, enterDone);
        } else if (type === TYPE_ANIMATION) {
          this.setupCssCb(animationEndEvent, enterDone);
        } else {
          enterDone();
        }
      } else if (type === TYPE_TRANSITION) {
        removeClass(this.el, this.enterClass);
      }
    };
    p$1.enterDone = function() {
      this.entered = true;
      this.cancel = this.pendingJsCb = null;
      removeClass(this.el, this.enterClass);
      this.callHook('afterEnter');
      if (this.cb)
        this.cb();
    };
    p$1.leave = function(op, cb) {
      this.cancelPending();
      this.callHook('beforeLeave');
      this.op = op;
      this.cb = cb;
      addClass(this.el, this.leaveClass);
      this.left = false;
      this.callHookWithCb('leave');
      if (this.left) {
        return;
      }
      this.cancel = this.hooks && this.hooks.leaveCancelled;
      if (this.op && !this.pendingJsCb) {
        if (this.justEntered) {
          this.leaveDone();
        } else {
          pushJob(this.leaveNextTick);
        }
      }
    };
    p$1.leaveNextTick = function() {
      var type = this.getCssTransitionType(this.leaveClass);
      if (type) {
        var event = type === TYPE_TRANSITION ? transitionEndEvent : animationEndEvent;
        this.setupCssCb(event, this.leaveDone);
      } else {
        this.leaveDone();
      }
    };
    p$1.leaveDone = function() {
      this.left = true;
      this.cancel = this.pendingJsCb = null;
      this.op();
      removeClass(this.el, this.leaveClass);
      this.callHook('afterLeave');
      if (this.cb)
        this.cb();
      this.op = null;
    };
    p$1.cancelPending = function() {
      this.op = this.cb = null;
      var hasPending = false;
      if (this.pendingCssCb) {
        hasPending = true;
        off(this.el, this.pendingCssEvent, this.pendingCssCb);
        this.pendingCssEvent = this.pendingCssCb = null;
      }
      if (this.pendingJsCb) {
        hasPending = true;
        this.pendingJsCb.cancel();
        this.pendingJsCb = null;
      }
      if (hasPending) {
        removeClass(this.el, this.enterClass);
        removeClass(this.el, this.leaveClass);
      }
      if (this.cancel) {
        this.cancel.call(this.vm, this.el);
        this.cancel = null;
      }
    };
    p$1.callHook = function(type) {
      if (this.hooks && this.hooks[type]) {
        this.hooks[type].call(this.vm, this.el);
      }
    };
    p$1.callHookWithCb = function(type) {
      var hook = this.hooks && this.hooks[type];
      if (hook) {
        if (hook.length > 1) {
          this.pendingJsCb = cancellable(this[type + 'Done']);
        }
        hook.call(this.vm, this.el, this.pendingJsCb);
      }
    };
    p$1.getCssTransitionType = function(className) {
      if (!transitionEndEvent || document.hidden || this.hooks && this.hooks.css === false || isHidden(this.el)) {
        return;
      }
      var type = this.typeCache[className];
      if (type)
        return type;
      var inlineStyles = this.el.style;
      var computedStyles = window.getComputedStyle(this.el);
      var transDuration = inlineStyles[transDurationProp] || computedStyles[transDurationProp];
      if (transDuration && transDuration !== '0s') {
        type = TYPE_TRANSITION;
      } else {
        var animDuration = inlineStyles[animDurationProp] || computedStyles[animDurationProp];
        if (animDuration && animDuration !== '0s') {
          type = TYPE_ANIMATION;
        }
      }
      if (type) {
        this.typeCache[className] = type;
      }
      return type;
    };
    p$1.setupCssCb = function(event, cb) {
      this.pendingCssEvent = event;
      var self = this;
      var el = this.el;
      var onEnd = this.pendingCssCb = function(e) {
        if (e.target === el) {
          off(el, event, onEnd);
          self.pendingCssEvent = self.pendingCssCb = null;
          if (!self.pendingJsCb && cb) {
            cb();
          }
        }
      };
      on$1(el, event, onEnd);
    };
    function isHidden(el) {
      return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }
    var transition = {
      priority: 1100,
      update: function update(id, oldId) {
        var el = this.el;
        var hooks = resolveAsset(this.vm.$options, 'transitions', id);
        id = id || 'v';
        el.__v_trans = new Transition(el, id, hooks, this.el.__vue__ || this.vm);
        if (oldId) {
          removeClass(el, oldId + '-transition');
        }
        addClass(el, id + '-transition');
      }
    };
    var bindingModes = config._propBindingModes;
    var propDef = {
      bind: function bind() {
        var child = this.vm;
        var parent = child._context;
        var prop = this.descriptor.prop;
        var childKey = prop.path;
        var parentKey = prop.parentPath;
        var twoWay = prop.mode === bindingModes.TWO_WAY;
        var parentWatcher = this.parentWatcher = new Watcher(parent, parentKey, function(val) {
          if (assertProp(prop, val)) {
            child[childKey] = val;
          }
        }, {
          twoWay: twoWay,
          filters: prop.filters,
          scope: this._scope
        });
        initProp(child, prop, parentWatcher.value);
        if (twoWay) {
          var self = this;
          child.$once('hook:created', function() {
            self.childWatcher = new Watcher(child, childKey, function(val) {
              parentWatcher.set(val);
            }, {sync: true});
          });
        }
      },
      unbind: function unbind() {
        this.parentWatcher.teardown();
        if (this.childWatcher) {
          this.childWatcher.teardown();
        }
      }
    };
    var component = {
      priority: 1500,
      params: ['keep-alive', 'transition-mode', 'inline-template'],
      bind: function bind() {
        if (!this.el.__vue__) {
          this.keepAlive = this.params.keepAlive;
          if (this.keepAlive) {
            this.cache = {};
          }
          if (this.params.inlineTemplate) {
            this.inlineTemplate = extractContent(this.el, true);
          }
          this.pendingComponentCb = this.Component = null;
          this.pendingRemovals = 0;
          this.pendingRemovalCb = null;
          this.anchor = createAnchor('v-component');
          replace(this.el, this.anchor);
          this.el.removeAttribute('is');
          if (this.descriptor.ref) {
            this.el.removeAttribute('v-ref:' + hyphenate(this.descriptor.ref));
          }
          if (this.literal) {
            this.setComponent(this.expression);
          }
        } else {
          'development' !== 'production' && warn('cannot mount component "' + this.expression + '" ' + 'on already mounted element: ' + this.el);
        }
      },
      update: function update(value) {
        if (!this.literal) {
          this.setComponent(value);
        }
      },
      setComponent: function setComponent(value, cb) {
        this.invalidatePending();
        if (!value) {
          this.unbuild(true);
          this.remove(this.childVM, cb);
          this.childVM = null;
        } else {
          var self = this;
          this.resolveComponent(value, function() {
            self.mountComponent(cb);
          });
        }
      },
      resolveComponent: function resolveComponent(id, cb) {
        var self = this;
        this.pendingComponentCb = cancellable(function(Component) {
          self.ComponentName = Component.options.name || id;
          self.Component = Component;
          cb();
        });
        this.vm._resolveComponent(id, this.pendingComponentCb);
      },
      mountComponent: function mountComponent(cb) {
        this.unbuild(true);
        var self = this;
        var activateHook = this.Component.options.activate;
        var cached = this.getCached();
        var newComponent = this.build();
        if (activateHook && !cached) {
          this.waitingFor = newComponent;
          activateHook.call(newComponent, function() {
            self.waitingFor = null;
            self.transition(newComponent, cb);
          });
        } else {
          if (cached) {
            newComponent._updateRef();
          }
          this.transition(newComponent, cb);
        }
      },
      invalidatePending: function invalidatePending() {
        if (this.pendingComponentCb) {
          this.pendingComponentCb.cancel();
          this.pendingComponentCb = null;
        }
      },
      build: function build(extraOptions) {
        var cached = this.getCached();
        if (cached) {
          return cached;
        }
        if (this.Component) {
          var options = {
            name: this.ComponentName,
            el: cloneNode(this.el),
            template: this.inlineTemplate,
            parent: this._host || this.vm,
            _linkerCachable: !this.inlineTemplate,
            _ref: this.descriptor.ref,
            _asComponent: true,
            _isRouterView: this._isRouterView,
            _context: this.vm,
            _scope: this._scope,
            _frag: this._frag
          };
          if (extraOptions) {
            extend(options, extraOptions);
          }
          var child = new this.Component(options);
          if (this.keepAlive) {
            this.cache[this.Component.cid] = child;
          }
          if ('development' !== 'production' && this.el.hasAttribute('transition') && child._isFragment) {
            warn('Transitions will not work on a fragment instance. ' + 'Template: ' + child.$options.template);
          }
          return child;
        }
      },
      getCached: function getCached() {
        return this.keepAlive && this.cache[this.Component.cid];
      },
      unbuild: function unbuild(defer) {
        if (this.waitingFor) {
          this.waitingFor.$destroy();
          this.waitingFor = null;
        }
        var child = this.childVM;
        if (!child || this.keepAlive) {
          if (child) {
            child._updateRef(true);
          }
          return;
        }
        child.$destroy(false, defer);
      },
      remove: function remove(child, cb) {
        var keepAlive = this.keepAlive;
        if (child) {
          this.pendingRemovals++;
          this.pendingRemovalCb = cb;
          var self = this;
          child.$remove(function() {
            self.pendingRemovals--;
            if (!keepAlive)
              child._cleanup();
            if (!self.pendingRemovals && self.pendingRemovalCb) {
              self.pendingRemovalCb();
              self.pendingRemovalCb = null;
            }
          });
        } else if (cb) {
          cb();
        }
      },
      transition: function transition(target, cb) {
        var self = this;
        var current = this.childVM;
        if ('development' !== 'production') {
          if (current)
            current._inactive = true;
          target._inactive = false;
        }
        this.childVM = target;
        switch (self.params.transitionMode) {
          case 'in-out':
            target.$before(self.anchor, function() {
              self.remove(current, cb);
            });
            break;
          case 'out-in':
            self.remove(current, function() {
              target.$before(self.anchor, cb);
            });
            break;
          default:
            self.remove(current);
            target.$before(self.anchor, cb);
        }
      },
      unbind: function unbind() {
        this.invalidatePending();
        this.unbuild();
        if (this.cache) {
          for (var key in this.cache) {
            this.cache[key].$destroy();
          }
          this.cache = null;
        }
      }
    };
    var vClass = {
      deep: true,
      update: function update(value) {
        if (value && typeof value === 'string') {
          this.handleObject(stringToObject(value));
        } else if (isPlainObject(value)) {
          this.handleObject(value);
        } else if (isArray(value)) {
          this.handleArray(value);
        } else {
          this.cleanup();
        }
      },
      handleObject: function handleObject(value) {
        this.cleanup(value);
        var keys = this.prevKeys = Object.keys(value);
        for (var i = 0,
            l = keys.length; i < l; i++) {
          var key = keys[i];
          if (value[key]) {
            addClass(this.el, key);
          } else {
            removeClass(this.el, key);
          }
        }
      },
      handleArray: function handleArray(value) {
        this.cleanup(value);
        for (var i = 0,
            l = value.length; i < l; i++) {
          if (value[i]) {
            addClass(this.el, value[i]);
          }
        }
        this.prevKeys = value.slice();
      },
      cleanup: function cleanup(value) {
        if (this.prevKeys) {
          var i = this.prevKeys.length;
          while (i--) {
            var key = this.prevKeys[i];
            if (key && (!value || !contains$1(value, key))) {
              removeClass(this.el, key);
            }
          }
        }
      }
    };
    function stringToObject(value) {
      var res = {};
      var keys = value.trim().split(/\s+/);
      var i = keys.length;
      while (i--) {
        res[keys[i]] = true;
      }
      return res;
    }
    function contains$1(value, key) {
      return isArray(value) ? value.indexOf(key) > -1 : hasOwn(value, key);
    }
    var internalDirectives = {
      style: style,
      'class': vClass,
      component: component,
      prop: propDef,
      transition: transition
    };
    var propBindingModes = config._propBindingModes;
    var empty = {};
    var identRE = /^[$_a-zA-Z]+[\w$]*$/;
    var settablePathRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]+\])*$/;
    function compileProps(el, propOptions) {
      var props = [];
      var names = Object.keys(propOptions);
      var i = names.length;
      var options,
          name,
          attr,
          value,
          path,
          parsed,
          prop;
      while (i--) {
        name = names[i];
        options = propOptions[name] || empty;
        if ('development' !== 'production' && name === '$data') {
          warn('Do not use $data as prop.');
          continue;
        }
        path = camelize(name);
        if (!identRE.test(path)) {
          'development' !== 'production' && warn('Invalid prop key: "' + name + '". Prop keys ' + 'must be valid identifiers.');
          continue;
        }
        prop = {
          name: name,
          path: path,
          options: options,
          mode: propBindingModes.ONE_WAY,
          raw: null
        };
        attr = hyphenate(name);
        if ((value = getBindAttr(el, attr)) === null) {
          if ((value = getBindAttr(el, attr + '.sync')) !== null) {
            prop.mode = propBindingModes.TWO_WAY;
          } else if ((value = getBindAttr(el, attr + '.once')) !== null) {
            prop.mode = propBindingModes.ONE_TIME;
          }
        }
        if (value !== null) {
          prop.raw = value;
          parsed = parseDirective(value);
          value = parsed.expression;
          prop.filters = parsed.filters;
          if (isLiteral(value)) {
            prop.optimizedLiteral = true;
          } else {
            prop.dynamic = true;
            if ('development' !== 'production' && prop.mode === propBindingModes.TWO_WAY && !settablePathRE.test(value)) {
              prop.mode = propBindingModes.ONE_WAY;
              warn('Cannot bind two-way prop with non-settable ' + 'parent path: ' + value);
            }
          }
          prop.parentPath = value;
          if ('development' !== 'production' && options.twoWay && prop.mode !== propBindingModes.TWO_WAY) {
            warn('Prop "' + name + '" expects a two-way binding type.');
          }
        } else if ((value = getAttr(el, attr)) !== null) {
          prop.raw = value;
        } else if (options.required) {
          'development' !== 'production' && warn('Missing required prop: ' + name);
        }
        props.push(prop);
      }
      return makePropsLinkFn(props);
    }
    function makePropsLinkFn(props) {
      return function propsLinkFn(vm, scope) {
        vm._props = {};
        var i = props.length;
        var prop,
            path,
            options,
            value,
            raw;
        while (i--) {
          prop = props[i];
          raw = prop.raw;
          path = prop.path;
          options = prop.options;
          vm._props[path] = prop;
          if (raw === null) {
            initProp(vm, prop, getDefault(vm, options));
          } else if (prop.dynamic) {
            if (vm._context) {
              if (prop.mode === propBindingModes.ONE_TIME) {
                value = (scope || vm._context).$get(prop.parentPath);
                initProp(vm, prop, value);
              } else {
                vm._bindDir({
                  name: 'prop',
                  def: propDef,
                  prop: prop
                }, null, null, scope);
              }
            } else {
              'development' !== 'production' && warn('Cannot bind dynamic prop on a root instance' + ' with no parent: ' + prop.name + '="' + raw + '"');
            }
          } else if (prop.optimizedLiteral) {
            var stripped = stripQuotes(raw);
            value = stripped === raw ? toBoolean(toNumber(raw)) : stripped;
            initProp(vm, prop, value);
          } else {
            value = options.type === Boolean && raw === '' ? true : raw;
            initProp(vm, prop, value);
          }
        }
      };
    }
    function getDefault(vm, options) {
      if (!hasOwn(options, 'default')) {
        return options.type === Boolean ? false : undefined;
      }
      var def = options['default'];
      if (isObject(def)) {
        'development' !== 'production' && warn('Object/Array as default prop values will be shared ' + 'across multiple instances. Use a factory function ' + 'to return the default value instead.');
      }
      return typeof def === 'function' && options.type !== Function ? def.call(vm) : def;
    }
    var bindRE = /^v-bind:|^:/;
    var onRE = /^v-on:|^@/;
    var argRE = /:(.*)$/;
    var modifierRE = /\.[^\.]+/g;
    var transitionRE = /^(v-bind:|:)?transition$/;
    var terminalDirectives = ['for', 'if'];
    var DEFAULT_PRIORITY = 1000;
    function compile(el, options, partial) {
      var nodeLinkFn = partial || !options._asComponent ? compileNode(el, options) : null;
      var childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && el.tagName !== 'SCRIPT' && el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null;
      return function compositeLinkFn(vm, el, host, scope, frag) {
        var childNodes = toArray(el.childNodes);
        var dirs = linkAndCapture(function compositeLinkCapturer() {
          if (nodeLinkFn)
            nodeLinkFn(vm, el, host, scope, frag);
          if (childLinkFn)
            childLinkFn(vm, childNodes, host, scope, frag);
        }, vm);
        return makeUnlinkFn(vm, dirs);
      };
    }
    function linkAndCapture(linker, vm) {
      var originalDirCount = vm._directives.length;
      linker();
      var dirs = vm._directives.slice(originalDirCount);
      dirs.sort(directiveComparator);
      for (var i = 0,
          l = dirs.length; i < l; i++) {
        dirs[i]._bind();
      }
      return dirs;
    }
    function directiveComparator(a, b) {
      a = a.descriptor.def.priority || DEFAULT_PRIORITY;
      b = b.descriptor.def.priority || DEFAULT_PRIORITY;
      return a > b ? -1 : a === b ? 0 : 1;
    }
    function makeUnlinkFn(vm, dirs, context, contextDirs) {
      return function unlink(destroying) {
        teardownDirs(vm, dirs, destroying);
        if (context && contextDirs) {
          teardownDirs(context, contextDirs);
        }
      };
    }
    function teardownDirs(vm, dirs, destroying) {
      var i = dirs.length;
      while (i--) {
        dirs[i]._teardown();
        if (!destroying) {
          vm._directives.$remove(dirs[i]);
        }
      }
    }
    function compileAndLinkProps(vm, el, props, scope) {
      var propsLinkFn = compileProps(el, props);
      var propDirs = linkAndCapture(function() {
        propsLinkFn(vm, scope);
      }, vm);
      return makeUnlinkFn(vm, propDirs);
    }
    function compileRoot(el, options, contextOptions) {
      var containerAttrs = options._containerAttrs;
      var replacerAttrs = options._replacerAttrs;
      var contextLinkFn,
          replacerLinkFn;
      if (el.nodeType !== 11) {
        if (options._asComponent) {
          if (containerAttrs && contextOptions) {
            contextLinkFn = compileDirectives(containerAttrs, contextOptions);
          }
          if (replacerAttrs) {
            replacerLinkFn = compileDirectives(replacerAttrs, options);
          }
        } else {
          replacerLinkFn = compileDirectives(el.attributes, options);
        }
      } else if ('development' !== 'production' && containerAttrs) {
        var names = containerAttrs.filter(function(attr) {
          return attr.name.indexOf('_v-') < 0 && !onRE.test(attr.name) && attr.name !== 'slot';
        }).map(function(attr) {
          return '"' + attr.name + '"';
        });
        if (names.length) {
          var plural = names.length > 1;
          warn('Attribute' + (plural ? 's ' : ' ') + names.join(', ') + (plural ? ' are' : ' is') + ' ignored on component ' + '<' + options.el.tagName.toLowerCase() + '> because ' + 'the component is a fragment instance: ' + 'http://vuejs.org/guide/components.html#Fragment_Instance');
        }
      }
      return function rootLinkFn(vm, el, scope) {
        var context = vm._context;
        var contextDirs;
        if (context && contextLinkFn) {
          contextDirs = linkAndCapture(function() {
            contextLinkFn(context, el, null, scope);
          }, context);
        }
        var selfDirs = linkAndCapture(function() {
          if (replacerLinkFn)
            replacerLinkFn(vm, el);
        }, vm);
        return makeUnlinkFn(vm, selfDirs, context, contextDirs);
      };
    }
    function compileNode(node, options) {
      var type = node.nodeType;
      if (type === 1 && node.tagName !== 'SCRIPT') {
        return compileElement(node, options);
      } else if (type === 3 && node.data.trim()) {
        return compileTextNode(node, options);
      } else {
        return null;
      }
    }
    function compileElement(el, options) {
      if (el.tagName === 'TEXTAREA') {
        var tokens = parseText(el.value);
        if (tokens) {
          el.setAttribute(':value', tokensToExp(tokens));
          el.value = '';
        }
      }
      var linkFn;
      var hasAttrs = el.hasAttributes();
      if (hasAttrs) {
        linkFn = checkTerminalDirectives(el, options);
      }
      if (!linkFn) {
        linkFn = checkElementDirectives(el, options);
      }
      if (!linkFn) {
        linkFn = checkComponent(el, options);
      }
      if (!linkFn && hasAttrs) {
        linkFn = compileDirectives(el.attributes, options);
      }
      return linkFn;
    }
    function compileTextNode(node, options) {
      if (node._skip) {
        return removeText;
      }
      var tokens = parseText(node.wholeText);
      if (!tokens) {
        return null;
      }
      var next = node.nextSibling;
      while (next && next.nodeType === 3) {
        next._skip = true;
        next = next.nextSibling;
      }
      var frag = document.createDocumentFragment();
      var el,
          token;
      for (var i = 0,
          l = tokens.length; i < l; i++) {
        token = tokens[i];
        el = token.tag ? processTextToken(token, options) : document.createTextNode(token.value);
        frag.appendChild(el);
      }
      return makeTextNodeLinkFn(tokens, frag, options);
    }
    function removeText(vm, node) {
      remove(node);
    }
    function processTextToken(token, options) {
      var el;
      if (token.oneTime) {
        el = document.createTextNode(token.value);
      } else {
        if (token.html) {
          el = document.createComment('v-html');
          setTokenType('html');
        } else {
          el = document.createTextNode(' ');
          setTokenType('text');
        }
      }
      function setTokenType(type) {
        if (token.descriptor)
          return;
        var parsed = parseDirective(token.value);
        token.descriptor = {
          name: type,
          def: publicDirectives[type],
          expression: parsed.expression,
          filters: parsed.filters
        };
      }
      return el;
    }
    function makeTextNodeLinkFn(tokens, frag) {
      return function textNodeLinkFn(vm, el, host, scope) {
        var fragClone = frag.cloneNode(true);
        var childNodes = toArray(fragClone.childNodes);
        var token,
            value,
            node;
        for (var i = 0,
            l = tokens.length; i < l; i++) {
          token = tokens[i];
          value = token.value;
          if (token.tag) {
            node = childNodes[i];
            if (token.oneTime) {
              value = (scope || vm).$eval(value);
              if (token.html) {
                replace(node, parseTemplate(value, true));
              } else {
                node.data = value;
              }
            } else {
              vm._bindDir(token.descriptor, node, host, scope);
            }
          }
        }
        replace(el, fragClone);
      };
    }
    function compileNodeList(nodeList, options) {
      var linkFns = [];
      var nodeLinkFn,
          childLinkFn,
          node;
      for (var i = 0,
          l = nodeList.length; i < l; i++) {
        node = nodeList[i];
        nodeLinkFn = compileNode(node, options);
        childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && node.tagName !== 'SCRIPT' && node.hasChildNodes() ? compileNodeList(node.childNodes, options) : null;
        linkFns.push(nodeLinkFn, childLinkFn);
      }
      return linkFns.length ? makeChildLinkFn(linkFns) : null;
    }
    function makeChildLinkFn(linkFns) {
      return function childLinkFn(vm, nodes, host, scope, frag) {
        var node,
            nodeLinkFn,
            childrenLinkFn;
        for (var i = 0,
            n = 0,
            l = linkFns.length; i < l; n++) {
          node = nodes[n];
          nodeLinkFn = linkFns[i++];
          childrenLinkFn = linkFns[i++];
          var childNodes = toArray(node.childNodes);
          if (nodeLinkFn) {
            nodeLinkFn(vm, node, host, scope, frag);
          }
          if (childrenLinkFn) {
            childrenLinkFn(vm, childNodes, host, scope, frag);
          }
        }
      };
    }
    function checkElementDirectives(el, options) {
      var tag = el.tagName.toLowerCase();
      if (commonTagRE.test(tag))
        return;
      var def = resolveAsset(options, 'elementDirectives', tag);
      if (def) {
        return makeTerminalNodeLinkFn(el, tag, '', options, def);
      }
    }
    function checkComponent(el, options) {
      var component = checkComponentAttr(el, options);
      if (component) {
        var ref = findRef(el);
        var descriptor = {
          name: 'component',
          ref: ref,
          expression: component.id,
          def: internalDirectives.component,
          modifiers: {literal: !component.dynamic}
        };
        var componentLinkFn = function componentLinkFn(vm, el, host, scope, frag) {
          if (ref) {
            defineReactive((scope || vm).$refs, ref, null);
          }
          vm._bindDir(descriptor, el, host, scope, frag);
        };
        componentLinkFn.terminal = true;
        return componentLinkFn;
      }
    }
    function checkTerminalDirectives(el, options) {
      if (getAttr(el, 'v-pre') !== null) {
        return skip;
      }
      if (el.hasAttribute('v-else')) {
        var prev = el.previousElementSibling;
        if (prev && prev.hasAttribute('v-if')) {
          return skip;
        }
      }
      var value,
          dirName;
      for (var i = 0,
          l = terminalDirectives.length; i < l; i++) {
        dirName = terminalDirectives[i];
        if (value = el.getAttribute('v-' + dirName)) {
          return makeTerminalNodeLinkFn(el, dirName, value, options);
        }
      }
    }
    function skip() {}
    skip.terminal = true;
    function makeTerminalNodeLinkFn(el, dirName, value, options, def) {
      var parsed = parseDirective(value);
      var descriptor = {
        name: dirName,
        expression: parsed.expression,
        filters: parsed.filters,
        raw: value,
        def: def || publicDirectives[dirName]
      };
      if (dirName === 'for' || dirName === 'router-view') {
        descriptor.ref = findRef(el);
      }
      var fn = function terminalNodeLinkFn(vm, el, host, scope, frag) {
        if (descriptor.ref) {
          defineReactive((scope || vm).$refs, descriptor.ref, null);
        }
        vm._bindDir(descriptor, el, host, scope, frag);
      };
      fn.terminal = true;
      return fn;
    }
    function compileDirectives(attrs, options) {
      var i = attrs.length;
      var dirs = [];
      var attr,
          name,
          value,
          rawName,
          rawValue,
          dirName,
          arg,
          modifiers,
          dirDef,
          tokens;
      while (i--) {
        attr = attrs[i];
        name = rawName = attr.name;
        value = rawValue = attr.value;
        tokens = parseText(value);
        arg = null;
        modifiers = parseModifiers(name);
        name = name.replace(modifierRE, '');
        if (tokens) {
          value = tokensToExp(tokens);
          arg = name;
          pushDir('bind', publicDirectives.bind, true);
          if ('development' !== 'production') {
            if (name === 'class' && Array.prototype.some.call(attrs, function(attr) {
              return attr.name === ':class' || attr.name === 'v-bind:class';
            })) {
              warn('class="' + rawValue + '": Do not mix mustache interpolation ' + 'and v-bind for "class" on the same element. Use one or the other.');
            }
          }
        } else if (transitionRE.test(name)) {
          modifiers.literal = !bindRE.test(name);
          pushDir('transition', internalDirectives.transition);
        } else if (onRE.test(name)) {
          arg = name.replace(onRE, '');
          pushDir('on', publicDirectives.on);
        } else if (bindRE.test(name)) {
          dirName = name.replace(bindRE, '');
          if (dirName === 'style' || dirName === 'class') {
            pushDir(dirName, internalDirectives[dirName]);
          } else {
            arg = dirName;
            pushDir('bind', publicDirectives.bind);
          }
        } else if (name.indexOf('v-') === 0) {
          arg = (arg = name.match(argRE)) && arg[1];
          if (arg) {
            name = name.replace(argRE, '');
          }
          dirName = name.slice(2);
          if (dirName === 'else') {
            continue;
          }
          dirDef = resolveAsset(options, 'directives', dirName);
          if ('development' !== 'production') {
            assertAsset(dirDef, 'directive', dirName);
          }
          if (dirDef) {
            pushDir(dirName, dirDef);
          }
        }
      }
      function pushDir(dirName, def, interp) {
        var parsed = parseDirective(value);
        dirs.push({
          name: dirName,
          attr: rawName,
          raw: rawValue,
          def: def,
          arg: arg,
          modifiers: modifiers,
          expression: parsed.expression,
          filters: parsed.filters,
          interp: interp
        });
      }
      if (dirs.length) {
        return makeNodeLinkFn(dirs);
      }
    }
    function parseModifiers(name) {
      var res = Object.create(null);
      var match = name.match(modifierRE);
      if (match) {
        var i = match.length;
        while (i--) {
          res[match[i].slice(1)] = true;
        }
      }
      return res;
    }
    function makeNodeLinkFn(directives) {
      return function nodeLinkFn(vm, el, host, scope, frag) {
        var i = directives.length;
        while (i--) {
          vm._bindDir(directives[i], el, host, scope, frag);
        }
      };
    }
    var specialCharRE = /[^\w\-:\.]/;
    function transclude(el, options) {
      if (options) {
        options._containerAttrs = extractAttrs(el);
      }
      if (isTemplate(el)) {
        el = parseTemplate(el);
      }
      if (options) {
        if (options._asComponent && !options.template) {
          options.template = '<slot></slot>';
        }
        if (options.template) {
          options._content = extractContent(el);
          el = transcludeTemplate(el, options);
        }
      }
      if (el instanceof DocumentFragment) {
        prepend(createAnchor('v-start', true), el);
        el.appendChild(createAnchor('v-end', true));
      }
      return el;
    }
    function transcludeTemplate(el, options) {
      var template = options.template;
      var frag = parseTemplate(template, true);
      if (frag) {
        var replacer = frag.firstChild;
        var tag = replacer.tagName && replacer.tagName.toLowerCase();
        if (options.replace) {
          if (el === document.body) {
            'development' !== 'production' && warn('You are mounting an instance with a template to ' + '<body>. This will replace <body> entirely. You ' + 'should probably use `replace: false` here.');
          }
          if (frag.childNodes.length > 1 || replacer.nodeType !== 1 || tag === 'component' || resolveAsset(options, 'components', tag) || replacer.hasAttribute('is') || replacer.hasAttribute(':is') || replacer.hasAttribute('v-bind:is') || resolveAsset(options, 'elementDirectives', tag) || replacer.hasAttribute('v-for') || replacer.hasAttribute('v-if')) {
            return frag;
          } else {
            options._replacerAttrs = extractAttrs(replacer);
            mergeAttrs(el, replacer);
            return replacer;
          }
        } else {
          el.appendChild(frag);
          return el;
        }
      } else {
        'development' !== 'production' && warn('Invalid template option: ' + template);
      }
    }
    function extractAttrs(el) {
      if (el.nodeType === 1 && el.hasAttributes()) {
        return toArray(el.attributes);
      }
    }
    function mergeAttrs(from, to) {
      var attrs = from.attributes;
      var i = attrs.length;
      var name,
          value;
      while (i--) {
        name = attrs[i].name;
        value = attrs[i].value;
        if (!to.hasAttribute(name) && !specialCharRE.test(name)) {
          to.setAttribute(name, value);
        } else if (name === 'class') {
          value.split(/\s+/).forEach(function(cls) {
            addClass(to, cls);
          });
        }
      }
    }
    var compiler = Object.freeze({
      compile: compile,
      compileAndLinkProps: compileAndLinkProps,
      compileRoot: compileRoot,
      transclude: transclude
    });
    function stateMixin(Vue) {
      Object.defineProperty(Vue.prototype, '$data', {
        get: function get() {
          return this._data;
        },
        set: function set(newData) {
          if (newData !== this._data) {
            this._setData(newData);
          }
        }
      });
      Vue.prototype._initState = function() {
        this._initProps();
        this._initMeta();
        this._initMethods();
        this._initData();
        this._initComputed();
      };
      Vue.prototype._initProps = function() {
        var options = this.$options;
        var el = options.el;
        var props = options.props;
        if (props && !el) {
          'development' !== 'production' && warn('Props will not be compiled if no `el` option is ' + 'provided at instantiation.');
        }
        el = options.el = query(el);
        this._propsUnlinkFn = el && el.nodeType === 1 && props ? compileAndLinkProps(this, el, props, this._scope) : null;
      };
      Vue.prototype._initData = function() {
        var propsData = this._data;
        var optionsDataFn = this.$options.data;
        var optionsData = optionsDataFn && optionsDataFn();
        if (optionsData) {
          this._data = optionsData;
          for (var prop in propsData) {
            if ('development' !== 'production' && hasOwn(optionsData, prop)) {
              warn('Data field "' + prop + '" is already defined ' + 'as a prop. Use prop default value instead.');
            }
            if (this._props[prop].raw !== null || !hasOwn(optionsData, prop)) {
              set(optionsData, prop, propsData[prop]);
            }
          }
        }
        var data = this._data;
        var keys = Object.keys(data);
        var i,
            key;
        i = keys.length;
        while (i--) {
          key = keys[i];
          this._proxy(key);
        }
        observe(data, this);
      };
      Vue.prototype._setData = function(newData) {
        newData = newData || {};
        var oldData = this._data;
        this._data = newData;
        var keys,
            key,
            i;
        keys = Object.keys(oldData);
        i = keys.length;
        while (i--) {
          key = keys[i];
          if (!(key in newData)) {
            this._unproxy(key);
          }
        }
        keys = Object.keys(newData);
        i = keys.length;
        while (i--) {
          key = keys[i];
          if (!hasOwn(this, key)) {
            this._proxy(key);
          }
        }
        oldData.__ob__.removeVm(this);
        observe(newData, this);
        this._digest();
      };
      Vue.prototype._proxy = function(key) {
        if (!isReserved(key)) {
          var self = this;
          Object.defineProperty(self, key, {
            configurable: true,
            enumerable: true,
            get: function proxyGetter() {
              return self._data[key];
            },
            set: function proxySetter(val) {
              self._data[key] = val;
            }
          });
        }
      };
      Vue.prototype._unproxy = function(key) {
        if (!isReserved(key)) {
          delete this[key];
        }
      };
      Vue.prototype._digest = function() {
        for (var i = 0,
            l = this._watchers.length; i < l; i++) {
          this._watchers[i].update(true);
        }
      };
      function noop() {}
      Vue.prototype._initComputed = function() {
        var computed = this.$options.computed;
        if (computed) {
          for (var key in computed) {
            var userDef = computed[key];
            var def = {
              enumerable: true,
              configurable: true
            };
            if (typeof userDef === 'function') {
              def.get = makeComputedGetter(userDef, this);
              def.set = noop;
            } else {
              def.get = userDef.get ? userDef.cache !== false ? makeComputedGetter(userDef.get, this) : bind$1(userDef.get, this) : noop;
              def.set = userDef.set ? bind$1(userDef.set, this) : noop;
            }
            Object.defineProperty(this, key, def);
          }
        }
      };
      function makeComputedGetter(getter, owner) {
        var watcher = new Watcher(owner, getter, null, {lazy: true});
        return function computedGetter() {
          if (watcher.dirty) {
            watcher.evaluate();
          }
          if (Dep.target) {
            watcher.depend();
          }
          return watcher.value;
        };
      }
      Vue.prototype._initMethods = function() {
        var methods = this.$options.methods;
        if (methods) {
          for (var key in methods) {
            this[key] = bind$1(methods[key], this);
          }
        }
      };
      Vue.prototype._initMeta = function() {
        var metas = this.$options._meta;
        if (metas) {
          for (var key in metas) {
            defineReactive(this, key, metas[key]);
          }
        }
      };
    }
    var eventRE = /^v-on:|^@/;
    function eventsMixin(Vue) {
      Vue.prototype._initEvents = function() {
        var options = this.$options;
        if (options._asComponent) {
          registerComponentEvents(this, options.el);
        }
        registerCallbacks(this, '$on', options.events);
        registerCallbacks(this, '$watch', options.watch);
      };
      function registerComponentEvents(vm, el) {
        var attrs = el.attributes;
        var name,
            handler;
        for (var i = 0,
            l = attrs.length; i < l; i++) {
          name = attrs[i].name;
          if (eventRE.test(name)) {
            name = name.replace(eventRE, '');
            handler = (vm._scope || vm._context).$eval(attrs[i].value, true);
            vm.$on(name.replace(eventRE), handler);
          }
        }
      }
      function registerCallbacks(vm, action, hash) {
        if (!hash)
          return;
        var handlers,
            key,
            i,
            j;
        for (key in hash) {
          handlers = hash[key];
          if (isArray(handlers)) {
            for (i = 0, j = handlers.length; i < j; i++) {
              register(vm, action, key, handlers[i]);
            }
          } else {
            register(vm, action, key, handlers);
          }
        }
      }
      function register(vm, action, key, handler, options) {
        var type = typeof handler;
        if (type === 'function') {
          vm[action](key, handler, options);
        } else if (type === 'string') {
          var methods = vm.$options.methods;
          var method = methods && methods[handler];
          if (method) {
            vm[action](key, method, options);
          } else {
            'development' !== 'production' && warn('Unknown method: "' + handler + '" when ' + 'registering callback for ' + action + ': "' + key + '".');
          }
        } else if (handler && type === 'object') {
          register(vm, action, key, handler.handler, handler);
        }
      }
      Vue.prototype._initDOMHooks = function() {
        this.$on('hook:attached', onAttached);
        this.$on('hook:detached', onDetached);
      };
      function onAttached() {
        if (!this._isAttached) {
          this._isAttached = true;
          this.$children.forEach(callAttach);
        }
      }
      function callAttach(child) {
        if (!child._isAttached && inDoc(child.$el)) {
          child._callHook('attached');
        }
      }
      function onDetached() {
        if (this._isAttached) {
          this._isAttached = false;
          this.$children.forEach(callDetach);
        }
      }
      function callDetach(child) {
        if (child._isAttached && !inDoc(child.$el)) {
          child._callHook('detached');
        }
      }
      Vue.prototype._callHook = function(hook) {
        var handlers = this.$options[hook];
        if (handlers) {
          for (var i = 0,
              j = handlers.length; i < j; i++) {
            handlers[i].call(this);
          }
        }
        this.$emit('hook:' + hook);
      };
    }
    function noop() {}
    function Directive(descriptor, vm, el, host, scope, frag) {
      this.vm = vm;
      this.el = el;
      this.descriptor = descriptor;
      this.name = descriptor.name;
      this.expression = descriptor.expression;
      this.arg = descriptor.arg;
      this.modifiers = descriptor.modifiers;
      this.filters = descriptor.filters;
      this.literal = this.modifiers && this.modifiers.literal;
      this._locked = false;
      this._bound = false;
      this._listeners = null;
      this._host = host;
      this._scope = scope;
      this._frag = frag;
      if ('development' !== 'production' && this.el) {
        this.el._vue_directives = this.el._vue_directives || [];
        this.el._vue_directives.push(this);
      }
    }
    Directive.prototype._bind = function() {
      var name = this.name;
      var descriptor = this.descriptor;
      if ((name !== 'cloak' || this.vm._isCompiled) && this.el && this.el.removeAttribute) {
        var attr = descriptor.attr || 'v-' + name;
        this.el.removeAttribute(attr);
      }
      var def = descriptor.def;
      if (typeof def === 'function') {
        this.update = def;
      } else {
        extend(this, def);
      }
      this._setupParams();
      if (this.bind) {
        this.bind();
      }
      if (this.literal) {
        this.update && this.update(descriptor.raw);
      } else if ((this.expression || this.modifiers) && (this.update || this.twoWay) && !this._checkStatement()) {
        var dir = this;
        if (this.update) {
          this._update = function(val, oldVal) {
            if (!dir._locked) {
              dir.update(val, oldVal);
            }
          };
        } else {
          this._update = noop;
        }
        var preProcess = this._preProcess ? bind$1(this._preProcess, this) : null;
        var postProcess = this._postProcess ? bind$1(this._postProcess, this) : null;
        var watcher = this._watcher = new Watcher(this.vm, this.expression, this._update, {
          filters: this.filters,
          twoWay: this.twoWay,
          deep: this.deep,
          preProcess: preProcess,
          postProcess: postProcess,
          scope: this._scope
        });
        if (this.afterBind) {
          this.afterBind();
        } else if (this.update) {
          this.update(watcher.value);
        }
      }
      this._bound = true;
    };
    Directive.prototype._setupParams = function() {
      if (!this.params) {
        return;
      }
      var params = this.params;
      this.params = Object.create(null);
      var i = params.length;
      var key,
          val,
          mappedKey;
      while (i--) {
        key = params[i];
        mappedKey = camelize(key);
        val = getBindAttr(this.el, key);
        if (val != null) {
          this._setupParamWatcher(mappedKey, val);
        } else {
          val = getAttr(this.el, key);
          if (val != null) {
            this.params[mappedKey] = val === '' ? true : val;
          }
        }
      }
    };
    Directive.prototype._setupParamWatcher = function(key, expression) {
      var self = this;
      var called = false;
      var unwatch = (this._scope || this.vm).$watch(expression, function(val, oldVal) {
        self.params[key] = val;
        if (called) {
          var cb = self.paramWatchers && self.paramWatchers[key];
          if (cb) {
            cb.call(self, val, oldVal);
          }
        } else {
          called = true;
        }
      }, {immediate: true});
      (this._paramUnwatchFns || (this._paramUnwatchFns = [])).push(unwatch);
    };
    Directive.prototype._checkStatement = function() {
      var expression = this.expression;
      if (expression && this.acceptStatement && !isSimplePath(expression)) {
        var fn = parseExpression(expression).get;
        var scope = this._scope || this.vm;
        var handler = function handler(e) {
          scope.$event = e;
          fn.call(scope, scope);
          scope.$event = null;
        };
        if (this.filters) {
          handler = scope._applyFilters(handler, null, this.filters);
        }
        this.update(handler);
        return true;
      }
    };
    Directive.prototype.set = function(value) {
      if (this.twoWay) {
        this._withLock(function() {
          this._watcher.set(value);
        });
      } else if ('development' !== 'production') {
        warn('Directive.set() can only be used inside twoWay' + 'directives.');
      }
    };
    Directive.prototype._withLock = function(fn) {
      var self = this;
      self._locked = true;
      fn.call(self);
      nextTick(function() {
        self._locked = false;
      });
    };
    Directive.prototype.on = function(event, handler) {
      on$1(this.el, event, handler);
      (this._listeners || (this._listeners = [])).push([event, handler]);
    };
    Directive.prototype._teardown = function() {
      if (this._bound) {
        this._bound = false;
        if (this.unbind) {
          this.unbind();
        }
        if (this._watcher) {
          this._watcher.teardown();
        }
        var listeners = this._listeners;
        var i;
        if (listeners) {
          i = listeners.length;
          while (i--) {
            off(this.el, listeners[i][0], listeners[i][1]);
          }
        }
        var unwatchFns = this._paramUnwatchFns;
        if (unwatchFns) {
          i = unwatchFns.length;
          while (i--) {
            unwatchFns[i]();
          }
        }
        if ('development' !== 'production' && this.el) {
          this.el._vue_directives.$remove(this);
        }
        this.vm = this.el = this._watcher = this._listeners = null;
      }
    };
    function lifecycleMixin(Vue) {
      Vue.prototype._updateRef = function(remove) {
        var ref = this.$options._ref;
        if (ref) {
          var refs = (this._scope || this._context).$refs;
          if (remove) {
            if (refs[ref] === this) {
              refs[ref] = null;
            }
          } else {
            refs[ref] = this;
          }
        }
      };
      Vue.prototype._compile = function(el) {
        var options = this.$options;
        var original = el;
        el = transclude(el, options);
        this._initElement(el);
        var contextOptions = this._context && this._context.$options;
        var rootLinker = compileRoot(el, options, contextOptions);
        var contentLinkFn;
        var ctor = this.constructor;
        if (options._linkerCachable) {
          contentLinkFn = ctor.linker;
          if (!contentLinkFn) {
            contentLinkFn = ctor.linker = compile(el, options);
          }
        }
        var rootUnlinkFn = rootLinker(this, el, this._scope);
        var contentUnlinkFn = contentLinkFn ? contentLinkFn(this, el) : compile(el, options)(this, el);
        this._unlinkFn = function() {
          rootUnlinkFn();
          contentUnlinkFn(true);
        };
        if (options.replace) {
          replace(original, el);
        }
        this._isCompiled = true;
        this._callHook('compiled');
        return el;
      };
      Vue.prototype._initElement = function(el) {
        if (el instanceof DocumentFragment) {
          this._isFragment = true;
          this.$el = this._fragmentStart = el.firstChild;
          this._fragmentEnd = el.lastChild;
          if (this._fragmentStart.nodeType === 3) {
            this._fragmentStart.data = this._fragmentEnd.data = '';
          }
          this._fragment = el;
        } else {
          this.$el = el;
        }
        this.$el.__vue__ = this;
        this._callHook('beforeCompile');
      };
      Vue.prototype._bindDir = function(descriptor, node, host, scope, frag) {
        this._directives.push(new Directive(descriptor, this, node, host, scope, frag));
      };
      Vue.prototype._destroy = function(remove, deferCleanup) {
        if (this._isBeingDestroyed) {
          if (!deferCleanup) {
            this._cleanup();
          }
          return;
        }
        this._callHook('beforeDestroy');
        this._isBeingDestroyed = true;
        var i;
        var parent = this.$parent;
        if (parent && !parent._isBeingDestroyed) {
          parent.$children.$remove(this);
          this._updateRef(true);
        }
        i = this.$children.length;
        while (i--) {
          this.$children[i].$destroy();
        }
        if (this._propsUnlinkFn) {
          this._propsUnlinkFn();
        }
        if (this._unlinkFn) {
          this._unlinkFn();
        }
        i = this._watchers.length;
        while (i--) {
          this._watchers[i].teardown();
        }
        if (this.$el) {
          this.$el.__vue__ = null;
        }
        var self = this;
        if (remove && this.$el) {
          this.$remove(function() {
            self._cleanup();
          });
        } else if (!deferCleanup) {
          this._cleanup();
        }
      };
      Vue.prototype._cleanup = function() {
        if (this._isDestroyed) {
          return;
        }
        if (this._frag) {
          this._frag.children.$remove(this);
        }
        if (this._data.__ob__) {
          this._data.__ob__.removeVm(this);
        }
        this.$el = this.$parent = this.$root = this.$children = this._watchers = this._context = this._scope = this._directives = null;
        this._isDestroyed = true;
        this._callHook('destroyed');
        this.$off();
      };
    }
    function miscMixin(Vue) {
      Vue.prototype._applyFilters = function(value, oldValue, filters, write) {
        var filter,
            fn,
            args,
            arg,
            offset,
            i,
            l,
            j,
            k;
        for (i = 0, l = filters.length; i < l; i++) {
          filter = filters[i];
          fn = resolveAsset(this.$options, 'filters', filter.name);
          if ('development' !== 'production') {
            assertAsset(fn, 'filter', filter.name);
          }
          if (!fn)
            continue;
          fn = write ? fn.write : fn.read || fn;
          if (typeof fn !== 'function')
            continue;
          args = write ? [value, oldValue] : [value];
          offset = write ? 2 : 1;
          if (filter.args) {
            for (j = 0, k = filter.args.length; j < k; j++) {
              arg = filter.args[j];
              args[j + offset] = arg.dynamic ? this.$get(arg.value) : arg.value;
            }
          }
          value = fn.apply(this, args);
        }
        return value;
      };
      Vue.prototype._resolveComponent = function(id, cb) {
        var factory = resolveAsset(this.$options, 'components', id);
        if ('development' !== 'production') {
          assertAsset(factory, 'component', id);
        }
        if (!factory) {
          return;
        }
        if (!factory.options) {
          if (factory.resolved) {
            cb(factory.resolved);
          } else if (factory.requested) {
            factory.pendingCallbacks.push(cb);
          } else {
            factory.requested = true;
            var cbs = factory.pendingCallbacks = [cb];
            factory(function resolve(res) {
              if (isPlainObject(res)) {
                res = Vue.extend(res);
              }
              factory.resolved = res;
              for (var i = 0,
                  l = cbs.length; i < l; i++) {
                cbs[i](res);
              }
            }, function reject(reason) {
              'development' !== 'production' && warn('Failed to resolve async component: ' + id + '. ' + (reason ? '\nReason: ' + reason : ''));
            });
          }
        } else {
          cb(factory);
        }
      };
    }
    function globalAPI(Vue) {
      Vue.util = util;
      Vue.config = config;
      Vue.set = set;
      Vue['delete'] = del;
      Vue.nextTick = nextTick;
      Vue.compiler = compiler;
      Vue.FragmentFactory = FragmentFactory;
      Vue.internalDirectives = internalDirectives;
      Vue.parsers = {
        path: path,
        text: text$1,
        template: template,
        directive: directive,
        expression: expression
      };
      Vue.cid = 0;
      var cid = 1;
      Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};
        var Super = this;
        var isFirstExtend = Super.cid === 0;
        if (isFirstExtend && extendOptions._Ctor) {
          return extendOptions._Ctor;
        }
        var name = extendOptions.name || Super.options.name;
        var Sub = createClass(name || 'VueComponent');
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.cid = cid++;
        Sub.options = mergeOptions(Super.options, extendOptions);
        Sub['super'] = Super;
        Sub.extend = Super.extend;
        config._assetTypes.forEach(function(type) {
          Sub[type] = Super[type];
        });
        if (name) {
          Sub.options.components[name] = Sub;
        }
        if (isFirstExtend) {
          extendOptions._Ctor = Sub;
        }
        return Sub;
      };
      function createClass(name) {
        return new Function('return function ' + classify(name) + ' (options) { this._init(options) }')();
      }
      Vue.use = function(plugin) {
        if (plugin.installed) {
          return;
        }
        var args = toArray(arguments, 1);
        args.unshift(this);
        if (typeof plugin.install === 'function') {
          plugin.install.apply(plugin, args);
        } else {
          plugin.apply(null, args);
        }
        plugin.installed = true;
        return this;
      };
      Vue.mixin = function(mixin) {
        Vue.options = mergeOptions(Vue.options, mixin);
      };
      config._assetTypes.forEach(function(type) {
        Vue[type] = function(id, definition) {
          if (!definition) {
            return this.options[type + 's'][id];
          } else {
            if ('development' !== 'production') {
              if (type === 'component' && commonTagRE.test(id)) {
                warn('Do not use built-in HTML elements as component ' + 'id: ' + id);
              }
            }
            if (type === 'component' && isPlainObject(definition)) {
              definition.name = id;
              definition = Vue.extend(definition);
            }
            this.options[type + 's'][id] = definition;
            return definition;
          }
        };
      });
    }
    var filterRE = /[^|]\|[^|]/;
    function dataAPI(Vue) {
      Vue.prototype.$get = function(exp, asStatement) {
        var res = parseExpression(exp);
        if (res) {
          if (asStatement && !isSimplePath(exp)) {
            var self = this;
            return function statementHandler() {
              res.get.call(self, self);
            };
          } else {
            try {
              return res.get.call(this, this);
            } catch (e) {}
          }
        }
      };
      Vue.prototype.$set = function(exp, val) {
        var res = parseExpression(exp, true);
        if (res && res.set) {
          res.set.call(this, this, val);
        }
      };
      Vue.prototype.$delete = function(key) {
        del(this._data, key);
      };
      Vue.prototype.$watch = function(expOrFn, cb, options) {
        var vm = this;
        var parsed;
        if (typeof expOrFn === 'string') {
          parsed = parseDirective(expOrFn);
          expOrFn = parsed.expression;
        }
        var watcher = new Watcher(vm, expOrFn, cb, {
          deep: options && options.deep,
          filters: parsed && parsed.filters
        });
        if (options && options.immediate) {
          cb.call(vm, watcher.value);
        }
        return function unwatchFn() {
          watcher.teardown();
        };
      };
      Vue.prototype.$eval = function(text, asStatement) {
        if (filterRE.test(text)) {
          var dir = parseDirective(text);
          var val = this.$get(dir.expression, asStatement);
          return dir.filters ? this._applyFilters(val, null, dir.filters) : val;
        } else {
          return this.$get(text, asStatement);
        }
      };
      Vue.prototype.$interpolate = function(text) {
        var tokens = parseText(text);
        var vm = this;
        if (tokens) {
          if (tokens.length === 1) {
            return vm.$eval(tokens[0].value) + '';
          } else {
            return tokens.map(function(token) {
              return token.tag ? vm.$eval(token.value) : token.value;
            }).join('');
          }
        } else {
          return text;
        }
      };
      Vue.prototype.$log = function(path) {
        var data = path ? getPath(this._data, path) : this._data;
        if (data) {
          data = clean(data);
        }
        if (!path) {
          for (var key in this.$options.computed) {
            data[key] = clean(this[key]);
          }
        }
        console.log(data);
      };
      function clean(obj) {
        return JSON.parse(JSON.stringify(obj));
      }
    }
    function domAPI(Vue) {
      Vue.prototype.$nextTick = function(fn) {
        nextTick(fn, this);
      };
      Vue.prototype.$appendTo = function(target, cb, withTransition) {
        return insert(this, target, cb, withTransition, append, appendWithTransition);
      };
      Vue.prototype.$prependTo = function(target, cb, withTransition) {
        target = query(target);
        if (target.hasChildNodes()) {
          this.$before(target.firstChild, cb, withTransition);
        } else {
          this.$appendTo(target, cb, withTransition);
        }
        return this;
      };
      Vue.prototype.$before = function(target, cb, withTransition) {
        return insert(this, target, cb, withTransition, beforeWithCb, beforeWithTransition);
      };
      Vue.prototype.$after = function(target, cb, withTransition) {
        target = query(target);
        if (target.nextSibling) {
          this.$before(target.nextSibling, cb, withTransition);
        } else {
          this.$appendTo(target.parentNode, cb, withTransition);
        }
        return this;
      };
      Vue.prototype.$remove = function(cb, withTransition) {
        if (!this.$el.parentNode) {
          return cb && cb();
        }
        var inDocument = this._isAttached && inDoc(this.$el);
        if (!inDocument)
          withTransition = false;
        var self = this;
        var realCb = function realCb() {
          if (inDocument)
            self._callHook('detached');
          if (cb)
            cb();
        };
        if (this._isFragment) {
          removeNodeRange(this._fragmentStart, this._fragmentEnd, this, this._fragment, realCb);
        } else {
          var op = withTransition === false ? removeWithCb : removeWithTransition;
          op(this.$el, this, realCb);
        }
        return this;
      };
      function insert(vm, target, cb, withTransition, op1, op2) {
        target = query(target);
        var targetIsDetached = !inDoc(target);
        var op = withTransition === false || targetIsDetached ? op1 : op2;
        var shouldCallHook = !targetIsDetached && !vm._isAttached && !inDoc(vm.$el);
        if (vm._isFragment) {
          mapNodeRange(vm._fragmentStart, vm._fragmentEnd, function(node) {
            op(node, target, vm);
          });
          cb && cb();
        } else {
          op(vm.$el, target, vm, cb);
        }
        if (shouldCallHook) {
          vm._callHook('attached');
        }
        return vm;
      }
      function query(el) {
        return typeof el === 'string' ? document.querySelector(el) : el;
      }
      function append(el, target, vm, cb) {
        target.appendChild(el);
        if (cb)
          cb();
      }
      function beforeWithCb(el, target, vm, cb) {
        before(el, target);
        if (cb)
          cb();
      }
      function removeWithCb(el, vm, cb) {
        remove(el);
        if (cb)
          cb();
      }
    }
    function eventsAPI(Vue) {
      Vue.prototype.$on = function(event, fn) {
        (this._events[event] || (this._events[event] = [])).push(fn);
        modifyListenerCount(this, event, 1);
        return this;
      };
      Vue.prototype.$once = function(event, fn) {
        var self = this;
        function on() {
          self.$off(event, on);
          fn.apply(this, arguments);
        }
        on.fn = fn;
        this.$on(event, on);
        return this;
      };
      Vue.prototype.$off = function(event, fn) {
        var cbs;
        if (!arguments.length) {
          if (this.$parent) {
            for (event in this._events) {
              cbs = this._events[event];
              if (cbs) {
                modifyListenerCount(this, event, -cbs.length);
              }
            }
          }
          this._events = {};
          return this;
        }
        cbs = this._events[event];
        if (!cbs) {
          return this;
        }
        if (arguments.length === 1) {
          modifyListenerCount(this, event, -cbs.length);
          this._events[event] = null;
          return this;
        }
        var cb;
        var i = cbs.length;
        while (i--) {
          cb = cbs[i];
          if (cb === fn || cb.fn === fn) {
            modifyListenerCount(this, event, -1);
            cbs.splice(i, 1);
            break;
          }
        }
        return this;
      };
      Vue.prototype.$emit = function(event) {
        var cbs = this._events[event];
        var shouldPropagate = !cbs;
        if (cbs) {
          cbs = cbs.length > 1 ? toArray(cbs) : cbs;
          var args = toArray(arguments, 1);
          for (var i = 0,
              l = cbs.length; i < l; i++) {
            var res = cbs[i].apply(this, args);
            if (res === true) {
              shouldPropagate = true;
            }
          }
        }
        return shouldPropagate;
      };
      Vue.prototype.$broadcast = function(event) {
        if (!this._eventsCount[event])
          return;
        var children = this.$children;
        for (var i = 0,
            l = children.length; i < l; i++) {
          var child = children[i];
          var shouldPropagate = child.$emit.apply(child, arguments);
          if (shouldPropagate) {
            child.$broadcast.apply(child, arguments);
          }
        }
        return this;
      };
      Vue.prototype.$dispatch = function() {
        this.$emit.apply(this, arguments);
        var parent = this.$parent;
        while (parent) {
          var shouldPropagate = parent.$emit.apply(parent, arguments);
          parent = shouldPropagate ? parent.$parent : null;
        }
        return this;
      };
      var hookRE = /^hook:/;
      function modifyListenerCount(vm, event, count) {
        var parent = vm.$parent;
        if (!parent || !count || hookRE.test(event))
          return;
        while (parent) {
          parent._eventsCount[event] = (parent._eventsCount[event] || 0) + count;
          parent = parent.$parent;
        }
      }
    }
    function lifecycleAPI(Vue) {
      Vue.prototype.$mount = function(el) {
        if (this._isCompiled) {
          'development' !== 'production' && warn('$mount() should be called only once.');
          return;
        }
        el = query(el);
        if (!el) {
          el = document.createElement('div');
        }
        this._compile(el);
        this._initDOMHooks();
        if (inDoc(this.$el)) {
          this._callHook('attached');
          ready.call(this);
        } else {
          this.$once('hook:attached', ready);
        }
        return this;
      };
      function ready() {
        this._isAttached = true;
        this._isReady = true;
        this._callHook('ready');
      }
      Vue.prototype.$destroy = function(remove, deferCleanup) {
        this._destroy(remove, deferCleanup);
      };
      Vue.prototype.$compile = function(el, host, scope, frag) {
        return compile(el, this.$options, true)(this, el, host, scope, frag);
      };
    }
    function Vue(options) {
      this._init(options);
    }
    initMixin(Vue);
    stateMixin(Vue);
    eventsMixin(Vue);
    lifecycleMixin(Vue);
    miscMixin(Vue);
    globalAPI(Vue);
    dataAPI(Vue);
    domAPI(Vue);
    eventsAPI(Vue);
    lifecycleAPI(Vue);
    var convertArray = vFor._postProcess;
    function limitBy(arr, n, offset) {
      offset = offset ? parseInt(offset, 10) : 0;
      return typeof n === 'number' ? arr.slice(offset, offset + n) : arr;
    }
    function filterBy(arr, search, delimiter) {
      arr = convertArray(arr);
      if (search == null) {
        return arr;
      }
      if (typeof search === 'function') {
        return arr.filter(search);
      }
      search = ('' + search).toLowerCase();
      var n = delimiter === 'in' ? 3 : 2;
      var keys = toArray(arguments, n).reduce(function(prev, cur) {
        return prev.concat(cur);
      }, []);
      var res = [];
      var item,
          key,
          val,
          j;
      for (var i = 0,
          l = arr.length; i < l; i++) {
        item = arr[i];
        val = item && item.$value || item;
        j = keys.length;
        if (j) {
          while (j--) {
            key = keys[j];
            if (key === '$key' && contains(item.$key, search) || contains(getPath(val, key), search)) {
              res.push(item);
              break;
            }
          }
        } else if (contains(item, search)) {
          res.push(item);
        }
      }
      return res;
    }
    function orderBy(arr, sortKey, reverse) {
      arr = convertArray(arr);
      if (!sortKey) {
        return arr;
      }
      var order = reverse && reverse < 0 ? -1 : 1;
      return arr.slice().sort(function(a, b) {
        if (sortKey !== '$key') {
          if (isObject(a) && '$value' in a)
            a = a.$value;
          if (isObject(b) && '$value' in b)
            b = b.$value;
        }
        a = isObject(a) ? getPath(a, sortKey) : a;
        b = isObject(b) ? getPath(b, sortKey) : b;
        return a === b ? 0 : a > b ? order : -order;
      });
    }
    function contains(val, search) {
      var i;
      if (isPlainObject(val)) {
        var keys = Object.keys(val);
        i = keys.length;
        while (i--) {
          if (contains(val[keys[i]], search)) {
            return true;
          }
        }
      } else if (isArray(val)) {
        i = val.length;
        while (i--) {
          if (contains(val[i], search)) {
            return true;
          }
        }
      } else if (val != null) {
        return val.toString().toLowerCase().indexOf(search) > -1;
      }
    }
    var digitsRE = /(\d{3})(?=\d)/g;
    var filters = {
      orderBy: orderBy,
      filterBy: filterBy,
      limitBy: limitBy,
      json: {
        read: function read(value, indent) {
          return typeof value === 'string' ? value : JSON.stringify(value, null, Number(indent) || 2);
        },
        write: function write(value) {
          try {
            return JSON.parse(value);
          } catch (e) {
            return value;
          }
        }
      },
      capitalize: function capitalize(value) {
        if (!value && value !== 0)
          return '';
        value = value.toString();
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
      uppercase: function uppercase(value) {
        return value || value === 0 ? value.toString().toUpperCase() : '';
      },
      lowercase: function lowercase(value) {
        return value || value === 0 ? value.toString().toLowerCase() : '';
      },
      currency: function currency(value, _currency) {
        value = parseFloat(value);
        if (!isFinite(value) || !value && value !== 0)
          return '';
        _currency = _currency != null ? _currency : '$';
        var stringified = Math.abs(value).toFixed(2);
        var _int = stringified.slice(0, -3);
        var i = _int.length % 3;
        var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
        var _float = stringified.slice(-3);
        var sign = value < 0 ? '-' : '';
        return _currency + sign + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
      },
      pluralize: function pluralize(value) {
        var args = toArray(arguments, 1);
        return args.length > 1 ? args[value % 10 - 1] || args[args.length - 1] : args[0] + (value === 1 ? '' : 's');
      },
      debounce: function debounce(handler, delay) {
        if (!handler)
          return;
        if (!delay) {
          delay = 300;
        }
        return _debounce(handler, delay);
      }
    };
    var partial = {
      priority: 1750,
      params: ['name'],
      paramWatchers: {name: function name(value) {
          vIf.remove.call(this);
          if (value) {
            this.insert(value);
          }
        }},
      bind: function bind() {
        this.anchor = createAnchor('v-partial');
        replace(this.el, this.anchor);
        this.insert(this.params.name);
      },
      insert: function insert(id) {
        var partial = resolveAsset(this.vm.$options, 'partials', id);
        if ('development' !== 'production') {
          assertAsset(partial, 'partial', id);
        }
        if (partial) {
          this.factory = new FragmentFactory(this.vm, partial);
          vIf.insert.call(this);
        }
      },
      unbind: function unbind() {
        if (this.frag) {
          this.frag.destroy();
        }
      }
    };
    var slot = {
      priority: 1750,
      params: ['name'],
      bind: function bind() {
        var host = this.vm;
        var raw = host.$options._content;
        var content;
        if (!raw) {
          this.fallback();
          return;
        }
        var context = host._context;
        var slotName = this.params.name;
        if (!slotName) {
          var self = this;
          var compileDefaultContent = function compileDefaultContent() {
            self.compile(extractFragment(raw.childNodes, raw, true), context, host);
          };
          if (!host._isCompiled) {
            host.$once('hook:compiled', compileDefaultContent);
          } else {
            compileDefaultContent();
          }
        } else {
          var selector = '[slot="' + slotName + '"]';
          var nodes = raw.querySelectorAll(selector);
          if (nodes.length) {
            content = extractFragment(nodes, raw);
            if (content.hasChildNodes()) {
              this.compile(content, context, host);
            } else {
              this.fallback();
            }
          } else {
            this.fallback();
          }
        }
      },
      fallback: function fallback() {
        this.compile(extractContent(this.el, true), this.vm);
      },
      compile: function compile(content, context, host) {
        if (content && context) {
          var scope = host ? host._scope : this._scope;
          this.unlink = context.$compile(content, host, scope, this._frag);
        }
        if (content) {
          replace(this.el, content);
        } else {
          remove(this.el);
        }
      },
      unbind: function unbind() {
        if (this.unlink) {
          this.unlink();
        }
      }
    };
    function extractFragment(nodes, parent, main) {
      var frag = document.createDocumentFragment();
      for (var i = 0,
          l = nodes.length; i < l; i++) {
        var node = nodes[i];
        if (main && !node.__v_selected) {
          append(node);
        } else if (!main && node.parentNode === parent) {
          node.__v_selected = true;
          append(node);
        }
      }
      return frag;
      function append(node) {
        if (isTemplate(node) && !node.hasAttribute('v-if') && !node.hasAttribute('v-for')) {
          node = parseTemplate(node);
        }
        node = cloneNode(node);
        frag.appendChild(node);
      }
    }
    var elementDirectives = {
      slot: slot,
      partial: partial
    };
    Vue.version = '1.0.10';
    Vue.options = {
      directives: publicDirectives,
      elementDirectives: elementDirectives,
      filters: filters,
      transitions: {},
      components: {},
      partials: {},
      replace: true
    };
    if ('development' !== 'production') {
      if (inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('init', Vue);
      }
    }
    return Vue;
  }));
})(require('process'));
