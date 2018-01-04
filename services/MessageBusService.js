'use strict';

/**
 * Initialize the Kafka producer.
 */
var init = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return producer.init();

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function init() {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Post a new event to Kafka.
 *
 * @param {String} sourceServiceName the source service name
 * @param {Object} event the event to post
 */


var postEvent = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(sourceServiceName, event) {
    var result, error;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            helper.validateEvent(sourceServiceName, event);

            // Post
            _context2.next = 3;
            return producer.send({
              topic: '' + config.KAFKA_TOPIC_PREFIX + event.type,
              message: {
                value: event.message
              }
            });

          case 3:
            result = _context2.sent;


            // Check if there is any error
            error = _.get(result, '[0].error');

            if (!error) {
              _context2.next = 9;
              break;
            }

            if (!(error.code === 'UnknownTopicOrPartition')) {
              _context2.next = 8;
              break;
            }

            throw createError.BadRequest('Unknown event type "' + event.type + '"');

          case 8:
            throw createError.InternalServerError();

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function postEvent(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Get all topic names from Kafka.
 *
 * @returns {Array} the topic names
 */
var getAllTopics = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return producer.client.updateMetadata();

          case 2:
            return _context3.abrupt('return', _.keys(producer.client.topicMetadata));

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getAllTopics() {
    return _ref3.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * The Message Bus service provides operations to the remote Kafka.
 */
var createError = require('http-errors');
var Joi = require('joi');
var _ = require('lodash');
var config = require('config');
var Kafka = require('no-kafka');

var helper = require('../common/helper');

// Create a new producer instance with KAFKA_URL, KAFKA_CLIENT_CERT, and
// KAFKA_CLIENT_CERT_KEY environment variables
var producer = new Kafka.Producer();

postEvent.schema = Joi.object().keys({
  sourceServiceName: Joi.string().required(),
  event: Joi.object().keys({
    type: Joi.string().regex(/^([a-zA-Z0-9]+\.)+[a-zA-Z0-9]+$/).error(createError.BadRequest('"type" must be a fully qualified name - dot separated string')).required(),
    message: Joi.string().required()
  })
});

module.exports = {
  init: init,
  postEvent: postEvent,
  getAllTopics: getAllTopics
};

helper.buildService(module.exports);