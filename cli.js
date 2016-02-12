#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var yf = require('./');

function readConfig() {
  var filepath = path.join(process.env.HOME, '.yf.json');
  var stats;
  try {
    stats = fs.statSync(filepath);
  } catch (e) {
    console.log('usage: yf <code>');
    process.exit(0);
  }

  var file = fs.readFileSync(filepath);

  try {
    return JSON.parse(file);
  } catch (e) {
    throw new Error('Failed to parse JSON config');
  }
}


var code;
var argv = process.argv.slice(2);
if (argv.length > 0) {
  code = argv.shift();
} else {
  var config = readConfig();
  if (!config.code) {
    console.log('usage: yf <code>');
    process.exit(1);
  }
  code = config.code;
}

yf(code, function(err, data) {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }
  console.log(data.price);
});