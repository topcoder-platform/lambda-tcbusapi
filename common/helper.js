'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * This file defines helper methods.
 */
var util = require('util');
var _ = require('lodash');
var Joi = require('joi');
var getParams = require('get-parameter-names');
var config = require('config');
var jwt = require('jsonwebtoken');
var createError = require('http-errors');

var logger = require('./logger');

/**
 * Convert array with arguments to object.
 *
 * @param {Array} params the name of parameters
 * @param {Array} arr the array with values
 * @returns {Object} the combined object
 * @private
 */
function combineObject(params, arr) {
  var ret = {};
  _.forEach(arr, function (arg, i) {
    ret[params[i]] = arg;
  });
  return ret;
}

/**
 * Decorate all functions of a service and log debug information if DEBUG is enabled.
 *
 * @param {Object} service the service
 * @private
 */
function decorateWithLogging(service) {
  if (config.LOG_LEVEL !== 'debug') {
    return;
  }
  _.forEach(service, function (method, name) {
    var params = method.params || getParams(method);
    service[name] = function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                logger.debug('ENTER ' + name);
                logger.debug('input arguments');
                logger.debug(util.inspect(combineObject(params, args)));
                _context.next = 5;
                return method.apply(this, args);

              case 5:
                result = _context.sent;

                logger.debug('EXIT ' + name);
                logger.debug('output arguments');
                logger.debug(util.inspect(result));
                return _context.abrupt('return', result);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function serviceMethodWithLogging() {
        return _ref.apply(this, arguments);
      }

      return serviceMethodWithLogging;
    }();
  });
}

/**
 * Decorate all functions of a service and validate input values
 * and replace input arguments with sanitized result = require('Joi.
 * Service method must have a `schema` property with Joi schema.
 *
 * @param {Object} service the service
 * @private
 */
function decorateWithValidator(service) {
  _.forEach(service, function (method, name) {
    if (!method.schema) {
      return;
    }
    var params = getParams(method);
    service[name] = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var value, normalized, newArgs;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                value = combineObject(params, args);
                normalized = Joi.attempt(value, method.schema, { abortEarly: false });
                // Joi will normalize values
                // for example string number '1' to 1
                // if schema type is number

                newArgs = _.map(params, function (param) {
                  return normalized[param];
                });
                return _context2.abrupt('return', method.apply(this, newArgs));

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function serviceMethodWithValidation() {
        return _ref2.apply(this, arguments);
      }

      return serviceMethodWithValidation;
    }();
    service[name].params = params;
  });
}

/**
 * Apply logger and validation decorators to the service.
 *
 * @export helper/buildService
 * @param {any} service the service to wrap
 */
function buildService(service) {
  decorateWithValidator(service);
  decorateWithLogging(service);
}

/**
 * Verify the JWT token and get the payload.
 *
 * @param {String} token the JWT token to verify
 * @returns {Object} the payload decoded from the token
 */
function verifyJwtToken(token) {
  var payload = void 0;

  try {
    payload = jwt.verify(token, config.JWT_TOKEN_SECRET);
  } catch (err) {
    if (err.message === 'jwt expired') {
      throw createError.Unauthorized('Token has been expired');
    }

    throw createError.Unauthorized('Failed to verify token');
  }

  if (!payload) {
    throw createError.Unauthorized('Failed to decode token');
  }

  return payload;
}

/**
 * Sign the payload and get the JWT token.
 *
 * @param {Object} payload the payload to be sign
 * @returns {String} the token
 */
function signJwtToken(payload) {
  return jwt.sign(payload, config.JWT_TOKEN_SECRET, { expiresIn: config.JWT_TOKEN_EXPIRES_IN });
}

/**
 * Validate the event based on the source service, type, and message.
 *
 * @param {String} sourceServiceName the source service name
 * @param {Object} event the event
 */
function validateEvent(sourceServiceName, event) {
  // The message should be a JSON-formatted string
  try {
    JSON.parse(event.message);
  } catch (err) {
    logger.error(err);
    throw createError.BadRequest('"message" is not a valid JSON-formatted string: ' + err.message);
  }

  // The message should match with the source service and type
  // no-op for now
}

module.exports = {
  buildService: buildService,
  verifyJwtToken: verifyJwtToken,
  signJwtToken: signJwtToken,
  validateEvent: validateEvent
};