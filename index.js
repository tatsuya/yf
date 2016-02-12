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

    var data = {};

    var price = $('table.stocksTable').find('td.stoksPrice').text();
    data.price = unformat(price);

    var details = $('div#detail').find('dd > strong').map(function() {
      return $(this).text();
    });

    data.prevClose = unformat(details.get(0));
    data.open = unformat(details.get(1));
    data.high = unformat(details.get(2));
    data.low = unformat(details.get(3));

    callback(null, data);
  });
};

function unformat(price) {
  return numeral().unformat(price.trim());
}
