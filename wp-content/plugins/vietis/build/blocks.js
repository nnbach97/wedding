/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || defaults.transitional;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
axios.VERSION = (__webpack_require__(/*! ./env/data */ "./node_modules/axios/lib/env/data.js").version);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ (function(module) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ (function(module) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  if (!config.url) {
    throw new Error('Provided config url is not valid');
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  if (!config.url) {
    throw new Error('Provided config url is not valid');
  }
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled');
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ (function(module) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ (function(module) {

module.exports = {
  "version": "0.25.0"
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ (function(module) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ (function(module) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ (function(module) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ (function(module) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var VERSION = (__webpack_require__(/*! ../env/data */ "./node_modules/axios/lib/env/data.js").version);

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return toString.call(val) === '[object FormData]';
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return toString.call(val) === '[object URLSearchParams]';
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./src/blocks.js":
/*!***********************!*\
  !*** ./src/blocks.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _blocks_Banner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./blocks/Banner */ "./src/blocks/Banner/index.js");
/* harmony import */ var _blocks_Services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./blocks/Services */ "./src/blocks/Services/index.js");
/* harmony import */ var _blocks_Feature__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./blocks/Feature */ "./src/blocks/Feature/index.js");
/* harmony import */ var _blocks_Outsource__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./blocks/Outsource */ "./src/blocks/Outsource/index.js");
/* harmony import */ var _blocks_About__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./blocks/About */ "./src/blocks/About/index.js");
/* harmony import */ var _blocks_Clients__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./blocks/Clients */ "./src/blocks/Clients/index.js");
/* harmony import */ var _blocks_Feedback__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./blocks/Feedback */ "./src/blocks/Feedback/index.js");
/* harmony import */ var _blocks_Teams__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./blocks/Teams */ "./src/blocks/Teams/index.js");
/* harmony import */ var _blocks_CaseStudy__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./blocks/CaseStudy */ "./src/blocks/CaseStudy/index.js");
/* harmony import */ var _blocks_AboutBanner__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./blocks/AboutBanner */ "./src/blocks/AboutBanner/index.js");
/* harmony import */ var _blocks_Overview__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./blocks/Overview */ "./src/blocks/Overview/index.js");
/* harmony import */ var _blocks_Guarantee__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./blocks/Guarantee */ "./src/blocks/Guarantee/index.js");
/* harmony import */ var _blocks_Certificate__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./blocks/Certificate */ "./src/blocks/Certificate/index.js");
/* harmony import */ var _blocks_FunctionList__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./blocks/FunctionList */ "./src/blocks/FunctionList/index.js");
/* harmony import */ var _blocks_Product_VISInsight_Banner__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./blocks/Product/VISInsight/Banner */ "./src/blocks/Product/VISInsight/Banner/index.js");
/* harmony import */ var _blocks_Product_VISInsight_Overview__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./blocks/Product/VISInsight/Overview */ "./src/blocks/Product/VISInsight/Overview/index.js");
/* harmony import */ var _blocks_Product_Veramine_Banner__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./blocks/Product/Veramine/Banner */ "./src/blocks/Product/Veramine/Banner/index.js");
/* harmony import */ var _blocks_Product_Veramine_Technology__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./blocks/Product/Veramine/Technology */ "./src/blocks/Product/Veramine/Technology/index.js");
/* harmony import */ var _blocks_Product_Veramine_Overview__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./blocks/Product/Veramine/Overview */ "./src/blocks/Product/Veramine/Overview/index.js");
/* harmony import */ var _blocks_BlogFeatured__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./blocks/BlogFeatured */ "./src/blocks/BlogFeatured/index.js");
/* harmony import */ var _blocks_BlogTags__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./blocks/BlogTags */ "./src/blocks/BlogTags/index.js");
/* harmony import */ var _blocks_BannerCommon__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./blocks/BannerCommon */ "./src/blocks/BannerCommon/index.js");
/* harmony import */ var _blocks_DevelopingMobile__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./blocks/DevelopingMobile */ "./src/blocks/DevelopingMobile/index.js");
/* harmony import */ var _blocks_DevelopmentOurProcess__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./blocks/DevelopmentOurProcess */ "./src/blocks/DevelopmentOurProcess/index.js");
/* harmony import */ var _blocks_DevelopmentBenefit__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./blocks/DevelopmentBenefit */ "./src/blocks/DevelopmentBenefit/index.js");
/* harmony import */ var _blocks_ServiceHead__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./blocks/ServiceHead */ "./src/blocks/ServiceHead/index.js");
/* harmony import */ var _blocks_BlockChain__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./blocks/BlockChain */ "./src/blocks/BlockChain/index.js");
/* harmony import */ var _blocks_BannerNew__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./blocks/BannerNew */ "./src/blocks/BannerNew/index.js");
/* harmony import */ var _blocks_Leadership__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./blocks/Leadership */ "./src/blocks/Leadership/index.js");
/* harmony import */ var _blocks_ServiceNew__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./blocks/ServiceNew */ "./src/blocks/ServiceNew/index.js");
/* harmony import */ var _blocks_BannerServicePage__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./blocks/BannerServicePage */ "./src/blocks/BannerServicePage/index.js");
/* harmony import */ var _blocks_BannerNewImg__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./blocks/BannerNewImg */ "./src/blocks/BannerNewImg/index.js");
/* harmony import */ var _blocks_TheFox__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./blocks/TheFox */ "./src/blocks/TheFox/index.js");
/* harmony import */ var _blocks_Process__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./blocks/Process */ "./src/blocks/Process/index.js");
/* harmony import */ var _blocks_FeatureServicePage__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./blocks/FeatureServicePage */ "./src/blocks/FeatureServicePage/index.js");





































/***/ }),

/***/ "./src/blocks/AboutBanner/edit.js":
/*!****************************************!*\
  !*** ./src/blocks/AboutBanner/edit.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");







const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  })));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_5__.processConfig)(attributes.config);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block block-about-banner",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {}
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "ttl",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.ttl,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      ttl: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "txt",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.txt,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      txt: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "role"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "desc",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.role,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      role: value
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "img"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: PV_Admin.PV_BASE_URL + "/assets/img/blocks/about-banner/about-img01.png"
  }))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/AboutBanner/index.js":
/*!*****************************************!*\
  !*** ./src/blocks/AboutBanner/index.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/AboutBanner/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/AboutBanner/edit.js");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("create-block/about-banner", {
  title: "Banner-about",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-info",
  attributes: {
    ttl: {
      type: "string",
      default: "<strong>About us</strong>"
    },
    txt: {
      type: "string",
      default: "We are very grateful for working with you.<br><br>Our company VietIS was established in 2009 in Hanoi, focusing on thehighly demanding quality markets such as Japanese and APAC. Wealways work hard, highly disciplined to provide reliable offshoresoftware services at affordable cost but high quality. We are offeringseveral services: <strong>Application Development/Maintenance, DigitalTransformation, UI/UX Design, Engineer Dispatch.</strong><br><br>Our broad experience allows us to create many type applications inmany type of platforms with front-end, web, mobile technologies andprogramming languages such as Java, PHP, Java Scripts, .NET, NodeJS ...and back-end enterprise applications, cloud computing solution withAWS, Microsoft Azure, Google Cloud. We have many engineers speakinggood Japanese, English to work with you from early stages of project asrequirement hearing, UI/ UX design to later stages as detailed design,coding, testing and deployment.<br><br><strong>We are looking forward to becoming your trusted tech- partner, wefeel happy and excited to see your products succeed on the marketand we are always available to support you.</strong>"
    },
    role: {
      type: "string",
      default: "CEO <strong>Dang Dieu Linh</strong>"
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  }
});

/***/ }),

/***/ "./src/blocks/About/edit.js":
/*!**********************************!*\
  !*** ./src/blocks/About/edit.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var _components_color_control__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/color-control */ "./src/components/color-control.js");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-sortable-hoc */ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");











const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.title_shadow,
    onChange: value => setAttributes({
      title_shadow: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\xECm",
    label: "Ti\xEAu \u0111\u1EC1 ch\xECm"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  })));
};
const DragHandle = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8__.sortableHandle)(() => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "admin-buttom-move-item"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "dashicons dashicons-move"
})));
const SortableItem = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8__.SortableElement)(props => {
  const {
    object,
    data_key,
    attributes,
    setAttributes,
    handlerDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap",
    style: {
      "--color-background": object !== null && object !== void 0 && object.color ? object === null || object === void 0 ? void 0 : object.color : "#F3F4FD"
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => handlerDelete(data_key),
    className: "admin-buttom-delete-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(DragHandle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_color_control__WEBPACK_IMPORTED_MODULE_7__.BaseColorControl, {
    value: (object === null || object === void 0 ? void 0 : object.color) || "#F3F4FD",
    colors: [{
      name: "Màu 1",
      color: "#F3F4FD"
    }, {
      name: "Màu 2",
      color: "#EDFAFE"
    }, {
      name: "Màu 3",
      color: "#EBF5FF"
    }],
    onChange: value => {
      let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let item = {
        ...object,
        color: value
      };
      items[data_key] = item;
      setAttributes({
        items: items
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "icon"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: object === null || object === void 0 ? void 0 : object.icon,
    className: "img",
    onChange: value => {
      let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let item = {
        ...object,
        icon: value
      };
      items[data_key] = item;
      setAttributes({
        items: items
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "text"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "ttl",
    value: object === null || object === void 0 ? void 0 : object.ttl,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Ti\xEAu \u0111\u1EC1",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let item = {
        ...object,
        ttl: value
      };
      items[data_key] = item;
      setAttributes({
        items: items
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "txt",
    value: object === null || object === void 0 ? void 0 : object.txt,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "N\u1ED9i dung",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let item = {
        ...object,
        txt: value
      };
      items[data_key] = item;
      setAttributes({
        items: items
      });
    }
  }))));
});
const SortableList = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8__.SortableContainer)(props => {
  const {
    items,
    attributes,
    setAttributes,
    handlerAdd,
    handlerDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrapper-item"
  }, items && items.map(function (object, index) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableItem, {
      key: `item-${index}`,
      value: object,
      object: object,
      index: index,
      data_key: index,
      attributes: attributes,
      setAttributes: setAttributes,
      handlerDelete: handlerDelete
    });
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item button-add"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => handlerAdd(),
    className: "admin-buttom-add-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus-alt2"
  })))));
});
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const handlerAdd = function () {
    let datas = [...attributes.items];
    datas.push({
      icon: {},
      ttl: "<strong>Tiêu đề</strong>",
      txt: "Nội dung",
      color: "#F3F4FD"
    });
    setAttributes({
      items: datas
    });
  };
  const handlerDelete = function (index) {
    let datas = [...attributes.items];
    datas.splice(index, 1);
    setAttributes({
      items: datas
    });
  };
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_5__.processConfig)(attributes.config);
  const handlerOnSortEnd = _ref3 => {
    let {
      oldIndex,
      newIndex
    } = _ref3;
    let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    setAttributes({
      items: (0,array_move__WEBPACK_IMPORTED_MODULE_9__.arrayMoveImmutable)(items, oldIndex, newIndex)
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-about",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {}
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "title text-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "ttl",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "shadow"
  }, attributes === null || attributes === void 0 ? void 0 : attributes.title_shadow)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableList, {
    items: attributes === null || attributes === void 0 ? void 0 : attributes.items,
    onSortEnd: handlerOnSortEnd,
    axis: "xy",
    helperClass: "hold-item-about",
    hideSortableGhost: true,
    lockOffset: ["100%"],
    useDragHandle: true,
    attributes: attributes,
    setAttributes: setAttributes,
    handlerAdd: handlerAdd,
    handlerDelete: handlerDelete
  }))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/About/index.js":
/*!***********************************!*\
  !*** ./src/blocks/About/index.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./src/blocks/About/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/About/style.scss");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("create-block/about", {
  title: "About",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-editor-help",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Why VietIS?</strong>"
    },
    title_shadow: {
      type: "string",
      default: "About"
    },
    config: {
      type: "object",
      default: {}
    },
    items: {
      type: "array",
      default: [{
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/about/about_img01.png",
          alt: "",
          id: ""
        },
        ttl: "<strong>Certified technical staff</strong>",
        txt: "Highly selected vendors from our rapidly expanding vendor ecosystem",
        color: "#F3F4FD"
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/about/about_img02.png",
          alt: "",
          id: ""
        },
        ttl: "<strong>Instant deployment</strong>",
        txt: "Using data-driven matching and improved profile creation",
        color: "#EDFAFE"
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/about/about_img03.png",
          alt: "",
          id: ""
        },
        ttl: "<strong>Business simplicity</strong>",
        txt: "An efficient platform for the full remote employee augmentation process",
        color: "#EBF5FF"
      }]
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  }
});

/***/ }),

/***/ "./src/blocks/BannerCommon/edit.js":
/*!*****************************************!*\
  !*** ./src/blocks/BannerCommon/edit.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");








const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  })));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block common-block-banner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "banner-bg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes.img,
    onChange: value => {
      if (!value) return false;
      setAttributes({
        img: value
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "banner-inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h2",
    className: "ttl",
    value: attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Case Study",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/BannerCommon/index.js":
/*!******************************************!*\
  !*** ./src/blocks/BannerCommon/index.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/BannerCommon/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/blocks/BannerCommon/edit.js");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/banner-common", {
  title: "Banner Common",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-info",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Case Study</strong>"
    },
    img: {
      type: "object",
      default: {
        url: PV_Admin.PV_BASE_URL + "assets/img/blocks/casestudy/casestudy_bg.png",
        alt: "",
        id: ""
      }
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"]
});

/***/ }),

/***/ "./src/blocks/BannerNewImg/edit.js":
/*!*****************************************!*\
  !*** ./src/blocks/BannerNewImg/edit.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var _components_video_upload__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/video-upload */ "./src/components/video-upload.js");









const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3 horizontal-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "ttl"
  }, "Show button video:"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FormToggle, {
    checked: attributes.is_show_btn_video,
    onChange: () => setAttributes({
      is_show_btn_video: !attributes.is_show_btn_video
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3 horizontal-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "ttl"
  }, "Show background mobile:"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FormToggle, {
    checked: attributes.is_show_bg,
    onChange: () => setAttributes({
      is_show_bg: !attributes.is_show_bg
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Panel, {
    header: "Video Film"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_video_upload__WEBPACK_IMPORTED_MODULE_7__.VideoUploadSingle, {
    value: attributes.video_film,
    className: "video-wrap",
    onChange: media => {
      setAttributes({
        video_film: media.url
      });
    },
    handleDeleteVideo: () => setAttributes({
      video_film: ""
    })
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const FragmentBlock = function (_ref2) {
  var _attributes$btn_inqui, _attributes$btn_inqui2, _attributes$certifica, _attributes$certifica2;
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `block block-banner-new-img${attributes.is_show_bg ? "" : " is-show-bg"}`
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "banner-bg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : attributes.img_banner,
    className: "banner-bg__img",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        ...(attributes === null || attributes === void 0 ? void 0 : attributes.img_banner),
        img_banner: value
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder banner-inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h2",
    className: "ttl",
    value: attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "In Pursuit of Excellence",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "sub",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.description,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "To be your long term Tech - Partner",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      description: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "btn-wrapper"
  }, attributes.is_show_btn_video ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "video-btn"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "video-mark"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wave-pulse wave-pulse-1"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wave-pulse wave-pulse-2"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "video-click"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "video-play"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "video-play-icon"
  })))) : "", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "icon"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : (_attributes$btn_inqui = attributes.btn_inquiry) === null || _attributes$btn_inqui === void 0 ? void 0 : _attributes$btn_inqui.icon,
    className: "img",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        btn_inquiry: {
          ...(attributes === null || attributes === void 0 ? void 0 : attributes.btn_inquiry),
          icon: value
        }
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "span",
    className: "url",
    value: (_attributes$btn_inqui2 = attributes.btn_inquiry) === null || _attributes$btn_inqui2 === void 0 ? void 0 : _attributes$btn_inqui2.text,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Inquiry",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      btn_inquiry: {
        ...(attributes === null || attributes === void 0 ? void 0 : attributes.btn_inquiry),
        text: value
      }
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "certificate"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "img-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : (_attributes$certifica = attributes.certificate) === null || _attributes$certifica === void 0 ? void 0 : _attributes$certifica.certificate_01,
    className: "img",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        certificate: {
          ...(attributes === null || attributes === void 0 ? void 0 : attributes.certificate),
          certificate_01: value
        }
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "img-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : (_attributes$certifica2 = attributes.certificate) === null || _attributes$certifica2 === void 0 ? void 0 : _attributes$certifica2.certificate_02,
    className: "img img-cmmi",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        certificate: {
          ...(attributes === null || attributes === void 0 ? void 0 : attributes.certificate),
          certificate_02: value
        }
      });
    }
  })))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-number"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "img img-number-bottom",
    src: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/banner/bg-number.svg`,
    alt: ""
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "number-inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "counter"
  }, attributes.counters && attributes.counters.map(function (object, index) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "counter-number"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "span",
      className: "",
      value: object.number,
      allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
      placeholder: "Num",
      keepPlaceholderOnFocus: true,
      onChange: value => {
        let counters = [...attributes.counters];
        let counter = {
          ...object,
          number: value
        };
        counters[index] = counter;
        setAttributes({
          counters: counters
        });
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, index !== 0 && "+")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "div",
      className: "txt",
      value: object.text,
      allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
      placeholder: "Title",
      keepPlaceholderOnFocus: true,
      onChange: value => {
        let counters = [...attributes.counters];
        let counter = {
          ...object,
          text: value
        };
        counters[index] = counter;
        setAttributes({
          counters: counters
        });
      }
    }));
  }))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/BannerNewImg/index.js":
/*!******************************************!*\
  !*** ./src/blocks/BannerNewImg/index.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/BannerNewImg/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/BannerNewImg/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/banner-new-img", {
  title: "Banner New Img",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "format-image",
  attributes: {
    title: {
      type: "string",
      default: "In Pursuit of Excellence"
    },
    description: {
      type: "string",
      default: "To be your long term Tech - Partner"
    },
    btn_watch: {
      type: "object",
      default: {
        text: '<a href="#">Watch vision film</a>',
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_icon-film.svg",
          alt: "",
          id: ""
        }
      }
    },
    btn_inquiry: {
      type: "object",
      default: {
        text: '<a href="/en/contact/">Inquiry</a>',
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_icon-inquiry.svg",
          alt: "",
          id: ""
        }
      }
    },
    certificate: {
      type: "array",
      default: {
        certificate_01: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_iso.svg",
          alt: "",
          id: ""
        },
        certificate_02: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_cmmi.png",
          alt: "",
          id: ""
        }
      }
    },
    counters: {
      type: "array",
      default: [{
        number: "03",
        text: "Locations"
      }, {
        number: "250",
        text: "Clients"
      }, {
        number: "300",
        text: "Projects"
      }]
    },
    img_banner: {
      type: "string",
      default: {
        url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_new.png",
        alt: ""
      }
    },
    video_film: {
      type: "string",
      default: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/video_film.mp4"
    },
    is_show_btn_video: {
      type: "boolean",
      default: true
    },
    is_show_bg: {
      type: "boolean",
      default: true
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/BannerNew/edit.js":
/*!**************************************!*\
  !*** ./src/blocks/BannerNew/edit.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var _components_video_upload__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/video-upload */ "./src/components/video-upload.js");









const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3 horizontal-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "ttl"
  }, "Show button video:"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FormToggle, {
    checked: attributes.is_show_btn_video,
    onChange: () => setAttributes({
      is_show_btn_video: !attributes.is_show_btn_video
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3 horizontal-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "ttl"
  }, "Show background mobile:"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FormToggle, {
    checked: attributes.is_show_bg,
    onChange: () => setAttributes({
      is_show_bg: !attributes.is_show_bg
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Panel, {
    header: "Video Background"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_video_upload__WEBPACK_IMPORTED_MODULE_7__.VideoUploadSingle, {
    value: attributes.video_background,
    className: "video-wrap",
    onChange: media => {
      setAttributes({
        video_background: media.url
      });
    },
    handleDeleteVideo: () => setAttributes({
      video_background: ""
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Panel, {
    header: "Video Film"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_video_upload__WEBPACK_IMPORTED_MODULE_7__.VideoUploadSingle, {
    value: attributes.video_film,
    className: "video-wrap",
    onChange: media => {
      setAttributes({
        video_film: media.url
      });
    },
    handleDeleteVideo: () => setAttributes({
      video_film: ""
    })
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const FragmentBlock = function (_ref2) {
  var _attributes$btn_inqui, _attributes$btn_inqui2, _attributes$certifica, _attributes$certifica2;
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `block block-banner-new${attributes.is_show_bg ? "" : " is-show-bg"}`
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "banner-bg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("video", {
    className: "video",
    preload: "true",
    muted: "",
    playsinline: "",
    poster: "",
    autoplay: "",
    loop: "",
    controls: ""
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("source", {
    src: attributes.video_background,
    type: "video/mp4"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder banner-inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h2",
    className: "ttl",
    value: attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "In Pursuit of Excellence",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "sub",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.description,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "To be your long term Tech - Partner",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      description: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "btn-wrapper"
  }, attributes.is_show_btn_video ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "video-btn"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "video-mark"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wave-pulse wave-pulse-1"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wave-pulse wave-pulse-2"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "video-click"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "video-play"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "video-play-icon"
  })))) : "", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "icon"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : (_attributes$btn_inqui = attributes.btn_inquiry) === null || _attributes$btn_inqui === void 0 ? void 0 : _attributes$btn_inqui.icon,
    className: "img",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        btn_inquiry: {
          ...(attributes === null || attributes === void 0 ? void 0 : attributes.btn_inquiry),
          icon: value
        }
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "span",
    className: "url",
    value: (_attributes$btn_inqui2 = attributes.btn_inquiry) === null || _attributes$btn_inqui2 === void 0 ? void 0 : _attributes$btn_inqui2.text,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Inquiry",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      btn_inquiry: {
        ...(attributes === null || attributes === void 0 ? void 0 : attributes.btn_inquiry),
        text: value
      }
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "certificate"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "img-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : (_attributes$certifica = attributes.certificate) === null || _attributes$certifica === void 0 ? void 0 : _attributes$certifica.certificate_01,
    className: "img",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        certificate: {
          ...(attributes === null || attributes === void 0 ? void 0 : attributes.certificate),
          certificate_01: value
        }
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "img-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : (_attributes$certifica2 = attributes.certificate) === null || _attributes$certifica2 === void 0 ? void 0 : _attributes$certifica2.certificate_02,
    className: "img img-cmmi",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        certificate: {
          ...(attributes === null || attributes === void 0 ? void 0 : attributes.certificate),
          certificate_02: value
        }
      });
    }
  })))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-number"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "img img-number-bottom",
    src: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/banner/bg-number.svg`,
    alt: ""
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "number-inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "counter"
  }, attributes.counters && attributes.counters.map(function (object, index) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "counter-number"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "span",
      className: "",
      value: object.number,
      allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
      placeholder: "Num",
      keepPlaceholderOnFocus: true,
      onChange: value => {
        let counters = [...attributes.counters];
        let counter = {
          ...object,
          number: value
        };
        counters[index] = counter;
        setAttributes({
          counters: counters
        });
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, index !== 0 && "+")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "div",
      className: "txt",
      value: object.text,
      allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
      placeholder: "Title",
      keepPlaceholderOnFocus: true,
      onChange: value => {
        let counters = [...attributes.counters];
        let counter = {
          ...object,
          text: value
        };
        counters[index] = counter;
        setAttributes({
          counters: counters
        });
      }
    }));
  }))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/BannerNew/index.js":
/*!***************************************!*\
  !*** ./src/blocks/BannerNew/index.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/BannerNew/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/BannerNew/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/banner-new", {
  title: "Banner New",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "format-image",
  attributes: {
    title: {
      type: "string",
      default: "In Pursuit of Excellence"
    },
    description: {
      type: "string",
      default: "To be your long term Tech - Partner"
    },
    btn_watch: {
      type: "object",
      default: {
        text: '<a href="#">Watch vision film</a>',
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_icon-film.svg",
          alt: "",
          id: ""
        }
      }
    },
    btn_inquiry: {
      type: "object",
      default: {
        text: '<a href="/en/contact/">Inquiry</a>',
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_icon-inquiry.svg",
          alt: "",
          id: ""
        }
      }
    },
    certificate: {
      type: "array",
      default: {
        certificate_01: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_iso.svg",
          alt: "",
          id: ""
        },
        certificate_02: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_cmmi.png",
          alt: "",
          id: ""
        }
      }
    },
    counters: {
      type: "array",
      default: [{
        number: "03",
        text: "Locations"
      }, {
        number: "250",
        text: "Clients"
      }, {
        number: "300",
        text: "Projects"
      }]
    },
    video_background: {
      type: "string",
      default: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/video_background_new.mp4"
    },
    video_film: {
      type: "string",
      default: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/video_film.mp4"
    },
    is_show_btn_video: {
      type: "boolean",
      default: true
    },
    is_show_bg: {
      type: "boolean",
      default: true
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/BannerServicePage/edit.js":
/*!**********************************************!*\
  !*** ./src/blocks/BannerServicePage/edit.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");







const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-service-banner js-hero"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder banner-inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h2",
    className: "ttl",
    value: attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "des",
    value: attributes.description,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Description",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      description: value
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-process"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder process"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ttl-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h2",
    className: "ttl",
    value: attributes.title_process,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Process main service",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title_process: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-left"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-left-block process-left-block--first"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-left-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "txt-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "process-left-item__txt",
    value: attributes.list_text_process.text1,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      list_text_process: {
        ...attributes.list_text_process,
        text1: value
      }
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num-in"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, "01")))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "img",
    src: PV_Admin.PV_BASE_URL + "assets/img/blocks/banner-service-page/dash_01_left.svg",
    alt: ""
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-left-block process-left-block--second"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-left-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "txt-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "process-left-item__txt",
    value: attributes.list_text_process.text2,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      list_text_process: {
        ...attributes.list_text_process,
        text2: value
      }
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num-in"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, "02")))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "img",
    src: PV_Admin.PV_BASE_URL + "assets/img/blocks/banner-service-page/dash_02_left.svg",
    alt: ""
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-left-block process-left-block--third"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-left-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "txt-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "process-left-item__txt",
    value: attributes.list_text_process.text3,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      list_text_process: {
        ...attributes.list_text_process,
        text3: value
      }
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num-in"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, "03")))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "img",
    src: PV_Admin.PV_BASE_URL + "assets/img/blocks/banner-service-page/dash_03_left.svg",
    alt: ""
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-left-block process-left-block--fourth"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-left-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "txt-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "process-left-item__txt",
    value: attributes.list_text_process.text4,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      list_text_process: {
        ...attributes.list_text_process,
        text4: value
      }
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num-in"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, "04")))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-mid"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "",
    src: PV_Admin.PV_BASE_URL + "assets/img/blocks/banner-service-page/dash_mid_top.svg",
    alt: ""
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "",
    src: PV_Admin.PV_BASE_URL + "assets/img/blocks/banner-service-page/dash_mid_bottom.svg",
    alt: ""
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-right"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-right-block process-right-block--first"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-right-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num-in"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, "08"))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "txt-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "process-right-item__txt",
    value: attributes.list_text_process.text8,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      list_text_process: {
        ...attributes.list_text_process,
        text8: value
      }
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "img",
    src: PV_Admin.PV_BASE_URL + "assets/img/blocks/banner-service-page/dash_03_right.svg",
    alt: ""
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-right-block process-right-block--second"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-right-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num-in"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, "07"))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "txt-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "process-right-item__txt",
    value: attributes.list_text_process.text7,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      list_text_process: {
        ...attributes.list_text_process,
        text7: value
      }
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "img",
    src: PV_Admin.PV_BASE_URL + "assets/img/blocks/banner-service-page/dash_02_right.svg",
    alt: ""
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-right-block process-right-block--third"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-right-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num-in"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, "06"))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "txt-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "process-right-item__txt",
    value: attributes.list_text_process.text6,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      list_text_process: {
        ...attributes.list_text_process,
        text6: value
      }
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "img",
    src: PV_Admin.PV_BASE_URL + "assets/img/blocks/banner-service-page/dash_01_right.svg",
    alt: ""
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-right-block process-right-block--fourth"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-right-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "process-num-in"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, "05"))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "txt-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "process-right-item__txt",
    value: attributes.list_text_process.text5,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      list_text_process: {
        ...attributes.list_text_process,
        text5: value
      }
    })
  }))))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/BannerServicePage/index.js":
/*!***********************************************!*\
  !*** ./src/blocks/BannerServicePage/index.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/BannerServicePage/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/BannerServicePage/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/banner-service-page", {
  title: "Banner Service_Page",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "format-image",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Our services that serve your business needs</strong>"
    },
    description: {
      type: "string",
      default: "At VietIS, our customers’ business needs are at the center of everything we do. We don’t just deliver technological solutions – we provide services that offer tangible business value. To accomplish this, we help you decide on the most suitable approach and the best technology to meet your specific needs."
    },
    title_process: {
      type: "string",
      default: "<strong>Process main service</strong>"
    },
    list_text_process: {
      type: "object",
      default: {
        text1: "Receive the Requirement",
        text2: "Understanding the requirement",
        text3: "Consultation/ interview",
        text4: "Quotation / contract",
        text5: "Development",
        text6: "Process Evaluation",
        text7: "Test",
        text8: "Maintenance"
      }
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/Banner/edit.js":
/*!***********************************!*\
  !*** ./src/blocks/Banner/edit.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var _components_video_upload__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/video-upload */ "./src/components/video-upload.js");









