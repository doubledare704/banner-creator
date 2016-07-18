/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inactiveImg = __webpack_require__(51);

	var _inactiveImg2 = _interopRequireDefault(_inactiveImg);

	var _deleteFromDB = __webpack_require__(52);

	var _deleteFromDB2 = _interopRequireDefault(_deleteFromDB);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//var fabric = require('./fabmain.js');
	var styluses = __webpack_require__(2);
	var Baz = __webpack_require__(6);

	Baz.register({
	    'inactiveImg': _inactiveImg2.default,
	    'deleteImg': _deleteFromDB2.default
	});

	var unwatch = Baz.watch();

/***/ },

/***/ 2:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 6:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _bazId = 0;
	var nodesComponentsRegistry = {};
	var componentsRegistry = {};
	var wrappersRegistry = {};

	function _getComponent(name) {
	  if (!componentsRegistry[name]) {
	    throw new Error(name + ' component is not registered. Use `Baz.register()` to do it');
	  }

	  return componentsRegistry[name];
	}

	function _bindComponentToNode(wrappedNode, componentName) {
	  var bazId = wrappedNode.id;

	  if (!componentName) {
	    return
	  }

	  if (nodesComponentsRegistry[bazId] === void 0) {
	    nodesComponentsRegistry[bazId] = [];
	  }

	  if (nodesComponentsRegistry[bazId].indexOf(componentName) === -1) {
	    nodesComponentsRegistry[bazId].push(componentName);
	  }
	}

	function _applyComponentsToNode(wrappedNode) {
	  var bazId = wrappedNode.id;

	  for (var i = 0; i < nodesComponentsRegistry[bazId].length; i++) {
	    var component = _getComponent(nodesComponentsRegistry[bazId][i]);

	    if (component.bazFunc) {
	      component.bazFunc(wrappedNode.__wrapped__);
	    }
	  }
	}

	function BazookaWrapper(node) {
	  var bazId = node.getAttribute('data-bazid');

	  if (bazId == null) {
	    bazId = (_bazId++).toString();
	    node.setAttribute('data-bazid', bazId);
	    wrappersRegistry[bazId] = this;
	  }

	  this.__wrapped__ = node;
	  /**
	   * Internal id
	   * @name Bazooka.id
	   * @type {string}
	   * @memberof Bazooka
	   * @instance
	   */
	  this.id = bazId;
	}

	BazookaWrapper.prototype.constructor = BazookaWrapper;
	BazookaWrapper.prototype.getComponents = function () {
	  var components = {}

	  for (var i = 0; i < nodesComponentsRegistry[this.id].length; i++) {
	    components[nodesComponentsRegistry[this.id][i]] = _getComponent(nodesComponentsRegistry[this.id][i])
	  }

	  return components
	};

	function _wrapAndBindNode(node) {
	  var dataBazooka = (node.getAttribute('data-bazooka') || '').trim();
	  var wrappedNode;
	  var componentNames;

	  if (dataBazooka) {
	    componentNames = dataBazooka.split(' ');
	    wrappedNode = new BazookaWrapper(node);

	    for (var i = 0; i < componentNames.length; i++) {
	      _bindComponentToNode(wrappedNode, componentNames[i].trim());
	    }

	    _applyComponentsToNode(wrappedNode);
	  }
	}

	/** @class Bazooka */

	/**
	 * @namespace BazComponent
	 * @description Interface of component, required by [Bazooka.refresh]{@link module:Bazooka.refresh}
	 */

	/**
	 * @name simple
	 * @func
	 * @memberof BazComponent
	 * @param {node} - bound DOM node
	 * @description CommonJS module written only with Bazooka interface to be used with `data-bazooka`
	 * @example
	 * ```javascript
	 *   module.exports = function bazFunc(node) {}
	 * ```
	 */

	/**
	 * @name universal
	 * @namespace BazComponent.universal
	 * @description CommonJS module with Bazooka interface, so it can be used both in `data-bazooka`
	 * and in another CommonJS modules via `require()`
	 * @example
	 * ```javascript
	 *   function trackEvent(category, action, label) {}
	 *   module.exports = {
	 *     bazFunc: function bazFunc(node) { node.onclick = trackEvent.bind(…) },
	 *     trackEvent: trackEvent,
	 *   }
	 * ```
	 */

	/**
	 * @name bazFunc
	 * @memberof BazComponent.universal
	 * @func
	 * @param {node} - bound DOM node
	 * @description Component's binding function
	 */

	/**
	 * @func
	 * @param {node|BazookaWrapper} value - DOM node or wrapped node
	 * @returns {BazookaWrapper}
	 * @example
	 * ```javascript
	 *   var Baz = require('bazooka');
	 *   var $baz = Baz(node);
	 * ```
	 */
	var Bazooka = function (value) {
	  if (value instanceof BazookaWrapper) {
	    return value;
	  }

	  return new BazookaWrapper(value);
	};

	/** @module {function} Bazooka */
	/**
	 * Reference to {@link BazookaWrapper} class
	 * @name BazookaWrapper
	 */
	Bazooka.BazookaWrapper = BazookaWrapper;

	Bazooka.h = __webpack_require__(7);

	/**
	 * Register components names
	 * @func register
	 * @param {Object} componentsObj - object with names as keys and components as values
	 * @static
	 */
	Bazooka.register = function (componentsObj) {
	  for (var name in componentsObj) {
	    if (typeof componentsObj[name] === 'function') {
	      componentsRegistry[name] = {
	        bazFunc: componentsObj[name],
	      };
	    } else {
	      componentsRegistry[name] = componentsObj[name];
	    }
	  }
	};

	/**
	 * Parse and bind bazooka components to nodes without bound components
	 * @func refresh
	 * @param {node} [rootNode=document.body] - DOM node, children of which will be checked for `data-bazooka`
	 * @static
	 */
	Bazooka.refresh = function (rootNode) {
	  rootNode = rootNode || document.body;

	  for (var bazId in wrappersRegistry) {
	    if (wrappersRegistry[bazId] && !wrappersRegistry[bazId].__wrapped__.parentNode) {
	      wrappersRegistry[bazId] = null;
	      nodesComponentsRegistry[bazId] = [];
	    }
	  }

	  Array.prototype.forEach.call(
	    rootNode.querySelectorAll('[data-bazooka]:not([data-bazid])'),
	    _wrapAndBindNode
	  );
	};

	function _observedMutationCallback(mutation) {
	  Bazooka.refresh(mutation.target);
	}

	function _MutationObserverCallback(mutations) {
	  mutations.forEach(_observedMutationCallback);
	}

	/**
	 * Watch for new nodes with `data-bazooka`. No need to run {@link Bazooka.refresh} before this. It will be called automatically.
	 * @func watch
	 * @param {node} [rootNode=document.body] - DOM node, children of which will be watched for `data-bazooka`
	 * @static
	 * @returns {function} Unwatch function
	 */
	Bazooka.watch = function (rootNode) {
	  var observer = new MutationObserver(_MutationObserverCallback);
	  rootNode = rootNode || document.body;

	  Bazooka.refresh(rootNode);
	  observer.observe(rootNode, {childList: true, subtree: true});

	  return observer.disconnect.bind(observer);
	};

	module.exports = Bazooka;


