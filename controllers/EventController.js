'use strict';

/**
 * Create a new event.
 *
 * @param {Object} req the request
 * @param {Object} res the response
 * @param {Function} next the next middleware
 */
var create = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return MessageBusService.postEvent(req.sourceServiceName, req.body);

          case 2:
            res.status(204).end();
            next();

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function create(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * The Event controller.
 */
var MessageBusService = require('../services/MessageBusService');

module.exports = {
  create: create
};