const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  const [isChecked, setChecked] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setAttributes({
      is_show_btn_video: isChecked
    });
  }, [isChecked]);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3 horizontal-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "ttl"
  }, "Show button video:"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FormToggle, {
    checked: isChecked,
    onChange: () => setChecked(state => !state)
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Panel, {
    header: "Video Background"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_video_upload__WEBPACK_IMPORTED_MODULE_7__.VideoUploadSingle, {
    value: attributes.video_background,
    className: "video-wrap",
    onChange: media => {
      setAttributes({
        video_background: media.url
      });
    },
    handleDeleteVideo: () => setAttributes({
      video_background: ""
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Panel, {
    header: "Video Film"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_video_upload__WEBPACK_IMPORTED_MODULE_7__.VideoUploadSingle, {
    value: attributes.video_film,
    className: "video-wrap",
    onChange: media => {
      setAttributes({
        video_film: media.url
      });
    },
    handleDeleteVideo: () => setAttributes({
      video_film: ""
    })
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const FragmentBlock = function (_ref2) {
  var _attributes$btn_watch, _attributes$btn_watch2, _attributes$btn_inqui, _attributes$btn_inqui2, _attributes$certifica, _attributes$certifica2, _attributes$mail, _attributes$mail2, _attributes$mail3;
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_5__.processConfig)(attributes.config);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-banner js-hero"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "overlay",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {}
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "banner-bg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("video", {
    className: "video",
    preload: "true",
    muted: "",
    playsinline: "",
    poster: "",
    autoplay: "",
    loop: "",
    controls: ""
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("source", {
    src: attributes.video_background,
    type: "video/mp4"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder banner-inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h2",
    className: "ttl",
    value: attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "In Pursuit of Excellent",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "sub",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.description,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "To be your long term Tech - Partner",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      description: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "btn-wrapper"
  }, attributes.is_show_btn_video ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "icon"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : (_attributes$btn_watch = attributes.btn_watch) === null || _attributes$btn_watch === void 0 ? void 0 : _attributes$btn_watch.icon,
    className: "img",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        btn_watch: {
          ...(attributes === null || attributes === void 0 ? void 0 : attributes.btn_watch),
          icon: value
        }
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "span",
    className: "url",
    value: (_attributes$btn_watch2 = attributes.btn_watch) === null || _attributes$btn_watch2 === void 0 ? void 0 : _attributes$btn_watch2.text,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Watch vision film",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      btn_watch: {
        ...(attributes === null || attributes === void 0 ? void 0 : attributes.btn_watch),
        text: value
      }
    })
  })) : "", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "icon"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : (_attributes$btn_inqui = attributes.btn_inquiry) === null || _attributes$btn_inqui === void 0 ? void 0 : _attributes$btn_inqui.icon,
    className: "img",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        btn_inquiry: {
          ...(attributes === null || attributes === void 0 ? void 0 : attributes.btn_inquiry),
          icon: value
        }
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "span",
    className: "url",
    value: (_attributes$btn_inqui2 = attributes.btn_inquiry) === null || _attributes$btn_inqui2 === void 0 ? void 0 : _attributes$btn_inqui2.text,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Inquiry",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      btn_inquiry: {
        ...(attributes === null || attributes === void 0 ? void 0 : attributes.btn_inquiry),
        text: value
      }
    })
  }))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "number"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder-fluid number-inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "overlay"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "certificate"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : (_attributes$certifica = attributes.certificate) === null || _attributes$certifica === void 0 ? void 0 : _attributes$certifica.certificate_01,
    className: "img",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        certificate: {
          ...(attributes === null || attributes === void 0 ? void 0 : attributes.certificate),
          certificate_01: value
        }
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : (_attributes$certifica2 = attributes.certificate) === null || _attributes$certifica2 === void 0 ? void 0 : _attributes$certifica2.certificate_02,
    className: "img img-cmmi",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        certificate: {
          ...(attributes === null || attributes === void 0 ? void 0 : attributes.certificate),
          certificate_02: value
        }
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "counter"
  }, attributes.counters && attributes.counters.map(function (object, index) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "counter-number"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "span",
      className: "js-counter",
      value: object.number,
      allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
      placeholder: "Inquiry",
      keepPlaceholderOnFocus: true,
      onChange: value => {
        let counters = [...attributes.counters];
        let counter = {
          ...object,
          number: value
        };
        counters[index] = counter;
        setAttributes({
          counters: counters
        });
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, index !== 0 && "+")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "div",
      className: "txt",
      value: object.text,
      allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
      placeholder: "Inquiry",
      keepPlaceholderOnFocus: true,
      onChange: value => {
        let counters = [...attributes.counters];
        let counter = {
          ...object,
          text: value
        };
        counters[index] = counter;
        setAttributes({
          counters: counters
        });
      }
    }));
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "contact"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : (_attributes$mail = attributes.mail) === null || _attributes$mail === void 0 ? void 0 : _attributes$mail.icon,
    className: "img",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        mail: {
          ...(attributes === null || attributes === void 0 ? void 0 : attributes.mail),
          icon: value
        }
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "ttl",
    value: (_attributes$mail2 = attributes.mail) === null || _attributes$mail2 === void 0 ? void 0 : _attributes$mail2.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "MAIL US DAILY:",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      mail: {
        ...(attributes === null || attributes === void 0 ? void 0 : attributes.mail),
        title: value
      }
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "email",
    value: (_attributes$mail3 = attributes.mail) === null || _attributes$mail3 === void 0 ? void 0 : _attributes$mail3.mail,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "contact@vietis.com.vn",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      mail: {
        ...(attributes === null || attributes === void 0 ? void 0 : attributes.mail),
        mail: value
      }
    })
  })))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Banner/index.js":
/*!************************************!*\
  !*** ./src/blocks/Banner/index.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/Banner/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Banner/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/banner", {
  title: "Banner",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "format-image",
  attributes: {
    title: {
      type: "string",
      default: "In Pursuit of Excellent"
    },
    description: {
      type: "string",
      default: "To be your long term Tech - Partner"
    },
    config: {
      type: "object",
      default: {
        bg_method: "gradient",
        bg_gradient: "linear-gradient(105.79deg,rgba(127,23,231,.8) 2.36%,rgba(23,44,231,.8) 25.81%,rgba(1,4,32,.6) 100.86%)"
      }
    },
    btn_watch: {
      type: "object",
      default: {
        text: '<a href="#">Watch vision film</a>',
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_icon-film.svg",
          alt: "",
          id: ""
        }
      }
    },
    btn_inquiry: {
      type: "object",
      default: {
        text: '<a href="#">Inquiry</a>',
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_icon-inquiry.svg",
          alt: "",
          id: ""
        }
      }
    },
    certificate: {
      type: "array",
      default: {
        certificate_01: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_iso.png",
          alt: "",
          id: ""
        },
        certificate_02: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/banner_cmmi.png",
          alt: "",
          id: ""
        }
      }
    },
    counters: {
      type: "array",
      default: [{
        number: "03",
        text: "Locations"
      }, {
        number: "250",
        text: "Clients"
      }, {
        number: "300",
        text: "Projects"
      }]
    },
    mail: {
      type: "object",
      default: {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/mail_icon.png",
          alt: "",
          id: ""
        },
        title: "MAIL US DAILY:",
        mail: '<a href="mailto:' + PV_Admin.contact_email + '">' + PV_Admin.contact_email + "</a>"
      }
    },
    video_background: {
      type: "string",
      default: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/video_background.mp4"
    },
    video_film: {
      type: "string",
      default: PV_Admin.PV_BASE_URL + "/assets/img/blocks/banner/video_film.mp4"
    },
    is_show_btn_video: {
      type: "boolean",
      default: true
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/BlockChain/edit.js":
/*!***************************************!*\
  !*** ./src/blocks/BlockChain/edit.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var _components_color_control__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/color-control */ "./src/components/color-control.js");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-sortable-hoc */ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");











const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  })));
};
const DragHandle = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8__.sortableHandle)(() => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "admin-buttom-move-item"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "dashicons dashicons-move"
})));
const SortableItem = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8__.SortableElement)(props => {
  const {
    object,
    data_key,
    attributes,
    setAttributes,
    handlerDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item",
    style: {
      "background": object !== null && object !== void 0 && object.color ? object === null || object === void 0 ? void 0 : object.color : "#F3F4FD"
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => handlerDelete(data_key),
    className: "admin-buttom-delete-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(DragHandle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_color_control__WEBPACK_IMPORTED_MODULE_7__.BaseColorControl, {
    value: (object === null || object === void 0 ? void 0 : object.color) || "#F3F4FD",
    colors: [{
      name: "Màu 1",
      color: "#F3F4FD"
    }, {
      name: "Màu 2",
      color: "#EDFAFE"
    }, {
      name: "Màu 3",
      color: "#EBF5FF"
    }],
    onChange: value => {
      let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let item = {
        ...object,
        color: value
      };
      items[data_key] = item;
      setAttributes({
        items: items
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "subtitle"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "image"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: object === null || object === void 0 ? void 0 : object.icon,
    className: "img",
    onChange: value => {
      if (!value) return false;
      let atts = [...attributes.items];
      atts[data_key]['icon'] = value;
      setAttributes({
        items: atts
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "ttl",
    value: object === null || object === void 0 ? void 0 : object.ttl,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title ..",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      atts[data_key]['ttl'] = value;
      setAttributes({
        items: atts
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "txt",
    value: object === null || object === void 0 ? void 0 : object.txt,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Text ..",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      atts[data_key]['txt'] = value;
      setAttributes({
        items: atts
      });
    }
  }));
});
const SortableList = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_8__.SortableContainer)(props => {
  const {
    items,
    attributes,
    setAttributes,
    handlerAdd,
    handlerDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrapper-item"
  }, items && items.map(function (object, index) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableItem, {
      key: `item-${index}`,
      value: object,
      object: object,
      index: index,
      data_key: index,
      attributes: attributes,
      setAttributes: setAttributes,
      handlerDelete: handlerDelete
    });
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item button-add"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => handlerAdd(),
    className: "admin-buttom-add-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus-alt2"
  })))));
});
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const handlerAdd = function () {
    let datas = [...attributes.items];
    datas.push({
      icon: {},
      ttl: "<strong>Tiêu đề</strong>",
      txt: "Nội dung",
      color: "#F3F4FD"
    });
    setAttributes({
      items: datas
    });
  };
  const handlerDelete = function (index) {
    let datas = [...attributes.items];
    datas.splice(index, 1);
    setAttributes({
      items: datas
    });
  };
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_5__.processConfig)(attributes.config);
  const handlerOnSortEnd = _ref3 => {
    let {
      oldIndex,
      newIndex
    } = _ref3;
    let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    setAttributes({
      items: (0,array_move__WEBPACK_IMPORTED_MODULE_9__.arrayMoveImmutable)(items, oldIndex, newIndex)
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-blockchain",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {}
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h4",
    className: "title",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Ti\xEAu \u0111\u1EC1",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      setAttributes({
        title: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableList, {
    items: attributes === null || attributes === void 0 ? void 0 : attributes.items,
    onSortEnd: handlerOnSortEnd,
    axis: "xy",
    helperClass: "hold-item-blockchain",
    hideSortableGhost: true,
    lockOffset: ["100%"],
    useDragHandle: true,
    attributes: attributes,
    setAttributes: setAttributes,
    handlerAdd: handlerAdd,
    handlerDelete: handlerDelete
  })))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/BlockChain/index.js":
/*!****************************************!*\
  !*** ./src/blocks/BlockChain/index.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/BlockChain/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/BlockChain/edit.js");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("create-block/block-blockchain", {
  title: "Blockchain",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-info",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Why do we use Blockchain Technology?</strong>"
    },
    config: {
      type: "object",
      default: {}
    },
    items: {
      type: "array",
      default: [{
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/blockchain/blockchain_icon01.svg",
          alt: "",
          id: ""
        },
        ttl: "<strong>Cost-effectiveness</strong>",
        txt: "Blockchain technology eliminates the costs associated with managing and recording transactions through third parties including banks, mediators, payment networks, and money transfer services. By avoiding the need to update old systems and administrative infrastructure in enterprises, it can also reduce operational and IT expenditures. The use of Blockchain technology requires some financial commitment. However, the price is far lower than the expense of maintaining IT infrastructure. The same holds true for other facets of the company, such as finance or supply chain management.",
        color: "#F3F4FD"
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/blockchain/blockchain_icon02.svg",
          alt: "",
          id: ""
        },
        ttl: "<strong>Generating Revenue</strong>",
        txt: "The Blockchain removes administrative and teamwork boundaries, paving the path for creative business tactics that were simply not possible before distributed ledger technology. Blockchain opens the door for new infrastructure and business models with this new independence.",
        color: "#EDFAFE"
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/blockchain/blockchain_icon03.svg",
          alt: "",
          id: ""
        },
        ttl: "<strong>Effect on Consumers</strong>",
        txt: "The possibility to address previously neglected needs of customers and communities is provided by new business models. Blockchain innovations in the medical sector offer ways to get around obstacles like remote patient care and record-keeping via networked smart medical devices and synced records.",
        color: "#EBF5FF"
      }]
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  }
});

/***/ }),

/***/ "./src/blocks/BlogFeatured/edit.js":
/*!*****************************************!*\
  !*** ./src/blocks/BlogFeatured/edit.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");






const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_4__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "sidebar-featured"
  }, "Blog Featured Default"));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/BlogFeatured/index.js":
/*!******************************************!*\
  !*** ./src/blocks/BlogFeatured/index.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/BlogFeatured/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/BlogFeatured/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/blogs-featured", {
  title: "Blogs Featured",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "format-image",
  attributes: {},
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/BlogTags/edit.js":
/*!*************************************!*\
  !*** ./src/blocks/BlogTags/edit.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");






const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_4__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "sidebar-tags"
  }, "Blog Tags Default"));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/BlogTags/index.js":
/*!**************************************!*\
  !*** ./src/blocks/BlogTags/index.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/BlogTags/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/BlogTags/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/blogs-tags", {
  title: "Blogs Tags",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "format-image",
  attributes: {},
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/CaseStudy/edit.js":
/*!**************************************!*\
  !*** ./src/blocks/CaseStudy/edit.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _services_api_fetch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/api-fetch */ "./src/services/api-fetch.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");








const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes === null || attributes === void 0 ? void 0 : attributes.conditon_post.posts_per_page,
    onChange: value => setAttributes({
      conditon_post: {
        ...attributes.conditon_post,
        posts_per_page: value
      }
    }),
    placeholder: "Nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng b\xE0i vi\u1EBFt",
    label: "S\u1ED1 l\u01B0\u1EE3ng b\xE0i vi\u1EBFt:"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "S\u1EAFp x\u1EBFp theo",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.conditon_post.orderby,
    options: _config_define__WEBPACK_IMPORTED_MODULE_4__.ORDER_BY_FIELD,
    onChange: value => setAttributes({
      conditon_post: {
        ...attributes.conditon_post,
        orderby: value
      }
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Th\u1EE9 t\u1EF1 s\u1EAFp x\u1EBFp",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.conditon_post.order,
    options: _config_define__WEBPACK_IMPORTED_MODULE_4__.ORDER,
    onChange: value => setAttributes({
      conditon_post: {
        ...attributes.conditon_post,
        order: value
      }
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Hi\u1EC3n th\u1ECB b\xE0i vi\u1EBFt:",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.conditon_post.highlight_post_only,
    options: [{
      label: "Highlight",
      value: "1"
    }, {
      label: "All",
      value: "0"
    }],
    onChange: value => setAttributes({
      conditon_post: {
        ...attributes.conditon_post,
        highlight_post_only: value
      }
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_6__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  })));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const [dataItem, setDataItem] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    const data = new FormData();
    data.append("action", "get_post_casestudy");
    data.append("nonce", PV_Admin.SECURITY);
    data.append("post_type", "Works");
    data.append("posts_per_page", attributes.conditon_post.posts_per_page);
    data.append("orderby", attributes.conditon_post.orderby);
    data.append("order", attributes.conditon_post.order);
    data.append("highlight_post_only", attributes.conditon_post.highlight_post_only);
    (0,_services_api_fetch__WEBPACK_IMPORTED_MODULE_5__.axiosFetch)(data).then(res => {
      let data = res.data;
      if (data.data.html) {
        setDataItem(data.data.html);
      }
    });
  });
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_6__.processConfig)(attributes.config);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-caseStudy",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {},
    dangerouslySetInnerHTML: {
      __html: dataItem
    }
  }));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/CaseStudy/index.js":
/*!***************************************!*\
  !*** ./src/blocks/CaseStudy/index.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/CaseStudy/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/CaseStudy/edit.js");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("create-block/casestudy", {
  title: "Case Study",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-forms",
  attributes: {
    title: {
      type: "string",
      default: ""
    },
    title_shadow: {
      type: "string",
      default: "Team"
    },
    images: {
      type: "array",
      default: []
    },
    conditon_post: {
      type: "object",
      default: {
        post_type: "Works",
        posts_per_page: 3,
        orderby: "date",
        order: "DESC",
        highlight_post_only: "0"
      }
    },
    blocks: {
      type: "array",
      default: []
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  }
});

/***/ }),

/***/ "./src/blocks/Certificate/edit.js":
/*!****************************************!*\
  !*** ./src/blocks/Certificate/edit.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var _components_color_control__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/color-control */ "./src/components/color-control.js");
/* harmony import */ var _components_image_bg_upload__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../components/image-bg-upload */ "./src/components/image-bg-upload.js");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-sortable-hoc */ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");












const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3 setup-img"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Panel, {
    header: "Image"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_bg_upload__WEBPACK_IMPORTED_MODULE_8__.ImageBgUpload, {
    value: attributes.img_background,
    className: "img",
    onChange: media => {
      setAttributes({
        img_background: media.url
      });
    },
    handleDeleteImage: () => setAttributes({
      img_background: ""
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  })));
};
const DragHandle = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_9__.sortableHandle)(() => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "admin-buttom-move-item"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "dashicons dashicons-move"
})));
const SortableItem = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_9__.SortableElement)(props => {
  const {
    object,
    data_key,
    attributes,
    setAttributes,
    handlerDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap",
    style: {
      background: object !== null && object !== void 0 && object.color ? object === null || object === void 0 ? void 0 : object.color : "#F3F4FD"
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "icon"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: PV_Admin.PV_BASE_URL + "/assets/img/blocks/certificate/certificate_ico.png"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => handlerDelete(data_key),
    className: "admin-buttom-delete-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(DragHandle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_color_control__WEBPACK_IMPORTED_MODULE_7__.BaseColorControl, {
    value: (object === null || object === void 0 ? void 0 : object.color) || "#F3F4FD",
    colors: [{
      name: "Màu 1",
      color: "#F3F4FD"
    }, {
      name: "Màu 2",
      color: "#EDFAFE"
    }, {
      name: "Màu 3",
      color: "#EBF5FF"
    }, {
      name: "Màu 4",
      color: "#FFFFFF"
    }],
    onChange: value => {
      let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let item = {
        ...object,
        color: value
      };
      items[data_key] = item;
      setAttributes({
        items: items
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "image"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: object === null || object === void 0 ? void 0 : object.image,
    className: "img",
    onChange: value => {
      let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let item = {
        ...object,
        image: value
      };
      items[data_key] = item;
      setAttributes({
        items: items
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "text"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "ttl",
    value: object === null || object === void 0 ? void 0 : object.ttl,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Ti\xEAu \u0111\u1EC1",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let item = {
        ...object,
        ttl: value
      };
      items[data_key] = item;
      setAttributes({
        items: items
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "txt",
    value: object === null || object === void 0 ? void 0 : object.txt,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "N\u1ED9i dung",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let item = {
        ...object,
        txt: value
      };
      items[data_key] = item;
      setAttributes({
        items: items
      });
    }
  }))));
});
const SortableList = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_9__.SortableContainer)(props => {
  const {
    items,
    attributes,
    setAttributes,
    handlerAdd,
    handlerDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrapper-item"
  }, items && items.map(function (object, index) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableItem, {
      key: `item-${index}`,
      value: object,
      object: object,
      index: index,
      data_key: index,
      attributes: attributes,
      setAttributes: setAttributes,
      handlerDelete: handlerDelete
    });
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item button-add"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => handlerAdd(),
    className: "admin-buttom-add-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus-alt2"
  })))));
});
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const handlerAdd = function () {
    let datas = [...attributes.items];
    datas.push({
      icon: {},
      image: {},
      ttl: "<strong>Tiêu đề</strong>",
      txt: "Nội dung",
      color: "#F3F4FD"
    });
    setAttributes({
      items: datas
    });
  };
  const handlerDelete = function (index) {
    let datas = [...attributes.items];
    datas.splice(index, 1);
    setAttributes({
      items: datas
    });
  };
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_5__.processConfig)(attributes.config);
  const handlerOnSortEnd = _ref3 => {
    let {
      oldIndex,
      newIndex
    } = _ref3;
    let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    setAttributes({
      items: (0,array_move__WEBPACK_IMPORTED_MODULE_10__.arrayMoveImmutable)(items, oldIndex, newIndex)
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-certificate"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "overlay",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {}
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "img-bg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    className: "img",
    src: attributes.img_background,
    alt: ""
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableList, {
    items: attributes === null || attributes === void 0 ? void 0 : attributes.items,
    onSortEnd: handlerOnSortEnd,
    axis: "xy",
    helperClass: "hold-item-certificate",
    hideSortableGhost: true,
    lockOffset: ["100%"],
    useDragHandle: true,
    attributes: attributes,
    setAttributes: setAttributes,
    handlerAdd: handlerAdd,
    handlerDelete: handlerDelete
  }))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Certificate/index.js":
/*!*****************************************!*\
  !*** ./src/blocks/Certificate/index.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./src/blocks/Certificate/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Certificate/style.scss");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("create-block/certificate", {
  title: "Certificate",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-welcome-learn-more",
  attributes: {
    config: {
      type: "object",
      default: {
        bg_method: "color",
        bg_color: "rgba(18, 51, 111, 1)"
      }
    },
    items: {
      type: "array",
      default: [{
        image: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/certificate/certificate_img01.png",
          alt: "",
          id: ""
        },
        ttl: "<strong>ISO 27001 Certification System</strong>",
        txt: "This is a system to certify businesses that have established an information security management system (ISMS) that meets the requirements of ISO27001, appropriately implement control measures for information security, and properly manage risks. Businesses certified by a certification body are permitted to use “ISO27001”.",
        color: "#fff"
      }, {
        image: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/certificate/certificate_img02.png",
          alt: "",
          id: ""
        },
        ttl: "<strong>CMMI Level 3 Certificate</strong>",
        txt: "Based on the CMMI (the system development organization’s process improvement model and evaluation methodology), the entire organization worked to improve the software development process and reached Level 3 in February 2019.",
        color: "#fff"
      }]
    },
    img_background: {
      type: "string",
      default: PV_Admin.PV_BASE_URL + "/assets/img/blocks/certificate/certificate_bg.png"
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  }
});

/***/ }),

/***/ "./src/blocks/Clients/edit.js":
/*!************************************!*\
  !*** ./src/blocks/Clients/edit.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");








const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.title_shadow,
    onChange: value => setAttributes({
      title_shadow: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\xECm",
    label: "Ti\xEAu \u0111\u1EC1 ch\xECm"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  })));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_5__.processConfig)(attributes.config);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-clients",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {}
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "title text-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "ttl",
    value: attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "shadow"
  }, attributes.title_shadow)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUpload, {
    value: attributes === null || attributes === void 0 ? void 0 : attributes.images,
    multiple: true,
    onChange: value => {
      if (!value) return false;
      setAttributes({
        images: value
      });
    }
  }))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Clients/index.js":
/*!*************************************!*\
  !*** ./src/blocks/Clients/index.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./src/blocks/Clients/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Clients/style.scss");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("create-block/clients", {
  title: "Clients",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-buddicons-buddypress-logo",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Our Clients</strong>"
    },
    title_shadow: {
      type: "string",
      default: "Clients"
    },
    images: {
      type: "array",
      default: []
    },
    conditon_post: {
      type: "object",
      default: {
        post_type: "services",
        posts_per_page: 4,
        orderby: "date",
        order: "DESC"
      }
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  }
});

/***/ }),

/***/ "./src/blocks/DevelopingMobile/edit.js":
/*!*********************************************!*\
  !*** ./src/blocks/DevelopingMobile/edit.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-sortable-hoc */ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");