/***/ },

/***/ 7:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var IGNORED_ATTRS = ['data-bazid', 'data-bazooka'];

	var rbrace = /^(?:\{.*\}|\[.*\])$/;
	var rdataAttr = /^data-([a-z\d\-]+)$/;
	var rdashAlpha = /-([a-z])/gi;
	var fcamelCase = function (all, letter) {
	  return letter.toUpperCase();
	};

	function _parseAttr(prefix, parsedAttrs, attr) {
	  if (typeof attr.value !== 'string') { return parsedAttrs; }

	  if ( !rdataAttr.test(attr.name) || IGNORED_ATTRS.indexOf(attr.name) !== -1) {
	    return parsedAttrs;
	  }

	  var attrName = attr.name.match(rdataAttr)[1];

	  if (prefix) {
	    prefix = prefix.concat('-');
	    if (prefix === attrName.slice(0, prefix.length)) {
	      attrName = attrName.slice(prefix.length);
	    } else {
	      return parsedAttrs;
	    }
	  }

	  var camelCaseName = attrName.replace(rdashAlpha, fcamelCase);

	  var data;

	  switch (attr.value) {
	    case 'true':
	      data = true;
	      break;
	    case 'false':
	      data = false;
	      break;
	    case 'null':
	      data = null;
	      break;
	    default:
	      try {
	        if (attr.value === +attr.value + '') {
	          data = +attr.value;
	        } else if (rbrace.test(attr.value)) {
	          data = JSON.parse(attr.value);
	        } else {
	          data = attr.value;
	        }
	      } catch (e) { return parsedAttrs; }
	  }

	  parsedAttrs[camelCaseName] = data;
	  return parsedAttrs;
	}

	function _getPrefixedAttrs(prefix, node) {
	  return Array.prototype.reduce.call(node.attributes, _parseAttr.bind(null, prefix), {});
	}

	/**
	 * @param {string} [prefix] - data-attribute prefix
	 * @param {HTMLNode} node - target node
	 * @returns {function|object} - curried function for parsing node with passed prefix or parsed attrs
	 */
	var getAttrs = function (prefix, node) {
	  if (typeof prefix === 'string' && node === void 0) {
	    return _getPrefixedAttrs.bind(null, prefix);
	  }

	  if (node === void 0) {
	    if (process.env.NODE_ENV != 'production') {
	      console.warn('`Baz.h.getAttrs(node)` is deprecated. Use `Baz.h.getAttrs(prefix, node)` or `Baz.h.getAttrs(prefix)(node)` instead')
	    }
	    node = prefix;
	    return _getPrefixedAttrs('', node);
	  }

	  return _getPrefixedAttrs(prefix, node);
	};

	function _prefixDataKey(dataKey) {
	  if (!dataKey) {
	    throw new Error('dataKey must be non empty');
	  }

	  if (dataKey.indexOf('data-') === 0) {
	    return dataKey
	  } else if (dataKey.indexOf('-') >= 0) {
	    return 'data-' + dataKey
	  } else {
	    return 'data-' + dataKey.replace(/([A-Z])/g, "-$1").toLowerCase()
	  }
	};

	/**
	 * @param {HTMLNode} parentNode
	 * @param {string} dataKey – data-key. data-baz-key, baz-key and bazKey are equivalent
	 * @param {string} [dataValue]
	 * @returns {NodeList}
	 */
	var getChildrenWithData = function (parentNode, dataKey, dataValue) {
	  var prefixedDataKey = _prefixDataKey(dataKey);
	  var query;

	  if (dataValue === void 0) {
	    query = '[' + prefixedDataKey + ']'
	  } else {
	    query = '[' + prefixedDataKey + '="' + dataValue + '"]'
	  }

	  return parentNode.querySelectorAll(query)
	};

	module.exports = {
	  getAttrs: getAttrs,
	  getChildrenWithData: getChildrenWithData
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },

/***/ 8:
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = cachedSetTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    cachedClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        cachedSetTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },

/***/ 51:
/***/ function(module, exports) {

	"use strict";

	var infoClicked = function infoClicked(ev) {
	    var xhttp = new XMLHttpRequest();
	    xhttp.onreadystatechange = function () {
	        if (xhttp.readyState == 4 && xhttp.status == 200) {
	            var img = document.getElementsByClassName(ev.target.id);
	            var table = document.getElementById("inactiveImg").tBodies[0];

	            table.appendChild(img[0]);
	        }
	    };
	    xhttp.open("POST", "/admin/inactiveImg/" + ev.target.id, true);
	    xhttp.send(null);
	};

	function inactiveImg(node) {
	    node.onclick = infoClicked;
	}

	module.exports = {
	    bazFunc: inactiveImg
	};

/***/ },

/***/ 52:
/***/ function(module, exports) {

	"use strict";

	var infoClicked = function infoClicked(ev) {
	    var xhttp = new XMLHttpRequest();
	    xhttp.onreadystatechange = function () {
	        if (xhttp.readyState == 4 && xhttp.status == 204) {
	            var img = document.getElementsByClassName(ev.target.id);
	            img[0].style.display = "none";
	        }
	    };
	    xhttp.open("POST", "/admin/deleteImg/" + ev.target.id, true);
	    xhttp.send(null);
	};

	function deleteImg(node) {
	    node.onclick = infoClicked;
	}

	module.exports = {
	    bazFunc: deleteImg
	};

/***/ }

/******/ });