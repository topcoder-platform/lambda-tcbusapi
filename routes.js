'use strict';

/**
 * Configure application routes.
 */
var _require = require('express'),
    Router = _require.Router;

var requireDir = require('require-dir');
var auth = require('./common/auth');

var router = Router();
var controllers = requireDir('./controllers');

// Async error handling
var wrap = function wrap(fn) {
  return function () {
    return fn.apply(undefined, arguments).catch(arguments.length <= 2 ? undefined : arguments[2]);
  };
};

// Routes
router.post('/events', auth, wrap(controllers.EventController.create));
router.get('/topics', auth, wrap(controllers.TopicController.getAll));
router.get('/health', wrap(controllers.HealthController.health));

module.exports = router;