const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.title_shadow,
    onChange: value => setAttributes({
      title_shadow: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\xECm",
    label: "Ti\xEAu \u0111\u1EC1 ch\xECm"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_4__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const DragHandle = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.sortableHandle)(() => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "admin-buttom-move-item"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "dashicons dashicons-move"
})));
const SortableItem = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.SortableElement)(props => {
  const {
    object,
    data_key,
    attributes,
    setAttributes,
    handleDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "desc"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "admin-buttom-delete-item",
    onClick: () => handleDelete(data_key)
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: object === null || object === void 0 ? void 0 : object.icon,
    onChange: value => {
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let new_image = {
        ...object,
        icon: value
      };
      atts[data_key] = new_image;
      setAttributes({
        items: atts
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "sub-desc"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(DragHandle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "ttl",
    value: object === null || object === void 0 ? void 0 : object.ttl,
    placeholder: "Enter Subtitle..",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let new_title = {
        ...object,
        ttl: value
      };
      atts[data_key] = new_title;
      setAttributes({
        items: atts
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "txt",
    placeholder: "Enter Content..",
    keepPlaceholderOnFocus: true,
    value: object === null || object === void 0 ? void 0 : object.txt,
    onChange: value => {
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let new_title = {
        ...object,
        txt: value
      };
      atts[data_key] = new_title;
      setAttributes({
        items: atts
      });
    }
  })));
});
const SortableList = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.SortableContainer)(props => {
  const {
    items,
    attributes,
    setAttributes,
    handleDelete,
    handleAdd
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "application"
  }, items && items.map((object, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableItem, {
      key: `item-${index}`,
      value: object,
      object: object,
      index: index,
      data_key: index,
      attributes: attributes,
      setAttributes: setAttributes,
      handleDelete: handleDelete
    });
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "desc"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "admin-buttom-add-item",
    onClick: handleAdd
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus-alt2"
  }))));
});
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const handleAdd = () => {
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    atts.push({
      icon: {
        url: "",
        alt: "",
        id: ""
      },
      ttl: "",
      txt: ""
    });
    setAttributes({
      items: atts
    });
  };
  const handleDelete = index => {
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    atts.splice(index, 1);
    setAttributes({
      items: atts
    });
  };
  const handlerOnSortEnd = _ref3 => {
    let {
      oldIndex,
      newIndex
    } = _ref3;
    let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    setAttributes({
      items: (0,array_move__WEBPACK_IMPORTED_MODULE_8__.arrayMoveImmutable)(items, oldIndex, newIndex)
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block block-mobile"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "subtitle"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "ttl",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "Enter Title ...",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "txt",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.desc,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "Enter Content ...",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      desc: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "image"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : attributes.image,
    className: "img",
    onChange: value => {
      setAttributes({
        image: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "ttl",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.image_txt,
    onChange: value => {
      setAttributes({
        image_txt: value
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableList, {
    items: attributes === null || attributes === void 0 ? void 0 : attributes.items,
    onSortEnd: handlerOnSortEnd,
    axis: "xy",
    helperClass: "hold-item-mobile",
    hideSortableGhost: true,
    lockOffset: ["100%"],
    useDragHandle: true,
    attributes: attributes,
    setAttributes: setAttributes,
    handleDelete: handleDelete,
    handleAdd: handleAdd
  }))))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/DevelopingMobile/index.js":
/*!**********************************************!*\
  !*** ./src/blocks/DevelopingMobile/index.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/DevelopingMobile/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/DevelopingMobile/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/develop-mobile", {
  title: "Develop Mobile",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-awards",
  attributes: {
    title: {
      type: "string",
      default: "<strong>System Development</strong>"
    },
    desc: {
      type: "string",
      default: "VietIS Software’s business application development and maintenance services are designed to enable you to lower the total cost of ownership (TCO) for your application portfolio.VietIS ’s application service helps you extract the best out of your existing applications. We also help you to migrate from legacy systems to a more dynamic and modern technologies, capable of today’s more rigorous business needs. Enterprises spend a lot of time in maintaining their legacy applications, which serve critical business functions.<br><br>VietIS provides reliable and cost effective solutions for application maintenance in technologies spanning across .Net, Java, PHP, ReactJS, Ruby and other languages."
    },
    items: {
      type: "array",
      default: [{
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/mobile/data.svg",
          alt: "",
          id: ""
        },
        ttl: "<strong>Application Development</strong>",
        txt: "VietIS team dedicates to develop software solution, providing a complete lifecycle which includes business analysis, design, application development, implementation, maintenance and other supports"
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/mobile/optimize.svg",
          alt: "",
          id: ""
        },
        ttl: "<strong>Application Maintenance</strong>",
        txt: "Our application maintenance services help to improve our clients’ efficiency, slash costs and enhance overall business performance. Our scope of work will enables clients’ business to continuously reinvent system landscapes and achieve IT goals that align with business needs. "
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/mobile/feature.svg",
          alt: "",
          id: ""
        },
        ttl: "<strong>Application Maintenance</strong>",
        txt: "Our application maintenance services help to improve our clients’ efficiency, slash costs and enhance overall business performance. Our scope of work will enables clients’ business to continuously reinvent system landscapes and achieve IT goals that align with business needs. "
      }]
    },
    image: {
      type: "object",
      default: {
        url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/mobile/services-page-mobile01.png",
        alt: "",
        id: ""
      }
    },
    image_txt: {
      type: "string",
      default: "Our Service Offering"
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/DevelopmentBenefit/edit.js":
/*!***********************************************!*\
  !*** ./src/blocks/DevelopmentBenefit/edit.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-sortable-hoc */ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");









const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_4__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const DragHandle = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_5__.sortableHandle)(() => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "admin-buttom-move-item"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "dashicons dashicons-move"
})));
const SortableItem = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_5__.SortableElement)(props => {
  const {
    object,
    data_key,
    attributes,
    setAttributes,
    handleDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => handleDelete(data_key),
    className: "admin-buttom-delete-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(DragHandle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_7__.ImageUploadSingle, {
    className: "img",
    value: object === null || object === void 0 ? void 0 : object.icon,
    onChange: value => {
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let item = {
        ...object,
        icon: value
      };
      atts[data_key] = item;
      setAttributes({
        items: atts
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "ttl",
    value: object === null || object === void 0 ? void 0 : object.title,
    placeholder: "Enter Title..",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let item = {
        ...object,
        title: value
      };
      atts[data_key] = item;
      setAttributes({
        items: atts
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "txt",
    value: object === null || object === void 0 ? void 0 : object.txt,
    placeholder: "Enter Content..",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let item = {
        ...object,
        txt: value
      };
      atts[data_key] = item;
      setAttributes({
        items: atts
      });
    }
  })));
});
const SortableList = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_5__.SortableContainer)(props => {
  const {
    items,
    attributes,
    setAttributes,
    handleDelete,
    handleAdd
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper-item"
  }, items && items.map((object, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableItem, {
      key: `item-${index}`,
      value: object,
      object: object,
      index: index,
      data_key: index,
      attributes: attributes,
      setAttributes: setAttributes,
      handleDelete: handleDelete
    });
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item button-add"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => handleAdd(),
    className: "admin-buttom-add-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus-alt2"
  })))));
});
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const handlerAdd = () => {
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    atts.push({
      icon: {
        url: "",
        alt: "",
        id: ""
      },
      title: "",
      txt: ""
    });
    setAttributes({
      items: atts
    });
  };
  const handleDelete = index => {
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    atts.splice(index, 1);
    setAttributes({
      items: atts
    });
  };
  const handlerOnSortEnd = _ref3 => {
    let {
      oldIndex,
      newIndex
    } = _ref3;
    let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    setAttributes({
      items: (0,array_move__WEBPACK_IMPORTED_MODULE_6__.arrayMoveImmutable)(items, oldIndex, newIndex)
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block block-development-benefit"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableList, {
    items: attributes === null || attributes === void 0 ? void 0 : attributes.items,
    onSortEnd: handlerOnSortEnd,
    axis: "xy",
    helperClass: "hold-item-benefit",
    hideSortableGhost: true,
    lockOffset: ["100%"],
    useDragHandle: true,
    attributes: attributes,
    setAttributes: setAttributes,
    handleDelete: handleDelete,
    handleAdd: handlerAdd
  }))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/DevelopmentBenefit/index.js":
/*!************************************************!*\
  !*** ./src/blocks/DevelopmentBenefit/index.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/DevelopmentBenefit/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/DevelopmentBenefit/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/develop-benefit", {
  title: "Develop Benefit",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-awards",
  attributes: {
    items: {
      type: "array",
      default: [{
        icon: {
          id: 1,
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/benefit/service-software-icon01.svg",
          alt: ""
        },
        title: "Efficiency",
        txt: "Custom software is a product that has been specifically designed to ensure smooth operation. In terms of software setup, support, and scalability, this approach saves time and money."
      }, {
        icon: {
          id: 2,
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/benefit/service-software-icon02.svg",
          alt: ""
        },
        title: "Scalability",
        txt: "With software customized to your company's needs, you won't have to worry about scalability because software complexity increases in lockstep with your business's expansion."
      }, {
        icon: {
          id: 2,
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/benefit/service-software-icon03.svg",
          alt: ""
        },
        title: "Simple & Affordable Integration",
        txt: "With the help of custom software development, existing digital services and infrastructure may be accurately and seamlessly integrated, allowing business operations to be properly synchronized."
      }]
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/DevelopmentOurProcess/edit.js":
/*!**************************************************!*\
  !*** ./src/blocks/DevelopmentOurProcess/edit.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");







const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.title_shadow,
    onChange: value => setAttributes({
      title_shadow: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\xECm",
    label: "Ti\xEAu \u0111\u1EC1 ch\xECm"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_4__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const {
    title,
    steps
  } = attributes;
  const handleAdd = () => {
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.steps)];
    atts.push({
      title: "",
      txt: ""
    });
    setAttributes({
      steps: atts
    });
  };
  const handleDelete = index => {
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.steps)];
    atts.splice(index, 1);
    setAttributes({
      steps: atts
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block block-service-process"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    value: title,
    tagName: "p",
    className: "title",
    onChange: value => {
      setAttributes({
        title: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "line"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper-item"
  }, steps && steps.map((item, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "number"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      class: "txt"
    }, index + 1 < 10 ? "0" + (index + 1) : index + 1)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "text"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      value: item === null || item === void 0 ? void 0 : item.title,
      allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
      tagName: "p",
      className: "ttl",
      placeholder: "Enter your title here",
      keepPlaceholderOnFocus: true,
      onChange: value => {
        let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.steps)];
        let new_title = {
          ...item,
          title: value
        };
        atts[index] = new_title;
        setAttributes({
          steps: atts
        });
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      value: item === null || item === void 0 ? void 0 : item.txt,
      allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
      tagName: "p",
      className: "txt",
      placeholder: "Enter your text here",
      keepPlaceholderOnFocus: true,
      onChange: value => {
        let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.steps)];
        let new_title = {
          ...item,
          txt: value
        };
        atts[index] = new_title;
        setAttributes({
          steps: atts
        });
      }
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "delete-area"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      onClick: () => handleDelete(index),
      className: "admin-buttom-delete-item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      class: "dashicons dashicons-no"
    }))));
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "admin-buttom-add-item",
    onClick: handleAdd
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus-alt"
  }))))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/DevelopmentOurProcess/index.js":
/*!***************************************************!*\
  !*** ./src/blocks/DevelopmentOurProcess/index.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/DevelopmentOurProcess/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/DevelopmentOurProcess/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/develop-our-process", {
  title: "Develop Our Process",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-awards",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Our Process</strong>"
    },
    steps: {
      type: "array",
      default: [{
        title: "Exploration Stage",
        txt: "The assessment of the project and comprehension of your company's objectives are the primary objectives of the discovery stage of the development of bespoke software. Based on this demand elicitation, we create the most affordable technological solution and tailored software development methodology to jointly accomplish the set goals.</br>" + "<br/>Based on the specifics and requirements of your project, our team develops an individual discovery plan with corresponding deliveries for the creation of custom software. Following the exploration phase, you will be given an interactive product prototype showing your future digital product. We will work together to complete the UX/UI design."
      }, {
        title: "UI/UX Design",
        txt: "Every one of our projects is driven by design, and UI/UX design is crucial to the discovery stage. As part of our bespoke software services, we create a design based on your project concept and organizational requirements while adhering to the project budget and timeframe. The creation of user-friendly software with an aesthetically beautiful interface is the ultimate goal of custom software development."
      }, {
        title: "Custom Software Development",
        txt: "This is the stage of developing custom software where the magic happens. Based on our high standards for software development, we pay particular attention to guaranteeing the product's stability and good performance (iOS, Android, Web Front-end, Web Back-end).</br>" + "</br>In order to meet the project's budget and timeline, we use agile methodologies to track our work on a daily basis."
      }, {
        title: "Software Testing",
        txt: "Since the beginning of the custom software development lifecycle, we have integrated quality assurance (2-week sprints). This indicates that any new feature created during this time period is fully tested using hundreds of autotests and manual techniques.</br>" + "</br>To make sure that previously developed features are not affected by new software functionality, we undertake regression testing in addition to routine functional, performance, regression, usability, and unit tests."
      }, {
        title: "Delivery",
        txt: "The solution is subsequently prepared for market entry and made accessible to final users."
      }, {
        title: "Maintenance",
        txt: "Our programmers will monitor the performance of your solution after it is operational and take user feedback into account to further enhance it. Following deployment, we additionally make any necessary modifications."
      }]
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/FeatureServicePage/edit.js":
/*!***********************************************!*\
  !*** ./src/blocks/FeatureServicePage/edit.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");








const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-feature-service-page"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "ttl",
    value: attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "content-features"
  }, attributes.content.length > 0 && attributes.content.map((item, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
      className: "item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "img-wrap"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
      value: item.icon,
      className: "",
      onChange: value => {
        if (!value) return false;
        const newContent = [...attributes.content];
        newContent[index].icon = value;
        setAttributes({
          content: newContent
        });
      }
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "div",
      className: "txt",
      value: item.title,
      allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
      placeholder: "Title",
      keepPlaceholderOnFocus: true,
      onChange: value => {
        const newContent = [...attributes.content];
        newContent[index].title = value;
        setAttributes({
          content: newContent
        });
      }
    }));
  })))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/FeatureServicePage/index.js":
/*!************************************************!*\
  !*** ./src/blocks/FeatureServicePage/index.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/FeatureServicePage/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/FeatureServicePage/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/feature-service-page", {
  title: "Feature service page",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "format-image",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Features of the service</strong>"
    },
    content: {
      type: "array",
      default: [{
        title: "<strong>Full sup	port from analysis to solution construction and operation</strong>",
        icon: {
          url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_digital-transformation_feature_1.png`,
          alt: "",
          id: ""
        }
      }, {
        title: "<strong>Experienced and proven expert team</strong>",
        icon: {
          url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_digital-transformation_feature_2.png`,
          alt: "",
          id: ""
        }
      }, {
        title: "<strong>Advanced technology know-how and abundant staff</strong>",
        icon: {
          url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_digital-transformation_feature_3.png`,
          alt: "",
          id: ""
        }
      }]
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/Feature/edit.js":
/*!************************************!*\
  !*** ./src/blocks/Feature/edit.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");








const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.title_shadow,
    onChange: value => setAttributes({
      title_shadow: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\xECm",
    label: "Ti\xEAu \u0111\u1EC1 ch\xECm"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_4__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const {
    title,
    title_highlight,
    title_shadow,
    description,
    btn_learn_more,
    image
  } = attributes;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block block-feature"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder feature-inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "title"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    class: "ttl"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "span",
    className: "ttl-txt",
    value: title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "description",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "span",
    className: "ttl--highlight",
    value: title_highlight,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "description",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title_highlight: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "shadow"
  }, title_shadow)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "block-content des",
    value: description,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "description",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      description: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: image,
    className: "img",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        image: value
      });
    }
  })))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Feature/index.js":
/*!*************************************!*\
  !*** ./src/blocks/Feature/index.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/Feature/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Feature/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/feature", {
  title: "Feature",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "format-image",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Scale Up your tech team though out highly skilled developers</strong>"
    },
    title_highlight: {
      type: "string",
      default: "<strong>highly skilled developers</strong>"
    },
    title_shadow: {
      type: "string",
      default: "Feature"
    },
    description: {
      type: "string",
      default: "VietIS specializing in providing digital transformation consulting services and software solutions in many domains. We have a highly experienced in house technical team which provides enterprise-level IT consulting design, procurement, and support to customers."
    },
    image: {
      type: "object",
      default: {
        url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/feature/feature_img.png",
        alt: "",
        id: ""
      }
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/Feedback/edit.js":
/*!*************************************!*\
  !*** ./src/blocks/Feedback/edit.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");








const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.title_shadow,
    onChange: value => setAttributes({
      title_shadow: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\xECm",
    label: "Ti\xEAu \u0111\u1EC1 ch\xECm"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  })));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const [slideItem, setSlideItem] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const handlerAdd = function () {
    let datas = [...attributes.items];
    datas.push({
      icon: {},
      text: "Content...",
      name: "Company Name.."
    });
    setAttributes({
      items: datas
    });
    handleShowSlide(attributes.items.length);
  };
  const handlerDelete = function (index) {
    let datas = [...attributes.items];
    datas.splice(index, 1);
    if (index == attributes.items.length - 1) {
      handleShowSlide(index - 1);
    }
    setAttributes({
      items: datas
    });
  };
  const handleShowSlide = function (index) {
    setSlideItem(index);
    return;
  };
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_5__.processConfig)(attributes.config);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block block-feedback",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {}
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "img"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: PV_Admin.PV_BASE_URL + "/assets/img/blocks/feedback/feedback_img01.png"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "title"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "ttl",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "shadow"
  }, attributes === null || attributes === void 0 ? void 0 : attributes.title_shadow)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "slider js-slick-feedback"
  }, (attributes === null || attributes === void 0 ? void 0 : attributes.items.length) > 0 && (attributes === null || attributes === void 0 ? void 0 : attributes.items.map((item, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, slideItem == index && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "p",
      className: "txt",
      value: attributes === null || attributes === void 0 ? void 0 : attributes.items[index]["text"],
      allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
      placeholder: "Text",
      keepPlaceholderOnFocus: true,
      onChange: value => {
        if (!value) return "";
        let att = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
        att[index]["text"] = value.trim();
        setAttributes({
          items: att
        });
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "author"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
      className: "avt",
      value: item === null || item === void 0 ? void 0 : item.icon,
      multiple: false,
      onChange: value => {
        if (!value) return false;
        let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
        let img = {
          ...item,
          icon: value
        };
        console.log(img);
        items[index] = img;
        setAttributes({
          items: items
        });
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "span",
      className: "name",
      value: attributes === null || attributes === void 0 ? void 0 : attributes.items[index]["name"],
      allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
      placeholder: "Name",
      keepPlaceholderOnFocus: true,
      onChange: value => {
        if (!value) return "";
        let att = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
        att[index]["name"] = value.trim();
        setAttributes({
          items: att
        });
      }
    }))));
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    class: "slick-dots"
  }, (attributes === null || attributes === void 0 ? void 0 : attributes.items) && (attributes === null || attributes === void 0 ? void 0 : attributes.items.map((item, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
      class: `slick ${slideItem == index ? "active" : ""}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      class: "btn",
      onClick: () => handleShowSlide(index)
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      onClick: () => handlerDelete(index),
      className: `admin-buttom-delete-item item-${index}`
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      class: "dashicons dashicons-no"
    })));
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item button-add"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => handlerAdd(),
    className: "admin-buttom-add-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus-alt2"
  })))))))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Feedback/index.js":
/*!**************************************!*\
  !*** ./src/blocks/Feedback/index.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Feedback/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/Feedback/edit.js");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("create-block/feedback", {
  title: "Feedback",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-testimonial",
  attributes: {
    title: {
      type: "string",
      default: "<strong>HEAR FROM OUR USER</strong>"
    },
    title_shadow: {
      type: "string",
      default: "Feedback"
    },
    items: {
      type: "array",
      default: [{
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/feedback/feedback_avt.png",
          alt: "",
          id: ""
        },
        text: "VietIS is known as an offshore company. There were quite a few offshore vendors exhibiting there, and honestly, it was difficult to decide which company was better. At this time, I had a chance to know and talk with Mr. Tan- Vice President of VietIS. I could see that he has a high level of technical capabilities and a fast capability to handle. There’s no doubt that Mr. Tan’s Japanese capability is an important element that made me choose VietIS to develop my product.To be honest, I felt that there was a gap in developers’ technical capabilities. But that is covered by other more experienced staff members, even if the program isn’t at a level that meets our requirements. Senior developers can follow instantly.",
        name: "First Inc."
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/feedback/feedback_avt.png",
          alt: "",
          id: ""
        },
        text: "When developing the project with VietIS, although there are many challenges and obstacles when proceeding with the project, you have tried and worked hard with us to overcome them. The time when the project was completed is a deeply moving experience.I hope more and more members can work together to realize new technological innovations. We can see that your company is a good company/organization, please do not lose your kindness and make it become a big company. No matter how technical you are, I want you to keep that kindness.",
        name: "Lecre Inc."
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/feedback/feedback_avt.png",
          alt: "",
          id: ""
        },
        text: "We have been working on the project together for over a year. We are very grateful because VietIS has development speed, abundant knowledge, and capability to foresee the project at the consultation stage.",
        name: "BenefitOne Inc."
      }]
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  }
});

/***/ }),

/***/ "./src/blocks/FunctionList/edit.js":
/*!*****************************************!*\
  !*** ./src/blocks/FunctionList/edit.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-sortable-hoc */ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");









const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.title_shadow,
    onChange: value => setAttributes({
      title_shadow: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\xECm",
    label: "Ti\xEAu \u0111\u1EC1 ch\xECm"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_4__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const DragHandle = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_6__.sortableHandle)(() => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "admin-buttom-move-item"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "dashicons dashicons-move"
})));
const SortableItem = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_6__.SortableElement)(props => {
  const {
    object,
    data_key,
    attributes,
    setAttributes,
    handleDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "item",
    key: data_key
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: event => handleDelete(event, data_key),
    className: "admin-buttom-delete-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(DragHandle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "txt",
    value: object === null || object === void 0 ? void 0 : object.text,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "Text",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let newObj = {
        ...object,
        text: value
      };
      atts[data_key] = newObj;
      setAttributes({
        items: atts
      });
    }
  }));
});
const SortableList = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_6__.SortableContainer)(props => {
  const {
    items,
    attributes,
    setAttributes,
    handleDelete,
    handleAdd
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "list"
  }, items && items.map((object, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableItem, {
      key: `item-${index}`,
      value: object,
      object: object,
      index: index,
      data_key: index,
      attributes: attributes,
      setAttributes: setAttributes,
      handleDelete: handleDelete
    });
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    class: "admin-buttom-add-item",
    onClick: handleAdd
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus-alt2"
  }))));
});
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const handleDelete = (event, index) => {
    event.stopPropagation();
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    atts.splice(index, 1);
    setAttributes({
      items: atts
    });
  };
  const handleAdd = () => {
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    atts.push({
      text: ""
    });
    setAttributes({
      items: atts
    });
  };
  const handlerOnSortEnd = _ref3 => {
    let {
      oldIndex,
      newIndex
    } = _ref3;
    let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    setAttributes({
      items: (0,array_move__WEBPACK_IMPORTED_MODULE_7__.arrayMoveImmutable)(items, oldIndex, newIndex)
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block block-functions"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "title",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "description",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableList, {
    items: attributes === null || attributes === void 0 ? void 0 : attributes.items,
    onSortEnd: handlerOnSortEnd,
    axis: "xy",
    helperClass: "hold-item-function",
    hideSortableGhost: true,
    lockOffset: ["100%"],
    useDragHandle: true,
    attributes: attributes,
    setAttributes: setAttributes,
    handleDelete: handleDelete,
    handleAdd: handleAdd
  })))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/FunctionList/index.js":
/*!******************************************!*\
  !*** ./src/blocks/FunctionList/index.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/FunctionList/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/FunctionList/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/function", {
  title: "Function List",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-text",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Function list</strong>"
    },
    items: {
      type: "array",
      default: [{
        text: "Manager Project Bidding"
      }, {
        text: "Weekly Report"
      }, {
        text: "Project Opening (submit, review, approve)"
      }, {
        text: "Resource Reports"
      }, {
        text: "Redmine members Synchronize"
      }, {
        text: "OT Registration"
      }, {
        text: "Estimation Importing"
      }, {
        text: "Members Management"
      }, {
        text: "Requirements Importing"
      }, {
        text: "Departments Management"
      }, {
        text: "Requirements Synchronization"
      }, {
        text: "Project Opening Decision"
      }]
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/Guarantee/edit.js":
/*!**************************************!*\
  !*** ./src/blocks/Guarantee/edit.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-sortable-hoc */ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");










