#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var yargs = require('yargs');

var yf = require('./');

function readConfig() {
  var filepath = path.join(process.env.HOME, '.yf.json');
  var stats;
  try {
    stats = fs.statSync(filepath);
  } catch (e) {
    yargs.showHelp();
    process.exit(1);
  }

  var file = fs.readFileSync(filepath);

  try {
    return JSON.parse(file);
  } catch (e) {
    throw new Error('Failed to parse JSON config');
  }
}

var argv = yargs
  .usage('Usage: yf <code> [options]')
  .option('w', {
    alias: 'watch',
    desc: 'Interval in seconds to watch price periodically'
  })
  .help('h')
  .alias('h', 'help')
  .version(function() {
    return require('./package').version;
  })
  .argv;


var code;

if (argv._.length > 0) {
  code = argv._.shift();
} else {
  var config = readConfig();
  if (!config.code) {
    yargs.showHelp();
    process.exit(1);
  }
  code = config.code;
}

if (argv.w) {
  yf(code, function(err, data) {
    if (err) {
      console.log(err.message);
      process.exit(1);
    }
    console.log(data.price);

    setInterval(function() {
      yf(code, function(err, data) {
        if (err) {
          console.log(err.message);
          process.exit(1);
        }
        console.log(data.price);
      });
    }, argv.w * 1000);
  });

} else {
  yf(code, function(err, data) {
    if (err) {
      console.log(err.message);
      process.exit(1);
    }
    console.log(data.price);
  });
}
