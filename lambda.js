require("babel-polyfill");
console.log('inside lambda.js file line 1')
AWS_ACCESS_KEY_ID=AKIAIZNXS5YYYHTLVKKK
const awsServerlessExpress = require('aws-serverless-express');
console.log('inside lambda.js file line 2')
const app = require('./index');
const server = awsServerlessExpress.createServer(app)
console.log('inside lambda.js file line 5')
module.exports.universal = (event, context) => awsServerlessExpress.proxy(server, event, context);