const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.title_shadow,
    onChange: value => setAttributes({
      title_shadow: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\xECm",
    label: "Ti\xEAu \u0111\u1EC1 ch\xECm"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_4__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const DragHandle = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.sortableHandle)(() => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
  className: "admin-buttom-move-item"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "dashicons dashicons-move"
})));
const SortableItem = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.SortableElement)(props => {
  const {
    object,
    data_key,
    attributes,
    setAttributes,
    handlerDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "item",
    key: data_key
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "btns"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: event => handlerDelete(event, data_key),
    className: "admin-buttom-delete-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(DragHandle, null)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "txt",
    value: object.text,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "Text",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let newVisions = [...(attributes === null || attributes === void 0 ? void 0 : attributes.visions)];
      let newObj = {
        ...object,
        text: value
      };
      newVisions[data_key] = newObj;
      setAttributes({
        visions: newVisions
      });
    }
  }));
});
const SortableList = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.SortableContainer)(props => {
  const {
    items,
    attributes,
    setAttributes,
    handlerAdd,
    handlerDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "list"
  }, items.length > 0 && items.map(function (object, index) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableItem, {
      key: `item-${index}`,
      value: object,
      object: object,
      index: index,
      data_key: index,
      attributes: attributes,
      setAttributes: setAttributes,
      handlerDelete: handlerDelete
    });
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    class: "admin-buttom-add-item",
    onClick: handlerAdd
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus-alt2"
  }))));
});
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const {
    title,
    guarantee_title,
    guarantee_txt,
    image,
    visions
  } = attributes;
  const handlerDelete = (event, index) => {
    event.stopPropagation();
    const newVisions = [...visions];
    newVisions.splice(index, 1);
    setAttributes({
      visions: newVisions
    });
  };
  const handlerAdd = () => {
    const newVisions = [...visions];
    newVisions.push({
      text: "..."
    });
    setAttributes({
      visions: newVisions
    });
  };
  const handlerOnSortEnd = _ref3 => {
    let {
      oldIndex,
      newIndex
    } = _ref3;
    let newVisions = [...visions];
    setAttributes({
      visions: (0,array_move__WEBPACK_IMPORTED_MODULE_8__.arrayMoveImmutable)(newVisions, oldIndex, newIndex)
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-guarantee"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder guarantee-inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "guarantee-head"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "ttl",
    value: guarantee_title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "description",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      guarantee_title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "txt",
    value: guarantee_txt,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "description",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      guarantee_txt: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: image,
    className: "img",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        image: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "title"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "ttl",
    value: title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "description",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableList, {
    items: visions,
    onSortEnd: handlerOnSortEnd,
    axis: "y",
    helperClass: "hold-item-visions",
    hideSortableGhost: true,
    lockOffset: ["100%"],
    useDragHandle: true,
    attributes: attributes,
    setAttributes: setAttributes,
    handlerAdd: handlerAdd,
    handlerDelete: handlerDelete
  }))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Guarantee/index.js":
/*!***************************************!*\
  !*** ./src/blocks/Guarantee/index.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/Guarantee/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Guarantee/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/guarantee", {
  title: "Guarantee",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-awards",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Our Vision</strong>"
    },
    guarantee_title: {
      type: "string",
      default: "<strong><span>What We Guarantee</span> for Successful Businesses</strong>"
    },
    guarantee_txt: {
      type: "string",
      default: "<strong>Leverage technology to enhance the value of the business and provide clients with the best service possible.</strong><br></br>VIETIS provides a new creative platform to increase people’s creativity and productivity and support developers and companies in the next generation of technology. We aim to absorb the latest technology and innovative businesses with our own strength, create new value, and position ourselves as a globally reliable partner."
    },
    image: {
      type: "object",
      default: {
        url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/guarantee/guarantee_default.png",
        alt: "",
        id: ""
      }
    },
    visions: {
      type: "array",
      default: [{
        text: "Become an IT service company with innovative technology"
      }, {
        text: "Create an internal environment where employees can work comfortably."
      }, {
        text: "Aiming to be a company with 1000 people and continuous process improvement (CMMi L4)"
      }, {
        text: "We are always the trusted partner of our customers and can recommend the best technology solutions and business flows."
      }]
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/Leadership/edit.js":
/*!***************************************!*\
  !*** ./src/blocks/Leadership/edit.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-sortable-hoc */ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");










const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.title_shadow,
    onChange: value => setAttributes({
      title_shadow: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\xECm",
    label: "Ti\xEAu \u0111\u1EC1 ch\xECm"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  })));
};
const DragHandle = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.sortableHandle)(() => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "admin-buttom-move-item btn-about-move"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "dashicons dashicons-move"
})));
const SortableItem = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.SortableElement)(props => {
  const {
    object,
    data_key,
    attributes,
    setAttributes,
    handleDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(DragHandle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => handleDelete(data_key),
    className: "admin-buttom-delete-item btn-about-delete"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: object === null || object === void 0 ? void 0 : object.icon,
    onChange: value => {
      if (!value) return false;
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.blocks)];
      atts[data_key] = {
        ...object,
        icon: value
      };
      setAttributes({
        blocks: atts
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h4",
    className: "ttl",
    value: object === null || object === void 0 ? void 0 : object.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "H\u1ECD v\xE0 t\xEAn",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      if (!value) return "";
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.blocks)];
      atts[data_key] = {
        ...object,
        title: value
      };
      setAttributes({
        blocks: atts
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "txt",
    value: object === null || object === void 0 ? void 0 : object.des,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "M\xF4 t\u1EA3",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      if (!value) return "";
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.blocks)];
      atts[data_key] = {
        ...object,
        des: value
      };
      setAttributes({
        blocks: atts
      });
    }
  })));
});
const SortableList = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.SortableContainer)(props => {
  const {
    items,
    attributes,
    setAttributes,
    handleDelete,
    handleAdd
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper-item"
  }, items && items.map((object, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableItem, {
      key: `item-${index}`,
      value: object,
      object: object,
      index: index,
      data_key: index,
      attributes: attributes,
      setAttributes: setAttributes,
      handleDelete: handleDelete
    });
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "btn-about-add",
    onClick: handleAdd
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus"
  })));
});
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const handleAddBlock = () => {
    let list = [...(attributes === null || attributes === void 0 ? void 0 : attributes.blocks)];
    list.push({
      icon: {
        id: "",
        url: "",
        alt: ""
      },
      title: "",
      des: ""
    });
    setAttributes({
      blocks: list
    });
  };
  const handleRemoveBlock = index => {
    let list = [...(attributes === null || attributes === void 0 ? void 0 : attributes.blocks)];
    list.splice(index, 1);
    setAttributes({
      blocks: list
    });
  };
  const handlerOnSortEnd = _ref3 => {
    let {
      oldIndex,
      newIndex
    } = _ref3;
    let blocks = [...(attributes === null || attributes === void 0 ? void 0 : attributes.blocks)];
    setAttributes({
      blocks: (0,array_move__WEBPACK_IMPORTED_MODULE_8__.arrayMoveImmutable)(blocks, oldIndex, newIndex)
    });
  };
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_5__.processConfig)(attributes.config);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-leadership-new ",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {}
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "title text-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "ttl",
    value: attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "shadow"
  }, attributes.title_shadow)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableList, {
    items: attributes === null || attributes === void 0 ? void 0 : attributes.blocks,
    onSortEnd: handlerOnSortEnd,
    axis: "xy",
    helperClass: "hold-item-leadership",
    hideSortableGhost: true,
    lockOffset: ["100%"],
    useDragHandle: true,
    attributes: attributes,
    setAttributes: setAttributes,
    handleDelete: handleRemoveBlock,
    handleAdd: handleAddBlock
  }))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Leadership/index.js":
/*!****************************************!*\
  !*** ./src/blocks/Leadership/index.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Leadership/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/Leadership/edit.js");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("create-block/leadership", {
  title: "Leadership New",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-buddicons-buddypress-logo",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Meet Our Leadership Team</strong>"
    },
    title_shadow: {
      type: "string",
      default: "Team"
    },
    blocks: {
      type: "array",
      default: [{
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img01.png",
          id: "",
          alt: ""
        },
        title: "<strong>Dang Dieu Linh</strong>",
        des: "VIETIS President & CEO"
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img02.png",
          id: "",
          alt: ""
        },
        title: "<strong>Nguyen Ngoc Tan</strong>",
        des: "VIETIS Vice-Director & VIETIS Solution President"
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img03.png",
          id: "",
          alt: ""
        },
        title: "<strong>Nguyen Truong Giang</strong>",
        des: "VIETIS CPO & VIETIS Solution CEO"
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img04.png",
          id: "",
          alt: ""
        },
        title: "<strong>Tran Tri Dung</strong>",
        des: "VIETIS COO & QA Manager"
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img05.png",
          id: "",
          alt: ""
        },
        title: "<strong>Le Tuan Anh</strong>",
        des: "VIETIS BU2 Director"
      }]
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  }
});

/***/ }),

/***/ "./src/blocks/Outsource/edit.js":
/*!**************************************!*\
  !*** ./src/blocks/Outsource/edit.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-sortable-hoc */ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");










const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.title_shadow,
    onChange: value => setAttributes({
      title_shadow: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\xECm",
    label: "Ti\xEAu \u0111\u1EC1 ch\xECm"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.modal_meeting.title_modal,
    onChange: value => {
      const newModal = {
        ...attributes.modal_meeting
      };
      newModal["title_modal"] = value;
      setAttributes({
        modal_meeting: newModal
      });
    },
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 modal",
    label: "Title Modal Meeting"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.modal_meeting.link,
    onChange: value => {
      const newModal = {
        ...attributes.modal_meeting
      };
      newModal["link"] = value;
      setAttributes({
        modal_meeting: newModal
      });
    },
    placeholder: "Nh\u1EADp link meeting",
    label: "Link Meeting"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_4__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const DragHandle = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.sortableHandle)(() => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "admin-buttom-move-item"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "dashicons dashicons-move"
})));
const active_style = {
  background: '#01B9EA'
};
const SortableItem = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.SortableElement)(props => {
  const {
    object,
    expanded,
    setExpanded,
    data_key,
    attributes,
    setAttributes,
    handlerDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "item",
    key: data_key
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ttl",
    style: expanded === data_key ? active_style : {},
    onClick: () => setExpanded(data_key)
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "span",
    className: "",
    value: object.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "Enter Title",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let newWhys = [...(attributes === null || attributes === void 0 ? void 0 : attributes.whys)];
      let newObj = {
        ...object,
        title: value
      };
      newWhys[data_key] = newObj;
      setAttributes({
        whys: newWhys
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(DragHandle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: event => handlerDelete(event, data_key),
    className: "admin-buttom-delete-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  }))), expanded === data_key ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "span",
    className: "txt show",
    value: object.text,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "Text",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let newWhys = [...(attributes === null || attributes === void 0 ? void 0 : attributes.whys)];
      let newObj = {
        ...object,
        text: value
      };
      newWhys[data_key] = newObj;
      setAttributes({
        whys: newWhys
      });
    }
  }) : (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null));
});
const SortableList = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.SortableContainer)(props => {
  const {
    items,
    attributes,
    setAttributes,
    handlerAdd,
    handlerDelete
  } = props;
  const [expanded, setExpanded] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "list"
  }, items.length > 0 && items.map(function (object, index) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableItem, {
      key: `item-${index}`,
      value: object,
      object: object,
      index: index,
      data_key: index,
      attributes: attributes,
      setAttributes: setAttributes,
      handlerDelete: handlerDelete,
      expanded: expanded,
      setExpanded: setExpanded
    });
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    class: "admin-buttom-add-item",
    onClick: handlerAdd
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus-alt2"
  }))));
});
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const {
    title,
    title_shadow,
    image,
    whys,
    text_meeting,
    text_button_meeting
  } = attributes;
  const handlerDelete = (event, index) => {
    event.stopPropagation();
    let newWhys = [...whys];
    newWhys.splice(index, 1);
    setAttributes({
      whys: newWhys
    });
  };
  const handlerAdd = () => {
    let newWhys = [...whys];
    newWhys.push({
      title: "Title",
      text: "Content"
    });
    setAttributes({
      whys: newWhys
    });
  };
  const handlerOnSortEnd = _ref3 => {
    let {
      oldIndex,
      newIndex
    } = _ref3;
    let newWhys = [...whys];
    setAttributes({
      whys: (0,array_move__WEBPACK_IMPORTED_MODULE_8__.arrayMoveImmutable)(newWhys, oldIndex, newIndex)
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-outsource"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder outsource-inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: image,
    className: "img",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        image: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "title"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "ttl",
    value: title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "description",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "shadow shadow--primary"
  }, title_shadow)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableList, {
    items: whys,
    onSortEnd: handlerOnSortEnd,
    axis: "y",
    helperClass: "hold-item-outsource",
    hideSortableGhost: true,
    lockOffset: ["100%"],
    useDragHandle: true,
    attributes: attributes,
    setAttributes: setAttributes,
    handlerAdd: handlerAdd,
    handlerDelete: handlerDelete
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "call-meeting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "meeting-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "txt",
    value: text_meeting,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "description",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      text_meeting: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "btn",
    value: text_button_meeting,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_5__.ALLOWED_FORMATS,
    placeholder: "description",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      text_button_meeting: value
    })
  }))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Outsource/index.js":
/*!***************************************!*\
  !*** ./src/blocks/Outsource/index.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/Outsource/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Outsource/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/outsource", {
  title: "Outsource",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "format-image",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Why Outsource Your IT Services?</strong>"
    },
    title_shadow: {
      type: "string",
      default: "Why Outsource"
    },
    image: {
      type: "object",
      default: {
        url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/outsource/outsource_img.png",
        alt: "",
        id: ""
      }
    },
    whys: {
      type: "array",
      default: [{
        title: "Save Costs",
        text: "It takes a lot of resources to manage IT. In addition to money and time, hardware and software need to be purchased, installed, and maintained. Additionally, hiring, training, retaining, and managing IT workers costs money and time. You can lower operational costs by outsourcing your IT services and lowering the price associated with these vital IT resources. Additionally, you will spend less on hiring, firing, annual bonuses, health insurance, retirement payments, and other expenses."
      }, {
        title: "Simplify Procurement",
        text: "By using Outsourcing Service, you don’t have to take care of the necessary hardware (such as computers and other office equipment)."
      }, {
        title: "Flexibly Scalable",
        text: "Different firms have different IT requirements. yet occasionally, the requirements of a firm can also shift. Your business’ other essential components won’t be put under undue strain as a result of the scalability you’ll have with an IT partner that can adapt to your needs at any time."
      }, {
        title: "Utilise more experience",
        text: "You may get much more experience by outsourcing your IT services to a skilled provider, which is almost hard for an in-house IT team to do. This is because companies that provide outsourced IT services have a wide range of expertise from working with various organizations and their various IT requirements."
      }]
    },
    text_meeting: {
      type: "string",
      default: "<strong>Looking for a Long-Term Technical Partner?</strong>"
    },
    text_button_meeting: {
      type: "string",
      default: "Arrange Meeting Right Now!"
    },
    modal_meeting: {
      type: 'object',
      default: {
        title_modal: "Exec partnership meeting",
        link: "https://meetings.hubspot.com/ken-nguyen1?embed=true"
      }
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/Overview/edit.js":
/*!*************************************!*\
  !*** ./src/blocks/Overview/edit.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");








const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.title_shadow,
    onChange: value => setAttributes({
      title_shadow: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\xECm",
    label: "Ti\xEAu \u0111\u1EC1 ch\xECm"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_6__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const {
    title,
    title_shadow,
    config
  } = attributes;
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_6__.processConfig)(attributes.config);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block block-overview",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {}
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "title text-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "ttl",
    value: attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "shadow"
  }, attributes.title_shadow)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "title"
  }, PV_Admin.company_name_vi), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "text text--underline"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "ttl"
  }, "Year of incorporation"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "txt"
  }, PV_Admin.year_of_incorporation_vi)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "text text--underline"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "ttl"
  }, "Representative"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "txt"
  }, PV_Admin.representative_vi)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "text text--column"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "ttl"
  }, "Contact Info"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "txt"
  }, PV_Admin.address_vi)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "text"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, "Tel: "), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#"
  }, PV_Admin.phone_vi))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "title"
  }, PV_Admin.company_name_jp), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content content--bg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "text text--underline"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "ttl"
  }, "Year of incorporation"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "txt"
  }, PV_Admin.year_of_incorporation_jp)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "text text--underline"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "ttl"
  }, "Representative"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "txt"
  }, PV_Admin.representative_jp)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "text text--column"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "ttl"
  }, "Contact Info"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "address"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "txt"
  }, PV_Admin.address_jp_01), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "sub"
  }, PV_Admin.address_jp_02))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "text"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, "Tel: "), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#"
  }, PV_Admin.phone_jp))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "title"
  }, PV_Admin.company_name_us), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content content--center content--bg"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "text text text--column"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "ttl"
  }, "Contact Info"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "txt"
  }, PV_Admin.address_us)))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "title"
  }, PV_Admin.company_name_fin), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content content--center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "text"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "ttl"
  }, "Representative"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    class: "txt"
  }, PV_Admin.representative_vi)))))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Overview/index.js":
/*!**************************************!*\
  !*** ./src/blocks/Overview/index.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/Overview/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Overview/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/overview", {
  title: "company-overview",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-building",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Company overview</strong>"
    },
    title_shadow: {
      type: "string",
      default: "VietIS"
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/Process/edit.js":
/*!************************************!*\
  !*** ./src/blocks/Process/edit.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-sortable-hoc */ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");










const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const DragHandle = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.sortableHandle)(() => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "admin-buttom-move-item"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "dashicons dashicons-move"
})));
const SortableItem = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.SortableElement)(props => {
  var _attributes$content$d, _attributes$content$d2, _attributes$content$d3, _attributes$content$d4;
  const {
    object,
    data_key,
    attributes,
    setAttributes,
    handleDelete,
    setIsShowTooltip,
    isShowTooltip
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "item",
    key: data_key
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "admin-buttom-delete-item",
    onClick: () => handleDelete(data_key)
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(DragHandle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-admin-comments icon-show-popover",
    onClick: () => isShowTooltip === data_key ? setIsShowTooltip(null) : setIsShowTooltip(data_key)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "img-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: object.icon,
    className: "img",
    onChange: value => {
      if (!value) return false;
      const newContent = [...attributes.content];
      newContent[data_key].icon = value;
      setAttributes({
        content: newContent
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "span",
    className: "txt",
    value: object.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Enter Title",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      const newContent = [...attributes.content];
      newContent[data_key].title = value;
      setAttributes({
        content: newContent
      });
    }
  }), isShowTooltip === data_key ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "popover show"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "admin-buttom-delete-item",
    onClick: () => setIsShowTooltip(null)
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "arrow-tooltip"
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "popover-body"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "ttl",
    value: (_attributes$content$d = attributes.content[data_key]) === null || _attributes$content$d === void 0 ? void 0 : (_attributes$content$d2 = _attributes$content$d.tooltip) === null || _attributes$content$d2 === void 0 ? void 0 : _attributes$content$d2.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Enter Title",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      const newContent = [...attributes.content];
      newContent[data_key].tooltip.title = value;
      setAttributes({
        content: newContent
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "list"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "ul",
    className: "",
    value: (_attributes$content$d3 = attributes.content[data_key]) === null || _attributes$content$d3 === void 0 ? void 0 : (_attributes$content$d4 = _attributes$content$d3.tooltip) === null || _attributes$content$d4 === void 0 ? void 0 : _attributes$content$d4.lists,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "List",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      const newContent = [...attributes.content];
      newContent[data_key].tooltip.lists = value;
      setAttributes({
        content: newContent
      });
    }
  })))) : "");
});
const SortableList = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.SortableContainer)(props => {
  const {
    items,
    attributes,
    setAttributes,
    handleDelete,
    handleAdd,
    isShowTooltip,
    setIsShowTooltip
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "content-solution"
  }, items && items.map((object, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableItem, {
      key: `item-${index}`,
      value: object,
      object: object,
      index: index,
      data_key: index,
      attributes: attributes,
      setAttributes: setAttributes,
      handleDelete: handleDelete,
      isShowTooltip: isShowTooltip,
      setIsShowTooltip: setIsShowTooltip
    });
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    className: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "admin-buttom-add-item",
    onClick: handleAdd
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus-alt2"
  }))));
});
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const [isShowTooltip, setIsShowTooltip] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const handleDelete = index => {
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.content)];
    atts.splice(index, 1);
    setAttributes({
      content: atts
    });
  };
  const handleAdd = () => {
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.content)];
    atts.push({
      title: "<strong>Text</strong>",
      icon: {
        url: "",
        alt: "",
        id: ""
      },
      tooltip: {
        title: "",
        lists: ""
      }
    });
    setAttributes({
      content: atts
    });
  };
  const handlerOnSortEnd = _ref3 => {
    let {
      oldIndex,
      newIndex
    } = _ref3;
    let content = [...(attributes === null || attributes === void 0 ? void 0 : attributes.content)];
    setIsShowTooltip(null);
    setAttributes({
      content: (0,array_move__WEBPACK_IMPORTED_MODULE_8__.arrayMoveImmutable)(content, oldIndex, newIndex)
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-process-service"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "ttl",
    value: attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableList, {
    items: attributes === null || attributes === void 0 ? void 0 : attributes.content,
    onSortEnd: handlerOnSortEnd,
    axis: "xy",
    helperClass: "hold-item-process",
    hideSortableGhost: true,
    lockOffset: ["100%"],
    useDragHandle: true,
    attributes: attributes,
    setAttributes: setAttributes,
    isShowTooltip: isShowTooltip,
    setIsShowTooltip: setIsShowTooltip,
    handleDelete: handleDelete,
    handleAdd: handleAdd
  })))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Process/index.js":
/*!*************************************!*\
  !*** ./src/blocks/Process/index.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/Process/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Process/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/process", {
  title: "Process",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "format-image",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Process</strong>"
    },
    content: {
      type: "array",
      default: [{
        title: "<strong>Discovery</strong>",
        icon: {
          url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_lv1.png`,
          alt: "",
          id: ""
        },
        tooltip: {
          title: "",
          lists: "VietIS will go into detail about the experience you want to offer before diving into digital transformation. We will help you in this process by providing answers to the following questions: What, Where, and How?"
        }
      }, {
        title: "<strong>Change</strong>",
        icon: {
          url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_lv2.png`,
          alt: "",
          id: ""
        },
        tooltip: {
          title: "",
          lists: "Before deciding to adopt technology, many firms don't take the time to consider what they actually need. This is a waste of time and resources and can result in digital fatigue.<br>Therefore, defining your objectives and desired outcomes can help you develop an effective digital transformation strategy. The appropriate technologies in line with the strategy for digital transformation will be offered by our knowledgeable experts."
        }
      }, {
        title: "<strong>Scale</strong>",
        icon: {
          url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_lv3.png`,
          alt: "",
          id: ""
        },
        tooltip: {
          title: "",
          lists: "The process of digital transformation is ongoing and has no defined end point. To assure your success, VietIS keeps its tech specialists up to date on the newest developments in technology."
        }
      }, {
        title: "<strong>Optimize</strong>",
        icon: {
          url: `${PV_Admin.PV_BASE_URL}/assets/img/blocks/digital-transformation-service-page/product_lv4.png`,
          alt: "",
          id: ""
        },
        tooltip: {
          title: "",
          lists: "Take a step back as you execute improvements in your company to assess your progress and make any corrections. Then, you can discuss your progress and what isn't working with important stakeholders. In the future, VietIS will be available to help you with any additional upgrades."
        }
      }]
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/blocks/Product/VISInsight/Banner/edit.js":
/*!******************************************************!*\
  !*** ./src/blocks/Product/VISInsight/Banner/edit.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../components/config-block */ "./src/components/config-block.js");









const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_6__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-product-banner js-hero"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder-fluid banner-inner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "img-wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_5__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : attributes.image,
    className: "img",
    onChange: media => {
      setAttributes({
        image: media
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    className: "ttl",
    tagName: "h2",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.title,
    placeholder: "Ti\xEAu \u0111\u1EC1",
    keepPlaceholderOnFocus: true,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    onChange: value => {
      setAttributes({
        title: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    className: "des",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.description,
    placeholder: "M\xF4 t\u1EA3",
    keepPlaceholderOnFocus: true,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    onChange: value => {
      setAttributes({
        description: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "product-insight-implement"
  }, attributes.steps && attributes.steps.map((item, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
      className: "item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "number"
    }, item.id), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "span",
      className: "txt",
      value: attributes === null || attributes === void 0 ? void 0 : attributes.steps[index]["text"],
      placeholder: "M\xF4 t\u1EA3",
      keepPlaceholderOnFocus: true,
      allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
      onChange: value => {
        let steps = [...attributes.steps];
        steps[index]["text"] = value;
        setAttributes({
          steps: steps
        });
      }
    }));
  }))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block block-technology"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder list"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_5__.ImageUpload, {
    value: attributes === null || attributes === void 0 ? void 0 : attributes.technology,
    multiple: true,
    className: "item",
    tagName: "div",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        technology: value
      });
    }
  }))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Product/VISInsight/Banner/index.js":
/*!*******************************************************!*\
  !*** ./src/blocks/Product/VISInsight/Banner/index.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Product/VISInsight/Banner/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/blocks/Product/VISInsight/Banner/edit.js");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/visinsight-banner", {
  title: "VISInsight-banner",
  description: "Example block VISInsight",
  category: "vietis",
  icon: "dashicons dashicons-info",
  attributes: {
    title: {
      type: "string",
      default: "VISInsight"
    },
    description: {
      type: "string",
      default: "Is a project management tool of VietIS company, aiming to implement the digital transformation roadmap."
    },
    steps: {
      type: "array",
      default: [{
        id: 1,
        text: "Planning assistance"
      }, {
        id: 2,
        text: "Monitoring project"
      }, {
        id: 3,
        text: "Data collection"
      }]
    },
    technology: {
      type: "array",
      default: []
    },
    image: {
      type: "object",
      default: {
        id: "",
        url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/product/product-insight-laptop.png",
        alt: ""
      }
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"]
});

/***/ }),

/***/ "./src/blocks/Product/VISInsight/Overview/edit.js":
/*!********************************************************!*\
  !*** ./src/blocks/Product/VISInsight/Overview/edit.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../components/image-upload */ "./src/components/image-upload.js");





const FragmentBlock = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-product-overview"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "product-ttl",
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    value: attributes === null || attributes === void 0 ? void 0 : attributes.title,
    onChange: value => {
      setAttributes({
        title: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "img"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_3__.ImageUploadSingle, {
    className: "img",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.image,
    onChange: value => {
      setAttributes({
        image: value
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    class: "list"
  }, (attributes === null || attributes === void 0 ? void 0 : attributes.items) && (attributes === null || attributes === void 0 ? void 0 : attributes.items.map((item, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
      className: "item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "wrap"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "p",
      className: "ttl",
      placeholder: "Title",
      keepPlaceholderOnFocus: true,
      value: item === null || item === void 0 ? void 0 : item.ttl,
      onChange: value => {
        let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
        atts[index] = {
          ...item,
          ttl: value
        };
        setAttributes({
          items: atts
        });
      }
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "p",
      className: "txt",
      placeholder: "Text",
      keepPlaceholderOnFocus: true,
      value: item === null || item === void 0 ? void 0 : item.txt,
      onChange: value => {
        let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
        atts[index] = {
          ...item,
          txt: value
        };
        setAttributes({
          items: atts
        });
      }
    })));
  })))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Product/VISInsight/Overview/index.js":
/*!*********************************************************!*\
  !*** ./src/blocks/Product/VISInsight/Overview/index.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Product/VISInsight/Overview/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/blocks/Product/VISInsight/Overview/edit.js");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/visinsight-overview", {
  title: "VISInsight-overview",
  description: "Example block-overview VISInsight",
  category: "vietis",
  icon: "dashicons dashicons-info",
  attributes: {
    title: {
      type: "string",
      default: "Overview VISInsight"
    },
    image: {
      type: "object",
      default: {
        id: "",
        url: PV_Admin.PV_BASE_URL + "assets/img/blocks/product/product-insight-dt.png",
        alt: ""
      }
    },
    items: {
      type: "array",
      default: [{
        ttl: "BOD",
        txt: "View project situation in the company<br>Review, approve necessary documents"
      }, {
        ttl: "QA",
        txt: "View, monitor project information<br>Support PM completes the target<br>Collect data analysis, build target for the organization"
      }, {
        ttl: "Software production department",
        txt: "Create procedures for opening and closing projects<br>Create a report<br>Monitoring<br>Resource Management"
      }, {
        ttl: "IT Support",
        txt: "Decentralization for the project<br>Backup/ recovery’s server folder"
      }, {
        ttl: "HR",
        txt: "Department information management<br>Employee information management"
      }, {
        ttl: "Sales",
        txt: "Create customer information<br>Bidding information management"
      }]
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"]
});

/***/ }),

/***/ "./src/blocks/Product/Veramine/Banner/edit.js":
/*!****************************************************!*\
  !*** ./src/blocks/Product/Veramine/Banner/edit.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../components/config-block */ "./src/components/config-block.js");








