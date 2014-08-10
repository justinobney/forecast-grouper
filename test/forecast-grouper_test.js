'use strict';

var forecastGrouper = require('../lib/forecast-grouper.js');
var assert = require('should');

describe('forecastGrouper', function() {

  it('should group by payday', function() {
    var data = require('./test-data-1.json');
    var summaries = forecastGrouper.build(data);
    (summaries.length).should.be.exactly(2);
  });

  it('should find credits', function() {
    var data = require('./test-data-1.json');
    var summaries = forecastGrouper.build(data);
    (summaries[0].credits.length).should.be.exactly(1);
  });

  it('should find debits', function() {
    var data = require('./test-data-1.json');
    var summaries = forecastGrouper.build(data);
    (summaries[0].debits.length).should.be.exactly(3);
  });

});
