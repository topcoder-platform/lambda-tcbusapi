'use strict';

/**
 * Get all topic names.
 *
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
var getAll = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var topics;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return MessageBusService.getAllTopics();

          case 2:
            topics = _context.sent;

            res.send(topics);
            next();

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getAll(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * The Topic controller.
 */
var MessageBusService = require('../services/MessageBusService');

module.exports = {
  getAll: getAll
};