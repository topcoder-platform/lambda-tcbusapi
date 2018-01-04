require("babel-core/register");
require("babel-polyfill");
const app = require('./index');
const port = process.env.PORT || 8000;
const logger = require('./common/logger')
const routes = require('./routes')
const MessageBusService = require('./services/MessageBusService')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('config')
const morgan = require('morgan')
const _ = require('lodash')


// Server
// Start

MessageBusService.init()
.then(() => {
  app.listen(config.PORT, '0.0.0.0')
  logger.info('Express server listening on port %d in %s mode', config.PORT, process.env.NODE_ENV)
})