const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes === null || attributes === void 0 ? void 0 : attributes.title,
    onChange: value => setAttributes({
      title: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1",
    label: "Ti\xEAu \u0111\u1EC1"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_6__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-veramine-banner"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "header"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "logo"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_5__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : attributes.logo,
    onChange: value => {
      setAttributes({
        logo: value
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "header-txt",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.header_txt,
    placeholder: "Title",
    onChange: value => {
      setAttributes({
        header_txt: value
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "desc"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h2",
    className: "ttl",
    placeholder: "Title",
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    value: attributes === null || attributes === void 0 ? void 0 : attributes.title,
    onChange: value => {
      setAttributes({
        title: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "txt",
    placeholder: "Description",
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    value: attributes === null || attributes === void 0 ? void 0 : attributes.description,
    onChange: value => {
      setAttributes({
        description: value
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "img"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_5__.ImageUploadSingle, {
    value: attributes === null || attributes === void 0 ? void 0 : attributes.image,
    onChange: value => {
      setAttributes({
        image: value
      });
    }
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    class: "list"
  }, (attributes === null || attributes === void 0 ? void 0 : attributes.steps) && (attributes === null || attributes === void 0 ? void 0 : attributes.steps.map((item, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
      className: "item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "span",
      value: item === null || item === void 0 ? void 0 : item.text,
      placeholder: "Description",
      allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
      keepPlaceholderOnFocus: true,
      onChange: value => {
        let steps = [...attributes.steps];
        steps[index]["text"] = value;
        setAttributes({
          steps: steps
        });
      }
    }));
  }))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Product/Veramine/Banner/index.js":
/*!*****************************************************!*\
  !*** ./src/blocks/Product/Veramine/Banner/index.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Product/Veramine/Banner/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/blocks/Product/Veramine/Banner/edit.js");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/veramine-banner", {
  title: "Veramine-banner",
  description: "Example block Veramine",
  category: "vietis",
  icon: "dashicons dashicons-info",
  attributes: {
    title: {
      type: "string",
      default: "テレワークのデバイス環<br>境をセキュアに保つ"
    },
    header_txt: {
      type: "string",
      default: "アメリカ国防総省、空軍、国土安全保障省なとて導入済み!"
    },
    description: {
      type: "string",
      default: "従来のセキュリティ対策ソフトでは対応できないサイバー攻撃を阻止!"
    },
    logo: {
      type: "object",
      default: {
        url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/product/veramine/logo_veramin.svg",
        id: 1,
        alt: ''
      }
    },
    image: {
      type: "object",
      default: {
        url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/product/veramine/icon_baner_veramin.svg",
        id: 1,
        alt: ''
      }
    },
    steps: {
      type: "array",
      default: [{
        text: 'クラウドとオンプレミス いすれにも対応',
        color: '#F3F4FD'
      }, {
        text: '強力なすべての機能を 1つのセンサーに バッケージ化',
        color: '#EDFAFE'
      }, {
        text: 'CPU 1 % 20M3 AMで負荷がかからない',
        color: '#EBF5FF'
      }]
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"]
});

/***/ }),

/***/ "./src/blocks/Product/Veramine/Overview/edit.js":
/*!******************************************************!*\
  !*** ./src/blocks/Product/Veramine/Overview/edit.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../config/define */ "./src/config/define.js");






const FragmentBlock = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-veramine-overview"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "feature"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "product-ttl product-ttl--line",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    onChange: value => {
      setAttributes({
        title: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "inner-blocks"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks, {
    allowedBlocks: {}
  })))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Product/Veramine/Overview/index.js":
/*!*******************************************************!*\
  !*** ./src/blocks/Product/Veramine/Overview/index.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Product/Veramine/Overview/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/Product/Veramine/Overview/edit.js");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("create-block/veramine-overview", {
  title: "Veramine-Overview",
  description: "Example block Veramine overview",
  category: "vietis",
  icon: "dashicons dashicons-info",
  attributes: {
    title: {
      type: "string",
      default: "Features of Products and Services"
    },
    feature: {
      type: "array",
      default: [{
        id: 1,
        title: "Data Collection and Monitoring",
        text: "Data Quality: Variety. Detailed. Structured. Real Time. Small Traffic. Security-related activities: Process, Registry, System Security, Network, User, SMB, Binaries, AMSI...<br>" + "<br>Flexible collection policies: admins can select what data to collect. Adaptive filter: sensors smartly don't send irrelevant high-volume events to servers, that can filter out TB's of traffic sent and processed by sensors and servers.<br>" + "<br>External and Insider Threats Prevention with Advanced Monitoring on Data, Devices and Users, such as Key loggers, Video and Screenshot captures, Activities of Browsing-Email-SMB, USB Management Logged Tracking and Access Control Policies (Blocked, Read-Only, or Read-Write), User sessions, User and Entity Behavior Analytics (UEBA)<br>-----"
      }, {
        id: 2,
        title: "Detection and Deception",
        text: "Detect attack tactics and techniques in https://attack.mitre.org/wiki/Technique_Matrix.<br>" + "<br>More collected data types allow more data analysis algorithms, combining rule-based and machine learning, resulting in better Detection. Examples: SMB data allows detecting Lateral Movement and Insider Threats; Precise Elevation of Privilege (EOP) detection by collecting security tokens; Lsass process open allows detecting credentials and passwords dumping (Mimikatz); Command arguments allow detecting Malicious Powershell intrusions...<br>" + "<br>Deception is an Active Defense approach, whereas most existing approaches are Passive Defense. Platform of Traps, put along the kill chain, to cheat, detect and prevent intrusions. Capable of making every computer (physical or \/M) a honeypot, in IT Systems. Uniquely offered by Veramine.<br>" + "<br>Deceptive services, processes, files, mutexes, credentials, network listeners, data shares, registry helper, VMs... Track intruders' activities, and limit things they can do, with the traps. E.g. WannaCry checks a mutex to decide if a system is already infected, and we can set such a deceptive mutex."
      }, {
        id: 3,
        title: "Incident Response and Forensics",
        text: "Yara Search on Memory and Files. Memory dumps are at fingertips. Collected data is searchable using flexible logical expressions. All executable binaries are col ected for forensics.<br>" + "<br>Veramine have most Response Actions, from Binaries, Users, Hosts to Processes. E.g. Network Quarantine, Process Suspend/Terminate, User Disable/Disconnect, Host Sleep/Shutdown/Restart, Binary Block, Scan with Virus Total...<br>" + "<br>Forensics with Velociraptor to collect various built-in or customized artifacts from multiple endpoints in real-time from centralized portal. VQL, similar to SQL, allows collection tasks to be quickly programmed, automated and shared, so that turn-around from IOC to fu I hunt can be a few minutes. E.g. VQL to search and collect fi es in users' temp directory which have been created within the last week."
      }, {
        id: 4,
        title: "Performance, Deployment, Integration and Management",
        text: "Veramine sensors on average take less than 1% CPU and 20 MB RAM, network traffic is less than 30 MB/day/host, and can be further tuned using col ection policies. Easy deployment to the whole network such as using AD, SCCM or psexec.<br>" + "<br>Integration with S EM, VDI, LDAP, AD, 2-fact Authen, APIs. Sensor Emergency & Autoupdate. Server: Multisite and audited."
      }, {
        id: 5,
        title: "Training and Education",
        text: "Veramine Founders<br>" + '<br> - authored a number of books, such as "Practical Reverse Engineering" best rated on Amazon.com<br>' + "<br> - spoke and trained at most respected venues Black Hat, Recon, CCC, NATO..."
      }]
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  }
});

/***/ }),

/***/ "./src/blocks/Product/Veramine/Technology/edit.js":
/*!********************************************************!*\
  !*** ./src/blocks/Product/Veramine/Technology/edit.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-sortable-hoc */ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");








const DragHandle = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_5__.sortableHandle)(() => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "admin-buttom-move-item"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "dashicons dashicons-move"
})));
const SortableItem = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_5__.SortableElement)(props => {
  const {
    object,
    data_key,
    attributes,
    setAttributes,
    handlerDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: event => handlerDelete(event, data_key),
    className: "admin-buttom-delete-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(DragHandle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "header"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "img"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_4__.ImageUploadSingle, {
    value: object === null || object === void 0 ? void 0 : object.icon,
    onChange: value => {
      let att = [...(attributes === null || attributes === void 0 ? void 0 : attributes.item)];
      let new_icon = {
        ...object,
        icon: value
      };
      att[data_key] = new_icon;
      setAttributes({
        item: att
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "ttl",
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_3__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    value: object === null || object === void 0 ? void 0 : object.title,
    onChange: value => {
      let att = [...(attributes === null || attributes === void 0 ? void 0 : attributes.item)];
      let new_title = {
        ...object,
        title: value
      };
      att[data_key] = new_title;
      setAttributes({
        item: att
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "main"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "desc",
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_3__.ALLOWED_FORMATS,
    placeholder: "Description",
    keepPlaceholderOnFocus: true,
    value: object === null || object === void 0 ? void 0 : object.description,
    onChange: value => {
      let att = [...(attributes === null || attributes === void 0 ? void 0 : attributes.item)];
      let new_description = {
        ...object,
        description: value
      };
      att[data_key] = new_description;
      setAttributes({
        item: att
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "note",
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_3__.ALLOWED_FORMATS,
    placeholder: "Note",
    keepPlaceholderOnFocus: true,
    value: object === null || object === void 0 ? void 0 : object.note,
    onChange: value => {
      let att = [...(attributes === null || attributes === void 0 ? void 0 : attributes.item)];
      let new_note = {
        ...object,
        note: value
      };
      att[data_key] = new_note;
      setAttributes({
        item: att
      });
    }
  })));
});
const SortableList = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_5__.SortableContainer)(props => {
  const {
    items,
    attributes,
    setAttributes,
    handlerAdd,
    handlerDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "list"
  }, items && items.map((object, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableItem, {
      key: `item-${index}`,
      value: object,
      object: object,
      index: index,
      data_key: index,
      attributes: attributes,
      setAttributes: setAttributes,
      handlerDelete: handlerDelete
    });
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    class: "admin-buttom-add-item",
    onClick: handlerAdd
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus-alt2"
  }))));
});
const FragmentBlock = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  const handlerDelete = (event, index) => {
    event.stopPropagation();
    const atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.item)];
    atts.splice(index, 1);
    setAttributes({
      item: atts
    });
  };
  const handlerAdd = () => {
    let item = [...(attributes === null || attributes === void 0 ? void 0 : attributes.item)];
    let new_item = {
      icon: {
        id: item.length + 1,
        alt: "",
        url: ""
      },
      title: "",
      description: "",
      note: ""
    };
    item.push(new_item);
    setAttributes({
      item: item
    });
  };
  const handlerOnSortEnd = _ref2 => {
    let {
      oldIndex,
      newIndex
    } = _ref2;
    let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.item)];
    setAttributes({
      item: (0,array_move__WEBPACK_IMPORTED_MODULE_6__.arrayMoveImmutable)(items, oldIndex, newIndex)
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-veramine-technology"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "option"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableList, {
    items: attributes === null || attributes === void 0 ? void 0 : attributes.item,
    onSortEnd: handlerOnSortEnd,
    axis: "xy",
    helperClass: "hold-item-technology",
    hideSortableGhost: true,
    lockOffset: ["100%"],
    useDragHandle: true,
    attributes: attributes,
    setAttributes: setAttributes,
    handlerAdd: handlerAdd,
    handlerDelete: handlerDelete
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "feature-txt",
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_3__.ALLOWED_FORMATS,
    placeholder: "Feature",
    keepPlaceholderOnFocus: true,
    value: attributes === null || attributes === void 0 ? void 0 : attributes.feature_text,
    onChange: value => {
      setAttributes({
        feature_text: value
      });
    }
  })))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Product/Veramine/Technology/index.js":
/*!*********************************************************!*\
  !*** ./src/blocks/Product/Veramine/Technology/index.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Product/Veramine/Technology/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/blocks/Product/Veramine/Technology/edit.js");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/veramine-technology", {
  title: "Veramine-technology",
  description: "Example block-technology Veramine",
  category: "vietis",
  icon: "dashicons dashicons-info",
  attributes: {
    bg_image: {
      type: "string",
      default: PV_Admin.PV_BASE_URL + "/assets/img/blocks/product/veramine/image_bg_feature.svg"
    },
    item: {
      type: "array",
      default: [{
        icon: {
          id: 1,
          alt: "",
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/product/veramine/feature01.svg"
        },
        title: "高精度<br/>アルゴリズム",
        description: "膨大なデータをあらゆる角度から深く分析、サイバー攻撃の兆候をリアルタイムに検知・可視化し、標的型攻撃などの高度なサイバー攻撃を阻止します。",
        note: "Veramine Endpoint Detection日れdRes 0れse (VEDR)"
      }, {
        icon: {
          id: 2,
          alt: "",
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/product/veramine/feature03.svg"
        },
        title: "全てのエンドボイントをリアルタイムに監視",
        description: "企業が保有する数多くのエンドボイントに対し、マルウェアの感染や攻撃を検知し、影響範囲を特定、早期対応を実現します。",
        note: "Veramine P′Odu( ⅵ MOれ0 ng r00 (VPMT)"
      }, {
        icon: {
          id: 3,
          alt: "",
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/product/veramine/feature02.svg"
        },
        title: "Deception<br/>テクノロジー",
        description: 'おとり環境へ標的型サイバー攻撃を誘導し攻撃者を・騙す"ソリューションで攻撃を 阻止します。',
        note: "Veramine DynamicDeception System (VDDS)"
      }, {
        icon: {
          id: 4,
          alt: "",
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/product/veramine/feature04.svg"
        },
        title: "内部のセキュリティ違反<br/>もすぐ検知",
        description: "あらゆるアクテイヒティをモ二タリングし悪意のあるすべての操作を検知できます。",
        note: "Veramine引de′ TわヨtPレeれ0 (VITP)"
      }]
    },
    description: {
      type: "string",
      default: "昨今は、ゼロディ攻撃、標的型攻撃といった巧妙な手口を用いたサイバー攻撃が増えており、従来のセキュリティ対策ソフト( EPP)では攻撃を防ぐことが難しくなっています。<br>Veramineは、 会社が保有する全てのPC・ノートパソコン・サーバーの挙動を包括的にモニタリングすることができます。個々のデバイスではなく複数デバイスのデータを関連付けて分析するため、インシデント発生時にも感染経路や感染範囲を素早く特定し、被害を最小限に抑えることができます"
    },
    feature_text: {
      type: "string",
      default: "昨今は、ゼロディ攻撃、標的型攻撃といった巧妙な手口を用いたサイバー攻撃が増えており、従来のセキュリティ対策ソフト(EPP)では攻撃を防ぐことが難しくなっています。<br />Veramineは、会社が保有する全てのPC・ノートパソコン・サーバーの挙動を包括的にモニタリングすることができます。個々のデバイスではなく複数デバイスのデータを関連付けて分析するため、インシデント発生時にも感染経路や感染範囲を素早く特定し、被害を最小限に抑えることができます"
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"]
});

/***/ }),

/***/ "./src/blocks/ServiceHead/edit.js":
/*!****************************************!*\
  !*** ./src/blocks/ServiceHead/edit.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");








const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  const option = [{
    label: "Left",
    value: "left"
  }, {
    label: "Right",
    value: "right"
  }];
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "Id Block"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes === null || attributes === void 0 ? void 0 : attributes.id,
    onChange: value => setAttributes({
      id: value
    }),
    placeholder: "Nh\u1EADp id block"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "Layout Block Option:"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    options: option,
    value: attributes === null || attributes === void 0 ? void 0 : attributes.reverse,
    onChange: value => {
      setAttributes({
        reverse: value
      });
    }
  })));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const {
    ttl,
    txt,
    image
  } = attributes;
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_5__.processConfig)(attributes.config);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block-service-page"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: attributes !== null && attributes !== void 0 && attributes.reverse && (attributes === null || attributes === void 0 ? void 0 : attributes.reverse) === "right" ? "head" : "head head--reverse"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {}
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "title"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    class: "ttl"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "ttl",
    value: ttl,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title ..",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      ttl: value
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "txt",
    value: txt,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Description ..",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      txt: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: image,
    className: "img",
    onChange: value => {
      if (!value) return false;
      setAttributes({
        image: value
      });
    }
  }))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/ServiceHead/index.js":
/*!*****************************************!*\
  !*** ./src/blocks/ServiceHead/index.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/ServiceHead/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/ServiceHead/edit.js");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("create-block/service-head", {
  title: "Service-head",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-info",
  attributes: {
    ttl: {
      type: "string",
      default: "<strong>Please Enter Title..</strong>"
    },
    txt: {
      type: "string",
      default: "Please Enter Content .."
    },
    image: {
      type: "object",
      default: {
        url: PV_Admin.PV_BASE_URL + "/assets/img/image-default.png",
        alt: "",
        id: ""
      }
    },
    reverse: {
      type: "string",
      default: "left"
    },
    id: {
      type: "string",
      default: ""
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  }
});

/***/ }),

/***/ "./src/blocks/ServiceNew/edit.js":
/*!***************************************!*\
  !*** ./src/blocks/ServiceNew/edit.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-sortable-hoc */ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var _components_input_link__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../components/input-link */ "./src/components/input-link.js");











const DragHandle = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_6__.sortableHandle)(() => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "admin-buttom-move-item"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "dashicons dashicons-move"
})));
const SortableItem = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_6__.SortableElement)(props => {
  const {
    object,
    data_key,
    attributes,
    setAttributes,
    handleDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "lnk"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "item-media"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "admin-buttom-delete-item",
    onClick: () => handleDelete(data_key)
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(DragHandle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_input_link__WEBPACK_IMPORTED_MODULE_9__.InputLink, {
    value: (object === null || object === void 0 ? void 0 : object.link) || "",
    onChange: value => {
      let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let item = {
        ...object,
        link: value
      };
      items[data_key] = item;
      setAttributes({
        items: items
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "image"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_8__.ImageUploadSingle, {
    value: object === null || object === void 0 ? void 0 : object.image,
    onChange: value => {
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let new_image = {
        ...object,
        image: value
      };
      atts[data_key] = new_image;
      setAttributes({
        items: atts
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "desc"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "heading",
    value: object === null || object === void 0 ? void 0 : object.ttl,
    placeholder: "Your heading",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let new_title = {
        ...object,
        ttl: value
      };
      atts[data_key] = new_title;
      setAttributes({
        items: atts
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    className: "txt",
    value: object === null || object === void 0 ? void 0 : object.txt,
    placeholder: "Your text",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
      let new_txt = {
        ...object,
        txt: value
      };
      atts[data_key] = new_txt;
      setAttributes({
        items: atts
      });
    }
  }))));
});
const SortableList = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_6__.SortableContainer)(props => {
  const {
    items,
    attributes,
    setAttributes,
    handleDelete,
    handleAdd
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper-item"
  }, items && items.map((object, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableItem, {
      key: `item-${index}`,
      value: object,
      object: object,
      index: index,
      data_key: index,
      attributes: attributes,
      setAttributes: setAttributes,
      handleDelete: handleDelete
    });
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "admin-buttom-add-item",
    onClick: handleAdd
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus-alt2"
  })));
});
const FragmentBlock = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_5__.processConfig)(attributes.config);
  const handleDelete = index => {
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    atts.splice(index, 1);
    setAttributes({
      items: atts
    });
  };
  const handleAdd = () => {
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    atts.push({
      image: {
        url: "",
        alt: "",
        id: ""
      },
      ttl: "",
      txt: ""
    });
    setAttributes({
      items: atts
    });
  };
  const handlerOnSortEnd = _ref2 => {
    let {
      oldIndex,
      newIndex
    } = _ref2;
    let items = [...(attributes === null || attributes === void 0 ? void 0 : attributes.items)];
    setAttributes({
      items: (0,array_move__WEBPACK_IMPORTED_MODULE_7__.arrayMoveImmutable)(items, oldIndex, newIndex)
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-services-new",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {}
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "title text-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "ttl",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block-content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks, {
    allowedBlocks: {}
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableList, {
    items: attributes === null || attributes === void 0 ? void 0 : attributes.items,
    onSortEnd: handlerOnSortEnd,
    axis: "xy",
    helperClass: "hold-item-service-new",
    hideSortableGhost: true,
    lockOffset: ["100%"],
    useDragHandle: true,
    attributes: attributes,
    setAttributes: setAttributes,
    handleDelete: handleDelete,
    handleAdd: handleAdd
  }))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/ServiceNew/index.js":
/*!****************************************!*\
  !*** ./src/blocks/ServiceNew/index.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/ServiceNew/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/ServiceNew/edit.js");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("create-block/services-new", {
  title: "Services New",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-edit-page",
  attributes: {
    title: {
      type: "string",
      default: "<strong>VietIS Services</strong>"
    },
    items: {
      type: "array",
      default: [{
        image: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/service/service_img01.png",
          alt: "",
          id: ""
        },
        ttl: "Digital Transformation",
        txt: "Our team at VietIS can assist you in creating a solid digital foundation for your company so you can evolve your customer experience and surpass your competitors.",
        link: "/service/#service-dx"
      }, {
        image: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/service/service_img02.png",
          alt: "",
          id: ""
        },
        ttl: "Block Chain Technology",
        txt: "In the areas of banking, real estate, entertainment, healthcare, transportation, and insurance, VietIS is a company that specializes in offering organizations and enterprises solutions and applications of Blockchain technology.<br>We will assess, evaluate, develop a plan, and provide the best solution to install Blockchain technology applications for people and businesses with a team of competent and experienced specialists and programmers. Businesses and corporations may do so swiftly, effectively, and safely.",
        link: "/service/#block-chain"
      }, {
        image: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/service/service_img03.png",
          alt: "",
          id: ""
        },
        ttl: "Development of Mobile and Web Applications",
        txt: "Utilizing the best practices obtained from VIETIS's many years of service provision experience, all services are performed according to international standards such as CMMI level 3, ISO27001: 2013, and we can provide the level of service requested by our customers.",
        link: "/service/#service-system"
      }, {
        image: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/service/service_img04.png",
          alt: "",
          id: ""
        },
        ttl: "04. Development of Personalized Software",
        txt: "We offer a solution for custom software development to entrepreneurs. We create audacious and distinctive digital products that support your professional objectives. Each product's features are intended to increase the worth of your business, the number of customers you have, and your profitability. Custom software development enables certain business requirements to be handled at a competitive price when compared to commercial software and its modification and maintenance.",
        link: "/service/#service-ui-ux"
      }]
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  }
});

/***/ }),

/***/ "./src/blocks/Services/edit.js":
/*!*************************************!*\
  !*** ./src/blocks/Services/edit.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _services_api_fetch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/api-fetch */ "./src/services/api-fetch.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");








const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.title_shadow,
    onChange: value => setAttributes({
      title_shadow: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\xECm",
    label: "Ti\xEAu \u0111\u1EC1 ch\xECm"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.conditon_post.posts_per_page,
    onChange: value => setAttributes({
      conditon_post: {
        ...attributes.conditon_post,
        posts_per_page: value
      }
    }),
    placeholder: "Nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng b\xE0i vi\u1EBFt",
    label: "S\u1ED1 l\u01B0\u1EE3ng b\xE0i vi\u1EBFt:"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "PostType",
    value: attributes.conditon_post.post_type,
    options: _config_define__WEBPACK_IMPORTED_MODULE_4__.POSTTYPE_POST,
    onChange: value => setAttributes({
      conditon_post: {
        ...attributes.conditon_post,
        post_type: value
      }
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "S\u1EAFp x\u1EBFp theo",
    value: attributes.conditon_post.orderby,
    options: _config_define__WEBPACK_IMPORTED_MODULE_4__.ORDER_BY_FIELD,
    onChange: value => setAttributes({
      conditon_post: {
        ...attributes.conditon_post,
        orderby: value
      }
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Th\u1EE9 t\u1EF1 s\u1EAFp x\u1EBFp",
    value: attributes.conditon_post.order,
    options: _config_define__WEBPACK_IMPORTED_MODULE_4__.ORDER,
    onChange: value => setAttributes({
      conditon_post: {
        ...attributes.conditon_post,
        order: value
      }
    })
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_6__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  })));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const [dataItem, setDataItem] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    const data = new FormData();
    data.append("action", "get_post");
    data.append("nonce", PV_Admin.SECURITY);
    data.append("post_type", attributes.conditon_post.post_type);
    data.append("posts_per_page", attributes.conditon_post.posts_per_page);
    data.append("orderby", attributes.conditon_post.orderby);
    data.append("order", attributes.conditon_post.order);
    (0,_services_api_fetch__WEBPACK_IMPORTED_MODULE_5__.axiosFetch)(data).then(res => {
      let data = res.data;
      if (data.data.html) {
        setDataItem(data.data.html);
      }
    });
  }, [attributes.conditon_post.post_type, attributes.conditon_post.posts_per_page, attributes.conditon_post.orderby, attributes.conditon_post.order, setDataItem]);
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_6__.processConfig)(attributes.config);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-services",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {}
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "title text-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "ttl",
    value: attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "shadow"
  }, attributes.title_shadow)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block-content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks, {
    allowedBlocks: {}
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper-item",
    dangerouslySetInnerHTML: {
      __html: dataItem
    }
  }))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Services/index.js":
/*!**************************************!*\
  !*** ./src/blocks/Services/index.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Services/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/Services/edit.js");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("create-block/services", {
  title: "Services",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-edit-page",
  attributes: {
    title: {
      type: "string",
      default: "<strong>VietIS Services</strong>"
    },
    title_shadow: {
      type: "string",
      default: "Services"
    },
    conditon_post: {
      type: "object",
      default: {
        post_type: "services",
        posts_per_page: 4,
        orderby: "date",
        order: "DESC"
      }
    },
    desc: {
      type: "string"
    },
    sub: {
      type: "string"
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  }
});

/***/ }),

/***/ "./src/blocks/Teams/edit.js":
/*!**********************************!*\
  !*** ./src/blocks/Teams/edit.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-sortable-hoc */ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js");
/* harmony import */ var array_move__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! array-move */ "./node_modules/array-move/index.js");










const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.__experimentalInputControl, {
    value: attributes.title_shadow,
    onChange: value => setAttributes({
      title_shadow: value
    }),
    placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\xECm",
    label: "Ti\xEAu \u0111\u1EC1 ch\xECm"
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_5__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  })));
};
const DragHandle = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.sortableHandle)(() => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  className: "admin-buttom-move-item"
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
  class: "dashicons dashicons-move"
})));
const SortableItem = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.SortableElement)(props => {
  const {
    object,
    data_key,
    attributes,
    setAttributes,
    handleDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "box"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => handleDelete(data_key),
    className: "admin-buttom-delete-item btn-about-delete"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-no"
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(DragHandle, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrap"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_6__.ImageUploadSingle, {
    value: object === null || object === void 0 ? void 0 : object.icon,
    onChange: value => {
      if (!value) return false;
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.blocks)];
      atts[data_key] = {
        ...object,
        icon: value
      };
      setAttributes({
        blocks: atts
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h4",
    className: "ttl",
    value: object === null || object === void 0 ? void 0 : object.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "H\u1ECD v\xE0 t\xEAn",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      if (!value) return "";
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.blocks)];
      atts[data_key] = {
        ...object,
        title: value
      };
      setAttributes({
        blocks: atts
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "txt",
    value: object === null || object === void 0 ? void 0 : object.des,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "M\xF4 t\u1EA3",
    keepPlaceholderOnFocus: true,
    onChange: value => {
      if (!value) return "";
      let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.blocks)];
      atts[data_key] = {
        ...object,
        des: value
      };
      setAttributes({
        blocks: atts
      });
    }
  }))));
});
const SortableList = (0,react_sortable_hoc__WEBPACK_IMPORTED_MODULE_7__.SortableContainer)(props => {
  const {
    items,
    attributes,
    setAttributes,
    handleDelete
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper"
  }, items && items.map((object, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableItem, {
      key: `item-${index}`,
      value: object,
      object: object,
      index: index,
      data_key: index,
      attributes: attributes,
      setAttributes: setAttributes,
      handleDelete: handleDelete
    });
  }));
});
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  const handleAdd = () => {
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.blocks)];
    atts.push({
      icon: {
        url: "",
        id: "",
        alt: ""
      },
      title: "",
      des: ""
    });
    setAttributes({
      blocks: atts
    });
  };
  const handleDelete = index => {
    let atts = [...(attributes === null || attributes === void 0 ? void 0 : attributes.blocks)];
    atts.splice(index, 1);
    setAttributes({
      blocks: atts
    });
  };
  const handlerOnSortEnd = _ref3 => {
    let {
      oldIndex,
      newIndex
    } = _ref3;
    let blocks = [...(attributes === null || attributes === void 0 ? void 0 : attributes.blocks)];
    setAttributes({
      blocks: (0,array_move__WEBPACK_IMPORTED_MODULE_8__.arrayMoveImmutable)(blocks, oldIndex, newIndex)
    });
  };
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_5__.processConfig)(attributes.config);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block block-teams ",
    style: (data === null || data === void 0 ? void 0 : data.style_block) || {}
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "title text-center"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h3",
    className: "ttl",
    value: attributes.title,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    placeholder: "Title",
    keepPlaceholderOnFocus: true,
    onChange: value => setAttributes({
      title: value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "shadow"
  }, attributes.title_shadow)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(SortableList, {
    items: attributes === null || attributes === void 0 ? void 0 : attributes.blocks,
    onSortEnd: handlerOnSortEnd,
    axis: "xy",
    helperClass: "hold-item-teams",
    hideSortableGhost: true,
    lockOffset: ["100%"],
    useDragHandle: true,
    attributes: attributes,
    setAttributes: setAttributes,
    handleDelete: handleDelete
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "btn-about-add",
    onClick: handleAdd
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-plus"
  })))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/Teams/index.js":
