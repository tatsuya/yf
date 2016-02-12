#!/usr/bin/env node

var yf = require('./');

var argv = process.argv.slice(2);

if (argv.length < 1) {
  console.log('usage: yf <code>');
  process.exit(0);
}

var code = argv.shift();

yf(code, function(err, data) {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }
  console.log(data.price);
});
