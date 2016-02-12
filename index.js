'use strict';

var request = require('request');
var cheerio= require('cheerio');
var numeral = require('numeral');

module.exports = function(code, callback) {
  var url = 'http://stocks.finance.yahoo.co.jp/stocks/detail/?code=' + code;

  request(url, function(err, res, body) {
    if (err) {
      return callback(err);
    }
    if (res.statusCode !== 200) {
      err = new Error('HTTP status code is not 200, but is: ' + res.statusCode);
      return callback(err);
    }

    var $ = cheerio.load(body);

    var price = $('table.stocksTable').find('td.stoksPrice').text();

    if (!price) {
      err = new Error('Failed to retrieve price data from DOM');
      return callback(err);
    }

    var details = $('div#detail').find('dd > strong').map(function() {
      return $(this).text();
    });

    callback(null, {
      price: unformat(price),
      prevClose: unformat(details.get(0)),
      open: unformat(details.get(1)),
      high: unformat(details.get(2)),
      low: unformat(details.get(3))
    });
  });
};

function unformat(price) {
  return numeral().unformat(price.trim());
}