/*!***********************************!*\
  !*** ./src/blocks/Teams/index.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/Teams/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/blocks/Teams/edit.js");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("create-block/teams", {
  title: "Leadership",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-buddicons-buddypress-logo",
  attributes: {
    title: {
      type: "string",
      default: "<strong>Meet Our Leadership Team</strong>"
    },
    title_shadow: {
      type: "string",
      default: "Team"
    },
    blocks: {
      type: "array",
      default: [{
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img01.png",
          id: "",
          alt: ""
        },
        title: "<strong>Dang Dieu Linh</strong>",
        des: "VIETIS President & CEO"
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img02.png",
          id: "",
          alt: ""
        },
        title: "<strong>Nguyen Ngoc Tan</strong>",
        des: "VIETIS Vice-Director & VIETIS Solution President"
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img03.png",
          id: "",
          alt: ""
        },
        title: "<strong>Nguyen Truong Giang</strong>",
        des: "VIETIS CPO & VIETIS Solution CEO"
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img04.png",
          id: "",
          alt: ""
        },
        title: "<strong>Tran Tri Dung</strong>",
        des: "VIETIS COO & QA Manager"
      }, {
        icon: {
          url: PV_Admin.PV_BASE_URL + "/assets/img/blocks/leadership/leadership_img05.png",
          id: "",
          alt: ""
        },
        title: "<strong>Le Tuan Anh</strong>",
        des: "VIETIS BU2 Director"
      }]
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"],
  save: () => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null);
  }
});

/***/ }),

/***/ "./src/blocks/TheFox/edit.js":
/*!***********************************!*\
  !*** ./src/blocks/TheFox/edit.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/define */ "./src/config/define.js");
/* harmony import */ var _components_image_upload__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/image-upload */ "./src/components/image-upload.js");
/* harmony import */ var _components_config_block__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/config-block */ "./src/components/config-block.js");








const Control = function (_ref) {
  let {
    props
  } = _ref;
  const {
    attributes,
    setAttributes
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
    key: "settting"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh chung",
    initialOpen: true
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "C\u1EA5u h\xECnh block",
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_config_block__WEBPACK_IMPORTED_MODULE_6__.ConfigBlock, {
    data: attributes,
    setData: setAttributes
  }))));
};
const FragmentBlock = function (_ref2) {
  let {
    props
  } = _ref2;
  const {
    attributes,
    setAttributes
  } = props;
  let data = (0,_components_config_block__WEBPACK_IMPORTED_MODULE_6__.processConfig)(attributes.config);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "block block-thefox"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "holder"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "wrapper"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "content"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "h4",
    className: "title",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.title,
    onChange: value => {
      setAttributes({
        title: value
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "p",
    className: "desc",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.desc,
    allowedFormats: _config_define__WEBPACK_IMPORTED_MODULE_4__.ALLOWED_FORMATS,
    onChange: value => {
      setAttributes({
        desc: value
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "image"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_image_upload__WEBPACK_IMPORTED_MODULE_5__.ImageUploadSingle, {
    className: "img",
    value: attributes === null || attributes === void 0 ? void 0 : attributes.image,
    onChange: value => {
      setAttributes({
        image: value
      });
    }
  }))))));
};
function Edit(props) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Control, {
    props: props
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(FragmentBlock, {
    props: props
  }));
}

/***/ }),

/***/ "./src/blocks/TheFox/index.js":
/*!************************************!*\
  !*** ./src/blocks/TheFox/index.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/blocks/TheFox/edit.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/TheFox/style.scss");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)("create-block/the-fox", {
  title: "The Fox",
  description: "Example block scaffolded with Create Block tool.",
  category: "vietis",
  icon: "dashicons dashicons-book",
  attributes: {
    title: {
      type: "string",
      default: "<strong><span class = 'color'>The Fox</span> - The Mascot Of VietIS</strong>"
    },
    image: {
      type: "object",
      default: {
        id: "",
        url: PV_Admin.PV_BASE_URL + '/assets/img/blocks/thefox/the-fox.png',
        alt: ""
      }
    },
    desc: {
      type: "string",
      default: "In Japanese Culture, the Fox is believed to be the messenger of the Inari God, the protector of rice cultivation. The fox is so flexible and intelligent that it can distinguish good and bad people based on their daily behaviors. Moreover, this sacred animal can wholeheartedly help people to fulfill their dreams with its magic and bring  good luck to them<br>" + "<br>We chose the Fox as the Mascot of our company because VietIS and the Fox share the same characteristics. They are flexibility, devotion, and bringing good luck to the people they serve.<br>" + "<br><strong><span class = 'color'>Flexibility</span></strong>: We are flexible not only in the delivery process but also in ensuring our contracts can meet our customer’s requirements. Moreover, different resources will be allocated and utilized to meet the specific demands of our customers.<br>" + "<br><strong><span class = 'color'>Devotion</span></strong>: Our team always tries their best to complete the projects on time and on budget by using the most advanced technology available. Our skilled engineers are required to constantly update their knowledge and improve their technical skills to ensure the best outcomes.<br>" + "<br><strong><span class = 'color'>Good luck charm</span></strong>: Our services have aided many organizations in digitally transformation for their business. It is estimated that 70% of customers using VietIS products and services have witnessed rapid growth in their businesses. We attribute this to the luck of our Inari fox."
    },
    config: {
      type: "object",
      default: {}
    }
  },
  example: {},
  getEditWrapperProps() {
    return {
      "data-align": "full"
    };
  },
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/components/color-control.js":
/*!*****************************************!*\
  !*** ./src/components/color-control.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseColorControl": function() { return /* binding */ BaseColorControl; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);


// import { useState, useEffect } from "@wordpress/element";

function BaseColorControl(props) {
  const {
    onChange,
    value,
    position,
    colors
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "admin-color-control",
    style: {
      "--color": value
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Dropdown, {
    contentClassName: "admin-wrap",
    position: position ? position : "bottom right",
    renderToggle: _ref => {
      let {
        isOpen,
        onToggle
      } = _ref;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        className: "button-color",
        variant: "primary",
        onClick: onToggle,
        "aria-expanded": isOpen
      });
    },
    renderContent: () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPaletteControl, {
      colors: colors,
      value: value,
      onChange: value => onChange(value)
    })
  }));
}

/***/ }),

/***/ "./src/components/config-block.js":
/*!****************************************!*\
  !*** ./src/components/config-block.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConfigBlock": function() { return /* binding */ ConfigBlock; },
/* harmony export */   "processConfig": function() { return /* binding */ processConfig; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_define__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config/define */ "./src/config/define.js");
/* harmony import */ var _image_upload__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./image-upload */ "./src/components/image-upload.js");







function processConfig(config) {
  if (!config) return {};
  let data = {};
  data.style_block = {};
  if ((config === null || config === void 0 ? void 0 : config.bg_method) == "color" && config !== null && config !== void 0 && config.bg_color) {
    data.style_block.backgroundColor = config === null || config === void 0 ? void 0 : config.bg_color;
  }
  if ((config === null || config === void 0 ? void 0 : config.bg_method) == "gradient" && config !== null && config !== void 0 && config.bg_gradient) {
    data.style_block.background = config === null || config === void 0 ? void 0 : config.bg_gradient;
  }
  if ((config === null || config === void 0 ? void 0 : config.bg_method) == "image" && config !== null && config !== void 0 && config.bg_image) {
    var _config$bg_image$;
    if (config !== null && config !== void 0 && config.backgroundSize) data.style_block.backgroundSize = config === null || config === void 0 ? void 0 : config.backgroundSize;
    if (config !== null && config !== void 0 && config.backgroundPosition) data.style_block.backgroundPosition = config === null || config === void 0 ? void 0 : config.backgroundPosition;
    if (config !== null && config !== void 0 && config.backgroundRepeat) data.style_block.backgroundRepeat = config === null || config === void 0 ? void 0 : config.backgroundRepeat;
    data.style_block.backgroundImage = "url(" + (config === null || config === void 0 ? void 0 : (_config$bg_image$ = config.bg_image[0]) === null || _config$bg_image$ === void 0 ? void 0 : _config$bg_image$.url) + ")";
  }
  if (config !== null && config !== void 0 && config.margin) {
    let margin = config === null || config === void 0 ? void 0 : config.margin;
    if (margin !== null && margin !== void 0 && margin.top) data.style_block.marginTop = margin === null || margin === void 0 ? void 0 : margin.top;
    if (margin !== null && margin !== void 0 && margin.right) data.style_block.marginRight = margin === null || margin === void 0 ? void 0 : margin.right;
    if (margin !== null && margin !== void 0 && margin.bottom) data.style_block.marginBottom = margin === null || margin === void 0 ? void 0 : margin.bottom;
    if (margin !== null && margin !== void 0 && margin.left) data.style_block.marginLeft = margin === null || margin === void 0 ? void 0 : margin.left;
  }
  if (config !== null && config !== void 0 && config.padding) {
    let padding = config === null || config === void 0 ? void 0 : config.padding;
    if (padding !== null && padding !== void 0 && padding.top) data.style_block.paddingTop = padding === null || padding === void 0 ? void 0 : padding.top;
    if (padding !== null && padding !== void 0 && padding.right) data.style_block.paddingRight = padding === null || padding === void 0 ? void 0 : padding.right;
    if (padding !== null && padding !== void 0 && padding.bottom) data.style_block.paddingBottom = padding === null || padding === void 0 ? void 0 : padding.bottom;
    if (padding !== null && padding !== void 0 && padding.left) data.style_block.paddingLeft = padding === null || padding === void 0 ? void 0 : padding.left;
  }

  // console.log(config);

  return data;
}
function ConfigBlock(props) {
  var _data$config10, _data$config11, _data$config12;
  const {
    data,
    setData
  } = props;

  // const [gradient, setGradient] = useState(null);

  if ((data === null || data === void 0 ? void 0 : data.config) === undefined) return "";

  // useEffect(() => {
  // 	setData({
  // 		config: {
  // 			...data.config,
  // 			bg_gradient: gradient,
  // 		},
  // 	})
  // }, [gradient])

  const BackgroundColor = () => {
    var _data$config, _data$config2;
    if (((_data$config = data.config) === null || _data$config === void 0 ? void 0 : _data$config.bg_method) != "color") return "";
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPaletteControl, {
      value: (_data$config2 = data.config) === null || _data$config2 === void 0 ? void 0 : _data$config2.bg_color,
      onChange: value => setData({
        config: {
          ...data.config,
          bg_color: value
        }
      })
    });
  };
  const BackgroundGradient = () => {
    var _data$config3, _data$config4;
    if (((_data$config3 = data.config) === null || _data$config3 === void 0 ? void 0 : _data$config3.bg_method) != "gradient") return "";
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.GradientPicker, {
      __nextHasNoMargin: true,
      value: (_data$config4 = data.config) === null || _data$config4 === void 0 ? void 0 : _data$config4.bg_gradient,
      onChange: value => setData({
        config: {
          ...data.config,
          bg_gradient: value
        }
      }),
      gradients: [{
        name: "JShine",
        gradient: "linear-gradient(135deg,#12c2e9 0%,#c471ed 50%,#f64f59 100%)",
        slug: "jshine"
      }, {
        name: "Moonlit Asteroid",
        gradient: "linear-gradient(135deg,#0F2027 0%, #203A43 0%, #2c5364 100%)",
        slug: "moonlit-asteroid"
      }, {
        name: "Rastafarie",
        gradient: "linear-gradient(135deg,#1E9600 0%, #FFF200 0%, #FF0000 100%)",
        slug: "rastafari"
      }]
    });
  };
  let BACKGROUND_SIZE = [{
    label: "Auto",
    value: "auto"
  }, {
    label: "Contain",
    value: "contain"
  }, {
    label: "Cover",
    value: "cover"
  }];
  let BACKGROUND_POSITION = [{
    label: "left top",
    value: "left top"
  }, {
    label: "left center",
    value: "left center"
  }, {
    label: "left bottom",
    value: "left bottom"
  }, {
    label: "center top",
    value: "center top"
  }, {
    label: "center center",
    value: "center center"
  }, {
    label: "right top",
    value: "right top"
  }, {
    label: "right center",
    value: "right center"
  }, {
    label: "right bottom",
    value: "right bottom"
  }];
  let BACKGROUND_REPEAT = [{
    label: "No Repeat",
    value: "no-repeat"
  }, {
    label: "Repeat",
    value: "repeat"
  }, {
    label: "Repeat X",
    value: "repeat-x"
  }, {
    label: "Repeat Y",
    value: "repeat-y"
  }];
  const BackgroundImage = () => {
    var _data$config5, _data$config6, _data$config7, _data$config8, _data$config9;
    if (((_data$config5 = data.config) === null || _data$config5 === void 0 ? void 0 : _data$config5.bg_method) != "image") return "";
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_image_upload__WEBPACK_IMPORTED_MODULE_4__.ImageUpload, {
      value: (_data$config6 = data.config) === null || _data$config6 === void 0 ? void 0 : _data$config6.bg_image,
      multiple: false,
      onChange: value => setData({
        config: {
          ...data.config,
          bg_image: value
        }
      })
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "mb-3"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
      label: "BACKGROUND SIZE",
      value: (_data$config7 = data.config) === null || _data$config7 === void 0 ? void 0 : _data$config7.backgroundSize,
      options: BACKGROUND_SIZE,
      onChange: value => setData({
        config: {
          ...data.config,
          backgroundSize: value
        }
      })
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "mb-3"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
      label: "BACKGROUND POSITION",
      value: (_data$config8 = data.config) === null || _data$config8 === void 0 ? void 0 : _data$config8.backgroundPosition,
      options: BACKGROUND_POSITION,
      onChange: value => setData({
        config: {
          ...data.config,
          backgroundPosition: value
        }
      })
    })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "mb-3"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
      label: "BACKGROUND REPEAT",
      value: (_data$config9 = data.config) === null || _data$config9 === void 0 ? void 0 : _data$config9.backgroundRepeat,
      options: BACKGROUND_REPEAT,
      onChange: value => setData({
        config: {
          ...data.config,
          backgroundRepeat: value
        }
      })
    })));
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalBoxControl, {
    values: data === null || data === void 0 ? void 0 : (_data$config10 = data.config) === null || _data$config10 === void 0 ? void 0 : _data$config10.margin,
    label: "Margin",
    onChange: value => setData({
      config: {
        ...data.config,
        margin: value
      }
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalBoxControl, {
    values: data === null || data === void 0 ? void 0 : (_data$config11 = data.config) === null || _data$config11 === void 0 ? void 0 : _data$config11.padding,
    label: "Padding",
    onChange: value => setData({
      config: {
        ...data.config,
        padding: value
      }
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
    label: "Background",
    value: (_data$config12 = data.config) === null || _data$config12 === void 0 ? void 0 : _data$config12.bg_method,
    options: _config_define__WEBPACK_IMPORTED_MODULE_3__.BACKGROUND,
    onChange: value => setData({
      config: {
        ...data.config,
        bg_method: value
      }
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-3"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(BackgroundColor, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(BackgroundGradient, null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(BackgroundImage, null)));
}

/***/ }),

/***/ "./src/components/image-bg-upload.js":
/*!*******************************************!*\
  !*** ./src/components/image-bg-upload.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImageBgUpload": function() { return /* binding */ ImageBgUpload; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);



function ImageBgUpload(props) {
  const {
    onChange,
    handleDeleteImage,
    value,
    className
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
    onSelect: onChange,
    allowedTypes: "image",
    render: obj => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: className,
      style: {
        padding: value ? "0px" : "30px"
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      style: value ? {
        margin: "15px"
      } : {},
      onClick: obj.open
    }, value ? "Đổi ảnh" : "Chọn ảnh"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      style: value ? {
        display: "inline-block",
        margin: "15px"
      } : {
        display: "none"
      },
      onClick: handleDeleteImage
    }, "Xóa ảnh"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      class: "wrap-img"
    }, value ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      src: value,
      alt: ""
    }) : ""))
  }));
}

/***/ }),

/***/ "./src/components/image-upload.js":
/*!****************************************!*\
  !*** ./src/components/image-upload.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImageUpload": function() { return /* binding */ ImageUpload; },
/* harmony export */   "ImageUploadSingle": function() { return /* binding */ ImageUploadSingle; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);


function ImageUpload(props) {
  const {
    onChange,
    multiple,
    value,
    onDelete,
    label
  } = props;
  const onSelect = media => {
    if (!media) return;
    let images = [];
    if (multiple) {
      media.map(image => {
        images.push({
          url: image.url,
          alt: image.alt,
          id: image.id
        });
      });
      return onChange(images);
    }
    images.push({
      url: media.url,
      alt: media.alt,
      id: media.id
    });
    return onChange(images);
  };
  var image_ids = [];
  if (value && value !== null && value !== void 0 && value.length) {
    value.filter(image => {
      return image === null || image === void 0 ? void 0 : image.id;
    }).map((image, index) => {
      image_ids.push(image.id);
    });
  }
  let classWrap = "wrapper-images-list";
  if (!multiple) classWrap += " single ";
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
    onSelect: onSelect,
    multiple: multiple,
    gallery: multiple,
    value: image_ids,
    render: _ref => {
      let {
        open
      } = _ref;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: classWrap
      }, label && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
        className: "title"
      }, label), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "images-list"
      }, value && value.map((image, index) => {
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "item",
          onClick: open
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "wrap"
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
          src: image.url,
          alt: image.url
        })));
      }), (!value || multiple) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "item button-add",
        onClick: open
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "wrap"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
        className: "add"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        class: "dashicons dashicons-plus-alt"
      }))))));
    }
  });
}
function ImageUploadSingle(props) {
  const {
    onChange,
    value,
    onDelete,
    className
  } = props;
  const onSelect = media => {
    if (!media) return;
    let images = {
      url: media.url,
      alt: media.alt,
      id: media.id
    };
    return onChange(images);
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
    onSelect: onSelect,
    multiple: false,
    gallery: false,
    value: value === null || value === void 0 ? void 0 : value.id,
    render: _ref2 => {
      let {
        open
      } = _ref2;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (value === null || value === void 0 ? void 0 : value.url) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
        src: value === null || value === void 0 ? void 0 : value.url,
        alt: value === null || value === void 0 ? void 0 : value.alt,
        className: className,
        onClick: open
      }), !(value !== null && value !== void 0 && value.url) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
        className: "add-media",
        onClick: open
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        class: "dashicons dashicons-format-image"
      })));
    }
  });
}

/***/ }),

/***/ "./src/components/input-link.js":
/*!**************************************!*\
  !*** ./src/components/input-link.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InputLink": function() { return /* binding */ InputLink; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);



function InputLink(props) {
  const {
    onChange,
    value
  } = props;
  const [showInput, setShowInput] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "admin-input-link"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "admin-input-btn"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    className: "admin-buttom-link-item",
    onClick: () => setShowInput(!showInput)
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    class: "dashicons dashicons-admin-links"
  }))), showInput ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "admin-input-inpt"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalInputControl, {
    value: value,
    onChange: value => onChange(value)
  })) : "");
}

/***/ }),

/***/ "./src/components/video-upload.js":
/*!****************************************!*\
  !*** ./src/components/video-upload.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VideoUploadSingle": function() { return /* binding */ VideoUploadSingle; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);



function VideoUploadSingle(props) {
  const {
    onChange,
    handleDeleteVideo,
    value,
    className
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
    onSelect: onChange,
    allowedTypes: "video",
    render: obj => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: className,
      style: {
        padding: value ? "0px" : "30px"
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      style: value ? {
        margin: "15px"
      } : {},
      onClick: obj.open
    }, value ? "Đổi video" : "Chọn video"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      style: value ? {
        display: "inline-block",
        margin: "15px"
      } : {
        display: "none"
      },
      onClick: handleDeleteVideo
    }, "Xóa video"), value ? (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("video", {
      controls: true
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("source", {
      src: value,
      type: "video/mp4"
    })) : "")
  }));
}

/***/ }),

/***/ "./src/config/define.js":
/*!******************************!*\
  !*** ./src/config/define.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ALLOWED_FORMATS": function() { return /* binding */ ALLOWED_FORMATS; },
/* harmony export */   "BACKGROUND": function() { return /* binding */ BACKGROUND; },
/* harmony export */   "BACKGROUNDCSS": function() { return /* binding */ BACKGROUNDCSS; },
/* harmony export */   "ORDER": function() { return /* binding */ ORDER; },
/* harmony export */   "ORDER_BY_FIELD": function() { return /* binding */ ORDER_BY_FIELD; },
/* harmony export */   "POSTTYPE_POST": function() { return /* binding */ POSTTYPE_POST; }
/* harmony export */ });
const POSTTYPE_POST = [{
  label: "Bài viết",
  value: "post"
}, {
  label: "Dịch vụ",
  value: "service"
}];
const ORDER_BY_FIELD = [{
  label: "ID",
  value: "ID"
}, {
  label: "Tiêu đề",
  value: "title"
}, {
  label: "Ngày tháng",
  value: "date"
}, {
  label: "Ngẫu nhiên",
  value: "rand"
}];
const ORDER = [{
  label: "Tăng dần",
  value: "ASC"
}, {
  label: "Giảm dần",
  value: "DESC"
}];
const ALLOWED_FORMATS = ["core/text-color", "core/bold", "core/italic", "core/link", "core/strikethrough"];
const BACKGROUND = [{
  label: "Mặc định",
  value: ""
}, {
  label: "Màu nền",
  value: "color"
}, {
  label: "Màu gradient",
  value: "gradient"
}, {
  label: "Hình nền",
  value: "image"
}];
const BACKGROUNDCSS = [{
  label: "background-position",
  value: "top"
}, {
  label: "background-repeat",
  value: "no-repeat"
}];

/***/ }),

/***/ "./src/services/api-fetch.js":
/*!***********************************!*\
  !*** ./src/services/api-fetch.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "axiosFetch": function() { return /* binding */ axiosFetch; }
/* harmony export */ });
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);


function axiosFetch(data) {
  return axios__WEBPACK_IMPORTED_MODULE_1___default()({
    url: PV_Admin.PV_URL_AJAX,
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    data: data
  });
}

/***/ }),

/***/ "./node_modules/invariant/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/invariant/browser.js ***!
  \*******************************************/
/***/ (function(module) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (true) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;


/***/ }),

/***/ "./src/blocks/AboutBanner/style.scss":
/*!*******************************************!*\
  !*** ./src/blocks/AboutBanner/style.scss ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/About/style.scss":
/*!*************************************!*\
  !*** ./src/blocks/About/style.scss ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/BannerCommon/style.scss":
/*!********************************************!*\
  !*** ./src/blocks/BannerCommon/style.scss ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/BannerNewImg/style.scss":
/*!********************************************!*\
  !*** ./src/blocks/BannerNewImg/style.scss ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/BannerNew/style.scss":
/*!*****************************************!*\
  !*** ./src/blocks/BannerNew/style.scss ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/BannerServicePage/style.scss":
/*!*************************************************!*\
  !*** ./src/blocks/BannerServicePage/style.scss ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Banner/style.scss":
/*!**************************************!*\
  !*** ./src/blocks/Banner/style.scss ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/BlockChain/style.scss":
/*!******************************************!*\
  !*** ./src/blocks/BlockChain/style.scss ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/BlogFeatured/style.scss":
/*!********************************************!*\
  !*** ./src/blocks/BlogFeatured/style.scss ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/BlogTags/style.scss":
/*!****************************************!*\
  !*** ./src/blocks/BlogTags/style.scss ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/CaseStudy/style.scss":
/*!*****************************************!*\
  !*** ./src/blocks/CaseStudy/style.scss ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Certificate/style.scss":
/*!*******************************************!*\
  !*** ./src/blocks/Certificate/style.scss ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Clients/style.scss":
/*!***************************************!*\
  !*** ./src/blocks/Clients/style.scss ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/DevelopingMobile/style.scss":
/*!************************************************!*\
  !*** ./src/blocks/DevelopingMobile/style.scss ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/DevelopmentBenefit/style.scss":
/*!**************************************************!*\
  !*** ./src/blocks/DevelopmentBenefit/style.scss ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/DevelopmentOurProcess/style.scss":
/*!*****************************************************!*\
  !*** ./src/blocks/DevelopmentOurProcess/style.scss ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/FeatureServicePage/style.scss":
/*!**************************************************!*\
  !*** ./src/blocks/FeatureServicePage/style.scss ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Feature/style.scss":
/*!***************************************!*\
  !*** ./src/blocks/Feature/style.scss ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Feedback/style.scss":
/*!****************************************!*\
  !*** ./src/blocks/Feedback/style.scss ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/FunctionList/style.scss":
/*!********************************************!*\
  !*** ./src/blocks/FunctionList/style.scss ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Guarantee/style.scss":
/*!*****************************************!*\
  !*** ./src/blocks/Guarantee/style.scss ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Leadership/style.scss":
/*!******************************************!*\
  !*** ./src/blocks/Leadership/style.scss ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Outsource/style.scss":
/*!*****************************************!*\
  !*** ./src/blocks/Outsource/style.scss ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Overview/style.scss":
/*!****************************************!*\
  !*** ./src/blocks/Overview/style.scss ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Process/style.scss":
/*!***************************************!*\
  !*** ./src/blocks/Process/style.scss ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Product/VISInsight/Banner/style.scss":
/*!*********************************************************!*\
  !*** ./src/blocks/Product/VISInsight/Banner/style.scss ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Product/VISInsight/Overview/style.scss":
/*!***********************************************************!*\
  !*** ./src/blocks/Product/VISInsight/Overview/style.scss ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Product/Veramine/Banner/style.scss":
/*!*******************************************************!*\
  !*** ./src/blocks/Product/Veramine/Banner/style.scss ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Product/Veramine/Overview/style.scss":
/*!*********************************************************!*\
  !*** ./src/blocks/Product/Veramine/Overview/style.scss ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Product/Veramine/Technology/style.scss":
/*!***********************************************************!*\
  !*** ./src/blocks/Product/Veramine/Technology/style.scss ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/ServiceHead/style.scss":
/*!*******************************************!*\
  !*** ./src/blocks/ServiceHead/style.scss ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/ServiceNew/style.scss":
/*!******************************************!*\
  !*** ./src/blocks/ServiceNew/style.scss ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Services/style.scss":
/*!****************************************!*\
  !*** ./src/blocks/Services/style.scss ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/Teams/style.scss":
/*!*************************************!*\
  !*** ./src/blocks/Teams/style.scss ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/TheFox/style.scss":
/*!**************************************!*\
  !*** ./src/blocks/TheFox/style.scss ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/***/ (function(module) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js":
/*!************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bigint: createPrimitiveTypeChecker('bigint'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message, data) {
    this.message = message;
    this.data = data && typeof data === 'object' ? data: {};
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError(
          'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
          {expectedType: expectedType}
        );
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (true) {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      var expectedTypes = [];
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
        if (checkerResult == null) {
          return null;
        }
        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
          expectedTypes.push(checkerResult.data.expectedType);
        }
      }
      var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function invalidValidatorError(componentName, location, propFullName, key, type) {
    return new PropTypeError(
      (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
      'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
    );
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (has(shapeTypes, key) && typeof checker !== 'function') {
          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
        }
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "./node_modules/prop-types/index.js":
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "./node_modules/react-is/index.js");

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "./node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/***/ (function(module) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/prop-types/lib/has.js":
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
/***/ (function(module) {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/react-is/cjs/react-is.development.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ }),

/***/ "./node_modules/react-is/index.js":
/*!****************************************!*\
  !*** ./node_modules/react-is/index.js ***!
  \****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "./node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js":
/*!************************************************************************!*\
  !*** ./node_modules/react-sortable-hoc/dist/react-sortable-hoc.esm.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SortableContainer": function() { return /* binding */ sortableContainer; },
/* harmony export */   "SortableElement": function() { return /* binding */ sortableElement; },
/* harmony export */   "SortableHandle": function() { return /* binding */ sortableHandle; },
/* harmony export */   "arrayMove": function() { return /* binding */ arrayMove; },
/* harmony export */   "sortableContainer": function() { return /* binding */ sortableContainer; },
/* harmony export */   "sortableElement": function() { return /* binding */ sortableElement; },
/* harmony export */   "sortableHandle": function() { return /* binding */ sortableHandle; }
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectSpread */ "./node_modules/@babel/runtime/helpers/esm/objectSpread.js");
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var invariant__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! invariant */ "./node_modules/invariant/browser.js");
/* harmony import */ var invariant__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(invariant__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @babel/runtime/helpers/esm/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_14__);
















var Manager = function () {
  function Manager() {
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__["default"])(this, Manager);

    (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])(this, "refs", {});
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(Manager, [{
    key: "add",
    value: function add(collection, ref) {
      if (!this.refs[collection]) {
        this.refs[collection] = [];
      }

      this.refs[collection].push(ref);
    }
  }, {
    key: "remove",
    value: function remove(collection, ref) {
      var index = this.getIndex(collection, ref);

      if (index !== -1) {
        this.refs[collection].splice(index, 1);
      }
    }
  }, {
    key: "isActive",
    value: function isActive() {
      return this.active;
    }
  }, {
    key: "getActive",
    value: function getActive() {
      var _this = this;

      return this.refs[this.active.collection].find(function (_ref) {
        var node = _ref.node;
        return node.sortableInfo.index == _this.active.index;
      });
    }
  }, {
    key: "getIndex",
    value: function getIndex(collection, ref) {
      return this.refs[collection].indexOf(ref);
    }
  }, {
    key: "getOrderedRefs",
    value: function getOrderedRefs() {
      var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.active.collection;
      return this.refs[collection].sort(sortByIndex);
    }
  }]);

  return Manager;
}();

function sortByIndex(_ref2, _ref3) {
  var index1 = _ref2.node.sortableInfo.index;
  var index2 = _ref3.node.sortableInfo.index;
  return index1 - index2;
}

function arrayMove(array, from, to) {
  if (true) {
    if (typeof console !== 'undefined') {
      console.warn("Deprecation warning: arrayMove will no longer be exported by 'react-sortable-hoc' in the next major release. Please install the `array-move` package locally instead. https://www.npmjs.com/package/array-move");
    }
  }

  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
  return array;
}
function omit(obj, keysToOmit) {
  return Object.keys(obj).reduce(function (acc, key) {
    if (keysToOmit.indexOf(key) === -1) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
}
var events = {
  end: ['touchend', 'touchcancel', 'mouseup'],
  move: ['touchmove', 'mousemove'],
  start: ['touchstart', 'mousedown']
};
var vendorPrefix = function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return '';
  }

  var styles = window.getComputedStyle(document.documentElement, '') || ['-moz-hidden-iframe'];
  var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1];

  switch (pre) {
    case 'ms':
      return 'ms';

    default:
      return pre && pre.length ? pre[0].toUpperCase() + pre.substr(1) : '';
  }
}();
function setInlineStyles(node, styles) {
  Object.keys(styles).forEach(function (key) {
    node.style[key] = styles[key];
  });
}
function setTranslate3d(node, translate) {
  node.style["".concat(vendorPrefix, "Transform")] = translate == null ? '' : "translate3d(".concat(translate.x, "px,").concat(translate.y, "px,0)");
}
function setTransitionDuration(node, duration) {
  node.style["".concat(vendorPrefix, "TransitionDuration")] = duration == null ? '' : "".concat(duration, "ms");
}
function closest(el, fn) {
  while (el) {
    if (fn(el)) {
      return el;
    }

    el = el.parentNode;
  }

  return null;
}
function limit(min, max, value) {
  return Math.max(min, Math.min(value, max));
}

function getPixelValue(stringValue) {
  if (stringValue.substr(-2) === 'px') {
    return parseFloat(stringValue);
  }

  return 0;
}

function getElementMargin(element) {
  var style = window.getComputedStyle(element);
  return {
    bottom: getPixelValue(style.marginBottom),
    left: getPixelValue(style.marginLeft),
    right: getPixelValue(style.marginRight),
    top: getPixelValue(style.marginTop)
  };
}
function provideDisplayName(prefix, Component$$1) {
  var componentName = Component$$1.displayName || Component$$1.name;
  return componentName ? "".concat(prefix, "(").concat(componentName, ")") : prefix;
}
function getScrollAdjustedBoundingClientRect(node, scrollDelta) {
  var boundingClientRect = node.getBoundingClientRect();
  return {
    top: boundingClientRect.top + scrollDelta.top,
    left: boundingClientRect.left + scrollDelta.left
  };
}
function getPosition(event) {
  if (event.touches && event.touches.length) {
    return {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY
    };
  } else if (event.changedTouches && event.changedTouches.length) {
    return {
      x: event.changedTouches[0].pageX,
      y: event.changedTouches[0].pageY
    };
  } else {
    return {
      x: event.pageX,
      y: event.pageY
    };
  }
}
function isTouchEvent(event) {
  return event.touches && event.touches.length || event.changedTouches && event.changedTouches.length;
}
function getEdgeOffset(node, parent) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    left: 0,
    top: 0
  };

  if (!node) {
    return undefined;
  }

  var nodeOffset = {
    left: offset.left + node.offsetLeft,
    top: offset.top + node.offsetTop
  };

  if (node.parentNode === parent) {
    return nodeOffset;
  }

  return getEdgeOffset(node.parentNode, parent, nodeOffset);
}
function getTargetIndex(newIndex, prevIndex, oldIndex) {
  if (newIndex < oldIndex && newIndex > prevIndex) {
    return newIndex - 1;
  } else if (newIndex > oldIndex && newIndex < prevIndex) {
    return newIndex + 1;
  } else {
    return newIndex;
  }
}
function getLockPixelOffset(_ref) {
  var lockOffset = _ref.lockOffset,
      width = _ref.width,
      height = _ref.height;
  var offsetX = lockOffset;
  var offsetY = lockOffset;
  var unit = 'px';

  if (typeof lockOffset === 'string') {
    var match = /^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(lockOffset);
    invariant__WEBPACK_IMPORTED_MODULE_12___default()(match !== null, 'lockOffset value should be a number or a string of a ' + 'number followed by "px" or "%". Given %s', lockOffset);
    offsetX = parseFloat(lockOffset);
    offsetY = parseFloat(lockOffset);
    unit = match[1];
  }

  invariant__WEBPACK_IMPORTED_MODULE_12___default()(isFinite(offsetX) && isFinite(offsetY), 'lockOffset value should be a finite. Given %s', lockOffset);

  if (unit === '%') {
    offsetX = offsetX * width / 100;
    offsetY = offsetY * height / 100;
  }

  return {
    x: offsetX,
    y: offsetY
  };
}
function getLockPixelOffsets(_ref2) {
  var height = _ref2.height,
      width = _ref2.width,
      lockOffset = _ref2.lockOffset;
  var offsets = Array.isArray(lockOffset) ? lockOffset : [lockOffset, lockOffset];
  invariant__WEBPACK_IMPORTED_MODULE_12___default()(offsets.length === 2, 'lockOffset prop of SortableContainer should be a single ' + 'value or an array of exactly two values. Given %s', lockOffset);

  var _offsets = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(offsets, 2),
      minLockOffset = _offsets[0],
      maxLockOffset = _offsets[1];

  return [getLockPixelOffset({
    height: height,
    lockOffset: minLockOffset,
    width: width
  }), getLockPixelOffset({
    height: height,
    lockOffset: maxLockOffset,
    width: width
  })];
}

function isScrollable(el) {
  var computedStyle = window.getComputedStyle(el);
  var overflowRegex = /(auto|scroll)/;
  var properties = ['overflow', 'overflowX', 'overflowY'];
  return properties.find(function (property) {
    return overflowRegex.test(computedStyle[property]);
  });
}

function getScrollingParent(el) {
  if (!(el instanceof HTMLElement)) {
    return null;
  } else if (isScrollable(el)) {
    return el;
  } else {
    return getScrollingParent(el.parentNode);
  }
}
function getContainerGridGap(element) {
  var style = window.getComputedStyle(element);

  if (style.display === 'grid') {
    return {
      x: getPixelValue(style.gridColumnGap),
      y: getPixelValue(style.gridRowGap)
    };
  }

  return {
    x: 0,
    y: 0
  };
}
var KEYCODE = {
  TAB: 9,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};
var NodeType = {
  Anchor: 'A',
  Button: 'BUTTON',
  Canvas: 'CANVAS',
  Input: 'INPUT',
  Option: 'OPTION',
  Textarea: 'TEXTAREA',
  Select: 'SELECT'
};
function cloneNode(node) {
  var selector = 'input, textarea, select, canvas, [contenteditable]';
  var fields = node.querySelectorAll(selector);
  var clonedNode = node.cloneNode(true);

  var clonedFields = (0,_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_13__["default"])(clonedNode.querySelectorAll(selector));

  clonedFields.forEach(function (field, i) {
    if (field.type !== 'file') {
      field.value = fields[i].value;
    }

    if (field.type === 'radio' && field.name) {
      field.name = "__sortableClone__".concat(field.name);
    }

    if (field.tagName === NodeType.Canvas && fields[i].width > 0 && fields[i].height > 0) {
      var destCtx = field.getContext('2d');
      destCtx.drawImage(fields[i], 0, 0);
    }
  });
  return clonedNode;
}

function sortableHandle(WrappedComponent) {
  var _class, _temp;

  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    withRef: false
  };
  return _temp = _class = function (_React$Component) {
    (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_7__["default"])(WithSortableHandle, _React$Component);

    function WithSortableHandle() {
      var _getPrototypeOf2;

      var _this;

      (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__["default"])(this, WithSortableHandle);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, (_getPrototypeOf2 = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(WithSortableHandle)).call.apply(_getPrototypeOf2, [this].concat(args)));

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "wrappedInstance", (0,react__WEBPACK_IMPORTED_MODULE_10__.createRef)());

      return _this;
    }

    (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(WithSortableHandle, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var node = (0,react_dom__WEBPACK_IMPORTED_MODULE_11__.findDOMNode)(this);
        node.sortableHandle = true;
      }
    }, {
      key: "getWrappedInstance",
      value: function getWrappedInstance() {
        invariant__WEBPACK_IMPORTED_MODULE_12___default()(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableHandle() call');
        return this.wrappedInstance.current;
      }
    }, {
      key: "render",
      value: function render() {
        var ref = config.withRef ? this.wrappedInstance : null;
        return (0,react__WEBPACK_IMPORTED_MODULE_10__.createElement)(WrappedComponent, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
          ref: ref
        }, this.props));
      }
    }]);

    return WithSortableHandle;
  }(react__WEBPACK_IMPORTED_MODULE_10__.Component), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])(_class, "displayName", provideDisplayName('sortableHandle', WrappedComponent)), _temp;
}
function isSortableHandle(node) {
  return node.sortableHandle != null;
}

var AutoScroller = function () {
  function AutoScroller(container, onScrollCallback) {
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__["default"])(this, AutoScroller);

    this.container = container;
    this.onScrollCallback = onScrollCallback;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(AutoScroller, [{
    key: "clear",
    value: function clear() {
      if (this.interval == null) {
        return;
      }

      clearInterval(this.interval);
      this.interval = null;
    }
  }, {
    key: "update",
    value: function update(_ref) {
      var _this = this;

      var translate = _ref.translate,
          minTranslate = _ref.minTranslate,
          maxTranslate = _ref.maxTranslate,
          width = _ref.width,
          height = _ref.height;
      var direction = {
        x: 0,
        y: 0
      };
      var speed = {
        x: 1,
        y: 1
      };
      var acceleration = {
        x: 10,
        y: 10
      };
      var _this$container = this.container,
          scrollTop = _this$container.scrollTop,
          scrollLeft = _this$container.scrollLeft,
          scrollHeight = _this$container.scrollHeight,
          scrollWidth = _this$container.scrollWidth,
          clientHeight = _this$container.clientHeight,
          clientWidth = _this$container.clientWidth;
      var isTop = scrollTop === 0;
      var isBottom = scrollHeight - scrollTop - clientHeight === 0;
      var isLeft = scrollLeft === 0;
      var isRight = scrollWidth - scrollLeft - clientWidth === 0;

      if (translate.y >= maxTranslate.y - height / 2 && !isBottom) {
        direction.y = 1;
        speed.y = acceleration.y * Math.abs((maxTranslate.y - height / 2 - translate.y) / height);
      } else if (translate.x >= maxTranslate.x - width / 2 && !isRight) {
        direction.x = 1;
        speed.x = acceleration.x * Math.abs((maxTranslate.x - width / 2 - translate.x) / width);
      } else if (translate.y <= minTranslate.y + height / 2 && !isTop) {
        direction.y = -1;
        speed.y = acceleration.y * Math.abs((translate.y - height / 2 - minTranslate.y) / height);
      } else if (translate.x <= minTranslate.x + width / 2 && !isLeft) {
        direction.x = -1;
        speed.x = acceleration.x * Math.abs((translate.x - width / 2 - minTranslate.x) / width);
      }

      if (this.interval) {
        this.clear();
        this.isAutoScrolling = false;
      }

      if (direction.x !== 0 || direction.y !== 0) {
        this.interval = setInterval(function () {
          _this.isAutoScrolling = true;
          var offset = {
            left: speed.x * direction.x,
            top: speed.y * direction.y
          };
          _this.container.scrollTop += offset.top;
          _this.container.scrollLeft += offset.left;

          _this.onScrollCallback(offset);
        }, 5);
      }
    }
  }]);

  return AutoScroller;
}();

function defaultGetHelperDimensions(_ref) {
  var node = _ref.node;
  return {
    height: node.offsetHeight,
    width: node.offsetWidth
  };
}

function defaultShouldCancelStart(event) {
  var interactiveElements = [NodeType.Input, NodeType.Textarea, NodeType.Select, NodeType.Option, NodeType.Button];

  if (interactiveElements.indexOf(event.target.tagName) !== -1) {
    return true;
  }

  if (closest(event.target, function (el) {
    return el.contentEditable === 'true';
  })) {
    return true;
  }

  return false;
}

var propTypes = {
  axis: prop_types__WEBPACK_IMPORTED_MODULE_14___default().oneOf(['x', 'y', 'xy']),
  contentWindow: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().any),
  disableAutoscroll: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().bool),
  distance: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().number),
  getContainer: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().func),
  getHelperDimensions: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().func),
  helperClass: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().string),
  helperContainer: prop_types__WEBPACK_IMPORTED_MODULE_14___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_14___default().func), typeof HTMLElement === 'undefined' ? (prop_types__WEBPACK_IMPORTED_MODULE_14___default().any) : prop_types__WEBPACK_IMPORTED_MODULE_14___default().instanceOf(HTMLElement)]),
  hideSortableGhost: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().bool),
  keyboardSortingTransitionDuration: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().number),
  lockAxis: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().string),
  lockOffset: prop_types__WEBPACK_IMPORTED_MODULE_14___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_14___default().number), (prop_types__WEBPACK_IMPORTED_MODULE_14___default().string), prop_types__WEBPACK_IMPORTED_MODULE_14___default().arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_14___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_14___default().number), (prop_types__WEBPACK_IMPORTED_MODULE_14___default().string)]))]),
  lockToContainerEdges: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().bool),
  onSortEnd: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().func),
  onSortMove: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().func),
  onSortOver: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().func),
  onSortStart: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().func),
  pressDelay: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().number),
  pressThreshold: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().number),
  keyCodes: prop_types__WEBPACK_IMPORTED_MODULE_14___default().shape({
    lift: prop_types__WEBPACK_IMPORTED_MODULE_14___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_14___default().number)),
    drop: prop_types__WEBPACK_IMPORTED_MODULE_14___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_14___default().number)),
    cancel: prop_types__WEBPACK_IMPORTED_MODULE_14___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_14___default().number)),
    up: prop_types__WEBPACK_IMPORTED_MODULE_14___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_14___default().number)),
    down: prop_types__WEBPACK_IMPORTED_MODULE_14___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_14___default().number))
  }),
  shouldCancelStart: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().func),
  transitionDuration: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().number),
  updateBeforeSortStart: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().func),
  useDragHandle: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().bool),
  useWindowAsScrollContainer: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().bool)
};
var defaultKeyCodes = {
  lift: [KEYCODE.SPACE],
  drop: [KEYCODE.SPACE],
  cancel: [KEYCODE.ESC],
  up: [KEYCODE.UP, KEYCODE.LEFT],
  down: [KEYCODE.DOWN, KEYCODE.RIGHT]
};
var defaultProps = {
  axis: 'y',
  disableAutoscroll: false,
  distance: 0,
  getHelperDimensions: defaultGetHelperDimensions,
  hideSortableGhost: true,
  lockOffset: '50%',
  lockToContainerEdges: false,
  pressDelay: 0,
  pressThreshold: 5,
  keyCodes: defaultKeyCodes,
  shouldCancelStart: defaultShouldCancelStart,
  transitionDuration: 300,
  useWindowAsScrollContainer: false
};
var omittedProps = Object.keys(propTypes);
function validateProps(props) {
  invariant__WEBPACK_IMPORTED_MODULE_12___default()(!(props.distance && props.pressDelay), 'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.');
}

function _finallyRethrows(body, finalizer) {
  try {
    var result = body();
  } catch (e) {
    return finalizer(true, e);
  }

  if (result && result.then) {
    return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
  }

  return finalizer(false, value);
}
var SortableContext = (0,react__WEBPACK_IMPORTED_MODULE_10__.createContext)({
  manager: {}
});
function sortableContainer(WrappedComponent) {
  var _class, _temp;

  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    withRef: false
  };
  return _temp = _class = function (_React$Component) {
    (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_7__["default"])(WithSortableContainer, _React$Component);

    function WithSortableContainer(props) {
      var _this;

      (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__["default"])(this, WithSortableContainer);

      _this = (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(WithSortableContainer).call(this, props));

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "state", {});

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "handleStart", function (event) {
        var _this$props = _this.props,
            distance = _this$props.distance,
            shouldCancelStart = _this$props.shouldCancelStart;

        if (event.button === 2 || shouldCancelStart(event)) {
          return;
        }

        _this.touched = true;
        _this.position = getPosition(event);
        var node = closest(event.target, function (el) {
          return el.sortableInfo != null;
        });

        if (node && node.sortableInfo && _this.nodeIsChild(node) && !_this.state.sorting) {
          var useDragHandle = _this.props.useDragHandle;
          var _node$sortableInfo = node.sortableInfo,
              index = _node$sortableInfo.index,
              collection = _node$sortableInfo.collection,
              disabled = _node$sortableInfo.disabled;

          if (disabled) {
            return;
          }

          if (useDragHandle && !closest(event.target, isSortableHandle)) {
            return;
          }

          _this.manager.active = {
            collection: collection,
            index: index
          };

          if (!isTouchEvent(event) && event.target.tagName === NodeType.Anchor) {
            event.preventDefault();
          }

          if (!distance) {
            if (_this.props.pressDelay === 0) {
              _this.handlePress(event);
            } else {
              _this.pressTimer = setTimeout(function () {
                return _this.handlePress(event);
              }, _this.props.pressDelay);
            }
          }
        }
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "nodeIsChild", function (node) {
        return node.sortableInfo.manager === _this.manager;
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "handleMove", function (event) {
        var _this$props2 = _this.props,
            distance = _this$props2.distance,
            pressThreshold = _this$props2.pressThreshold;

        if (!_this.state.sorting && _this.touched && !_this._awaitingUpdateBeforeSortStart) {
          var position = getPosition(event);
          var delta = {
            x: _this.position.x - position.x,
            y: _this.position.y - position.y
          };
          var combinedDelta = Math.abs(delta.x) + Math.abs(delta.y);
          _this.delta = delta;

          if (!distance && (!pressThreshold || combinedDelta >= pressThreshold)) {
            clearTimeout(_this.cancelTimer);
            _this.cancelTimer = setTimeout(_this.cancel, 0);
          } else if (distance && combinedDelta >= distance && _this.manager.isActive()) {
            _this.handlePress(event);
          }
        }
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "handleEnd", function () {
        _this.touched = false;

        _this.cancel();
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "cancel", function () {
        var distance = _this.props.distance;
        var sorting = _this.state.sorting;

        if (!sorting) {
          if (!distance) {
            clearTimeout(_this.pressTimer);
          }

          _this.manager.active = null;
        }
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "handlePress", function (event) {
        try {
          var active = _this.manager.getActive();

          var _temp6 = function () {
            if (active) {
              var _temp7 = function _temp7() {
                var index = _node.sortableInfo.index;
                var margin = getElementMargin(_node);
                var gridGap = getContainerGridGap(_this.container);

                var containerBoundingRect = _this.scrollContainer.getBoundingClientRect();

                var dimensions = _getHelperDimensions({
                  index: index,
                  node: _node,
                  collection: _collection
                });

                _this.node = _node;
                _this.margin = margin;
                _this.gridGap = gridGap;
                _this.width = dimensions.width;
                _this.height = dimensions.height;
                _this.marginOffset = {
                  x: _this.margin.left + _this.margin.right + _this.gridGap.x,
                  y: Math.max(_this.margin.top, _this.margin.bottom, _this.gridGap.y)
                };
                _this.boundingClientRect = _node.getBoundingClientRect();
                _this.containerBoundingRect = containerBoundingRect;
                _this.index = index;
                _this.newIndex = index;
                _this.axis = {
                  x: _axis.indexOf('x') >= 0,
                  y: _axis.indexOf('y') >= 0
                };
                _this.offsetEdge = getEdgeOffset(_node, _this.container);

                if (_isKeySorting) {
                  _this.initialOffset = getPosition((0,_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_2__["default"])({}, event, {
                    pageX: _this.boundingClientRect.left,
                    pageY: _this.boundingClientRect.top
                  }));
                } else {
                  _this.initialOffset = getPosition(event);
                }

                _this.initialScroll = {
                  left: _this.scrollContainer.scrollLeft,
                  top: _this.scrollContainer.scrollTop
                };
                _this.initialWindowScroll = {
                  left: window.pageXOffset,
                  top: window.pageYOffset
                };
                _this.helper = _this.helperContainer.appendChild(cloneNode(_node));
                setInlineStyles(_this.helper, {
                  boxSizing: 'border-box',
                  height: "".concat(_this.height, "px"),
                  left: "".concat(_this.boundingClientRect.left - margin.left, "px"),
                  pointerEvents: 'none',
                  position: 'fixed',
                  top: "".concat(_this.boundingClientRect.top - margin.top, "px"),
                  width: "".concat(_this.width, "px")
                });

                if (_isKeySorting) {
                  _this.helper.focus();
                }

                if (_hideSortableGhost) {
                  _this.sortableGhost = _node;
                  setInlineStyles(_node, {
                    opacity: 0,
                    visibility: 'hidden'
                  });
                }

                _this.minTranslate = {};
                _this.maxTranslate = {};

                if (_isKeySorting) {
                  var _ref = _useWindowAsScrollContainer ? {
                    top: 0,
                    left: 0,
                    width: _this.contentWindow.innerWidth,
                    height: _this.contentWindow.innerHeight
                  } : _this.containerBoundingRect,
                      containerTop = _ref.top,
                      containerLeft = _ref.left,
                      containerWidth = _ref.width,
                      containerHeight = _ref.height;

                  var containerBottom = containerTop + containerHeight;
                  var containerRight = containerLeft + containerWidth;

                  if (_this.axis.x) {
                    _this.minTranslate.x = containerLeft - _this.boundingClientRect.left;
                    _this.maxTranslate.x = containerRight - (_this.boundingClientRect.left + _this.width);
                  }

                  if (_this.axis.y) {
                    _this.minTranslate.y = containerTop - _this.boundingClientRect.top;
                    _this.maxTranslate.y = containerBottom - (_this.boundingClientRect.top + _this.height);
                  }
                } else {
                  if (_this.axis.x) {
                    _this.minTranslate.x = (_useWindowAsScrollContainer ? 0 : containerBoundingRect.left) - _this.boundingClientRect.left - _this.width / 2;
                    _this.maxTranslate.x = (_useWindowAsScrollContainer ? _this.contentWindow.innerWidth : containerBoundingRect.left + containerBoundingRect.width) - _this.boundingClientRect.left - _this.width / 2;
                  }

                  if (_this.axis.y) {
                    _this.minTranslate.y = (_useWindowAsScrollContainer ? 0 : containerBoundingRect.top) - _this.boundingClientRect.top - _this.height / 2;
                    _this.maxTranslate.y = (_useWindowAsScrollContainer ? _this.contentWindow.innerHeight : containerBoundingRect.top + containerBoundingRect.height) - _this.boundingClientRect.top - _this.height / 2;
                  }
                }

                if (_helperClass) {
                  _helperClass.split(' ').forEach(function (className) {
                    return _this.helper.classList.add(className);
                  });
                }

                _this.listenerNode = event.touches ? event.target : _this.contentWindow;

                if (_isKeySorting) {
                  _this.listenerNode.addEventListener('wheel', _this.handleKeyEnd, true);

                  _this.listenerNode.addEventListener('mousedown', _this.handleKeyEnd, true);

                  _this.listenerNode.addEventListener('keydown', _this.handleKeyDown);
                } else {
                  events.move.forEach(function (eventName) {
                    return _this.listenerNode.addEventListener(eventName, _this.handleSortMove, false);
                  });
                  events.end.forEach(function (eventName) {
                    return _this.listenerNode.addEventListener(eventName, _this.handleSortEnd, false);
                  });
                }

                _this.setState({
                  sorting: true,
                  sortingIndex: index
                });

                if (_onSortStart) {
                  _onSortStart({
                    node: _node,
                    index: index,
                    collection: _collection,
                    isKeySorting: _isKeySorting,
                    nodes: _this.manager.getOrderedRefs(),
                    helper: _this.helper
                  }, event);
                }

                if (_isKeySorting) {
                  _this.keyMove(0);
                }
              };

              var _this$props3 = _this.props,
                  _axis = _this$props3.axis,
                  _getHelperDimensions = _this$props3.getHelperDimensions,
                  _helperClass = _this$props3.helperClass,
                  _hideSortableGhost = _this$props3.hideSortableGhost,
                  updateBeforeSortStart = _this$props3.updateBeforeSortStart,
                  _onSortStart = _this$props3.onSortStart,
                  _useWindowAsScrollContainer = _this$props3.useWindowAsScrollContainer;
              var _node = active.node,
                  _collection = active.collection;
              var _isKeySorting = _this.manager.isKeySorting;

              var _temp8 = function () {
                if (typeof updateBeforeSortStart === 'function') {
                  _this._awaitingUpdateBeforeSortStart = true;

                  var _temp9 = _finallyRethrows(function () {
                    var index = _node.sortableInfo.index;
                    return Promise.resolve(updateBeforeSortStart({
                      collection: _collection,
                      index: index,
                      node: _node,
                      isKeySorting: _isKeySorting
                    }, event)).then(function () {});
                  }, function (_wasThrown, _result) {
                    _this._awaitingUpdateBeforeSortStart = false;
                    if (_wasThrown) throw _result;
                    return _result;
                  });

                  if (_temp9 && _temp9.then) return _temp9.then(function () {});
                }
              }();

              return _temp8 && _temp8.then ? _temp8.then(_temp7) : _temp7(_temp8);
            }
          }();

          return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(function () {}) : void 0);
        } catch (e) {
          return Promise.reject(e);
        }
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "handleSortMove", function (event) {
        var onSortMove = _this.props.onSortMove;

        if (typeof event.preventDefault === 'function' && event.cancelable) {
          event.preventDefault();
        }

        _this.updateHelperPosition(event);

        _this.animateNodes();

        _this.autoscroll();

        if (onSortMove) {
          onSortMove(event);
        }
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "handleSortEnd", function (event) {
        var _this$props4 = _this.props,
            hideSortableGhost = _this$props4.hideSortableGhost,
            onSortEnd = _this$props4.onSortEnd;
        var _this$manager = _this.manager,
            collection = _this$manager.active.collection,
            isKeySorting = _this$manager.isKeySorting;

        var nodes = _this.manager.getOrderedRefs();

        if (_this.listenerNode) {
          if (isKeySorting) {
            _this.listenerNode.removeEventListener('wheel', _this.handleKeyEnd, true);

            _this.listenerNode.removeEventListener('mousedown', _this.handleKeyEnd, true);

            _this.listenerNode.removeEventListener('keydown', _this.handleKeyDown);
          } else {
            events.move.forEach(function (eventName) {
              return _this.listenerNode.removeEventListener(eventName, _this.handleSortMove);
            });
            events.end.forEach(function (eventName) {
              return _this.listenerNode.removeEventListener(eventName, _this.handleSortEnd);
            });
          }
        }

        _this.helper.parentNode.removeChild(_this.helper);

        if (hideSortableGhost && _this.sortableGhost) {
          setInlineStyles(_this.sortableGhost, {
            opacity: '',
            visibility: ''
          });
        }

        for (var i = 0, len = nodes.length; i < len; i++) {
          var _node2 = nodes[i];
          var el = _node2.node;
          _node2.edgeOffset = null;
          _node2.boundingClientRect = null;
          setTranslate3d(el, null);
          setTransitionDuration(el, null);
          _node2.translate = null;
        }

        _this.autoScroller.clear();

        _this.manager.active = null;
        _this.manager.isKeySorting = false;

        _this.setState({
          sorting: false,
          sortingIndex: null
        });

        if (typeof onSortEnd === 'function') {
          onSortEnd({
            collection: collection,
            newIndex: _this.newIndex,
            oldIndex: _this.index,
            isKeySorting: isKeySorting,
            nodes: nodes
          }, event);
        }

        _this.touched = false;
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "autoscroll", function () {
        var disableAutoscroll = _this.props.disableAutoscroll;
        var isKeySorting = _this.manager.isKeySorting;

        if (disableAutoscroll) {
          _this.autoScroller.clear();

          return;
        }

        if (isKeySorting) {
          var translate = (0,_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_2__["default"])({}, _this.translate);

          var scrollX = 0;
          var scrollY = 0;

          if (_this.axis.x) {
            translate.x = Math.min(_this.maxTranslate.x, Math.max(_this.minTranslate.x, _this.translate.x));
            scrollX = _this.translate.x - translate.x;
          }

          if (_this.axis.y) {
            translate.y = Math.min(_this.maxTranslate.y, Math.max(_this.minTranslate.y, _this.translate.y));
            scrollY = _this.translate.y - translate.y;
          }

          _this.translate = translate;
          setTranslate3d(_this.helper, _this.translate);
          _this.scrollContainer.scrollLeft += scrollX;
          _this.scrollContainer.scrollTop += scrollY;
          return;
        }

        _this.autoScroller.update({
          height: _this.height,
          maxTranslate: _this.maxTranslate,
          minTranslate: _this.minTranslate,
          translate: _this.translate,
          width: _this.width
        });
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "onAutoScroll", function (offset) {
        _this.translate.x += offset.left;
        _this.translate.y += offset.top;

        _this.animateNodes();
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "handleKeyDown", function (event) {
        var keyCode = event.keyCode;
        var _this$props5 = _this.props,
            shouldCancelStart = _this$props5.shouldCancelStart,
            _this$props5$keyCodes = _this$props5.keyCodes,
            customKeyCodes = _this$props5$keyCodes === void 0 ? {} : _this$props5$keyCodes;

        var keyCodes = (0,_babel_runtime_helpers_esm_objectSpread__WEBPACK_IMPORTED_MODULE_2__["default"])({}, defaultKeyCodes, customKeyCodes);

        if (_this.manager.active && !_this.manager.isKeySorting || !_this.manager.active && (!keyCodes.lift.includes(keyCode) || shouldCancelStart(event) || !_this.isValidSortingTarget(event))) {
          return;
        }

        event.stopPropagation();
        event.preventDefault();

        if (keyCodes.lift.includes(keyCode) && !_this.manager.active) {
          _this.keyLift(event);
        } else if (keyCodes.drop.includes(keyCode) && _this.manager.active) {
          _this.keyDrop(event);
        } else if (keyCodes.cancel.includes(keyCode)) {
          _this.newIndex = _this.manager.active.index;

          _this.keyDrop(event);
        } else if (keyCodes.up.includes(keyCode)) {
          _this.keyMove(-1);
        } else if (keyCodes.down.includes(keyCode)) {
          _this.keyMove(1);
        }
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "keyLift", function (event) {
        var target = event.target;
        var node = closest(target, function (el) {
          return el.sortableInfo != null;
        });
        var _node$sortableInfo2 = node.sortableInfo,
            index = _node$sortableInfo2.index,
            collection = _node$sortableInfo2.collection;
        _this.initialFocusedNode = target;
        _this.manager.isKeySorting = true;
        _this.manager.active = {
          index: index,
          collection: collection
        };

        _this.handlePress(event);
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "keyMove", function (shift) {
        var nodes = _this.manager.getOrderedRefs();

        var lastIndex = nodes[nodes.length - 1].node.sortableInfo.index;
        var newIndex = _this.newIndex + shift;
        var prevIndex = _this.newIndex;

        if (newIndex < 0 || newIndex > lastIndex) {
          return;
        }

        _this.prevIndex = prevIndex;
        _this.newIndex = newIndex;
        var targetIndex = getTargetIndex(_this.newIndex, _this.prevIndex, _this.index);
        var target = nodes.find(function (_ref2) {
          var node = _ref2.node;
          return node.sortableInfo.index === targetIndex;
        });
        var targetNode = target.node;
        var scrollDelta = _this.containerScrollDelta;
        var targetBoundingClientRect = target.boundingClientRect || getScrollAdjustedBoundingClientRect(targetNode, scrollDelta);
        var targetTranslate = target.translate || {
          x: 0,
          y: 0
        };
        var targetPosition = {
          top: targetBoundingClientRect.top + targetTranslate.y - scrollDelta.top,
          left: targetBoundingClientRect.left + targetTranslate.x - scrollDelta.left
        };
        var shouldAdjustForSize = prevIndex < newIndex;
        var sizeAdjustment = {
          x: shouldAdjustForSize && _this.axis.x ? targetNode.offsetWidth - _this.width : 0,
          y: shouldAdjustForSize && _this.axis.y ? targetNode.offsetHeight - _this.height : 0
        };

        _this.handleSortMove({
          pageX: targetPosition.left + sizeAdjustment.x,
          pageY: targetPosition.top + sizeAdjustment.y,
          ignoreTransition: shift === 0
        });
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "keyDrop", function (event) {
        _this.handleSortEnd(event);

        if (_this.initialFocusedNode) {
          _this.initialFocusedNode.focus();
        }
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "handleKeyEnd", function (event) {
        if (_this.manager.active) {
          _this.keyDrop(event);
        }
      });

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "isValidSortingTarget", function (event) {
        var useDragHandle = _this.props.useDragHandle;
        var target = event.target;
        var node = closest(target, function (el) {
          return el.sortableInfo != null;
        });
        return node && node.sortableInfo && !node.sortableInfo.disabled && (useDragHandle ? isSortableHandle(target) : target.sortableInfo);
      });

      var manager = new Manager();
      validateProps(props);
      _this.manager = manager;
      _this.wrappedInstance = (0,react__WEBPACK_IMPORTED_MODULE_10__.createRef)();
      _this.sortableContextValue = {
        manager: manager
      };
      _this.events = {
        end: _this.handleEnd,
        move: _this.handleMove,
        start: _this.handleStart
      };
      return _this;
    }

    (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(WithSortableContainer, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        var useWindowAsScrollContainer = this.props.useWindowAsScrollContainer;
        var container = this.getContainer();
        Promise.resolve(container).then(function (containerNode) {
          _this2.container = containerNode;
          _this2.document = _this2.container.ownerDocument || document;
          var contentWindow = _this2.props.contentWindow || _this2.document.defaultView || window;
          _this2.contentWindow = typeof contentWindow === 'function' ? contentWindow() : contentWindow;
          _this2.scrollContainer = useWindowAsScrollContainer ? _this2.document.scrollingElement || _this2.document.documentElement : getScrollingParent(_this2.container) || _this2.container;
          _this2.autoScroller = new AutoScroller(_this2.scrollContainer, _this2.onAutoScroll);
          Object.keys(_this2.events).forEach(function (key) {
            return events[key].forEach(function (eventName) {
              return _this2.container.addEventListener(eventName, _this2.events[key], false);
            });
          });

          _this2.container.addEventListener('keydown', _this2.handleKeyDown);
        });
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var _this3 = this;

        if (this.helper && this.helper.parentNode) {
          this.helper.parentNode.removeChild(this.helper);
        }

        if (!this.container) {
          return;
        }

        Object.keys(this.events).forEach(function (key) {
          return events[key].forEach(function (eventName) {
            return _this3.container.removeEventListener(eventName, _this3.events[key]);
          });
        });
        this.container.removeEventListener('keydown', this.handleKeyDown);
      }
    }, {
      key: "updateHelperPosition",
      value: function updateHelperPosition(event) {
        var _this$props6 = this.props,
            lockAxis = _this$props6.lockAxis,
            lockOffset = _this$props6.lockOffset,
            lockToContainerEdges = _this$props6.lockToContainerEdges,
            transitionDuration = _this$props6.transitionDuration,
            _this$props6$keyboard = _this$props6.keyboardSortingTransitionDuration,
            keyboardSortingTransitionDuration = _this$props6$keyboard === void 0 ? transitionDuration : _this$props6$keyboard;
        var isKeySorting = this.manager.isKeySorting;
        var ignoreTransition = event.ignoreTransition;
        var offset = getPosition(event);
        var translate = {
          x: offset.x - this.initialOffset.x,
          y: offset.y - this.initialOffset.y
        };
        translate.y -= window.pageYOffset - this.initialWindowScroll.top;
        translate.x -= window.pageXOffset - this.initialWindowScroll.left;
        this.translate = translate;

        if (lockToContainerEdges) {
          var _getLockPixelOffsets = getLockPixelOffsets({
            height: this.height,
            lockOffset: lockOffset,
            width: this.width
          }),
              _getLockPixelOffsets2 = (0,_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_getLockPixelOffsets, 2),
              minLockOffset = _getLockPixelOffsets2[0],
              maxLockOffset = _getLockPixelOffsets2[1];

          var minOffset = {
            x: this.width / 2 - minLockOffset.x,
            y: this.height / 2 - minLockOffset.y
          };
          var maxOffset = {
            x: this.width / 2 - maxLockOffset.x,
            y: this.height / 2 - maxLockOffset.y
          };
          translate.x = limit(this.minTranslate.x + minOffset.x, this.maxTranslate.x - maxOffset.x, translate.x);
          translate.y = limit(this.minTranslate.y + minOffset.y, this.maxTranslate.y - maxOffset.y, translate.y);
        }

        if (lockAxis === 'x') {
          translate.y = 0;
        } else if (lockAxis === 'y') {
          translate.x = 0;
        }

        if (isKeySorting && keyboardSortingTransitionDuration && !ignoreTransition) {
          setTransitionDuration(this.helper, keyboardSortingTransitionDuration);
        }

        setTranslate3d(this.helper, translate);
      }
    }, {
      key: "animateNodes",
      value: function animateNodes() {
        var _this$props7 = this.props,
            transitionDuration = _this$props7.transitionDuration,
            hideSortableGhost = _this$props7.hideSortableGhost,
            onSortOver = _this$props7.onSortOver;
        var containerScrollDelta = this.containerScrollDelta,
            windowScrollDelta = this.windowScrollDelta;
        var nodes = this.manager.getOrderedRefs();
        var sortingOffset = {
          left: this.offsetEdge.left + this.translate.x + containerScrollDelta.left,
          top: this.offsetEdge.top + this.translate.y + containerScrollDelta.top
        };
        var isKeySorting = this.manager.isKeySorting;
        var prevIndex = this.newIndex;
        this.newIndex = null;

        for (var i = 0, len = nodes.length; i < len; i++) {
          var _node3 = nodes[i].node;
          var index = _node3.sortableInfo.index;
          var width = _node3.offsetWidth;
          var height = _node3.offsetHeight;
          var offset = {
            height: this.height > height ? height / 2 : this.height / 2,
            width: this.width > width ? width / 2 : this.width / 2
          };
          var mustShiftBackward = isKeySorting && index > this.index && index <= prevIndex;
          var mustShiftForward = isKeySorting && index < this.index && index >= prevIndex;
          var translate = {
            x: 0,
            y: 0
          };
          var edgeOffset = nodes[i].edgeOffset;

          if (!edgeOffset) {
            edgeOffset = getEdgeOffset(_node3, this.container);
            nodes[i].edgeOffset = edgeOffset;

            if (isKeySorting) {
              nodes[i].boundingClientRect = getScrollAdjustedBoundingClientRect(_node3, containerScrollDelta);
            }
          }

          var nextNode = i < nodes.length - 1 && nodes[i + 1];
          var prevNode = i > 0 && nodes[i - 1];

          if (nextNode && !nextNode.edgeOffset) {
            nextNode.edgeOffset = getEdgeOffset(nextNode.node, this.container);

            if (isKeySorting) {
              nextNode.boundingClientRect = getScrollAdjustedBoundingClientRect(nextNode.node, containerScrollDelta);
            }
          }

          if (index === this.index) {
            if (hideSortableGhost) {
              this.sortableGhost = _node3;
              setInlineStyles(_node3, {
                opacity: 0,
                visibility: 'hidden'
              });
            }

            continue;
          }

          if (transitionDuration) {
            setTransitionDuration(_node3, transitionDuration);
          }

          if (this.axis.x) {
            if (this.axis.y) {
              if (mustShiftForward || index < this.index && (sortingOffset.left + windowScrollDelta.left - offset.width <= edgeOffset.left && sortingOffset.top + windowScrollDelta.top <= edgeOffset.top + offset.height || sortingOffset.top + windowScrollDelta.top + offset.height <= edgeOffset.top)) {
                translate.x = this.width + this.marginOffset.x;

                if (edgeOffset.left + translate.x > this.containerBoundingRect.width - offset.width) {
                  if (nextNode) {
                    translate.x = nextNode.edgeOffset.left - edgeOffset.left;
                    translate.y = nextNode.edgeOffset.top - edgeOffset.top;
                  }
                }

                if (this.newIndex === null) {
                  this.newIndex = index;
                }
              } else if (mustShiftBackward || index > this.index && (sortingOffset.left + windowScrollDelta.left + offset.width >= edgeOffset.left && sortingOffset.top + windowScrollDelta.top + offset.height >= edgeOffset.top || sortingOffset.top + windowScrollDelta.top + offset.height >= edgeOffset.top + height)) {
                translate.x = -(this.width + this.marginOffset.x);

                if (edgeOffset.left + translate.x < this.containerBoundingRect.left + offset.width) {
                  if (prevNode) {
                    translate.x = prevNode.edgeOffset.left - edgeOffset.left;
                    translate.y = prevNode.edgeOffset.top - edgeOffset.top;
                  }
                }

                this.newIndex = index;
              }
            } else {
              if (mustShiftBackward || index > this.index && sortingOffset.left + windowScrollDelta.left + offset.width >= edgeOffset.left) {
                translate.x = -(this.width + this.marginOffset.x);
                this.newIndex = index;
              } else if (mustShiftForward || index < this.index && sortingOffset.left + windowScrollDelta.left <= edgeOffset.left + offset.width) {
                translate.x = this.width + this.marginOffset.x;

                if (this.newIndex == null) {
                  this.newIndex = index;
                }
              }
            }
          } else if (this.axis.y) {
            if (mustShiftBackward || index > this.index && sortingOffset.top + windowScrollDelta.top + offset.height >= edgeOffset.top) {
              translate.y = -(this.height + this.marginOffset.y);
              this.newIndex = index;
            } else if (mustShiftForward || index < this.index && sortingOffset.top + windowScrollDelta.top <= edgeOffset.top + offset.height) {
              translate.y = this.height + this.marginOffset.y;

              if (this.newIndex == null) {
                this.newIndex = index;
              }
            }
          }

          setTranslate3d(_node3, translate);
          nodes[i].translate = translate;
        }

        if (this.newIndex == null) {
          this.newIndex = this.index;
        }

        if (isKeySorting) {
          this.newIndex = prevIndex;
        }

        var oldIndex = isKeySorting ? this.prevIndex : prevIndex;

        if (onSortOver && this.newIndex !== oldIndex) {
          onSortOver({
            collection: this.manager.active.collection,
            index: this.index,
            newIndex: this.newIndex,
            oldIndex: oldIndex,
            isKeySorting: isKeySorting,
            nodes: nodes,
            helper: this.helper
          });
        }
      }
    }, {
      key: "getWrappedInstance",
      value: function getWrappedInstance() {
        invariant__WEBPACK_IMPORTED_MODULE_12___default()(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableContainer() call');
        return this.wrappedInstance.current;
      }
    }, {
      key: "getContainer",
      value: function getContainer() {
        var getContainer = this.props.getContainer;

        if (typeof getContainer !== 'function') {
          return (0,react_dom__WEBPACK_IMPORTED_MODULE_11__.findDOMNode)(this);
        }

        return getContainer(config.withRef ? this.getWrappedInstance() : undefined);
      }
    }, {
      key: "render",
      value: function render() {
        var ref = config.withRef ? this.wrappedInstance : null;
        return (0,react__WEBPACK_IMPORTED_MODULE_10__.createElement)(SortableContext.Provider, {
          value: this.sortableContextValue
        }, (0,react__WEBPACK_IMPORTED_MODULE_10__.createElement)(WrappedComponent, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
          ref: ref
        }, omit(this.props, omittedProps))));
      }
    }, {
      key: "helperContainer",
      get: function get() {
        var helperContainer = this.props.helperContainer;

        if (typeof helperContainer === 'function') {
          return helperContainer();
        }

        return this.props.helperContainer || this.document.body;
      }
    }, {
      key: "containerScrollDelta",
      get: function get() {
        var useWindowAsScrollContainer = this.props.useWindowAsScrollContainer;

        if (useWindowAsScrollContainer) {
          return {
            left: 0,
            top: 0
          };
        }

        return {
          left: this.scrollContainer.scrollLeft - this.initialScroll.left,
          top: this.scrollContainer.scrollTop - this.initialScroll.top
        };
      }
    }, {
      key: "windowScrollDelta",
      get: function get() {
        return {
          left: this.contentWindow.pageXOffset - this.initialWindowScroll.left,
          top: this.contentWindow.pageYOffset - this.initialWindowScroll.top
        };
      }
    }]);

    return WithSortableContainer;
  }(react__WEBPACK_IMPORTED_MODULE_10__.Component), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])(_class, "displayName", provideDisplayName('sortableList', WrappedComponent)), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])(_class, "defaultProps", defaultProps), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])(_class, "propTypes", propTypes), _temp;
}

var propTypes$1 = {
  index: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().number.isRequired),
  collection: prop_types__WEBPACK_IMPORTED_MODULE_14___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_14___default().number), (prop_types__WEBPACK_IMPORTED_MODULE_14___default().string)]),
  disabled: (prop_types__WEBPACK_IMPORTED_MODULE_14___default().bool)
};
var omittedProps$1 = Object.keys(propTypes$1);
function sortableElement(WrappedComponent) {
  var _class, _temp;

  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    withRef: false
  };
  return _temp = _class = function (_React$Component) {
    (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_7__["default"])(WithSortableElement, _React$Component);

    function WithSortableElement() {
      var _getPrototypeOf2;

      var _this;

      (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__["default"])(this, WithSortableElement);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, (_getPrototypeOf2 = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(WithSortableElement)).call.apply(_getPrototypeOf2, [this].concat(args)));

      (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_8__["default"])(_this)), "wrappedInstance", (0,react__WEBPACK_IMPORTED_MODULE_10__.createRef)());

      return _this;
    }

    (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(WithSortableElement, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.register();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        if (this.node) {
          if (prevProps.index !== this.props.index) {
            this.node.sortableInfo.index = this.props.index;
          }

          if (prevProps.disabled !== this.props.disabled) {
            this.node.sortableInfo.disabled = this.props.disabled;
          }
        }

        if (prevProps.collection !== this.props.collection) {
          this.unregister(prevProps.collection);
          this.register();
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.unregister();
      }
    }, {
      key: "register",
      value: function register() {
        var _this$props = this.props,
            collection = _this$props.collection,
            disabled = _this$props.disabled,
            index = _this$props.index;
        var node = (0,react_dom__WEBPACK_IMPORTED_MODULE_11__.findDOMNode)(this);
        node.sortableInfo = {
          collection: collection,
          disabled: disabled,
          index: index,
          manager: this.context.manager
        };
        this.node = node;
        this.ref = {
          node: node
        };
        this.context.manager.add(collection, this.ref);
      }
    }, {
      key: "unregister",
      value: function unregister() {
        var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.collection;
        this.context.manager.remove(collection, this.ref);
      }
    }, {
      key: "getWrappedInstance",
      value: function getWrappedInstance() {
        invariant__WEBPACK_IMPORTED_MODULE_12___default()(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableElement() call');
        return this.wrappedInstance.current;
      }
    }, {
      key: "render",
      value: function render() {
        var ref = config.withRef ? this.wrappedInstance : null;
        return (0,react__WEBPACK_IMPORTED_MODULE_10__.createElement)(WrappedComponent, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
          ref: ref
        }, omit(this.props, omittedProps$1)));
      }
    }]);

    return WithSortableElement;
  }(react__WEBPACK_IMPORTED_MODULE_10__.Component), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])(_class, "displayName", provideDisplayName('sortableElement', WrappedComponent)), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])(_class, "contextType", SortableContext), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])(_class, "propTypes", propTypes$1), (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_9__["default"])(_class, "defaultProps", {
    collection: 0
  }), _temp;
}




/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ (function(module) {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ (function(module) {

"use strict";
module.exports = window["ReactDOM"];

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayLikeToArray; }
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithHoles; }
/* harmony export */ });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _arrayWithoutHoles; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _assertThisInitialized; }
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _classCallCheck; }
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _createClass; }
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _defineProperty; }
/* harmony export */ });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _extends; }
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _getPrototypeOf; }
/* harmony export */ });
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inherits.js":
/*!*************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inherits.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _inherits; }
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArray; }
/* harmony export */ });
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _iterableToArrayLimit; }
/* harmony export */ });
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableRest; }
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _nonIterableSpread; }
/* harmony export */ });
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/objectSpread.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectSpread.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _objectSpread; }
/* harmony export */ });
/* harmony import */ var _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defineProperty.js */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? Object(arguments[i]) : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function (key) {
      (0,_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]);
    });
  }
  return target;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _possibleConstructorReturn; }
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assertThisInitialized.js */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");


function _possibleConstructorReturn(self, call) {
  if (call && ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return (0,_assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__["default"])(self);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _setPrototypeOf; }
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _slicedToArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _slicedToArray(arr, i) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr, i) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr, i) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _toConsumableArray; }
/* harmony export */ });
/* harmony import */ var _arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js");




function _toConsumableArray(arr) {
  return (0,_arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr) || (0,_nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _typeof; }
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _unsupportedIterableToArray; }
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ }),

/***/ "./node_modules/array-move/index.js":
/*!******************************************!*\
  !*** ./node_modules/array-move/index.js ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrayMoveImmutable": function() { return /* binding */ arrayMoveImmutable; },
/* harmony export */   "arrayMoveMutable": function() { return /* binding */ arrayMoveMutable; }
/* harmony export */ });
function arrayMoveMutable(array, fromIndex, toIndex) {
	const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

	if (startIndex >= 0 && startIndex < array.length) {
		const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

		const [item] = array.splice(fromIndex, 1);
		array.splice(endIndex, 0, item);
	}
}

function arrayMoveImmutable(array, fromIndex, toIndex) {
	array = [...array];
	arrayMoveMutable(array, fromIndex, toIndex);
	return array;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"blocks": 0,
/******/ 			"./style-blocks": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkvietis"] = self["webpackChunkvietis"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-blocks"], function() { return __webpack_require__("./src/blocks.js"); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=blocks.js.map